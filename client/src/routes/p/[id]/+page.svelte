<script lang="ts">
  import Post from '$lib/components/Post.svelte';
  import Comment from '$lib/components/Comment.svelte';
  import PostForm from '$lib/components/forms/PostForm.svelte';
	import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
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
