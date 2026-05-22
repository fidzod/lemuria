import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { api, withCookies } from '$lib/api';

export const load: PageServerLoad = async ({ parent, fetch, request }) => {
	const { user } = await parent();
	if (user === null) redirect(302, '/login');

	// get notifications
	const res = await api.notifications.get(withCookies(fetch, request));

	return { notifications: res.success ? res.data : [] };
};
