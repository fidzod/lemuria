<script lang="ts">
	import PlaceholderAvatar from '$lib/assets/default_avatar.jpeg';
	import {
		ArrowBigUp as Upvote,
		ArrowBigDown as Downvote,
		Repeat2 as Repost,
		MessagesSquare as Replies,
		Save,
		Share
	} from '@lucide/svelte/icons';
	import { timeAgo } from '$lib/timeago';
	import type { Post } from '@lemuria/types';
	import Gallery from './Gallery.svelte';
	let { post }: { post: Post } = $props();
</script>

<div
	class="post"
	style="
        --user-accent-dark: var(--{post.author.accentColor || 'red'}-dark);
        --user-accent-bright: var(--{post.author.accentColor || 'red'}-bright);
    "
>
	<div class="head">
		<img
			src={post.author.avatarUrl || PlaceholderAvatar}
			alt="{post.author.username}'s Avatar"
			class="avatar"
		/>
		<div class="details-and-stats">
			<div class="details text-gradient">
				<a class="username" href="/@{post.author.username}"
					>{post.author.displayName} @{post.author.username}</a
				>
				<span class="date">{timeAgo(post.createdAt)}</span>
			</div>
			<div class="stats text-gradient">
				<span>Joined {timeAgo(post.author.createdAt)}</span>
			</div>
		</div>
	</div>
	<div class="body">
		<div class="media">
    {#if post.media.length > 1}
      <Gallery images={post.media} />
    {:else if post.media.length == 1}
      <img src={post.media[0]} alt="Post Media">
    {/if}
		</div>
		<div class="text-content">
			{post.textContent}
		</div>
	</div>
	<div class="footer">
		<div class="group">
			<button><Downvote /></button>
			<span class="mono">{post.likeCount}</span>
			<button><Upvote /></button>
		</div>
		<div class="group">
			<button><Repost /></button>
			<span class="mono">{post.reshareCount}</span>
		</div>
		<div class="group">
			<button><Replies /></button>
			<span class="mono">{post.replyCount}</span>
		</div>
		<div class="group aside">
			<button><Save /></button>
			<button><Share /></button>
		</div>
	</div>
</div>

<style>
	.post {
		width: 100%;
		overflow-wrap: break-word;
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}
	.head {
		width: 100%;
		display: flex;
		gap: var(--space-sm);
	}
	.avatar {
		width: 2rem;
		height: 2rem;
		margin: 3px;
		margin-top: 0.4rem;
		box-shadow:
			0 0 0 2px var(--bg),
			0 0 0 3px var(--user-accent-bright);
	}
	.details-and-stats {
		width: 100%;
		display: flex;
		flex-direction: column;
	}
	.details {
		width: 100%;
		display: flex;
	}
	.date {
		margin-left: auto;
	}
	.footer {
		width: 100%;
		display: flex;
		gap: var(--space-sm);
	}
	.group {
		display: flex;
		align-items: flex-start;
		gap: var(--space-xs);

		button {
			margin-top: 1px;
		}
	}
	.aside {
		margin-left: auto;
	}
  .media img {
    width: 100%;
    border-radius: 10px;
  }
</style>
