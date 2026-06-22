import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from './$types';
import { api, withCookies } from '$lib/api';
import { isAccentColor } from '@lemuria/types';

export const load: PageServerLoad = async ({ params, fetch, request }) => {
	const username = params.username;

	const profileRes = await api.users.get(withCookies(fetch, request), username);
	if (!profileRes.success) error(404, 'User not found.');

	const shelvesRes = await api.shelves.get(fetch, profileRes.data.user.id);
	if (!shelvesRes.success) error(400, 'Failed to fetch shelves.');

	const postsRes = await api.posts.fromUser(withCookies(fetch, request), profileRes.data.user.id);
	if (!postsRes.success) error(400, 'Failed to fetch posts.');

	return { profile: profileRes.data, posts: postsRes.data, shelfItems: shelvesRes.data };
};

export const actions: Actions = {
	updateProfile: async ({ fetch, request }) => {
		const form = await request.formData();
		const displayName = form.get('display-name');
		const bioRaw = form.get('bio');
		const accentColor = form.get('accent-color');
		const avatarFile = form.get('avatar');
		const bannerFile = form.get('banner');

		const avatar = avatarFile instanceof File && avatarFile.size > 0 ? avatarFile : null;
		const banner = bannerFile instanceof File && bannerFile.size > 0 ? bannerFile : null;

		if (typeof displayName !== 'string' || displayName.trim().length === 0) {
			return fail(400, { error: 'Invalid form data.' });
		}

		const bio = typeof bioRaw === 'string' && bioRaw.trim().length > 0 ? bioRaw.trim() : null;

		if (typeof accentColor !== 'string') {
			return fail(400, { error: 'Invalid form data.' });
		}

		if (!isAccentColor(accentColor)) {
			return fail(400, { error: 'Invalid form data.' });
		}

		const result = await api.users.updateProfile(
			withCookies(fetch, request),
			form.get('username') as string,
			{
				displayName,
				bio,
				accentColor,
				avatar,
				banner
			}
		);

		if (!result.success) {
			return fail(400, { error: result.error });
		}

		return { success: true };
	},
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

		return { success: true };
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

		return { success: true };
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

		return { success: true };
	}
};
