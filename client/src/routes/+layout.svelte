<script lang="ts">
	import type { LayoutData } from './$types';
	import type { Snippet } from 'svelte';

	import '@fontsource/jetbrains-mono/400.css';
	import '@fontsource/jetbrains-mono/700.css';
	import '@fontsource/open-sans/400.css';
	import '../app.css';

	import PageHead from '$lib/components/PageHead.svelte';
	import LeftSidebar from '$lib/components/LeftSidebar.svelte';
	import RightSidebar from '$lib/components/RightSidebar.svelte';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<svelte:head>
	<title>lemuria</title>
</svelte:head>

<div id="layout">
	<PageHead />

	<div class="columns">
		<aside class="left"><LeftSidebar /></aside>
		<main>{@render children()}</main>
		<aside class="right"><RightSidebar /></aside>
	</div>
</div>

<style>
	#layout {
		max-width: calc(2 * var(--sidebar-width) + 2 * var(--space-lg) + var(--page-max-width));
		width: fit-content;
		margin: var(--space-lg) auto;

		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
	}
	.columns {
		width: fit-content;
		margin-inline: auto;
		display: flex;
		gap: var(--space-lg);
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
