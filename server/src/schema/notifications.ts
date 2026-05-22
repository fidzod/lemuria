import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { users } from './users';
import { friendRequests, friendships } from './friends';
import type { NotificationType } from '@lemuria/types';
import { sql } from 'drizzle-orm';

export const notifications = sqliteTable('notifications', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	type: text('type').notNull().$type<NotificationType>(),
	read: integer('read', { mode: 'boolean' }).notNull().default(false),
	friendRequestId: integer('friend_request_id').references(() => friendRequests.id, {
		onDelete: 'set null'
	}),
	friendshipId: integer('friendship_id').references(() => friendships.id, { onDelete: 'set null' }),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(unixepoch())`)
});

export type NotificationRow = typeof notifications.$inferSelect;
