import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { api, withCookies } from '$lib/api';

export const load: PageServerLoad = async ({ fetch, request }) => {
	const result = await api.posts.all(withCookies(fetch, request));

	return { posts: result.success ? result.data : [] };
};

export const actions: Actions = {
	post: async ({ fetch, request }) => {
		const form = await request.formData();
		const textContent = form.get('text-content');

		const result = await api.posts.createPost(withCookies(fetch, request), textContent! as string);

		if (!result.success) {
			return fail(400, { error: result.error });
		}

		return;
	}
};
