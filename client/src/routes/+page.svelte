<script lang="ts">
    import type { PageData } from "./$types";

	// import Post from '$lib/components/Post.svelte';

    let { data }: { data: PageData } = $props();
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
    <!--
	{#each posts as post}
		<Post {post} />
	{/each}
    -->
</div>

<style>
	.feed {
		padding-top: var(--space-xs);
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
	}
</style>
