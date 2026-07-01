import {
	index,
	integer,
	primaryKey,
	sqliteTable,
	text,
	type AnySQLiteColumn
} from 'drizzle-orm/sqlite-core';
import { users } from './users';
import { sql } from 'drizzle-orm';
import { nanoid } from '../lib/id';

export const posts = sqliteTable(
	'posts',
	{
		id: text('id').primaryKey().$defaultFn(nanoid),
		authorId: text('author_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		parentId: text('parent_id').references((): AnySQLiteColumn => posts.id, {
			onDelete: 'cascade'
		}),
		textContent: text('text_content'),
		createdAt: integer('created_at', { mode: 'timestamp' })
			.notNull()
			.default(sql`(unixepoch())`),
		reshareCount: integer('reshare_count').notNull().default(0),
		replyCount: integer('reply_count').notNull().default(0),
		likeCount: integer('like_count').notNull().default(0)
	},
	(table) => [index('parent_id_idx').on(table.parentId)]
);

export const postMedia = sqliteTable('post_media', {
	id: text('id').primaryKey().$defaultFn(nanoid),
	postId: text('post_id')
		.notNull()
		.references(() => posts.id, { onDelete: 'cascade' }),
	url: text('url').notNull(),
	position: integer('position').notNull().default(0)
});

export const postLikes = sqliteTable(
	'post_likes',
	{
		userId: text('user_id')
			.notNull()
			.references(() => users.id),
		postId: text('post_id')
			.notNull()
			.references(() => posts.id)
	},
	(table) => [primaryKey({ columns: [table.userId, table.postId] })]
);

export type PostRow = typeof posts.$inferSelect;
export type PostMediaRow = typeof posts.$inferSelect;
