<script lang="ts">
	import {
		House as Home,
		Bell as Notifications,
		CircleUserRound as Profile,
		Search,
		FolderTree as Boards
	} from '@lucide/svelte/icons';
	import { UNREAD_NOTIFICATIONS_COUNT_KEY, USER_KEY } from '$lib/context';
	import { getContext } from 'svelte';
	import type { PublicUser } from '@lemuria/types';

	const getUnreadNotificationsCount = getContext<() => number>(UNREAD_NOTIFICATIONS_COUNT_KEY);
	let unreadNotifications = $derived(getUnreadNotificationsCount());

	const getUser = getContext<() => PublicUser>(USER_KEY);
	let user = $derived(getUser());
</script>

<div class="blob"></div>

<nav>
	<ul>
		<li><a href="/"><Home /></a></li>
		<li class:unread={unreadNotifications > 0}><a href="/notifications"><Notifications /></a></li>
		<li><a href="/{user ? '@' + user.username : 'login'}"><Profile /></a></li>
		<li><a href="/search"><Search /></a></li>
		<li><a href="/boards"><Boards /></a></li>
	</ul>
</nav>

<style>
	nav {
		width: 300px;
		height: var(--mb-nav-height);
		padding-top: 0.1rem;
		margin: 0 auto;
		border-radius: 20px;
		background-color: rgb(from var(--bg) r g b / 0.5);
		border: 1px solid var(--text-muted);
		backdrop-filter: blur(10px);
		box-shadow:
			0 0 20px 2px var(--border-subtle),
			0 0 5px 2px var(--border-subtle) inset;
		opacity: 0.9;
		z-index: 100;

		&:after {
			content: '';
			position: absolute;
			top: 25%;
			left: 2.5%;
			width: 95%;
			height: 5px;
			background-color: var(--text-primary);
			filter: blur(5px);
			opacity: 0.5;
		}

		:global(.lucide) {
			font-size: 1.5rem;
			color: var(--text-primary);
		}
	}

	li {
		position: relative;
		display: block;
		width: fit-content;
		height: fit-content;
		border-radius: 10px;
	}

	a {
		padding: 0.1rem 0.5rem;
	}

	ul {
		height: 100%;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
	}

	.unread:before {
		content: '';
		width: 0.5rem;
		height: 0.5rem;
		position: absolute;
		right: 0;
		border-radius: 50%;
		background-color: var(--red-bright);
	}
</style>
