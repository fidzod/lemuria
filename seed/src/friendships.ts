import type { FriendRequest } from '@lemuria/types';
import { api } from './api';
import type { SessionMap } from './types';

type PendingFriendRequest = {
	id: string;
	toUser: string;
	fromUser: string;
};

const sendFriendRequests = async (sessionMap: SessionMap): Promise<PendingFriendRequest[]> => {
	// For each user, for every other user, 40% chance,
	// if not pending friendship the other way, create friendship
	let pendingFriendRequests: PendingFriendRequest[] = [];
	for (let fromUser of sessionMap.keys()) {
		for (let toUser of sessionMap.keys()) {
			if (fromUser === toUser) continue;
			if (Math.random() > 0.4) continue;

			const hasInverseRequest =
				pendingFriendRequests.filter((r) => r.toUser === fromUser && r.fromUser === toUser).length >
				0;

			if (hasInverseRequest) continue;

			const toUserId = sessionMap.get(toUser)!.id;
			const res = await fetch(api('/friends/requests'), {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Cookie: sessionMap.get(fromUser)!.session
				},
				body: JSON.stringify({ toUserId: toUserId })
			});
			const data: {
				success: boolean;
				data: FriendRequest;
			} = (await res.json()) as any;
			const id = data.data.id;

			pendingFriendRequests.push({ id, fromUser, toUser });
			console.log(`@${fromUser} sent a friend request to @${toUser}`);
		}
	}
	return pendingFriendRequests;
};

const acceptFriendRequests = async (
	sessionMap: SessionMap,
	pendingFriendRequests: PendingFriendRequest[]
) => {
	for (let friendRequest of pendingFriendRequests) {
		await fetch(api(`/friends/requests/${friendRequest.id}`), {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Cookie: sessionMap.get(friendRequest.toUser)!.session
			},
			body: JSON.stringify({ status: 'accepted' })
		});
		console.log(
			`@${friendRequest.toUser} accepted a friend request from @${friendRequest.fromUser}`
		);
	}
};

export const createFriendships = async (sessionMap: SessionMap) => {
	const pendingFriendRequests = await sendFriendRequests(sessionMap);
	await acceptFriendRequests(sessionMap, pendingFriendRequests);
};
