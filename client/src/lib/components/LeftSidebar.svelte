<script lang="ts">
	import Nav from './sidebar/Nav.svelte';
	import Friends from './sidebar/Friends.svelte';
	import Sponsors from './sidebar/Sponsors.svelte';
	import Profile from './sidebar/Profile.svelte';
	import Boards from './sidebar/Boards.svelte';
	import Tags from './sidebar/Tags.svelte';

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
	<div class="section right-sidebar"><Boards /></div>
{/if}

<div class="section right-sidebar"><Tags /></div>
<div class="section"><Sponsors /></div>

<style>
	.right-sidebar {
		display: none;
	}

	@media (max-width: 740px) {
		.right-sidebar {
			display: block;
		}
	}
</style>
