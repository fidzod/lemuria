<script lang="ts">
	import Post from '$lib/components/Post.svelte';
	import PostForm from '$lib/components/forms/PostForm.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<h1>Recent Posts</h1>

<div class="feed">
	{#if data.user}
		<PostForm />
	{/if}

	{#each data.posts as post}
		<Post {post} />
	{/each}
</div>

<style>
	.feed {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}
</style>
