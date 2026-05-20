<script lang="ts">
	const friends = [
		{ username: 'zero', online: true },
		{ username: 'mirr0red', online: true },
		{ username: 'br34k', online: true },
		{ username: 'mael', online: false },
		{ username: 'revelations33', online: false }
	];
</script>

<h1>Friends</h1>

<ul>
	{#each friends as friend}
		<li class:offline={!friend.online}>
			<a href="/">@{friend.username}</a>
		</li>
	{/each}
	<li>
		<a href="/">See <span class="mono">10</span> more...</a>
	</li>
</ul>

<style>
	.offline a {
		color: var(--text-muted);

		&:hover {
			color: var(--text-primary);
		}
	}
</style>
