import { resolve } from 'node:path';
import type { SessionMap } from './types';
import data from './data/posts.yaml';
import { api } from './api';
import type { Post } from '@lemuria/types';
import { createImagePool, loadImage } from './images';

const posts: string[] = data.posts;

const sleep = (ms: number): Promise<void> => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

export const createPosts = async (sessionMap: SessionMap, parentIds: string[] = []) => {
	const pool = createImagePool('src/data/post_media');
	const createdPosts = await Promise.all(
		posts.map(async (p) => {
			await sleep(Math.random() * 500);

			const usernames = sessionMap.keys().toArray();
			const user = usernames[Math.floor(Math.random() * usernames.length)]!;
			const cookie = sessionMap.get(user)!.session;

			const form = new FormData();
			form.append('textContent', p);
			if (parentIds.length > 0) {
				const parentId = parentIds[Math.floor(Math.random() * parentIds.length)]!;
				form.append('parentId', parentId);
			}

			let images: File[] | undefined;
			const hasImage = Math.random() > 0.9;
			if (hasImage) {
				const count = Math.floor(Math.random() * 3) + 1;
				const paths = Array.from({ length: count }, () => pool()).filter(Boolean) as string[];
				if (paths.length) images = await Promise.all(paths.map(loadImage));
			}
			if (images !== undefined) for (let image of images) form.append('media', image);

			const res = await fetch(api('/posts'), {
				method: 'POST',
				headers: { Cookie: cookie },
				body: form
			});

			const data: {
				success: boolean;
				data: Post;
			} = (await res.json()) as any;
			if (!data.success) throw new Error('Failed to post');

			if (parentIds.length > 0) {
				console.log(`@${user} commented on ${form.get('parentId')}`);
			} else {
				console.log(`@${user} posted`);
			}

			return data.data.id;
		})
	);
	return createdPosts;
};
