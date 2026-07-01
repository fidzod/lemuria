import { Hono } from 'hono';
import { and, desc, eq, isNull, sql } from 'drizzle-orm';
import * as z from 'zod';

import type { Post } from '@lemuria/types';
import type { AppVariables } from '../lib/types';

import { postSchema } from '../schema/validators';
import { requireAuth } from '../middleware/require-auth';
import { err, ok } from '../lib/response';
import { db } from '../db';
import { postLikes, postMedia, posts } from '../schema/posts';
import { users } from '../schema';
import { applyLikesJoin, createPost, getPostSelect, groupPosts } from '../lib/posts';
import { createNotification } from '../lib/notifications';

export const postsRouter = new Hono<{ Variables: AppVariables }>()

	// GET /api/v1/posts/ - get posts
	.get('/', async (c) => {
		const queryUserId = c.req.query('userId');

		if (queryUserId !== undefined) {
			const [queryUser] = await db.select().from(users).where(eq(users.id, queryUserId));
			if (queryUser === undefined) {
				return err(c, 'User not found.', 404);
			}
		}

		const currentUserId = c.get('session')?.get('userId');
		const q = db
			.select(getPostSelect(currentUserId))
			.from(posts)
			.innerJoin(users, eq(posts.authorId, users.id))
			.leftJoin(postMedia, eq(postMedia.postId, posts.id))
			.where(
				queryUserId
					? and(eq(posts.authorId, queryUserId), isNull(posts.parentId))
					: isNull(posts.parentId)
			)
			.orderBy(desc(posts.createdAt));

		const rows = await applyLikesJoin(q, currentUserId);
		return ok<Post[]>(c, groupPosts(rows));
	})

	// GET /api/v1/posts/:postId - get a single post
	.get('/:postId', async (c) => {
		const postId = c.req.param('postId');

		const currentUserId = c.get('session').get('userId');

		const q = db
			.select(getPostSelect(currentUserId))
			.from(posts)
			.innerJoin(users, eq(posts.authorId, users.id))
			.leftJoin(postMedia, eq(postMedia.postId, posts.id))
			.where(eq(posts.id, postId));

		const rows = await applyLikesJoin(q, currentUserId);
		if (rows.length === 0) return err(c, 'Post not found.', 404);
		return ok<Post>(c, groupPosts(rows)[0]!);
	})

	// POST /api/v1/posts - create post
	.post('/', requireAuth, async (c) => {
		const formData = await c.req.formData();
		const textContent = formData.get('textContent') as string | null;
		const parentId = formData.get('parentId') as string | null;
		const media = formData
			.getAll('media')
			.filter((v): v is File => v instanceof File && v.size > 0);

		const result = postSchema.safeParse({ textContent: textContent ?? undefined, media });
		if (!result.success) {
			return err(c, 'Validation failed', 422, z.flattenError(result.error).fieldErrors);
		}

		if (parentId !== null) {
			const [parent] = await db.select().from(posts).where(eq(posts.id, parentId));
			if (parent === undefined) return err(c, 'Comment parent does not exist.', 404);
			if (parent.parentId !== null)
				return err(c, 'Cannot comment post a comment on another comment.');
		}

		const userId = c.get('session').get('userId')!;

		try {
			const post = await createPost(userId, textContent, parentId, result.data.media ?? []);
			return ok<Post>(c, post, 201);
		} catch {
			return err(c, 'Failed to post.');
		}
	})

	// GET /api/v1/posts/:id/comments - get comments for a post
	.get('/:id/comments', async (c) => {
		const postId = c.req.param('id');

		const [post] = await db.select({ id: posts.id }).from(posts).where(eq(posts.id, postId));

		if (post === undefined) return err(c, 'Post not found.', 404);

		const currentUserId = c.get('session')?.get('userId');

		const q = db
			.select(getPostSelect(currentUserId))
			.from(posts)
			.innerJoin(users, eq(posts.authorId, users.id))
			.leftJoin(postMedia, eq(postMedia.postId, posts.id))
			.where(eq(posts.parentId, postId))
			.orderBy(posts.createdAt);

		const rows = await applyLikesJoin(q, currentUserId);
		return ok<Post[]>(c, groupPosts(rows));
	})

	// POST /api/v1/posts/:postId/like - like a post
	.post('/:id/like', requireAuth, async (c) => {
		const postId = c.req.param('id');

		const userId = c.get('session').get('userId')!;

		const res = await db
			.insert(postLikes)
			.values({ postId: postId, userId })
			.onConflictDoNothing()
			.returning();

		if (res.length === 0) {
			return err(c, 'You have already liked this post.');
		}

		const [post] = await db
			.update(posts)
			.set({ likeCount: sql`${posts.likeCount} + 1` })
			.where(eq(posts.id, postId))
			.returning();

		if (post === undefined) return err(c, 'Post not found', 404);

		await createNotification(db, {
			userId: post.authorId,
			type: post.parentId === null ? 'post_liked' : 'comment_liked',
			actionUserId: userId,
			postId: post.id
		});

		return ok<{}>(c, {}, 201);
	})

	// DELETE /api/v1/posts/:postId/like - unlike a post
	.delete('/:id/like', requireAuth, async (c) => {
		const postId = c.req.param('id');

    const userId = c.get('session').get('userId')!;

		await db
			.delete(postLikes)
			.where(and(eq(postLikes.userId, userId), eq(postLikes.postId, postId)));

		await db
			.update(posts)
			.set({ likeCount: sql`${posts.likeCount} - 1` })
			.where(eq(posts.id, postId));

		return ok<{}>(c, {});
	});
