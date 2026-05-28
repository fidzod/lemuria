<script lang="ts">
	import PlaceholderAvatar from '$lib/assets/placeholder-avatar.jpg';
	import MockupHeader from '$lib/assets/mockup-header.jpg';
	import Shelves from '$lib/components/Shelves.svelte';
	let { data } = $props();
</script>

<div class="header" style="--image: url('{MockupHeader}')">
	<div class="cards">
		<div class="card user">
			<img src={PlaceholderAvatar} alt="{data.profile.user.username}'s Avatar" class="avatar" />
			<div class="name">
				<span class="display">Display Name</span>
				<span class="username mono">@{data.profile.user.username}</span>
			</div>
		</div>
		<div class="card stats">
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
</div>

<div class="details">
	<p class="bio">
		The story goes like this: Earth is captured by a technocapital singularity as renaissance
		rationalitization and oceanic navigation lock into commoditization take-off. Logistically
		accelerating techno-economic interactivity crumbles social order in auto-sophisticating machine
		runaway.
	</p>
</div>

<Shelves />

<h1>Posts</h1>

<style>
	.header {
		width: 100%;
		height: 8rem;
		position: relative;
		margin: 3px;
		margin-bottom: var(--space-xl);
		box-shadow:
			0 0 0 2px var(--bg),
			0 0 0 3px var(--red-bright);
		background: var(--image);
		background-size: cover;
		background-position: center;
		font-size: var(--text-sm);
	}
    .cards {
		position: absolute;
		left: var(--space-sm);
		bottom: var(--space-sm);

		display: flex;
		align-items: center;
		gap: var(--space-xs);
    }
	.card {
		padding: var(--space-sm) var(--space-lg);

		display: flex;
		align-items: center;
		gap: var(--space-xl);

		background-color: var(--bg);
		border: 1px solid var(--red-bright);
	}
    .user {
        padding-left: var(--space-sm);
        gap: var(--space-lg);
    }
	.avatar {
		flex: 0;
		width: 2rem;
		margin: 3px;
		box-shadow:
			0 0 0 2px var(--bg),
			0 0 0 3px var(--red-bright);
	}
    .name {
        display: flex;
        flex-direction: column;
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
	.details {
		font-size: var(--text-sm);
		margin-bottom: 2rem; /* TODO: this should be a var */
	}
    h1 {
        margin-top: 2rem;
    }
</style>
