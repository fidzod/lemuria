import type { PageServerLoad } from './$types';
import { api, withCookies } from '$lib/api';
import { requireAuth } from '$lib/auth';

export const load: PageServerLoad = async ({ parent, fetch, request, url }) => {
	const { user } = await parent();
	requireAuth(user, url);

	const res = await api.notifications.get(withCookies(fetch, request));

	return { notifications: res.success ? res.data : [] };
};
