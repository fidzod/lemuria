import type { PageServerLoad } from './$types';
import { api, withCookies } from '$lib/api';

export const load: PageServerLoad = async ({ fetch, request }) => {
	const result = await api.posts.all(withCookies(fetch, request));

	return { posts: result.success ? result.data : [] };
};
