import { Hono } from 'hono';
import { ok } from '../lib/response';
import { env } from '../lib/env';

type HealthResponse = {
	status: 'ok';
	env: string;
	timestamp: string;
};

export const healthRouter = new Hono().get('/', (c) => {
	return ok<HealthResponse>(c, {
		status: 'ok',
		env: env.NODE_ENV,
		timestamp: new Date().toISOString()
	});
});
