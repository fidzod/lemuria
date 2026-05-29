import type { PublicUser } from '@lemuria/types';
import type { UserRow } from '../schema';

export const userRowToPublicUser = (user: UserRow) =>
	(({ passwordHash, email, bannerUrl, bio, ...publicUser }) =>
		({ ...publicUser }) satisfies PublicUser)(user);
