import { Hono } from 'hono';
import type { AppVariables } from '../lib/types';
import { loginSchema, registerSchema } from '../schema/validators';
import { users } from '../schema';
import { eq, or } from 'drizzle-orm';
import { db } from '../db';
import { err, ok } from '../lib/response';
import { requireAuth } from '../middleware/require-auth';
import { zValidator } from '../lib/validate';
import type { PublicUser } from '@lemuria/types';
import { userRowToPublicUser } from '../lib/users';

export const authRouter = new Hono<{ Variables: AppVariables }>()

	// POST /api/v1/auth/register
	.post('/register', zValidator('json', registerSchema), async (c) => {
		const { email, username, password } = c.req.valid('json');

		const [existing] = await db
			.select({ id: users.id, email: users.email, username: users.username })
			.from(users)
			.where(or(eq(users.email, email), eq(users.username, username)));

		if (existing !== undefined) {
			const field = existing.email === email ? 'email' : 'username';
			return err(c, `That ${field} is already taken.`, 409);
		}

		const passwordHash = await Bun.password.hash(password);

		const [user] = await db.insert(users).values({ email, username, passwordHash }).returning();

		if (user === undefined) {
			return err(c, 'Failed to create user', 500);
		}

		const session = c.get('session');
		session.set('userId', user.id);

		return ok<PublicUser>(c, userRowToPublicUser(user), 201);
	})

	// POST /api/v1/auth/login
	.post('/login', zValidator('json', loginSchema), async (c) => {
		const { identifier, password } = c.req.valid('json');

		const [user] = await db
			.select()
			.from(users)
			.where(or(eq(users.email, identifier.toLowerCase()), eq(users.username, identifier)));

		// Hash whether or not user exists to protect against timing attacks
		const passwordToCheck = user?.passwordHash ?? '$argon2id$v=19$m=65536,t=2,p=1$dummy';
		const valid = user !== undefined && (await Bun.password.verify(password, passwordToCheck));

		if (!valid) return err(c, 'Invalid credentials', 401);

		const session = c.get('session');
		session.set('userId', user.id);

		return ok<PublicUser>(c, userRowToPublicUser(user));
	})

	// POST /api/v1/auth/logout
	.post('/logout', async (c) => {
		const session = c.get('session');
		session.deleteSession();
		return ok(c, { message: 'Logged out' });
	})

	// GET /api/v1/auth/me
	.get('/me', requireAuth, async (c) => {
		const session = c.get('session');
		const userId = session.get('userId') || '';

		const [user] = await db.select().from(users).where(eq(users.id, userId));

		if (user === undefined) {
			// Session references a deleted user
			session.deleteSession();
			return err(c, 'User not found', 404);
		}

		return ok<PublicUser>(c, userRowToPublicUser(user));
	})

	// POST /api/v1/auth/me/heartbeat
	.get('/me/heartbeat', requireAuth, async (c) => {
		const session = c.get('session');
		const userId = session.get('userId')!;
		await db.update(users).set({ lastSeen: new Date() }).where(eq(users.id, userId));
		return ok<{}>(c, {});
	});
