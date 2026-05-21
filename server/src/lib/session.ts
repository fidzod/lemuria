import { sessionMiddleware, type Session } from 'hono-sessions';
import { BunSqliteStore } from 'hono-sessions/bun-sqlite-store';
import { sqlite } from '../db';
import { env } from './env';

export type SessionData = {
	userId: number;
};

export type AppSession = Session<SessionData>;

const SESSION_30_DAYS_SECONDS = 60 * 60 * 24 * 30;

const store = new BunSqliteStore(sqlite);

export const session = sessionMiddleware({
	store,
	encryptionKey: env.SESSION_SECRET,
	expireAfterSeconds: SESSION_30_DAYS_SECONDS,
	autoExtendExpiration: true,
	sessionCookieName: 'sid',
	cookieOptions: {
		httpOnly: true,
		secure: env.NODE_ENV === 'production',
		sameSite: 'Lax',
		path: '/'
	}
});
