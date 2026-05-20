<script lang="ts">
	import PlaceholderAvatar from '$lib/assets/placeholder-avatar.jpg';
</script>

<h1>Your Profile</h1>

<div id="your-profile">
	<img class="avatar" src={PlaceholderAvatar} alt="Avatar" />
	<p class="name">Case @zero</p>
	<div class="stats">
		<button class="stat unset">
			<span class="value mono">15</span>
			<span>Friends</span>
		</button>
		<a class="stat" href="/">
			<span class="value mono">37</span>
			<span>Posts</span>
		</a>
	</div>
</div>

<style>
	#your-profile {
		padding-top: var(--space-xs);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-xs);
		font-size: var(--text-sm);
	}
	.avatar {
		width: 4rem;
		height: 4rem;
		margin: 3px;
		box-shadow:
			0 0 0 2px var(--bg),
			0 0 0 3px var(--red-bright);
	}
	.name {
		color: var(--red-bright);
	}
	.stats {
		display: flex;
		gap: var(--space-md);
	}
	.stat {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.value {
		font-weight: bold;
	}
</style>
