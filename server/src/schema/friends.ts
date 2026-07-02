import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { users } from './users';
import type { FriendRequestStatus } from '@lemuria/types';
import { sql } from 'drizzle-orm';
import { nanoid } from '../lib/id';

export const friendRequests = sqliteTable('friend_requests', {
	id: text('id').primaryKey().$defaultFn(nanoid),
	fromUserId: text('from_user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	toUserId: text('to_user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	status: text('status').notNull().$type<FriendRequestStatus>().default('pending'),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(unixepoch())`)
});

export const friendships = sqliteTable(
	'friendships',
	{
		id: text('id').primaryKey().$defaultFn(nanoid),
		userAId: text('user_a_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		userBId: text('user_b_id')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		createdAt: integer('created_at', { mode: 'timestamp' })
			.notNull()
			.default(sql`(unixepoch())`)
	},
	(t) => [uniqueIndex('user_a_user_b_idx').on(t.userAId, t.userBId)]
);

export type FriendRequestRow = typeof friendRequests.$inferSelect;
export type FriendshipRow = typeof friendships.$inferSelect;
