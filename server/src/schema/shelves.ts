import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { users } from './users';
import { ShelfItemType } from '@lemuria/types';

export const films = sqliteTable('films', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	externalId: text('external_id').unique().notNull(),
	title: text('title').notNull(),
	year: text('year').notNull(),
	posterUrl: text('posterUrl')
});

export const books = sqliteTable('books', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	externalId: text('external_id').unique().notNull(),
	title: text('title').notNull(),
	author: text('author').notNull(),
	coverUrl: text('posterUrl')
});

export const albums = sqliteTable('albums', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	externalId: text('external_id').unique().notNull(),
	title: text('title').notNull(),
	artist: text('artist').notNull(),
	coverUrl: text('posterUrl')
});

export const shelfItems = sqliteTable('shelf_items', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: integer('user_id')
		.references(() => users.id)
		.notNull(),
	position: integer('position').notNull(),
	itemType: text('item_type').$type<ShelfItemType>().notNull(),
	filmId: integer('film_id').references(() => films.id),
	bookId: integer('book_id').references(() => books.id),
	albumId: integer('album_id').references(() => albums.id)
});

export type ShelfItemRow = typeof shelfItems.$inferSelect;
