import { Hono } from 'hono';
import type { AppVariables } from '../lib/types';
import * as z from 'zod';
import { postSchema } from '../schema/validators';
import { requireAuth } from '../middleware/require-auth';
import { err, ok } from '../lib/response';
import { saveUpload } from '../lib/uploads';
import type { Post } from '@lemuria/types';
import { db } from '../db';
import { postMedia, posts } from '../schema/posts';
import { and, desc, eq, isNull, sql } from 'drizzle-orm';
import { users } from '../schema';
import { userRowToPublicUser } from '../lib/users';

export const postsRouter = new Hono<{ Variables: AppVariables }>()

  // GET /api/v1/posts/ - get posts
  .get('/', async (c) => {
    const queryUserId = c.req.query('userId');

    if (queryUserId !== undefined) {
      const queryUserIdNumber = Number(queryUserId);
      if (isNaN(queryUserIdNumber)) {
        return err(c, 'Invalid Id.');
      }
      const [queryUser] = await db.select().from(users).where(eq(users.id, queryUserIdNumber));
      if (queryUser === undefined) {
        return err(c, 'User not found.', 404);
      }
    }

    const rows = await db
      .select({
        id: posts.id,
        textContent: posts.textContent,
        createdAt: posts.createdAt,
        likeCount: posts.likeCount,
        dislikeCount: posts.dislikeCount,
        reshareCount: posts.reshareCount,
        replyCount: posts.replyCount,
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
      })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .leftJoin(postMedia, eq(postMedia.postId, posts.id))
      .where(
        queryUserId
          ? and(
            eq(posts.authorId, Number(queryUserId)),
            isNull(posts.parentId)
          )
          : isNull(posts.parentId)
      )
      .orderBy(desc(posts.createdAt));

    const grouped = new Map<number, Post & { id: number }>();

    for (const row of rows) {
      if (!grouped.has(row.id)) {
        grouped.set(row.id, { ...row, media: [] });
      }
      if (row.mediaUrl) {
        grouped.get(row.id)!.media.push(row.mediaUrl);
      }
    }

    return ok<Post[]>(
      c,
      [...grouped.values()]
    );
  })

  // POST /api/v1/posts - create post
  .post('/', requireAuth, async (c) => {
    const formData = await c.req.formData();
    const textContent = formData.get('textContent') as string | null;
    const parentId = formData.get('parentId') as number | null;
    const media = formData
      .getAll('media')
      .filter((v): v is File => v instanceof File && v.size > 0);

    const result = postSchema.safeParse({ textContent: textContent ?? undefined, media });
    if (!result.success) {
      return err(c, 'Validation failed', 422, z.flattenError(result.error).fieldErrors);
    }

    if (parentId !== null) {
      const [parent] = await db
        .select()
        .from(posts)
        .where(eq(posts.id, parentId))

      if (parent === undefined) {
        return err(c, 'Comment parent does not exist.', 404)
      }

      if (parent.parentId !== null) {
        return err(c, 'Cannot comment post a comment on another comment.')
      }
    }

    const session = c.get('session');
    const userId = session.get('userId') as number;

    const [inserted] = await db
      .insert(posts)
      .values({
        textContent,
        authorId: userId,
        ...(parentId !== null && { parentId })
      })
      .returning();

    if (!inserted) {
      return err(c, 'Failed to post.');
    }

    if (parentId !== null) {
      await db
        .update(posts)
        .set({ replyCount: sql`${posts.replyCount} + 1` })
        .where(eq(posts.id, parentId))
    }

    const mediaRows = await Promise.all(
      (result.data.media ?? []).map((file, i) =>
        saveUpload(file, userId, `post-${inserted.id}-${i}`).then((url) => ({
          postId: inserted.id,
          url,
          position: i
        }))
      )
    );

    if (mediaRows.length) {
      await db.insert(postMedia).values(mediaRows);
    }

    const [user] = await db.select().from(users).where(eq(users.id, userId));
    const { authorId, ...post } = inserted;

    return ok<Post>(
      c,
      {
        ...post,
        author: userRowToPublicUser(user!),
        media: mediaRows.map(({ url }) => url)
      },
      201
    );
  })

  // GET /api/v1/posts/:id/comments - get comments for a post
  .get('/:id/comments', async (c) => {
    const postId = c.req.param('id');

    const postIdNumber = Number(postId)

    if (isNaN(postIdNumber)) {
      return err(c, "Invalid post Id.")
    }

    const [post] = await db
      .select({ id: posts.id })
      .from(posts)
      .where(eq(posts.id, postIdNumber));

    if (post === undefined) {
      return err(c, "Post not found.", 404)
    }

    const rows = await db
      .select({
        id: posts.id,
        textContent: posts.textContent,
        createdAt: posts.createdAt,
        likeCount: posts.likeCount,
        dislikeCount: posts.dislikeCount,
        reshareCount: posts.reshareCount,
        replyCount: posts.replyCount,
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
      })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .leftJoin(postMedia, eq(postMedia.postId, posts.id))
      .where(eq(posts.parentId, postIdNumber))
      .orderBy(posts.createdAt);

    const grouped = new Map<number, Post & { id: number }>();

    for (const row of rows) {
      if (!grouped.has(row.id)) {
        grouped.set(row.id, { ...row, media: [] });
      }
      if (row.mediaUrl) {
        grouped.get(row.id)!.media.push(row.mediaUrl);
      }
    }

    return ok<Post[]>(
      c,
      [...grouped.values()]
    );
  })

  // GET /api/v1/posts/:postId - get a single post
  .get('/:postId', async (c) => {
    const postId = c.req.param('postId');
    const postIdNumber = Number(postId);

    if (isNaN(postIdNumber)) {
      return err(c, 'Invalid post Id.');
    }

    const rows = await db
      .select({
        id: posts.id,
        textContent: posts.textContent,
        createdAt: posts.createdAt,
        likeCount: posts.likeCount,
        dislikeCount: posts.dislikeCount,
        reshareCount: posts.reshareCount,
        replyCount: posts.replyCount,
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
      })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .leftJoin(postMedia, eq(postMedia.postId, posts.id))
      .where(eq(posts.id, postIdNumber));

    if (rows.length === 0) {
      return err(c, 'Post not found.', 404);
    }

    const post: Post = { ...rows[0]!, media: [] };
    for (const row of rows) {
      if (row.mediaUrl) post.media.push(row.mediaUrl);
    }

    return ok<Post>(c, post);
  });
