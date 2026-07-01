import type { Db, Tx } from '../db';
import { notifications } from '../schema/notifications';

type CreateNotificationInput =
	| { userId: string; type: 'friend_request'; friendRequestId: string }
	| { userId: string; type: 'friend_accepted'; friendshipId: string }
	| { userId: string; type: 'post_liked'; actionUserId: string; postId: string }
	| { userId: string; type: 'comment_liked'; actionUserId: string; postId: string };

export const createNotification = async (db: Db | Tx, input: CreateNotificationInput) => {
	await db
		.insert(notifications)
		.values({
			userId: input.userId,
			type: input.type,
			...(input.type === 'friend_request' && { friendRequestId: input.friendRequestId }),
			...(input.type === 'friend_accepted' && { friendshipId: input.friendshipId }),
			...(input.type === 'post_liked' && {
				actionUserId: input.actionUserId,
				postId: input.postId
			}),
			...(input.type === 'comment_liked' && {
				actionUserId: input.actionUserId,
				postId: input.postId
			})
		})
		.returning();
};
