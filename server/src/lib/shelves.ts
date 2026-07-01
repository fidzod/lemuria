import type { SearchResult, ShelfItem } from '@lemuria/types';
import { env } from '../lib/env';
import { albums, books, films, type ShelfItemRow } from '../schema';
import type { Db } from '../db';
import { eq } from 'drizzle-orm';

type OMDB_RESPONSE = {
	Search: {
		Title: string;
		Year: string;
		imdbID: string;
		Poster: string;
	}[];
};

export const searchFilms = async (query: string): Promise<SearchResult[] | null> => {
	try {
		const queryEncoded = encodeURIComponent(query);
		const url = `https://www.omdbapi.com/?s=${queryEncoded}&apikey=${env.OMDB_API_KEY}`;
		const response = await fetch(url);
		const data = (await response.json()) as OMDB_RESPONSE;
		return data.Search.map((r) => ({
			externalId: r.imdbID,
			title: r.Title,
			subtitle: r.Year,
			coverUrl: r.Poster === 'N/A' ? '' : r.Poster,
			type: 'film'
		}));
	} catch (error) {
		return null;
	}
};

export const searchAlbums = async (query: string): Promise<SearchResult[] | null> => {
	try {
		const queryEncoded = encodeURIComponent(query);
		const url = `https://musicbrainz.org/ws/2/release?query=${queryEncoded}&fmt=json&limit=10`;
		const response = await fetch(url);
		const data = (await response.json()) as { releases: any[] };

		if (!data.releases || data.releases.length === 0) return [];

		const albums = await Promise.all(
			data.releases.map(async (release) => {
				let coverUrl: string = '';

				try {
					const artResponse = await fetch(`https://coverartarchive.org/release/${release.id}`);
					if (artResponse.ok) {
						const artData = (await artResponse.json()) as { images: any[] };
						const frontCover = artData.images.find((img: any) => img.front);
						coverUrl = frontCover?.image || null;
					}
				} catch (error) {}

				return {
					externalId: release.id,
					title: release.title,
					subtitle: release['artist-credit']?.[0]?.name || 'Unknown Artist',
					coverUrl,
					type: 'album' as const
				};
			})
		);

		return albums;
	} catch (error) {
		return null;
	}
};

export const searchBooks = async (query: string): Promise<SearchResult[] | null> => {
	try {
		const queryEncoded = encodeURIComponent(query);
		const url = `https://openlibrary.org/search.json?q=${queryEncoded}&limit=10`;
		const response = await fetch(url, {
			headers: {
				'User-Agent': 'Lemuria (github.com/fidzod/lemuria) (mail@tobyjordan.com)'
			}
		});
		const data = (await response.json()) as { docs: any[] };

		if (!data.docs || data.docs.length === 0) return [];

		const books = data.docs.map((doc) => {
			const author = doc.author_name?.[0] || 'Unknown Author';

			let coverUrl: string = '';
			if (doc.cover_edition_key) {
				coverUrl = `https://covers.openlibrary.org/b/olid/${doc.cover_edition_key}-M.jpg`;
			}

			return {
				externalId: doc.key,
				title: doc.title,
				subtitle: `${author}`,
				coverUrl,
				type: 'book' as const
			};
		});

		return books;
	} catch (error) {
		return null;
	}
};

export const toShelfItem = async (db: Db, shelfItemRow: ShelfItemRow): Promise<ShelfItem> => {
	const type = shelfItemRow.itemType;

	switch (type) {
		case 'film':
			const [film] = await db.select().from(films).where(eq(films.id, shelfItemRow.filmId!));
			return {
        id: film!.id,
				externalId: film!.externalId,
				title: film!.title,
				subtitle: film!.year,
				coverUrl: film!.posterUrl || '',
				type: 'film'
			};
		case 'album':
			const [album] = await db.select().from(albums).where(eq(albums.id, shelfItemRow.albumId!));
			return {
        id: album!.id,
				externalId: album!.externalId,
				title: album!.title,
				subtitle: album!.artist,
				coverUrl: album!.coverUrl || '',
				type: 'album'
			};
		case 'book':
			const [book] = await db.select().from(books).where(eq(books.id, shelfItemRow.bookId!));
			return {
        id: book!.id,
				externalId: book!.externalId,
				title: book!.title,
				subtitle: book!.author,
				coverUrl: book!.coverUrl || '',
				type: 'book'
			};
	}
};
