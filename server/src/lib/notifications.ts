import type { Db, Tx } from '../db';
import { notifications } from '../schema/notifications';

type CreateNotificationInput =
	| { userId: number; type: 'friend_request'; friendRequestId: number }
	| { userId: number; type: 'friend_accepted'; friendshipId: number }
  | { userId: number; type: 'post_liked'; actionUserId: number; postId: number }
  | { userId: number; type: 'comment_liked'; actionUserId: number; postId: number };

export const createNotification = async (db: Db | Tx, input: CreateNotificationInput) => {
	await db
		.insert(notifications)
		.values({
			userId: input.userId,
			type: input.type,
			...(input.type === 'friend_request' && { friendRequestId: input.friendRequestId }),
			...(input.type === 'friend_accepted' && { friendshipId: input.friendshipId }),
			...(input.type === 'post_liked' && { actionUserId: input.actionUserId, postId: input.postId }),
			...(input.type === 'comment_liked' && { actionUserId: input.actionUserId, postId: input.postId }),
		})
		.returning();
};
