<script lang="ts">
    import PlaceholderAvatar from '$lib/assets/placeholder-avatar.jpg';
	import { timeAgo } from '$lib/timeago';
	import type { Post } from '@lemuria/types';
	let { post }: { post: Post } = $props();
</script>

<div class="post">
    <div class="head">
        <img src={PlaceholderAvatar} alt="{post.author.username}'s Avatar" class="avatar">
        <div class="details-and-stats">
            <div class="details">
                <span class="username">@{post.author.username}</span>
                <span class="date">{timeAgo(post.createdAt)}</span>
            </div>
            <div class="stats">
                <span><span>{post.reshareCount}</span> reposts</span>
                <span><span>{post.replyCount}</span> replies</span>
            </div>
        </div>
    </div>
    <div class="body">{post.textContent}</div>
    <div class="footer">
        <div class="group likes">
            <button>-</button>
            <span>{ post.likeCount }</span>
            <button>+</button>
        </div>
        <div class="group main">
            <button>r</button>
            <button>c</button>
        </div>
        <div class="group aside">
            <button>sv</button>
            <button>sh</button>
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
        align-items: flex-end;
        gap: var(--space-xs);
    }
    .aside {
        margin-left: auto;
    }
</style>
