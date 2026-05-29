<script lang="ts">
	import { enhance } from '$app/forms';
	import { addToast } from '$lib/stores/toast.svelte.js';
	let { data } = $props();
	let users = $derived(data.users);
</script>

<h1>Testing</h1>

<h2>Users</h2>
<ul>
	{#each users as profile}
		<li>
			<span>@{profile.user.username}</span>
			{#if profile.relationship.status === 'me'}
				Me
			{:else if profile.relationship.status === 'friends'}
				Friends
				<form
					method="POST"
					action="?/removeFriend"
					use:enhance={() => {
						return async ({ result }) => {
							if (result.type === 'failure') {
								const error = result.data?.error;
								addToast(typeof error === 'string' ? error : 'Something went wrong', 'error');
							}
						};
					}}
				>
					<input type="hidden" name="friendship-id" value={profile.relationship.friendshipId} />
					<button type="submit">Unfriend</button>
				</form>
			{:else if profile.relationship.status === 'request_sent'}
				Requested
			{:else if profile.relationship.status === 'request_received'}
				<form
					action="?/respondToFriendRequest"
					method="POST"
					use:enhance={() => {
						return async ({ result }) => {
							if (result.type === 'failure') {
								const error = result.data?.error;
								addToast(typeof error === 'string' ? error : 'Something went wrong', 'error');
							}
						};
					}}
				>
					<input
						type="hidden"
						name="friend-request-id"
						value={profile.relationship.friendRequestId}
					/>
					<button type="submit" name="response" value="accepted">Accept</button>
					<button type="submit" name="response" value="rejected">Reject</button>
				</form>
			{:else if data.user}
				<form method="POST" action="?/createFriendRequest" use:enhance>
					<input type="hidden" name="to-user-id" value={profile.user.id} />
					<button type="submit">Request</button>
				</form>
			{/if}
		</li>
	{/each}
</ul>

<style>
	li {
		display: flex;
		gap: var(--space-sm);
	}
</style>
