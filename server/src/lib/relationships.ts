import type { Relationship } from '@lemuria/types';
import type { Db } from '../db';
import { normaliseFriendship } from './friends';
import { friendRequests, friendships } from '../schema';
import { and, eq, or } from 'drizzle-orm';

export const resolveRelationship = async (
	sessionUserId: string,
	targetUserId: string,
	db: Db
): Promise<Relationship> => {
	if (sessionUserId === targetUserId) return { status: 'me' };

	const { userAId, userBId } = normaliseFriendship(sessionUserId, targetUserId);

	const [friendship, request] = await Promise.all([
		db
			.select({ id: friendships.id })
			.from(friendships)
			.where(and(eq(friendships.userAId, userAId), eq(friendships.userBId, userBId)))
			.get(),

		db
			.select({ id: friendRequests.id, fromUserId: friendRequests.fromUserId })
			.from(friendRequests)
			.where(
				and(
					or(
						and(
							eq(friendRequests.fromUserId, sessionUserId),
							eq(friendRequests.toUserId, targetUserId)
						),
						and(
							eq(friendRequests.fromUserId, targetUserId),
							eq(friendRequests.toUserId, sessionUserId)
						)
					),
					eq(friendRequests.status, 'pending')
				)
			)
			.get()
	]);

	if (friendship !== undefined) return { status: 'friends', friendshipId: friendship.id };
	if (request !== undefined) {
		return request.fromUserId === sessionUserId
			? { status: 'request_sent' }
			: { status: 'request_received', friendRequestId: request.id };
	}

	return { status: null };
};
