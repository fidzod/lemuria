<script lang="ts">
	import { SIDEBAR_FRIENDS_KEY, PROFILE_KEY } from '$lib/context';
	import type { PublicUser, UserProfile } from '@lemuria/types';
	import { getContext } from 'svelte';
	import DefaultAvatar from '$lib/assets/default_avatar.jpeg';

	const getFriends = getContext<() => PublicUser[] | null>(SIDEBAR_FRIENDS_KEY);
	let friends = $derived(getFriends());

	const getProfile = getContext<() => UserProfile | null>(PROFILE_KEY);
	let friendsCount = $derived(getProfile()?.friendsCount);

	const isOnlineThreshold = new Date(Date.now() - 90_000); // 90s
</script>

<!-- TODO: online/offline; see (#16) -->

{#if friends}
	<h1>Friends</h1>

	<ul>
		{#each friends as friend}
			<li
				class:online={new Date(friend.lastSeen) > isOnlineThreshold}
				style="
                --user-accent-bright: var(--{friend.accentColor}-bright);
                --user-accent-dark: var(--{friend.accentColor}-dark);
                "
			>
				<a href="/@{friend.username}">
					<img
						src={friend.avatarUrl || DefaultAvatar}
						alt="{friend.displayName}'s avatar"
						class="avatar"
					/>
					<span>{friend.displayName}</span>
				</a>
			</li>
		{/each}
		<li>
			{#if friendsCount && friendsCount > friends.length}
				<a href="/friends">See {friendsCount - friends.length} more...</a>
			{:else if friendsCount === 0}
				<span class="tip">Boards are a good way to discover new friends</span>
			{:else}
				<a href="/friends">See all</a>
			{/if}
		</li>
	</ul>
{/if}

<style>
	li a {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
	}
	.avatar {
		width: 1rem;
		height: 1rem;
		margin: 5px 3px 3px;
		box-shadow:
			0 0 0 2px var(--bg),
			0 0 0 3px var(--user-accent-bright);
	}
	.online a {
		color: var(--text-primary);
	}
	li:last-child {
		margin-top: var(--space-xs);
	}
	.tip {
		font-size: var(--text-sm);
	}
</style>
