import { AccentColors, FRIEND_REQUEST_STATUSES } from '@lemuria/types';
import { z } from 'zod';

export const usernameSchema = z
	.string()
	.min(3, 'Username must be at least 3 characters')
	.max(20, 'Username must be at most 20 characters')
	.regex(/^[a-zA-Z0-9_]+$/, 'Username may only contain letters, numbers and _');

export const passwordSchema = z
	.string()
	.min(8, 'Password must be at least 8 characters')
	.max(128, 'Password must be at most 128 characters');

export const emailSchema = z.email('Invalid email address').toLowerCase();

export const registerSchema = z.object({
	email: emailSchema,
	username: usernameSchema,
	password: passwordSchema
});

export const loginSchema = z.object({
	identifier: z.string().min(1, 'Username or email is required'),
	password: z.string().min(1, 'Password is required')
});

export const createFriendRequestSchema = z.object({
	toUserId: z.number()
});

export const respondToFriendRequestSchema = z.object({
	status: z.enum(FRIEND_REQUEST_STATUSES).exclude(['pending'])
});

export const postSchema = z.object({
	textContent: z.string()
});

const imageFile = z
	.instanceof(File)
	.refine((f) => f.size < 5 * 1024 * 1024, 'File exceeds max upload size (5MB)')
	.refine(
		(f) => ['image/jpeg', 'image/png', 'image/webp'].includes(f.type),
		'Must be JPEG, PNG or WebP'
	)
	.optional();

export const updateUserSchema = z.object({
	displayName: z.string().min(1),
	bio: z.string().optional(),
	accentColor: z.enum(AccentColors),
	avatar: imageFile,
	banner: imageFile
});
