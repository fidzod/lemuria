import { zValidator as honoZValidator } from '@hono/zod-validator';
import type { ValidationTargets } from 'hono';
import * as z from 'zod';

export const zValidator = <T extends z.ZodSchema, Target extends keyof ValidationTargets>(
	target: Target,
	schema: T
) =>
	honoZValidator(target, schema, (result, c) => {
		if (!result.success) {
			return c.json(
				{
					success: false,
					error: 'Validation failed',
					details: z.flattenError(result.error).fieldErrors
				},
				422
			);
		}
		return undefined;
	});
