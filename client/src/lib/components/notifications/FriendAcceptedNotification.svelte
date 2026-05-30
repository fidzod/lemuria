<script lang="ts">
	import { timeAgo } from '$lib/timeago';
	import type { AppNotification } from '@lemuria/types';

	let {
		notification
	}: {
		notification: AppNotification;
	} = $props();

	let date = $derived(timeAgo(notification.createdAt));
</script>

{#if notification.friendship}
	{#if notification.friendship.friend}
		<div class="notification" class:read={notification.read}>
			<a href="/@{notification.friendship.friend.username}">
				@{notification.friendship.friend.username}
			</a>
			accepted your friend request
			<span>{date}</span>
		</div>
	{:else}
		<div class="notification" class:read={notification.read}>
			Friend request accepted by deleted user
			<span>{date}</span>
		</div>
	{/if}
{/if}

<style>
	.notification:not(.read) {
		color: var(--text-primary);

		span {
			color: var(--text-secondary);
		}
	}
	.notification.read {
		span {
			color: var(--text-muted);
		}
	}
</style>
