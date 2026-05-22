import { api, withCookies } from '$lib/api';
import type { PublicUser } from '@lemuria/types';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ fetch, request }) => {
	let user: PublicUser | null = null;
	const meResult = await api.auth.me(withCookies(fetch, request));

	if (meResult.success) user = meResult.data;

	let unreadNotificationsCount: number | undefined;
    let sidebarFriends: PublicUser[] | undefined;

	if (user !== null) {
		const unreadCountResult = await api.notifications.unreadCount(withCookies(fetch, request));
        const sidebarFriendsResult = await api.friends.get(withCookies(fetch, request), 10);

		if (unreadCountResult.success) unreadNotificationsCount = unreadCountResult.data.count;
        if (sidebarFriendsResult.success) sidebarFriends = sidebarFriendsResult.data.friends;
	}

	return { user, unreadNotificationsCount, sidebarFriends };
};
