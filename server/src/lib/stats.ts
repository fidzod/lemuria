import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

export const dirSize = async (path: string): Promise<number> => {
	const entries = await readdir(path, { withFileTypes: true });
	const sizes = await Promise.all(
		entries.map((e) => {
			const full = join(path, e.name);
			return e.isDirectory() ? dirSize(full) : stat(full).then((s) => s.size);
		})
	);
	return sizes.reduce((a, b) => a + b, 0);
};
