<script lang="ts">
	import type { Stats } from '@lemuria/types';

	let { stats }: { stats: Stats | null } = $props();
</script>

<div id="page-head">
	<div class="stats">
		{#if stats}
			<p>
				<span class="mono primary"> {stats.onlineUsers}</span>
				user{stats.onlineUsers !== 1 ? 's' : ''} online
			</p>
			<p><span class="mono primary">{stats.totalPosts}</span> posts</p>
			<p><span class="mono primary">{stats.uploadsSize}</span> uploaded</p>
		{/if}
	</div>
	<div class="branding">
		<p class="primary">lemuria.so</p>
		<p>The sky above the port was the color of television,</p>
		<p>tuned to a dead channel.</p>
	</div>
</div>

<style>
	#page-head {
		width: 100%;
		display: flex;
	}
	.stats,
	.branding {
		display: flex;
		flex-direction: column;
	}
	.branding {
		margin-left: auto;
		text-align: right;
	}

	@media (max-width: 580px) {
		.stats {
			display: none;
		}
	}
</style>
