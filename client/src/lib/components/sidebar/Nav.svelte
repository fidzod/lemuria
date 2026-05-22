<script lang="ts">
	import { UNREAD_NOTIFICATIONS_COUNT_KEY } from '$lib/context';
	import { getContext } from 'svelte';

	const getUnreadNotificationsCount = getContext<() => number>(UNREAD_NOTIFICATIONS_COUNT_KEY);
</script>

<h1>Menu</h1>

<ul>
	<li id="active"><a href="/">Home</a></li>
	<li><a href="/notifications">Notifications ({getUnreadNotificationsCount()})</a></li>
	<li><a href="/">Search</a></li>
	<li><a href="/">Boards</a></li>
	<div class="separator"></div>
	<li><a href="/">Help</a></li>
	<li><a href="/">Contact Us</a></li>
	<li><a href="/">Donate or sponsor</a></li>
</ul>

<style>
	li#active a {
		color: var(--text-primary);
	}

	.separator {
		width: 100%;
		border-bottom: 1px solid var(--border-subtle);
		margin: var(--space-xs) 0;
	}
</style>
