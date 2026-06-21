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

<div class="notification" class:read={notification.read}>
  <a href="/@{notification.actionUser!.username}">@{notification.actionUser!.username}</a>
  liked
  {#if notification.post!.parentId === null}
  <a href="/p/{notification.post!.id}">your post</a>
  {:else}
  <a href="/p/{notification.post!.parentId}#{notification.post!.id}">your comment</a>
  {/if}
  <span>{date}</span>
</div>

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
