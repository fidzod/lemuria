<script lang="ts">
	import Post from '$lib/components/Post.svelte';
	import { posts } from '$lib/placeholderData.ts';
</script>

<h1>Recent Posts</h1>

<div class="feed">
	{#each posts as post}
		<Post {post} />
	{/each}
</div>

<style>
	.feed {
		padding-top: var(--space-xs);
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
	}
</style>
