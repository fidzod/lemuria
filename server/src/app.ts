import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { healthRouter } from './routes/health';
import { err } from './lib/response';
import { Hono, type Context } from 'hono';
import { errorHandler } from './middleware/error-handler';
import { session } from './lib/session';
import { authRouter } from './routes/auth';
import { friendsRouter } from './routes/friends';
import { notificationsRouter } from './routes/notifications';
import { usersRouter } from './routes/users';
import { postsRouter } from './routes/posts';
import { serveStatic } from 'hono/bun';
import { statsRouter } from './routes/stats';

export const app = new Hono()
	.use('*', logger())
	.use('*', secureHeaders())
	.use(
		'*',
		cors({
			origin: ['http://localhost:5173']
		})
	)

	.use('*', session)

	.use('/uploads/*', serveStatic({ root: './' }))

	.route('/api/v1/auth', authRouter)
	.route('/api/v1/friends', friendsRouter)
	.route('/api/v1/health', healthRouter)
	.route('/api/v1/stats', statsRouter)
	.route('/api/v1/notifications', notificationsRouter)
	.route('/api/v1/users', usersRouter)
	.route('/api/v1/posts', postsRouter)

	.notFound((c: Context) => err(c, 'Not found', 404))

	.onError(errorHandler);
