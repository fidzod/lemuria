export const saveUpload = async (file: File, userId: number, filename: string): Promise<string> => {
	const ext = file.name.split('.').pop();
	const path = `uploads/${userId}.${filename}.${Date.now()}.${ext}`;
	await Bun.write(path, await file.arrayBuffer());
	return `/${path}`;
};
