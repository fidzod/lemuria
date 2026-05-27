import { Hono } from 'hono';
import type { AppVariables } from '../lib/types';
import { requireAuth } from '../middleware/require-auth';
import { db } from '../db';
import { notifications } from '../schema/notifications';
import { and, desc, eq, sql } from 'drizzle-orm';
import { friendRequests, friendships } from '../schema/friends';
import { alias } from 'drizzle-orm/sqlite-core';
import { users } from '../schema';
import { err, ok } from '../lib/response';
import type {
	FriendRequestStatus,
	AppNotification,
	NotificationType,
	UnreadNotifications
} from '@lemuria/types';

export const notificationsRouter = new Hono<{ Variables: AppVariables }>()

	// GET /api/v1/notifications - get notifications for current user
	.get('/', requireAuth, async (c) => {
		const session = c.get('session');
		const userId = session.get('userId') as number;

		const fromUser = alias(users, 'from_user');
		const toUser = alias(users, 'to_user');
		const friendUser = alias(users, 'friend_user');

		const rows = await db
			.select({
				id: notifications.id,
				type: notifications.type,
				read: notifications.read,
				createdAt: notifications.createdAt,
				friendRequestId: friendRequests.id,
				friendRequeststatus: friendRequests.status,
				friendRequestCreatedAt: friendRequests.createdAt,
				fromId: fromUser.id,
				fromUsername: fromUser.username,
				fromEmail: fromUser.email,
				fromCreatedAt: fromUser.createdAt,
				toId: toUser.id,
				toUsername: toUser.username,
				toEmail: toUser.email,
				toCreatedAt: toUser.createdAt,
				friendshipId: friendships.id,
				friendshipCreatedAt: friendships.createdAt,
				friendId: friendUser.id,
				friendUsername: friendUser.username,
				friendEmail: friendUser.email,
				friendCreatedAt: friendUser.createdAt
			})
			.from(notifications)
			.leftJoin(friendRequests, eq(notifications.friendRequestId, friendRequests.id))
			.leftJoin(fromUser, eq(friendRequests.fromUserId, fromUser.id))
			.leftJoin(toUser, eq(friendRequests.toUserId, toUser.id))
			.leftJoin(friendships, eq(notifications.friendshipId, friendships.id))
			.leftJoin(
				friendUser,
				sql`
                CASE
                    WHEN ${friendships.userAId} = ${userId} THEN ${friendships.userBId} = ${friendUser.id}
                    ELSE ${friendships.userAId} = ${friendUser.id}
                END
            `
			)
			.where(eq(notifications.userId, userId))
			.orderBy(desc(notifications.createdAt));

		const mapped: AppNotification[] = rows.map((row): AppNotification => {
			const base = {
				id: row.id,
				type: row.type as NotificationType,
				read: row.read,
				createdAt: row.createdAt
			};

			if (base.type === 'friend_request' && row.friendRequestId !== null) {
				return {
					...base,
					friendRequest: {
						id: row.friendRequestId!,
						status: row.friendRequeststatus as FriendRequestStatus,
						createdAt: row.friendRequestCreatedAt!,
						from: {
							id: row.fromId!,
							username: row.fromUsername!,
							email: row.fromEmail!,
							createdAt: row.fromCreatedAt!
						},
						to: {
							id: row.toId!,
							username: row.toUsername!,
							email: row.toEmail!,
							createdAt: row.toCreatedAt!
						}
					}
				};
			}

			if (base.type === 'friend_accepted' && row.friendshipId !== null) {
				return {
					...base,
					friendship: {
						id: row.friendshipId,
						createdAt: row.friendshipCreatedAt!,
						friend: {
							id: row.friendId!,
							username: row.friendUsername!,
							email: row.friendEmail!,
							createdAt: row.friendCreatedAt!
						}
					}
				};
			}

			return base;
		});

		await db.update(notifications).set({ read: true }).where(eq(notifications.userId, userId));

		return ok<AppNotification[]>(c, mapped);
	})

	// GET /api/v1/notifications/unread-count
	// get unread notifications count for current user
	.get('/unread-count', async (c) => {
		const session = c.get('session');
		const userId = session.get('userId') as number;

		const [result] = await db
			.select({ count: sql`COUNT(*)` })
			.from(notifications)
			.where(and(eq(notifications.userId, userId), eq(notifications.read, false)));

		if (result === undefined) {
			return err(c, 'Failed to fetch notification count.');
		}

		return ok<UnreadNotifications>(c, { count: Number(result.count) });
	});
