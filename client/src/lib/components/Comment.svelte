<script lang="ts">
	import { timeAgo } from '$lib/timeago';
	import type { Post } from '@lemuria/types';
	import Gallery from './Gallery.svelte';
	import { ArrowBigUp as Like, Repeat2 as Repost, Save, Share } from '@lucide/svelte/icons';
	import { api } from '$lib/api';

	let { comment }: { comment: Post } = $props();

	// svelte-ignore state_referenced_locally
	let likedByMe = $state(comment.likedByMe);
	// svelte-ignore state_referenced_locally
	let likeCount = $state(comment.likeCount);

	const handleLike = async () => {
		const wasLiked = likedByMe;
		likedByMe = !likedByMe;
		likeCount += wasLiked ? -1 : 1;

		const res = wasLiked
			? await api.posts.unlike(fetch, comment.id)
			: await api.posts.like(fetch, comment.id);

		if (!res.success) {
			likedByMe = wasLiked;
			likeCount += wasLiked ? 1 : -1;
		}
	};
</script>

<div
	class="comment"
	id="comment-{comment.id}"
	style="
  --user-accent-dark: var(--{comment.author.accentColor}-dark);
  --user-accent-bright: var(--{comment.author.accentColor}-bright);
"
>
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
		<button class="group like-btn" class:liked={likedByMe} onclick={handleLike}>
			<Like />
			<span class="mono">{likeCount}</span>
		</button>
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
		background: transparent;
		transition: background-color 1.5s ease;
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
	.username,
	.posted-at {
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
	.like-btn.liked {
		color: var(--text-primary);
		:global(.lucide) {
			fill: var(--text-primary);
		}
		&:hover {
			:global(.lucide) {
				fill: none;
			}
		}
	}
	:global(.comment.highlighted) {
		background-color: color-mix(in srgb, var(--bg) 70%, white);
	}
</style>
