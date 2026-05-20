import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export type ApiSuccess<T> = { success: true; data: T };
export type ApiError = { success: false; error: string; details?: unknown };
export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export const ok = <T>(
    c: Context,
    data: T,
    status: ContentfulStatusCode = 200,
) => {
    return c.json<ApiSuccess<T>>({ success: true, data }, status);
};

export const err = (
    c: Context,
    error: string,
    status: ContentfulStatusCode = 500,
    details?: unknown,
) => {
    return c.json<ApiError>({ success: false, error, details }, status);
};
