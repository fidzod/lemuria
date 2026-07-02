import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

import type { NotificationType } from '@lemuria/types';
import { users } from './users';
import { friendRequests, friendships } from './friends';
import { posts } from './posts';
import { nanoid } from '../lib/id';

export const notifications = sqliteTable('notifications', {
	id: text('id').primaryKey().$defaultFn(nanoid),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	type: text('type').notNull().$type<NotificationType>(),
	read: integer('read', { mode: 'boolean' }).notNull().default(false),
	friendRequestId: text('friend_request_id').references(() => friendRequests.id, {
		onDelete: 'set null'
	}),
	friendshipId: text('friendship_id').references(() => friendships.id, { onDelete: 'set null' }),
	actionUserId: text('action_user_id').references(() => users.id, { onDelete: 'set null' }),
	postId: text('post_id').references(() => posts.id, { onDelete: 'set null' }),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(unixepoch())`)
});

export type NotificationRow = typeof notifications.$inferSelect;
