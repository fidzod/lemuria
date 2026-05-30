export const NotificationTypes = ['friend_request', 'friend_accepted'] as const;
export type NotificationType = (typeof NotificationTypes)[number];

export const FRIEND_REQUEST_STATUSES = ['pending', 'accepted', 'rejected'] as const;
export type FriendRequestStatus = (typeof FRIEND_REQUEST_STATUSES)[number];

export type Relationship =
	| { status: 'me' }
	| { status: 'friends'; friendshipId: number }
	| { status: 'request_sent' }
	| { status: 'request_received'; friendRequestId: number }
	| { status: null };

export const AccentColors = ['red', 'yellow', 'green', 'cyan', 'magenta', 'unset'] as const;
export type AccentColor = (typeof AccentColors)[number];

export const isAccentColor = (value: string): value is AccentColor =>
	(AccentColors as readonly string[]).includes(value);

export type PublicUser = {
	id: number;
	displayName: string;
	username: string;
	accentColor: AccentColor;
	avatarUrl: string | null;
	createdAt: Date;
};

export type UserProfile = {
	user: PublicUser;
	bannerUrl: string | null;
	bio: string | null;
	relationship: Relationship;
	postsCount: number;
	friendsCount: number;
};

export type ProfileUpdate = {
	displayName: string;
	bio: string | null;
	accentColor: AccentColor;
	avatar: File | null;
	banner: File | null;
};

export type FriendRequest = {
	id: number;
	from: PublicUser;
	to: PublicUser;
	status: FriendRequestStatus;
	createdAt: Date;
};

export type Friendship = {
	id: number;
	friend: PublicUser;
	createdAt: Date;
};

export type AppNotification = {
	id: number;
	type: NotificationType;
	read: boolean;
	friendRequest?: FriendRequest;
	friendship?: Friendship;
	createdAt: Date;
};

export type UnreadNotifications = {
	count: number;
};

export type Post = {
	textContent: string | null;
	createdAt: Date;
	author: PublicUser;
	likeCount: number;
	dislikeCount: number;
	reshareCount: number;
	replyCount: number;
};
