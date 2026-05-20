<script lang="ts">
	import type { Post } from '$lib/types';
	let { post }: { post: Post } = $props();

	const accentMap: Record<string, { bright: string; dark: string }> = {
		red: { bright: 'var(--red-bright)', dark: 'var(--red-dark)' },
		yellow: { bright: 'var(--yel-bright)', dark: 'var(--yel-dark)' },
		green: { bright: 'var(--gre-bright)', dark: 'var(--gre-dark)' },
		cyan: { bright: 'var(--cya-bright)', dark: 'var(--cya-dark)' },
		magenta: { bright: 'var(--mag-bright)', dark: 'var(--mag-dark)' }
	};
</script>

<div
	class="post"
	style="
        --user-accent: {accentMap[post.color].bright};
        --user-accent-dark: {accentMap[post.color].dark}
    "
>
	<div class="head">
		<img class="avatar" src={post.avatar} alt="{post.displayName}'s avatar" />
		<div class="meta">
			<div class="details accent-text-gradient">
				<span>{post.displayName}</span>
				<span class="mono">@{post.username}</span>
				<span class="timestamp">{post.createdAt}</span>
			</div>
			<div class="stats accent-text-gradient">
				<span><span class="mono">{post.votes}</span> votes</span>
				<span><span class="mono">{post.reshares}</span> reshares</span>
				<span><span class="mono">{post.replies}</span> replies</span>
			</div>
		</div>
	</div>
	<div class="body">{post.body}</div>
	<div class="interactions">
		<span class="vote-button">
			<button aria-label="Upvote">+</button>
			/
			<button aria-label="Downvote">-</button>
		</span>
		<button aria-label="Reshare">r</button>
		<button aria-label="Comment">c</button>
		<div class="secondary-actions">
			<button aria-label="Save">sv</button>
			<button aria-label="Share">sh</button>
		</div>
	</div>
</div>

<style>
	.post {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}
	.head {
		display: flex;
		gap: var(--space-sm);
		align-items: center;
	}
	.avatar {
		flex-shrink: 0;
		width: 2rem;
		height: 2rem;
		margin: 4px 3px 3px;
		box-shadow:
			0 0 0 2px var(--bg),
			0 0 0 3px var(--user-accent);
	}
	.meta {
		width: 100%;
		display: flex;
		flex-direction: column;
	}
	.details {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
	}
	.timestamp {
		margin-left: auto;
	}
	.stats {
		display: flex;
		gap: var(--space-sm);
	}
	.body {
		color: var(--text-primary);
		margin-bottom: var(--space-xs);
	}
	.interactions {
		display: flex;
		gap: var(--space-sm);
		color: var(--text-muted);
	}
	.secondary-actions {
		margin-left: auto;
	}
	.accent-text-gradient {
		background: linear-gradient(145deg, var(--user-accent-dark), var(--user-accent));
		background-size: 50px 50px;
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}
</style>
