import { and, eq, isNotNull, sql } from 'drizzle-orm';
import { posts, postLikes, users, postMedia } from '../schema';

import type { Post } from '@lemuria/types';
import { db } from '../db';
import { saveUpload } from '../lib/uploads';
import { userRowToPublicUser } from '../lib/users';

export const getPostSelect = (currentUserId?: number) => ({
	id: posts.id,
	textContent: posts.textContent,
	createdAt: posts.createdAt,
	likeCount: posts.likeCount,
	reshareCount: posts.reshareCount,
	replyCount: posts.replyCount,
	likedByMe: currentUserId ? isNotNull(postLikes.userId) : sql<boolean>`false`.mapWith(Boolean),
	author: {
		id: users.id,
		email: users.email,
		displayName: users.displayName,
		username: users.username,
		accentColor: users.accentColor,
		avatarUrl: users.avatarUrl,
		createdAt: users.createdAt,
		lastSeen: users.lastSeen
	},
	mediaUrl: postMedia.url,
	mediaPosition: postMedia.position
});

export const applyLikesJoin = (query: any, currentUserId?: number) => {
	if (!currentUserId) return query;
	return query.leftJoin(
		postLikes,
		and(eq(postLikes.postId, posts.id), eq(postLikes.userId, currentUserId))
	);
};

export const groupPosts = (rows: any[]): Post[] => {
	const grouped = new Map<number, Post & { id: number }>();
	for (const row of rows) {
		if (!grouped.has(row.id)) {
			grouped.set(row.id, { ...row, likedByMe: Boolean(row.likedByMe), media: [] });
		}
		if (row.mediaUrl) {
			grouped.get(row.id)!.media.push(row.mediaUrl);
		}
	}
	return [...grouped.values()];
};

export const createPost = async (
	userId: number,
	textContent: string | null,
	parentId: number | null,
	media: File[]
): Promise<Post> => {
	const [inserted] = await db
		.insert(posts)
		.values({
			authorId: userId,
			...(textContent !== null && { textContent }),
			...(parentId !== null && { parentId })
		})
		.returning();

	if (!inserted) throw new Error('Failed to insert post.');

	if (parentId !== null) {
		await db
			.update(posts)
			.set({ replyCount: sql`${posts.replyCount} + 1` })
			.where(eq(posts.id, parentId));
	}

	const mediaRows = await Promise.all(
		media.map((file, i) =>
			saveUpload(file, userId, `post-${inserted.id}-${i}`).then((url) => ({
				postId: inserted.id,
				url,
				position: i
			}))
		)
	);

	if (mediaRows.length) await db.insert(postMedia).values(mediaRows);

	const [user] = await db.select().from(users).where(eq(users.id, userId));

	const { authorId, ...post } = inserted;
	return {
		...post,
		author: userRowToPublicUser(user!),
		media: mediaRows.map(({ url }) => url),
		likedByMe: false
	};
};
