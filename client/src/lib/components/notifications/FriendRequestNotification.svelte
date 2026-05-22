<script lang="ts">
	import { enhance } from '$app/forms';
	import { timeAgo } from "$lib/timeago";
	import type { AppNotification } from "@lemuria/types";

    let { notification }: {
        notification: AppNotification
    } = $props();

    let friendRequest = $derived(notification.friendRequest!);

    let date = $derived(timeAgo(friendRequest.createdAt));
</script>

{#if friendRequest.from}
    <div class="notification" class:read={notification.read}>
        {#if friendRequest.status === 'pending'}
        New friend request from @{friendRequest.from.username}
        <form action="/testing?/respondToFriendRequest" method="POST" use:enhance>
            <input
                type="hidden"
                name="friend-request-id"
                value={friendRequest.id}
            />
            <button type="submit" name="response" value="accepted">Accept</button>
            <button type="submit" name="response" value="rejected">Reject</button>
        </form>
        {:else if friendRequest.status === 'accepted'}
        Friend request from @{friendRequest.from.username}
        <button disabled>Accepted</button>
        {:else}
        Friend request from @{friendRequest.from.username}
        <button disabled>Rejected</button>
        {/if}
        {date}
    </div>
{:else}
    <div class="notification" class:read={notification.read}>
        New friend request from a deleted user {date}
    </div>
{/if}

<style>
    .notification {
        display: flex;
        gap: var(--space-sm);
    }

    .notification.read {
        color: var(--text-muted);
    }
</style>
