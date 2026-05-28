import type { PublicUser } from '@lemuria/types';
import { redirect } from '@sveltejs/kit';

export const requireAuth = (user: PublicUser | null, url: URL) => {
	if (user === null) {
		throw redirect(302, `/login?redirectTo=${encodeURIComponent(url.pathname)}`);
	}
};
