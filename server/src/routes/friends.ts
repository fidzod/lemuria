import { Hono } from 'hono';
import type { AppVariables } from '../lib/types';
import { requireAuth } from '../middleware/require-auth';
import { zValidator } from '../lib/validate';
import { createFriendRequestSchema, respondToFriendRequestSchema } from '../schema/validators';
import { users } from '../schema';
import { and, eq, getTableColumns, or } from 'drizzle-orm';
import { db } from '../db';
import { err, ok } from '../lib/response';
import {
	friendRequests,
	friendships,
	type FriendRequestRow,
	type FriendshipRow
} from '../schema/friends';
import type { FriendRequest, Friendship, PublicUser } from '@lemuria/types';
import { createNotification } from '../lib/notifications';
import { userRowToPublicUser } from '../lib/users';
import { createFriendship, normaliseFriendship } from '../lib/friends';

export const friendsRouter = new Hono<{ Variables: AppVariables }>()

	// POST /api/v1/friends/requests - create a friend request
	.post('/requests', zValidator('json', createFriendRequestSchema), requireAuth, async (c) => {
		const { toUserId } = c.req.valid('json');

		// check user exists
		const [toUser] = await db.select().from(users).where(eq(users.id, toUserId));

		if (toUser === undefined) return err(c, 'User does not exist.', 404);

		// check user isn't yourself
    const fromUserId = c.get('session').get('userId')!;

		if (fromUserId === toUserId) return err(c, 'Cannot send friend request to yourself.');

		// check you haven't requested them already
		const [existingFriendRequest] = await db
			.select()
			.from(friendRequests)
			.where(
				and(
					eq(friendRequests.fromUserId, fromUserId),
					eq(friendRequests.toUserId, toUserId),
					eq(friendRequests.status, 'pending')
				)
			);

		if (existingFriendRequest !== undefined) {
			return err(c, 'Your friend request to this user is pending.', 409);
		}

		// check they haven't requested you already
		const [incomingRequest] = await db
			.select()
			.from(friendRequests)
			.where(
				and(
					eq(friendRequests.fromUserId, toUserId),
					eq(friendRequests.toUserId, fromUserId),
					eq(friendRequests.status, 'pending')
				)
			);

		if (incomingRequest !== undefined) {
			const result = await createFriendship(db, {
				normalisedFriendship: normaliseFriendship(toUserId, fromUserId),
				friendRequest: incomingRequest
			});

			if (result === undefined) {
				return err(c, 'Failed to add friend.');
			}

			const { friendship, updatedFriendRequest } = result;

			const [friend] = await db
				.select()
				.from(users)
				.where(eq(users.id, updatedFriendRequest.fromUserId));

			if (friend === undefined) return err(c, 'Friend not found.', 404);

			return ok<Friendship>(c, {
				id: friendship.id,
				createdAt: friendship.createdAt,
				friend: userRowToPublicUser(friend)
			});
		}

		// check not already friends
		const normalisedFriendship = normaliseFriendship(fromUserId, toUserId);
		const [friendship] = await db
			.select()
			.from(friendships)
			.where(
				and(
					eq(friendships.userAId, normalisedFriendship.userAId),
					eq(friendships.userBId, normalisedFriendship.userBId)
				)
			);

		if (friendship !== undefined) {
			return err(c, 'You are already friends with this user.');
		}

		// create friend request
		const [friendRequest] = await db
			.insert(friendRequests)
			.values({ fromUserId, toUserId, status: 'pending' })
			.returning();

		if (friendRequest === undefined) {
			return err(c, 'Failed to request user.');
		}

		// create notification
		await createNotification(db, {
			userId: toUserId,
			type: 'friend_request',
			friendRequestId: friendRequest.id
		});

		// return created friend request
		const [fromUser] = await db.select().from(users).where(eq(users.id, fromUserId));

		return ok<FriendRequest>(
			c,
			{
				id: friendRequest.id,
				from: userRowToPublicUser(fromUser!),
				to: userRowToPublicUser(toUser),
				status: friendRequest.status,
				createdAt: friendRequest.createdAt
			},
			201
		);
	})

	// PATCH /api/v1/friends/requests/:id - respond to a friend request
	.patch(
		'/requests/:id',
		zValidator('json', respondToFriendRequestSchema),
		requireAuth,
		async (c) => {
			const friendRequestId = c.req.param('id');

			// fetch request
			const [friendRequest] = await db
				.select()
				.from(friendRequests)
				.where(eq(friendRequests.id, friendRequestId));

			if (friendRequest === undefined) {
				return err(c, 'Friend request does not exist.', 404);
			}

			// verify toUserId matches session user
      const sessionUserId = c.get('session').get('userId')!;

			if (friendRequest.toUserId !== sessionUserId) {
				return err(c, 'You can only respond to requests sent to you.');
			}

			// verify status is pending
			if (friendRequest.status !== 'pending') {
				return err(c, `This friend request has already been ${friendRequest.status}.`);
			}

			// update status
			const { status: updatedStatus } = c.req.valid('json');

			let updatedFriendRequest: FriendRequestRow | undefined;

			// accepting:
			if (updatedStatus === 'accepted') {
				const result = await createFriendship(db, {
					normalisedFriendship: normaliseFriendship(sessionUserId, friendRequest.fromUserId),
					friendRequest: friendRequest
				});

				if (result === undefined) {
					return err(c, 'Failed to add friend.');
				}

				updatedFriendRequest = result.updatedFriendRequest;
			}

			// rejecting:
			if (updatedStatus === 'rejected') {
				[updatedFriendRequest] = await db
					.update(friendRequests)
					.set({ status: 'rejected' })
					.where(eq(friendRequests.id, friendRequestId))
					.returning();
			}

			if (updatedFriendRequest === undefined) {
				return err(c, 'Could not respond to friend request.');
			}

			const friends = await db
				.select()
				.from(users)
				.where(
					or(
						eq(users.id, updatedFriendRequest.fromUserId),
						eq(users.id, updatedFriendRequest.toUserId)
					)
				);

			const fromUser = friends.find((u) => u.id === updatedFriendRequest.fromUserId);
			const toUser = friends.find((u) => u.id === updatedFriendRequest.toUserId);

			if (fromUser === undefined || toUser === undefined) {
				return err(c, 'User not found.', 404);
			}

			return ok<FriendRequest>(c, {
				id: updatedFriendRequest.id,
				createdAt: updatedFriendRequest.createdAt,
				status: updatedFriendRequest.status,
				from: userRowToPublicUser(fromUser),
				to: userRowToPublicUser(toUser)
			});
		}
	)

	// DELETE /api/v1/friends/:id - delete a friendship
	.delete('/:id', requireAuth, async (c) => {
		const friendshipId = c.req.param('id');

    const sessionUserId = c.get('session').get('userId')!;

		const [friendship] = await db
			.select()
			.from(friendships)
			.where(eq(friendships.id, friendshipId));

		if (friendship === undefined) {
			return err(c, 'No friendship to delete.', 404);
		}

		if (friendship.userAId !== sessionUserId && friendship.userBId !== sessionUserId) {
			return err(c, 'Unauthorised.', 401);
		}

		const [deleted] = await db
			.delete(friendships)
			.where(eq(friendships.id, friendshipId))
			.returning();

		if (deleted === undefined) {
			return err(c, 'Failed to unfriend user.');
		}

		return ok<FriendshipRow>(c, { ...deleted });
	})

	// GET /api/v1/friends - get session user's friends
	.get('/', requireAuth, async (c) => {
    const sessionUserId = c.get('session').get('userId')!;

		const limit = Number(c.req.query('limit'));

		const rows = await db
			.select({
				...getTableColumns(users)
			})
			.from(friendships)
			.innerJoin(
				users,
				or(
					and(eq(friendships.userAId, sessionUserId), eq(friendships.userBId, users.id)),
					and(eq(friendships.userBId, sessionUserId), eq(friendships.userAId, users.id))
				)
			)
			.where(or(eq(friendships.userAId, sessionUserId), eq(friendships.userBId, sessionUserId)))
			.limit(limit || 1000);

		const friends = rows.map((f) => userRowToPublicUser(f));

		return ok<{ friends: PublicUser[] }>(c, { friends });
	});
