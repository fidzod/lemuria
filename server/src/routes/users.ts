import { Hono } from 'hono';
import type { AppVariables } from '../lib/types';
import { err, ok } from '../lib/response';
import { db } from '../db';
import { users } from '../schema';
import { eq } from 'drizzle-orm';
import type { UserProfile } from '@lemuria/types';
import { saveAndReplaceUpload, userRowToPublicUser } from '../lib/users';
import { resolveRelationship } from '../lib/relationships';
import { requireAuth } from '../middleware/require-auth';
import { zValidator } from '../lib/validate';
import { updateUserSchema } from '../schema/validators';

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
	})

	.patch('/:username', zValidator('form', updateUserSchema), requireAuth, async (c) => {
		const username = c.req.param('username');

		const [user] = await db.select().from(users).where(eq(users.username, username));

		if (user === undefined) {
			return err(c, 'User not found.', 404);
		}

		const session = c.get('session');
		const sessionUserId = Number(session.get('userId'));

		if (sessionUserId !== user.id) {
			return err(c, 'You can only update your own profile.', 401);
		}

		const { avatar: avatarFile, banner: bannerFile, ...textfields } = c.req.valid('form');

		const [avatarUrl, bannerUrl] = await Promise.all([
			avatarFile ? saveAndReplaceUpload(avatarFile, sessionUserId, 'avatar') : undefined,
			bannerFile ? saveAndReplaceUpload(bannerFile, sessionUserId, 'banner') : undefined
		]);

		const [updatedUser] = await db
			.update(users)
			.set({
				...textfields,
				...(avatarUrl !== undefined && { avatarUrl }),
				...(bannerUrl !== undefined && { bannerUrl })
			})
			.where(eq(users.id, sessionUserId))
			.returning();

		return ok<UserProfile>(c, {
			user: userRowToPublicUser(updatedUser!),
			bannerUrl: updatedUser!.bannerUrl,
			bio: updatedUser!.bio,
			relationship: await resolveRelationship(sessionUserId, user.id, db)
		});
	});
