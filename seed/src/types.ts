export type UserConfig = {
	username: string;
	displayName: string;
	email: string;
	accentColor: string;
	bio: string;
};

export type SessionUser = {
	session: string;
	id: string;
};

export type SessionMap = Map<string, SessionUser>;
