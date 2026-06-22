<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	import Post from '$lib/components/Post.svelte';
	import Comment from '$lib/components/Comment.svelte';
	import PostForm from '$lib/components/forms/PostForm.svelte';

	let { data }: { data: PageData } = $props();

	onMount(() => {
		const hash = window.location.hash;
		if (!hash) return;
		const id = hash.slice(1);
		const el = document.getElementById(`comment-${id}`);
		if (!el) return;
		el.classList.add('highlighted');
		el.scrollIntoView({ behavior: 'smooth', block: 'center' });
		setTimeout(() => el.classList.remove('highlighted'), 2000);
	});
</script>

<div class="post">
	<Post post={data.post} />
</div>

<h1>Comments</h1>

<div class="post-form">
	<PostForm message="Reply to this post..." parentId={data.post.id} />
</div>

<div class="feed">
	{#each data.comments as comment}
		<Comment {comment} />
	{/each}
</div>

<style>
	.post {
		margin-block-end: var(--space-xl);
	}
	.post-form {
		margin-block-end: var(--space-lg);
	}
	.feed {
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
	}
</style>
