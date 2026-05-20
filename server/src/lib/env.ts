import { z } from "zod";

const envSchema = z.object({
    PORT: z.coerce.number().int().min(1024).max(65535).default(3000),
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    DATABASE_URL: z.string().min(1),
    SESSION_SECRET: z.string().min(32, "SESSION_SECRET must be at least 32 characters"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error("Invalid environment variables:");
    console.error(z.flattenError(parsed.error).fieldErrors);
    process.exit(1);
}

export const env = parsed.data;
