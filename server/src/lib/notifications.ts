import type { Db, Tx } from '../db';
import { notifications } from '../schema/notifications';

type CreateNotificationInput =
	| { userId: number; type: 'friend_request'; friendRequestId: number }
	| { userId: number; type: 'friend_accepted'; friendshipId: number };

export const createNotification = async (db: Db | Tx, input: CreateNotificationInput) => {
	await db
		.insert(notifications)
		.values({
			userId: input.userId,
			type: input.type,
			...(input.type === 'friend_request' && { friendRequestId: input.friendRequestId }),
			...(input.type === 'friend_accepted' && { friendshipId: input.friendshipId })
		})
		.returning();
};
