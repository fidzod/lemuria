import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { ShelfItemType } from '@lemuria/types';
import { users } from './users';
import { nanoid } from '../lib/id';

export const films = sqliteTable('films', {
  id: text('id').primaryKey().$defaultFn(nanoid),
  externalId: text('external_id').unique().notNull(),
  title: text('title').notNull(),
  year: text('year').notNull(),
  posterUrl: text('posterUrl')
});

export const books = sqliteTable('books', {
  id: text('id').primaryKey().$defaultFn(nanoid),
  externalId: text('external_id').unique().notNull(),
  title: text('title').notNull(),
  author: text('author').notNull(),
  coverUrl: text('posterUrl')
});

export const albums = sqliteTable('albums', {
  id: text('id').primaryKey().$defaultFn(nanoid),
  externalId: text('external_id').unique().notNull(),
  title: text('title').notNull(),
  artist: text('artist').notNull(),
  coverUrl: text('posterUrl')
});

export const shelfItems = sqliteTable('shelf_items', {
  id: text('id').primaryKey().$defaultFn(nanoid),
  userId: text('user_id')
    .references(() => users.id)
    .notNull(),
  position: integer('position').notNull(),
  itemType: text('item_type').$type<ShelfItemType>().notNull(),
  filmId: text('film_id').references(() => films.id),
  bookId: text('book_id').references(() => books.id),
  albumId: text('album_id').references(() => albums.id)
});

export type ShelfItemRow = typeof shelfItems.$inferSelect;
