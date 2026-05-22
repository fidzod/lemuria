<script lang="ts">
	import { timeAgo } from "$lib/timeago";
	import type { AppNotification } from "@lemuria/types";

    let { notification }: {
        notification: AppNotification
    } = $props();

    let date = $derived(timeAgo(notification.createdAt));
</script>

{#if notification.friendship}
    {#if notification.friendship.friend}
        <div class="notification" class:read={notification.read}>
            @{notification.friendship.friend.username} accepted your friend request {date}
        </div>
    {:else}
        <div class="notification" class:read={notification.read}>
            Friend request accepted by deleted user
        </div>
    {/if}
{/if}

<style>
    .notification.read {
        color: var(--text-muted);
    }
</style>
