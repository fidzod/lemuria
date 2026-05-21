import { createMiddleware } from 'hono/factory';
import type { AppVariables } from '../lib/types';
import { err } from '../lib/response';

export const requireAuth = createMiddleware<{ Variables: AppVariables }>(async (c, next) => {
	const session = c.get('session');
	const userId = session.get('userId');

	if (userId === undefined) return err(c, 'Unauthorised', 401);

	return await next();
});
