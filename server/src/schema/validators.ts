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
