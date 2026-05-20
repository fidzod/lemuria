<script lang="ts">
	import BoardLink from '../BoardLink.svelte';
	import { boards } from '$lib/placeholderData.ts';
</script>

<h1>Your Boards</h1>

<div class="boards cluster">
	{#each boards as board}
		<BoardLink {board} />
	{/each}
</div>

<style>
	.boards {
		font-size: var(--text-sm);
	}
</style>
