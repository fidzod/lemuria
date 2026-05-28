import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { api } from '$lib/api';
import { formatApiError } from '$lib/utils';

export const load: PageServerLoad = async ({ parent, url }) => {
	const { user } = await parent();
	if (user !== null) redirect(302, '/');
	return { redirectTo: url.searchParams.get('redirectTo') };
};

export const actions: Actions = {
	login: async ({ fetch, request }) => {
		const form = await request.formData();
		const identifier = form.get('identifier');
		const password = form.get('password');
		const redirectTo = form.get('redirectTo');

		if (typeof identifier !== 'string' || typeof password !== 'string') {
			return fail(400, {
				action: 'login',
				error: 'Invalid form data',
				redirectTo: redirectTo ?? ''
			});
		}

		if (identifier.trim().length === 0) {
			return fail(400, {
				action: 'login',
				error: 'Email or username is required',
				redirectTo: redirectTo ?? ''
			});
		}

		if (password.length === 0) {
			return fail(400, {
				action: 'login',
				error: 'Password is required',
				redirectTo: redirectTo ?? ''
			});
		}

		const result = await api.auth.login(fetch, identifier.trim(), password);

		if (!result.success) {
			return fail(401, { action: 'login', error: result.error, redirectTo: redirectTo ?? '' });
		}

		const safeRedirect =
			typeof redirectTo === 'string' && redirectTo.startsWith('/') ? redirectTo : '/';
		redirect(302, safeRedirect);
	},

	register: async ({ fetch, request }) => {
		const form = await request.formData();
		const email = form.get('email');
		const username = form.get('username');
		const password = form.get('password');
		const redirectTo = form.get('redirectTo');

		if (typeof email !== 'string' || typeof username !== 'string' || typeof password !== 'string') {
			return fail(400, {
				action: 'register',
				error: 'Invalid form data',
				redirectTo: redirectTo ?? ''
			});
		}

		const result = await api.auth.register(fetch, email.trim(), username.trim(), password);

		if (!result.success) {
			return fail(400, {
				action: 'register',
				error: formatApiError(result.error, result.details),
				redirectTo: redirectTo ?? ''
			});
		}

		const safeRedirect =
			typeof redirectTo === 'string' && redirectTo.startsWith('/') ? redirectTo : '/';
		redirect(302, safeRedirect);
	},

	logout: async ({ fetch }) => {
		await api.auth.logout(fetch);
		redirect(302, '/login');
	}
};
