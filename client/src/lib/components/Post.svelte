<script lang="ts">
	import PlaceholderAvatar from '$lib/assets/placeholder-avatar.jpg';
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
	let { post }: { post: Post } = $props();
</script>

<div class="post">
	<div class="head">
		<img src={PlaceholderAvatar} alt="{post.author.username}'s Avatar" class="avatar" />
		<div class="details-and-stats">
			<div class="details">
				<a class="username" href="/@{post.author.username}">{post.author.displayName} @{post.author.username}</a>
				<span class="date">{timeAgo(post.createdAt)}</span>
			</div>
			<div class="stats">
				<span><span class="mono">0</span> views</span>
				<span><span class="mono">{post.reshareCount}</span> reposts</span>
				<span><span class="mono">{post.replyCount}</span> replies</span>
			</div>
		</div>
	</div>
	<div class="body">{post.textContent}</div>
	<div class="footer">
		<div class="group">
			<button><Downvote /></button>
			<span class="mono">{post.likeCount}</span>
			<button><Upvote /></button>
		</div>
		<div class="group">
			<button><Repost /></button>
		</div>
		<div class="group">
			<button><Replies /></button>
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
		overflow-x: hidden;
		text-wrap: wrap;
		word-break: break-all;
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
			0 0 0 3px var(--red-bright);
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
</style>
