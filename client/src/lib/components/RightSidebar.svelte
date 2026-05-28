<script lang="ts">
	import Profile from './sidebar/Profile.svelte';
	import Boards from './sidebar/Boards.svelte';
	import Tags from './sidebar/Tags.svelte';

	import { USER_KEY } from '$lib/context';
	import { getContext } from 'svelte';
	import type { PublicUser } from '@lemuria/types';

	const getUser = getContext<() => PublicUser>(USER_KEY);
	let user = $derived(getUser());
</script>

<div class="section"><Profile /></div>

{#if user}
	<div class="section"><Boards /></div>
{/if}

<div class="section"><Tags /></div>
