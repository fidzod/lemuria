<script lang="ts">
	import PlaceholderAvatar from '$lib/assets/placeholder-avatar.jpg';
    
	import { USER_KEY } from '$lib/context';
	import { getContext } from 'svelte';
    import type { PublicUser } from '@lemuria/types';

    const getUser = getContext<() => PublicUser>(USER_KEY);
    let user = $derived(getUser());
</script>

<h1>Your Profile</h1>

{#if user}
<div id="your-profile">
	<img class="avatar" src={PlaceholderAvatar} alt="Avatar" />
    <div class="name">
        <p class="name">Display Name</p>
        <p class="name">@{user.username}</p>
    </div>
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
    <div class="logout">
		<form method="POST" action="/login?/logout">
			<button type="submit">Log Out</button>
		</form>
    </div>
</div>
{:else}
	<a href="/login" class="btn">Log In</a>
{/if}

<style>
	#your-profile {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
		align-items: center;
        text-align: center;
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
