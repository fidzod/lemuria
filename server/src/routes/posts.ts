import { Hono } from 'hono';
import type { AppVariables } from '../lib/types';
import { zValidator } from '../lib/validate';
import { postSchema } from '../schema/validators';
import { requireAuth } from '../middleware/require-auth';
import { err, ok } from '../lib/response';
import type { Post } from '@lemuria/types';
import { db } from '../db';
import { posts } from '../schema/posts';
import { desc, eq } from 'drizzle-orm';
import { users } from '../schema';
import { userRowToPublicUser } from '../lib/users';

export const postsRouter = new Hono<{ Variables: AppVariables }>()

	// GET /api/v1/posts/ - get posts
	.get('/', async (c) => {
		const rows = await db
			.select({
				textContent: posts.textContent,
				createdAt: posts.createdAt,
				likeCount: posts.likeCount,
				dislikeCount: posts.dislikeCount,
				reshareCount: posts.reshareCount,
				replyCount: posts.replyCount,
				author: {
					id: users.id,
					email: users.email,
					username: users.username,
					createdAt: users.createdAt
				}
			})
			.from(posts)
			.innerJoin(users, eq(posts.authorId, users.id))
			.orderBy(desc(posts.createdAt));

		return ok<Post[]>(c, rows);
	})

	// POST /api/v1/posts - create post
	.post('/', zValidator('json', postSchema), requireAuth, async (c) => {
		const { textContent } = c.req.valid('json');

		const session = c.get('session');
		const userId = session.get('userId') as number;

		const [inserted] = await db.insert(posts).values({ textContent, authorId: userId }).returning();

		if (inserted === undefined) {
			return err(c, 'Failed to post.');
		}

		const [user] = await db.select().from(users).where(eq(users.id, userId));

		const { authorId, ...post } = inserted;

		return ok<Post>(
			c,
			{
				...post,
				author: userRowToPublicUser(user!)
			},
			201
		);
	});
