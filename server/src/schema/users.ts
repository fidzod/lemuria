import type { AccentColor } from '@lemuria/types';
import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	email: text('email').notNull().unique(),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	displayName: text('display_name').notNull().default('User'),
	avatarUrl: text('avatar_url'),
	accentColor: text('accent_color').notNull().$type<AccentColor>(),
	bannerUrl: text('banner_url'),
	bio: text(''),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(unixepoch())`),
	lastSeen: integer('last_seen', { mode: 'timestamp' })
		.notNull()
		.default(sql`(unixepoch())`)
});

export type UserRow = typeof users.$inferSelect;
