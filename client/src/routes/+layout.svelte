<script lang="ts">
	import { api } from '$lib/api';
	import type { LayoutData } from './$types';
	import { setContext, type Snippet, onMount } from 'svelte';

	import '@fontsource/jetbrains-mono/400.css';
	import '@fontsource/jetbrains-mono/700.css';
	import '@fontsource/open-sans/400.css';
	import '../app.css';

	import PageHead from '$lib/components/PageHead.svelte';
	import Toaster from '$lib/components/Toaster.svelte';
	import LeftSidebar from '$lib/components/LeftSidebar.svelte';
	import RightSidebar from '$lib/components/RightSidebar.svelte';
	import {
		SIDEBAR_FRIENDS_KEY,
		UNREAD_NOTIFICATIONS_COUNT_KEY,
		USER_KEY,
		PROFILE_KEY
	} from '$lib/context';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	setContext(USER_KEY, () => data.user);
	setContext(UNREAD_NOTIFICATIONS_COUNT_KEY, () => data.unreadNotificationsCount);
	setContext(SIDEBAR_FRIENDS_KEY, () => data.sidebarFriends);
	setContext(PROFILE_KEY, () => data.profile);

	onMount(() => {
		api.auth.heartbeat(fetch);
		const id = setInterval(() => {
			api.auth.heartbeat(fetch);
		}, 45_000);
		return () => clearInterval(id);
	});
</script>

<svelte:head>
	<title>lemuria</title>
</svelte:head>

<Toaster />

<div id="layout">
	<PageHead stats={data.stats} />

	<div class="columns">
		<aside class="left"><LeftSidebar /></aside>
		<main>{@render children()}</main>
		<aside class="right"><RightSidebar /></aside>
	</div>
</div>

<style>
	#layout {
		max-width: calc(2 * var(--sidebar-width) + 2 * var(--space-md) + var(--page-max-width));
		width: fit-content;
		margin: var(--space-md) auto;

		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}
	.columns {
		width: fit-content;
		margin-inline: auto;
		display: flex;
		gap: var(--space-md);
	}
	aside {
		width: var(--sidebar-width);
	}
	main {
		width: var(--page-max-width);
		flex: 1;
	}

	@media (max-width: 740px) {
		aside.right {
			display: none;
		}
	}

	@media (max-width: 580px) {
		aside.left {
			display: none;
		}
	}
</style>
