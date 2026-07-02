import { readdirSync } from 'fs';
import { join, extname } from 'path';

const SUPPORTED = new Set(['.jpg', '.jpeg', '.png', '.webp']);

const mimeType = (path: string): string => {
	const ext = extname(path).toLowerCase();
	if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
	if (ext === '.png') return 'image/png';
	return 'image/webp';
};

export const loadImage = async (path: string): Promise<File> => {
	const filename = path.split('/').pop()!;
	return new File([await Bun.file(path).arrayBuffer()], filename, { type: mimeType(path) });
};

export const createImagePool = (dir: string): (() => string | undefined) => {
	const files = readdirSync(dir)
		.filter((f) => SUPPORTED.has(extname(f).toLowerCase()))
		.map((f) => join(dir, f))
		.sort(() => Math.random() - 0.5);
	let i = 0;
	return () => files[i++];
};
