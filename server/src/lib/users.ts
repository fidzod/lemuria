import type { PublicUser } from '@lemuria/types';
import { users, type UserRow } from '../schema';
import { getTableColumns, sql, type SQL } from 'drizzle-orm';
import type { Db } from '../db';

export const userRowToPublicUser = (user: UserRow) =>
	(({ passwordHash, email, bannerUrl, bio, ...publicUser }) =>
		({ ...publicUser }) satisfies PublicUser)(user);

export const saveAndReplaceUpload = async (
	file: File,
	userId: number,
	kind: 'avatar' | 'banner',
	previous?: string | null
): Promise<string> => {
	if (previous)
		await Bun.file(previous.slice(1))
			.delete()
			.catch(() => {});
	const ext = file.name.split('.').pop();
	const path = `uploads/${userId}.${kind}.${ext}`;
	await Bun.write(path, await file.arrayBuffer());
	return `/${path}`;
};

export const getUserProfile = async (where: SQL, db: Db) =>
	await db
		.select({
			...getTableColumns(users),
			postsCount: sql<number>`(
        select count(*) from posts where author_id = users.id and parent_id is null)`,
			friendsCount: sql<number>`(
        select count(*)
        from friendships
        where user_a_id = users.id or user_b_id = users.id)`
		})
		.from(users)
		.where(where);
