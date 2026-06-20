<script lang="ts">
	import Notification from '$lib/components/Notification.svelte';
	import type { AppNotification } from '@lemuria/types';

	let { data } = $props();
	let notifications: AppNotification[] = $derived(data.notifications);
</script>

<h1>Notifications</h1>

{#if notifications.length === 0}
	Nothing to see here...
{/if}

{#each notifications as notification}
	<Notification {notification} />
{/each}
