import { eq } from 'drizzle-orm';
import type { Db } from '../db';
import {
	friendRequests,
	friendships,
	type FriendRequestRow,
	type FriendshipRow
} from '../schema/friends';
import { createNotification } from './notifications';

type NormalisedFriendship = { userAId: number; userBId: number };

export const normaliseFriendship = (userA: number, userB: number): NormalisedFriendship => {
	return userA < userB ? { userAId: userA, userBId: userB } : { userAId: userB, userBId: userA };
};

type createFriendshipInput = {
	normalisedFriendship: NormalisedFriendship;
	friendRequest: FriendRequestRow;
};

type createFriendshipOut = {
	friendship: FriendshipRow;
	updatedFriendRequest: FriendRequestRow;
};

export const createFriendship = async (
	db: Db,
	input: createFriendshipInput
): Promise<createFriendshipOut | undefined> => {
	const result = await db.transaction(async (tx) => {
		const [updatedFriendRequest] = await tx
			.update(friendRequests)
			.set({ status: 'accepted' })
			.where(eq(friendRequests.id, input.friendRequest.id))
			.returning();

		if (updatedFriendRequest === undefined) return;

		const [friendship] = await tx
			.insert(friendships)
			.values(input.normalisedFriendship)
			.returning();

		if (friendship === undefined) {
			tx.rollback();
			return;
		}

		await createNotification(tx, {
			userId: input.friendRequest.fromUserId,
			type: 'friend_accepted',
			friendshipId: friendship.id
		});

		return { friendship, updatedFriendRequest };
	});
	return result;
};
