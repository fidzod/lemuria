import { join } from 'path';
import type { PublicUser } from '@lemuria/types';
import type { SessionMap, SessionUser, UserConfig } from './types';
import data from './data/users.yaml';
import { loadImage } from './images';
import { api } from './api';

const register = async (username: string): Promise<SessionUser> => {
	const res = await fetch(api('/auth/register'), {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username, email: `${username}@tokyo3.jp`, password: 'password' })
	});
	const cookie = res.headers.get('set-cookie');
	if (!cookie) throw new Error(`Login failed for ${username}`);
	const data: {
		success: boolean;
		data?: PublicUser;
	} = (await res.json()) as any;
	return {
		session: cookie,
		id: data.data!.id
	};
};

export const createSessions = async () => {
	let sessionMap: SessionMap = new Map();
	for (let user of data.users) {
		let sessionUser = await register(user.username);
		sessionMap.set(user.username, sessionUser);
	}
	return sessionMap;
};

export const updateProfiles = async (sessionMap: SessionMap) => {
	await Promise.all(
		sessionMap.keys().map(async (username) => {
			const cookie = sessionMap.get(username)!.session;
			const avatar = await loadImage(join('src/data/profile_media', `${username}.avatar.jpg`));
			const banner = await loadImage(join('src/data/profile_media', `${username}.banner.jpg`));
			const form = new FormData();
			form.append('avatar', avatar);
			form.append('banner', banner);
			const userConfig = data.users.filter((item: UserConfig) => item.username === username)[0]!;
			form.append('displayName', userConfig.displayName);
			form.append('accentColor', userConfig.accentColor);
			form.append('bio', userConfig.bio);
			await fetch(api(`/users/${username}`), {
				method: 'PATCH',
				headers: { Cookie: cookie },
				body: form
			});
		})
	);
};
