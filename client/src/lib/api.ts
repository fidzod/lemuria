import type { PublicUser } from '@lemuria/types';

type SvelteKitFetch = typeof globalThis.fetch;

const BASE_URL = '/api/v1';

type ApiSuccess<T> = { success: true; data: T };
type ApiError = { success: false; error: string; details?: Record<string, string[]> };
type ApiResponse<T> = ApiSuccess<T> | ApiError;

const request = async <T>(
	fetch: SvelteKitFetch,
	path: string,
	options: RequestInit = {}
): Promise<ApiResponse<T>> => {
	const response = await fetch(`${BASE_URL}${path}`, {
		...options,
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			...options.headers
		}
	});

	const body = (await response.json()) as ApiResponse<T>;
	return body;
};

export const api = {
	auth: {
		me: (fetch: SvelteKitFetch) => request<PublicUser>(fetch, '/auth/me'),

		login: (fetch: SvelteKitFetch, identifier: string, password: string) =>
			request<PublicUser>(fetch, '/auth/login', {
				method: 'POST',
				body: JSON.stringify({ identifier, password })
			}),

		register: (fetch: SvelteKitFetch, email: string, username: string, password: string) =>
			request<PublicUser>(fetch, '/auth/register', {
				method: 'POST',
				body: JSON.stringify({ email, username, password })
			}),

		logout: (fetch: SvelteKitFetch) => request(fetch, '/auth/logout', { method: 'POST' })
	}
} as const;
