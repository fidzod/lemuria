import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { api, withCookies } from '$lib/api';

export const load: PageServerLoad = async ({ params, fetch, request }) => {
	const username = params.username;

	const res = await api.users.get(withCookies(fetch, request), username);

	if (!res.success) {
		error(404, 'User not found');
	}

	return { profile: res.data };
};
