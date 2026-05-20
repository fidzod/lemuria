<script lang="ts">
	let stats = {
		users_online: 129,
		total_posts: 602,
		uploads_size: '1.2Mb'
	};
</script>

<div id="page-head">
	<div class="stats">
		<p><span class="mono primary">{stats.users_online}</span> users online</p>
		<p><span class="mono primary">{stats.total_posts}</span> posts</p>
		<p><span class="mono primary">{stats.uploads_size}</span> uploaded</p>
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
