import type {
	AppNotification,
	UnreadNotifications,
	PublicUser,
	UserProfile,
	FriendRequest,
	Friendship,
	Post,
	ProfileUpdate
} from '@lemuria/types';

type SvelteKitFetch = typeof globalThis.fetch;

const BASE_URL = '/api/v1';

type ApiSuccess<T> = { success: true; data: T };
type ApiError = { success: false; error: string; details?: Record<string, string[]> };
type ApiResponse<T> = ApiSuccess<T> | ApiError;

export const withCookies = (fetch: SvelteKitFetch, request: Request): SvelteKitFetch => {
	const cookie = request.headers.get('cookie');

	return (input, init) =>
		fetch(input, {
			...init,
			headers: { ...init?.headers, ...(cookie !== null ? { cookie } : {}) }
		});
};

const request = async <T>(
	fetch: SvelteKitFetch,
	path: string,
	options: RequestInit = {}
): Promise<ApiResponse<T>> => {
	const isFormData = options.body instanceof FormData;
	const response = await fetch(`${BASE_URL}${path}`, {
		...options,
		credentials: 'include',
		headers: {
			...(!isFormData && { 'Content-Type': 'application/json' }),
			...options.headers
		}
	});

	const body = (await response.json()) as ApiResponse<T>;
	return body;
};

type GenericUpdate = Record<string, string | File | null | undefined>;

const buildFormData = <T extends GenericUpdate>(data: T): FormData => {
	const formData = new FormData();
	for (const [key, value] of Object.entries(data)) {
		if (value == null || value === '') continue;
		formData.append(key, value);
	}
	return formData;
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
	},
	notifications: {
		unreadCount: (fetch: SvelteKitFetch) =>
			request<UnreadNotifications>(fetch, '/notifications/unread-count'),
		get: (fetch: SvelteKitFetch) => request<AppNotification[]>(fetch, '/notifications')
	},
	users: {
		get: (fetch: SvelteKitFetch, username: string) =>
			request<UserProfile>(fetch, `/users/${username}`),
		updateProfile: (fetch: SvelteKitFetch, username: string, update: ProfileUpdate) =>
			request<UserProfile>(fetch, `/users/${username}`, {
				method: 'PATCH',
				body: buildFormData<ProfileUpdate>(update)
			})
	},
	friends: {
		request: (fetch: SvelteKitFetch, toUserId: number) =>
			request<FriendRequest | Friendship>(fetch, '/friends/requests', {
				method: 'POST',
				body: JSON.stringify({ toUserId })
			}),
		respondToRequest: (
			fetch: SvelteKitFetch,
			friendRequestId: number,
			response: 'accepted' | 'rejected'
		) =>
			request<FriendRequest>(fetch, `/friends/requests/${friendRequestId}`, {
				method: 'PATCH',
				body: JSON.stringify({ status: response })
			}),
		removeFriendship: (fetch: SvelteKitFetch, friendshipId: number) =>
			request<Friendship>(fetch, `/friends/${friendshipId}`, { method: 'DELETE' }),
		get: (fetch: SvelteKitFetch, limit: number) =>
			request<{ friends: PublicUser[] }>(fetch, `/friends?limit=${limit}`)
	},
	posts: {
		createPost: (fetch: SvelteKitFetch, textContent: string) =>
			request<Post>(fetch, '/posts', {
				method: 'POST',
				body: JSON.stringify({ textContent })
			}),
		all: (fetch: SvelteKitFetch) => request<Post[]>(fetch, '/posts')
	}
} as const;
