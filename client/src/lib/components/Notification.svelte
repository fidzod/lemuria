<script lang="ts">
	import type { AppNotification } from '@lemuria/types';
	import FriendRequestNotification from './notifications/FriendRequestNotification.svelte';
	import FriendAcceptedNotification from './notifications/FriendAcceptedNotification.svelte';
	import '$lib/styles/notifications.css';
	import LikedNotification from './notifications/LikedNotification.svelte';

	let { notification }: { notification: AppNotification } = $props();
</script>

{#if notification.type === 'friend_request'}
	<FriendRequestNotification {notification} />
{:else if notification.type === 'friend_accepted'}
	<FriendAcceptedNotification {notification} />
{:else if notification.type === 'post_liked' || notification.type === 'comment_liked'}
	<LikedNotification {notification} />
{/if}
