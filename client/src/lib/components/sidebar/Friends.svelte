<script lang="ts">
	import { SIDEBAR_FRIENDS_KEY } from '$lib/context';
	import type { PublicUser } from '@lemuria/types';
	import { getContext } from 'svelte';
	import DefaultAvatar from '$lib/assets/default_avatar.jpeg';

	const getFriends = getContext<() => PublicUser[] | undefined>(SIDEBAR_FRIENDS_KEY);
	let friends = $derived(getFriends());
</script>

<!-- TODO: online/offline; see (#16) -->

{#if friends}
	<h1>Friends</h1>

	<ul>
		{#each friends as friend}
			<li
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
			<!-- TODO: See (#16) -->
			<a href="/friends">See X more...</a>
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
	li:last-child {
		margin-top: var(--space-xs);
	}
</style>
