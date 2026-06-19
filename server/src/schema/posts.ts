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

export const postMedia = sqliteTable('post_media', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	postId: integer('post_id')
		.notNull()
		.references(() => posts.id, { onDelete: 'cascade' }),
	url: text('url').notNull(),
	position: integer('position').notNull().default(0)
});

export type PostRow = typeof posts.$inferSelect;
export type PostMediaRow = typeof posts.$inferSelect;
