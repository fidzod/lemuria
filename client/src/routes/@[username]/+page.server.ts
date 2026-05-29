import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from './$types';
import { api, withCookies } from '$lib/api';
import { isAccentColor } from '@lemuria/types';

export const load: PageServerLoad = async ({ params, fetch, request }) => {
	const username = params.username;

	const res = await api.users.get(withCookies(fetch, request), username);

	if (!res.success) {
		error(404, 'User not found');
	}

	return { profile: res.data };
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
	}
};
