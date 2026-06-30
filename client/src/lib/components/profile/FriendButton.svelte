<script lang="ts">
	import { enhance } from '$app/forms';
	import { addToast } from '$lib/stores/toast.svelte.js';
	import type { Relationship } from '@lemuria/types';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import {
		Users as Friends,
		X as RemoveFriend,
		Mail as Requested,
		Check as Accept,
		X as Reject,
		UserRoundPlus as Request
	} from '@lucide/svelte/icons';

	let { relationship, userId }: { relationship: Relationship; userId: number } = $props();
</script>

{#if relationship.status === 'friends'}
	<form
		method="POST"
		action="?/removeFriend"
		use:enhance={() => {
			return async ({ update, result }) => {
				if (result.type === 'failure') {
					const error = result.data?.error;
					addToast(typeof error === 'string' ? error : 'Something went wrong', 'error');
				}
				update();
			};
		}}
	>
		<input type="hidden" name="friendship-id" value={relationship.friendshipId} />
		<Tooltip message="Remove Friend">
			<button type="submit" class="friends">
				<div>
					<Friends />
				</div>
				<div class="hovered">
					<RemoveFriend />
				</div>
			</button>
		</Tooltip>
	</form>
{:else if relationship.status === 'request_sent'}
	<Tooltip message="Requested">
		<button disabled><Requested /></button>
	</Tooltip>
{:else if relationship.status === 'request_received'}
	<form
		action="?/respondToFriendRequest"
		method="POST"
		use:enhance={() => {
			return async ({ update, result }) => {
				if (result.type === 'failure') {
					const error = result.data?.error;
					addToast(typeof error === 'string' ? error : 'Something went wrong', 'error');
				}
				update();
			};
		}}
	>
		<input type="hidden" name="friend-request-id" value={relationship.friendRequestId} />
		<div class="response">
			<Tooltip message="Accept Friend Request">
				<button type="submit" name="response" value="accepted"><Accept /></button>
			</Tooltip>
			<Tooltip message="Reject Friend Request">
				<button type="submit" name="response" value="rejected"><Reject /></button>
			</Tooltip>
		</div>
	</form>
{:else if relationship.status === null}
	<form
		action="?/createFriendRequest"
		method="POST"
		use:enhance={() => {
			return async ({ update, result }) => {
				if (result.type === 'failure') {
					const error = result.data?.error;
					addToast(typeof error === 'string' ? error : 'Something went wrong', 'error');
				}
				update();
			};
		}}
	>
		<input type="hidden" name="to-user-id" value={userId} />
		<Tooltip message="Send a Friend Request">
			<button type="submit"><Request /></button>
		</Tooltip>
	</form>
{/if}

<style>
	button.friends {
		.hovered {
			display: none;
		}
	}
	button.friends:hover {
		.hovered {
			display: inline;
		}
		*:not(.hovered) {
			display: none;
		}
	}
	.response {
		display: flex;
		gap: var(--space-xs);
	}
	button {
		margin: 0;
	}
</style>
