import { Hono } from 'hono';
import * as z from 'zod';

import { err, ok } from '../lib/response';
import { addShelfItemSchema, shelvesSearchSchema } from '../schema/validators';
import type { SearchResult, ShelfItem } from '@lemuria/types';
import { searchAlbums, searchBooks, searchFilms, toShelfItem } from '../lib/shelves';
import { requireAuth } from '../middleware/require-auth';
import { zValidator } from '../lib/validate';
import { db } from '../db';
import { albums, books, films, shelfItems, users, type ShelfItemRow } from '../schema';
import { and, eq, sql } from 'drizzle-orm';

export const shelvesRouter = new Hono()

	// GET /api/v1/shelves/:userId - Get shelf shelf items
	.get('/:userId', async (c) => {
		const userId = Number(c.req.param('userId'));
		if (isNaN(userId)) return err(c, 'Invalid user Id.');
		const [user] = await db.select().from(users).where(eq(users.id, userId));
		if (user === undefined) return err(c, 'User not found.', 404);

		const rows = await db
			.select({
				id: shelfItems.id,
				type: shelfItems.itemType,
				filmExternalId: films.externalId,
				filmTitle: films.title,
				filmYear: films.year,
				filmPosterUrl: films.posterUrl,
				bookExternalId: books.externalId,
				bookTitle: books.title,
				bookAuthor: books.author,
				bookCoverUrl: books.coverUrl,
				albumExternalId: albums.externalId,
				albumTitle: albums.title,
				albumArtist: albums.artist,
				albumCoverUrl: albums.coverUrl
			})
			.from(shelfItems)
			.leftJoin(films, eq(films.id, shelfItems.filmId))
			.leftJoin(books, eq(books.id, shelfItems.bookId))
			.leftJoin(albums, eq(albums.id, shelfItems.albumId))
			.where(eq(shelfItems.userId, userId))
			.orderBy(shelfItems.position);

		const mapped: ShelfItem[] = rows.map((row) => {
			if (row.type === 'film')
				return {
					id: row.id,
					externalId: row.filmExternalId!,
					title: row.filmTitle!,
					subtitle: row.filmYear!,
					coverUrl: row.filmPosterUrl!,
					type: 'film'
				};
			if (row.type === 'book')
				return {
					id: row.id,
					externalId: row.bookExternalId!,
					title: row.bookTitle!,
					subtitle: row.bookAuthor!,
					coverUrl: row.bookCoverUrl!,
					type: 'book'
				};
			return {
				id: row.id,
				externalId: row.albumExternalId!,
				title: row.albumTitle!,
				subtitle: row.albumArtist!,
				coverUrl: row.albumCoverUrl!,
				type: 'album'
			};
		});

		return ok<ShelfItem[]>(c, mapped);
	})

	// POST /api/v1/shelves - Add an item to your shelves
	.post('/', requireAuth, zValidator('json', addShelfItemSchema), async (c) => {
		const userId = c.get('session').get('userId') as number;

		const { type, externalId, title, subtitle, coverUrl } = c.req.valid('json');

		let result: ShelfItemRow | undefined;
		try {
			result = await db.transaction(async (tx) => {
				// Upsert cache table
				const cacheTable = type === 'film' ? films : type === 'book' ? books : albums;
				await tx
					.insert(cacheTable)
					.values({
						externalId,
						title,
						...{
							...(type === 'film' && { year: subtitle, posterUrl: coverUrl }),
							...(type === 'album' && { artist: subtitle, coverUrl }),
							...(type === 'book' && { author: subtitle, coverUrl })
						}
					})
					.onConflictDoNothing();
				const [cached] = await tx
					.select()
					.from(cacheTable)
					.where(eq(cacheTable.externalId, externalId));

				// Enforce cap
				const [countResult] = await tx
					.select({ count: sql<number>`count(*)` })
					.from(shelfItems)
					.where(eq(shelfItems.userId, userId));
				const count = countResult?.count ?? 0;
				if (count >= 12) throw new Error('Shelf is full');

				// Insert shelf item
				const [item] = await tx
					.insert(shelfItems)
					.values({
						userId: userId,
						position: count,
						itemType: type,
						filmId: type === 'film' ? cached!.id : null,
						bookId: type === 'book' ? cached!.id : null,
						albumId: type === 'album' ? cached!.id : null
					})
					.returning();

				return item;
			});
		} catch (error) {
			return err(c, error as string);
		}

		if (result === undefined) return err(c, 'Failed to add item.');

		const newShelfItem = await toShelfItem(db, result);
		return ok<ShelfItem>(c, newShelfItem);
	})

	// GET /api/v1/shelves/search/:type?q= - Search for a new shelf item
	.get('/search/:type', async (c) => {
		const params = {
			type: c.req.param('type'),
			q: c.req.query('q')
		};

		const result = shelvesSearchSchema.safeParse(params);
		if (!result.success)
			return err(c, 'Validation failed', 422, z.flattenError(result.error).fieldErrors);

		const { type: itemType, q: query } = result.data;

		let res: SearchResult[] | null;

		switch (itemType) {
			case 'film':
				res = await searchFilms(query);
				break;
			case 'album':
				res = await searchAlbums(query);
				break;
			case 'book':
				res = await searchBooks(query);
				break;
		}

		if (res === null) return err(c, 'Failed to fetch data from OMDB.');

		return ok<SearchResult[]>(c, res);
	})

	// DELETE /api/v1/shelves/id - Delete an item from your shelves
	.delete('/:id', requireAuth, async (c) => {
		const userId = c.get('session').get('userId') as number;
		const id = Number(c.req.param('id'));

		let result: ShelfItemRow | undefined;
		try {
			result = await db.transaction(async (tx) => {
				const [item] = await tx
					.select()
					.from(shelfItems)
					.where(and(eq(shelfItems.id, id), eq(shelfItems.userId, userId)));

				if (!item) throw new Error('Item not found');

				await tx.delete(shelfItems).where(eq(shelfItems.id, id));

				await tx
					.update(shelfItems)
					.set({ position: sql`${shelfItems.position} - 1` })
					.where(
						and(eq(shelfItems.userId, userId), sql`${shelfItems.position} > ${item.position}`)
					);

				return item;
			});
		} catch (error) {
			return err(c, error as string);
		}

		if (result === undefined) return err(c, 'Failed to remove item.');
		return ok<{ id: number }>(c, { id: result.id });
	});
