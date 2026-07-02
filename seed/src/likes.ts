import { api } from './api';
import type { SessionMap } from './types';

export const createLikes = async (sessionMap: SessionMap, posts: string[]) => {
	for (let username of sessionMap.keys()) {
		for (let post of posts.filter(() => Math.random() < 0.5)) {
			await fetch(api(`/posts/${post}/like`), {
				method: 'POST',
				headers: { Cookie: sessionMap.get(username)!.session }
			});
			console.log(`@${username} liked ${post}`);
		}
	}
	return [sessionMap, posts];
};
