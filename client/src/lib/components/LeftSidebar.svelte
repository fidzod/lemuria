<script lang="ts">
	import Nav from './sidebar/Nav.svelte';
	import Friends from './sidebar/Friends.svelte';
	import Profile from './sidebar/Profile.svelte';

	import { USER_KEY } from '$lib/context';
	import { getContext } from 'svelte';
	import type { PublicUser } from '@lemuria/types';

	const getUser = getContext<() => PublicUser>(USER_KEY);
	let user = $derived(getUser());
</script>

<div class="section"><Nav /></div>

{#if user}
	<div class="section right-sidebar"><Profile /></div>
	<div class="section"><Friends /></div>
{/if}

<style>
	.right-sidebar {
		display: none;
	}

	@media (max-width: 810px) {
		.right-sidebar {
			display: block;
		}
	}
</style>
