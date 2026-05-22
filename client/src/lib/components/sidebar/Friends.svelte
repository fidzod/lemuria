<script lang="ts">
	import { SIDEBAR_FRIENDS_KEY } from "$lib/context";
	import type { PublicUser } from "@lemuria/types";
	import { getContext } from "svelte";

    const getFriends = getContext<() => PublicUser[] | undefined>(SIDEBAR_FRIENDS_KEY);
    let friends = $derived(getFriends());
</script>

{#if friends}
<h1>Friends</h1>

<ul>
	{#each friends as friend}
		<li>
			<a href="/">@{friend.username}</a>
		</li>
	{/each}
	<li>
		<a href="/">See all...</a>
	</li>
</ul>
{/if}

<style>
	.offline a {
		color: var(--text-muted);

		&:hover {
			color: var(--text-primary);
		}
	}
</style>
