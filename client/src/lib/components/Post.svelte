<script lang="ts">
	import PlaceholderAvatar from '$lib/assets/default_avatar.jpeg';
	import {
		ArrowBigUp as Like,
		Repeat2 as Repost,
		MessagesSquare as Replies,
		Save,
		Share
	} from '@lucide/svelte/icons';
	import { timeAgo } from '$lib/timeago';
	import type { Post } from '@lemuria/types';
	import Gallery from './Gallery.svelte';
	import { api } from '$lib/api';
	let { post }: { post: Post } = $props();

  // svelte-ignore state_referenced_locally
  let likedByMe = $state(post.likedByMe);
  // svelte-ignore state_referenced_locally
  let likeCount = $state(post.likeCount)

  const handleLike = async () => {
    const wasLiked = likedByMe;
    likedByMe = !likedByMe;
    likeCount += wasLiked ? -1 : 1;

    const res = wasLiked
      ? await api.posts.unlike(fetch, post.id)
      : await api.posts.like(fetch, post.id);

    if (!res.success) {
      likedByMe = wasLiked;
      likeCount += wasLiked ? 1 : -1;
    }
  }
</script>

<div
	class="post"
	style="
        --user-accent-dark: var(--{post.author.accentColor || 'red'}-dark);
        --user-accent-bright: var(--{post.author.accentColor || 'red'}-bright);
    "
>
	<div class="head">
    <a href="/@{post.author.username}" class="avatar">
      <img
        src={post.author.avatarUrl || PlaceholderAvatar}
        alt="{post.author.username}'s Avatar"
      />
    </a>
		<div class="details-and-stats">
			<div class="details text-gradient">
				<a href="/@{post.author.username}" class="name">
					{post.author.displayName}
				</a>
				<span class="date">{timeAgo(post.createdAt)}</span>
			</div>
			<a href="/@{post.author.username}" class="username text-gradient">
				@{post.author.username}
			</a>
		</div>
	</div>
	<div class="body">
		<div class="media">
			{#if post.media.length > 1}
				<Gallery images={post.media} />
			{:else if post.media.length == 1}
				<img src={post.media[0]} alt="Post Media" />
			{/if}
		</div>
		<div class="text-content prose">
			{post.textContent}
		</div>
	</div>
	<div class="footer">
		<button class="group like-btn" class:liked={likedByMe} onclick={handleLike}>
			<Like />
			<span class="mono">{likeCount}</span>
		</button>
		<div class="group">
			<button><Repost /></button>
			<span class="mono">{post.reshareCount}</span>
		</div>
		<a class="group" href="/p/{post.id}">
			<button><Replies /></button>
			<span class="mono">{post.replyCount}</span>
		</a>
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
    img {
      width: 2rem;
      height: 2rem;
    }
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
		font-size: 0.8rem;
	}
	.username {
		font-size: 0.8rem;
		font-family: var(--monospace);
    width: fit-content;
	}
	.footer {
		width: 100%;
		display: flex;
		gap: var(--space-lg);
	}
	.group {
		display: flex;
		align-items: flex-start;
		gap: var(--space-sm);

		button {
			margin-top: 1px;
		}
	}
  .like-btn.liked {
    color: var(--text-primary);
    :global(.lucide) {
      fill: var(--text-primary);
    }
    &:hover {
      :global(.lucide) {
        fill: none;
      }
      color: var(--text-secondary);
    }
  }
	.aside {
		margin-left: auto;
		gap: var(--space-lg);
	}
  .text-content {
    color: var(--text-primary);
  }
	.media img {
		width: 100%;
		border-radius: 10px;
	}
  a.group {
    cursor: pointer;
  }
</style>
