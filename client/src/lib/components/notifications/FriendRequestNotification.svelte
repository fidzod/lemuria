<script lang="ts">
	import { enhance } from '$app/forms';
	import { timeAgo } from '$lib/timeago';
	import type { AppNotification } from '@lemuria/types';
	import { X as Reject, Check as Accept } from '@lucide/svelte/icons';

	let {
		notification
	}: {
		notification: AppNotification;
	} = $props();

	let friendRequest = $derived(notification.friendRequest!);

	let date = $derived(timeAgo(friendRequest.createdAt));
</script>

{#if friendRequest.from}
	<div class="notification" class:read={notification.read}>
		{#if friendRequest.status === 'pending'}
			New friend request from
			<a href="/@{friendRequest.from.username}" class="pending">
				@{friendRequest.from.username}
			</a>
			<form
				action="/@{friendRequest.from.username}?/respondToFriendRequest"
				method="POST"
				use:enhance
			>
				<input type="hidden" name="friend-request-id" value={friendRequest.id} />
				<div class="response">
					<button type="submit" name="response" value="accepted"><Accept /></button>
					<button type="submit" name="response" value="rejected"><Reject /></button>
				</div>
			</form>
		{:else if friendRequest.status === 'accepted'}
			Friend request from
			<a href="/@{friendRequest.from.username}">
				@{friendRequest.from.username}
			</a>
			<button disabled>Accepted</button>
		{:else}
			Friend request from
			<a href="/@{friendRequest.from.username}">
				@{friendRequest.from.username}
			</a>
			<button disabled>Rejected</button>
		{/if}
		<span>{date}</span>
	</div>
{:else}
	<div class="notification" class:read={notification.read}>
		New friend request from a deleted user <span>{date}</span>
	</div>
{/if}

<style>
	.notification {
		display: flex;
		gap: var(--space-sm);
	}
	.response {
		display: flex;
		gap: var(--space-xs);

		button {
			margin-top: 3px;
		}
	}
</style>
