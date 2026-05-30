import { Hono } from 'hono';
import { err, ok } from '../lib/response';
import { db } from '../db';
import { count, gt } from 'drizzle-orm';
import { posts, users } from '../schema';
import type { Stats } from '@lemuria/types';
import { dirSize } from '../lib/stats';
import { join } from 'node:path';

const isOnlineThreshold = new Date(Date.now() - 90_000); // 90s

export const statsRouter = new Hono()

	// GET /api/v1/stats
	.get('/', async (c) => {
		const [totalPostsRes] = await db.select({ totalPosts: count() }).from(posts);

		if (totalPostsRes === undefined) {
			return err(c, 'Something went wrong.');
		}

		const { totalPosts } = totalPostsRes;

		const [onlineUsersRes] = await db
			.select({ onlineUsers: count() })
			.from(users)
			.where(gt(users.lastSeen, isOnlineThreshold));

		if (onlineUsersRes === undefined) {
			return err(c, 'Something went wrong.');
		}

		const { onlineUsers } = onlineUsersRes;

		const uploadsSizeInBytes = await dirSize(join(import.meta.dir, '../../uploads'));
		const uploadsSizeInMb = (uploadsSizeInBytes / 1_000_000).toFixed(2);
		const uploadsSize = `${uploadsSizeInMb}Mb`;

		return ok<Stats>(c, { totalPosts, onlineUsers, uploadsSize });
	});
