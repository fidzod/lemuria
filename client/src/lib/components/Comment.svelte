<script lang="ts">
	import { timeAgo } from '$lib/timeago';
	import type { Post } from '@lemuria/types';
	import Gallery from './Gallery.svelte';
	import {
		ArrowBigUp as Upvote,
		ArrowBigDown as Downvote,
		Repeat2 as Repost,
		Save,
		Share
	} from '@lucide/svelte/icons';

	let { comment }: { comment: Post } = $props();
</script>

<div class="comment" style="
  --user-accent-dark: var(--{comment.author.accentColor}-dark);
  --user-accent-bright: var(--{comment.author.accentColor}-bright);
">
	<a class="row details text-gradient" href="/@{comment.author.username}">
		<img
			src={comment.author.avatarUrl}
			alt="{comment.author.displayName}'s Avatar"
			class="avatar"
		/>
    <span class="display-name">{comment.author.displayName}</span>
    <span class="username">@{comment.author.username}</span>
    <span class="posted-at">{timeAgo(comment.createdAt)}</span>
	</a>
  <div class="row body">
    {#if comment.media.length > 1}
      <div class="media"><Gallery images={comment.media} /></div>
    {:else if comment.media.length == 1}
      <div class="media"><img src={comment.media[0]} alt="Post Media" /></div>
    {/if}
		<div class="text-content prose">
      {comment.textContent}
		</div>
  </div>
	<div class="row footer">
		<div class="group">
			<button><Downvote /></button>
			<span class="mono">{comment.likeCount}</span>
			<button><Upvote /></button>
		</div>
		<div class="group">
			<button><Repost /></button>
			<span class="mono">{comment.reshareCount}</span>
		</div>
		<div class="group aside">
			<button><Save /></button>
			<button><Share /></button>
		</div>
	</div>
</div>

<style>
  .comment {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }
  .row {
    display: flex;
    gap: var(--space-sm);
    align-items: center;
  }
  .avatar {
    width: 1rem;
    height: 1rem;
  }
  .username {
    font-family: var(--monospace);
  }
  .posted-at {
    margin-left: auto;
  }
  .username, .posted-at {
    font-size: 0.8rem;
  }
  .text-content {
    color: var(--text-primary);
  }
	.footer {
    margin-block-start: var(--space-xs);
		gap: var(--space-md);
	}
	.group {
		display: flex;
		align-items: flex-start;
		gap: var(--space-sm);

		button {
			margin-top: 1px;
		}
	}
	.aside {
		margin-left: auto;
		gap: var(--space-lg);
	}
  .body {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .media {
    width: 100%;
  }
  .media img {
    width: 100%;
    border-radius: 10px;
  }
</style>
