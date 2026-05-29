import type { PublicUser } from '@lemuria/types';
import type { UserRow } from '../schema';

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
