<script lang="ts">
	import Post from '$lib/components/Post.svelte';
	import PostForm from '$lib/components/PostForm.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<h1>Recent Posts</h1>

<div class="feed">
	{#if data.user}
		<p>Welcome, <strong>{data.user.username}</strong></p>
		<form method="POST" action="/login?/logout">
			<button type="submit">Log Out</button>
		</form>
	{:else}
		<a href="/login">[ Log In ]</a>
	{/if}

    <PostForm {form} />

	{#each data.posts as post}
        <Post {post} />
	{/each}
</div>

<style>
	.feed {
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
	}
</style>
