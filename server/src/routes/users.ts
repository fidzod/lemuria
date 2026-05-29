import { Hono } from 'hono';
import type { AppVariables } from '../lib/types';
import { err, ok } from '../lib/response';
import { db } from '../db';
import { users } from '../schema';
import { eq } from 'drizzle-orm';
import type { UserProfile } from '@lemuria/types';
import { userRowToPublicUser } from '../lib/users';
import { resolveRelationship } from '../lib/relationships';

export const usersRouter = new Hono<{ Variables: AppVariables }>()

	// GET /api/v1/users/:userId - get PublicUser by Id
	.get('/:username', async (c) => {
		const username = c.req.param('username') as string;

		const [user] = await db.select().from(users).where(eq(users.username, username));

		if (user === undefined) return err(c, 'User not found.', 404);

		const session = c.get('session');
		const sessionUserId = Number(session.get('userId'));

		return ok<UserProfile>(c, {
			user: userRowToPublicUser(user),
			bannerUrl: user.bannerUrl,
			bio: user.bio,
			relationship: isNaN(sessionUserId)
				? { status: null }
				: await resolveRelationship(sessionUserId, user.id, db)
		});
	});
