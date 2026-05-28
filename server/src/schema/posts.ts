import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { users } from './users';
import { sql } from 'drizzle-orm';

export const posts = sqliteTable('posts', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	authorId: integer('author_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	textContent: text('text_content'),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(unixepoch())`),
	reshareCount: integer('reshare_count').notNull().default(0),
	replyCount: integer('reply_count').notNull().default(0),
	likeCount: integer('like_count').notNull().default(0),
	dislikeCount: integer('dislike_count').notNull().default(0)
});

export type PostRow = typeof posts.$inferSelect;
