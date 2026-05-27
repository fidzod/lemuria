import { api, withCookies } from '$lib/api';
import type { UserProfile } from '@lemuria/types';
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch, request }) => {
	const userIds = [3, 4, 5, 6, 7];

	const users = (
		await Promise.all(
			userIds.map(async (userId) => {
				const res = await api.users.byId(withCookies(fetch, request), userId);
				return res.success ? res.data : null;
			})
		)
	).filter((u): u is UserProfile => u !== null);

	return { users };
};

export const actions: Actions = {
	createFriendRequest: async ({ fetch, request }) => {
		const form = await request.formData();
		const toUserId = form.get('to-user-id');

		if (typeof toUserId !== 'string' || toUserId.trim() === '') {
			return fail(400, { error: 'Invalid form data.' });
		}

		const toUserIdNumber = parseInt(toUserId);

		if (isNaN(toUserIdNumber)) {
			return fail(400, { error: 'Invalid user ID.' });
		}

		const result = await api.friends.request(withCookies(fetch, request), toUserIdNumber);

		if (!result.success) {
			return fail(400, { error: 'Request unsuccessful.' });
		}

		return;
	},
	respondToFriendRequest: async ({ fetch, request }) => {
		const form = await request.formData();
		const friendRequestId = form.get('friend-request-id');
		const response = form.get('response');

		if (typeof friendRequestId !== 'string' || friendRequestId.trim() === '') {
			return fail(400, { error: 'Invalid form data.' });
		}

		const friendRequestIdNumber = parseInt(friendRequestId);

		if (isNaN(friendRequestIdNumber)) {
			return fail(400, { error: 'Invalid friend request ID.' });
		}

		if (typeof response !== 'string' || response.trim() === '') {
			return fail(400, { error: 'Invalid form data.' });
		}

		if (response !== 'accepted' && response !== 'rejected') {
			return fail(400, { error: 'Invalid response.' });
		}

		const result = await api.friends.respondToRequest(
			withCookies(fetch, request),
			friendRequestIdNumber,
			response
		);

		if (!result.success) {
			return fail(400, { error: 'Request unsuccessful.' });
		}

		return;
	},
	removeFriend: async ({ fetch, request }) => {
		const form = await request.formData();
		const friendshipId = form.get('friendship-id');

		if (typeof friendshipId !== 'string' || friendshipId.trim() === '') {
			return fail(400, { error: 'Invalid form data.' });
		}

		const friendshipIdNumber = parseInt(friendshipId);

		if (isNaN(friendshipIdNumber)) {
			return fail(400, { error: 'Invalid friend request ID.' });
		}

		const result = await api.friends.removeFriendship(
			withCookies(fetch, request),
			friendshipIdNumber
		);

		if (!result.success) {
			return fail(400, { error: 'Request unsuccessful.' });
		}

		return;
	}
};
