export type PublicUser = {
    id: number;
    email: string;
    username: string;
    createdAt: string;
}

export interface Post {
	displayName: string;
	username: string;
	createdAt: string;
	reshares: number;
	votes: number;
	replies: number;
	body: string;
	avatar: string;
	color: string;
}

export interface Board {
	mnemonic: string;
	name: string;
	description: string;
}
