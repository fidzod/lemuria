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

export type PublicUser = {
	id: number;
	username: string;
	createdAt: Date;
};

export type UserProfile = {
	user: PublicUser;
	relationship: Relationship;
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
