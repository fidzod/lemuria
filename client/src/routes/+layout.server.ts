import { api, withCookies } from '$lib/api';
import type { PublicUser, UserProfile } from '@lemuria/types';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ fetch, request }) => {
	let user: PublicUser | null = null;
	const userRes = await api.auth.me(withCookies(fetch, request));

	if (userRes.success) user = userRes.data;

	if (user === null) {
		return { user, unreadNotificationsCount: null, sidebarFriends: [], profile: null };
	}

	let profile: UserProfile | null = null;
	let unreadNotificationsCount: number | null = null;
	let sidebarFriends: PublicUser[] = [];

	const profileRes = await api.users.get(withCookies(fetch, request), user.username);
	if (profileRes.success) profile = profileRes.data;

	const unreadRes = await api.notifications.unreadCount(withCookies(fetch, request));
	if (unreadRes.success) unreadNotificationsCount = unreadRes.data.count;

	const friendsRes = await api.friends.get(withCookies(fetch, request), 5);
	if (friendsRes.success) sidebarFriends = friendsRes.data.friends;

	return { user, unreadNotificationsCount, sidebarFriends, profile };
};
