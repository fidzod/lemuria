<script lang="ts">
	import PlaceholderAvatar from '$lib/assets/default_avatar.jpeg';
	import { Pencil as Edit } from '@lucide/svelte/icons';
	import MockupHeader from '$lib/assets/mockup-header.jpg';
	import EditModal from '$lib/components/profile/EditModal.svelte';
	// import Shelves from '$lib/components/Shelves.svelte';
	import { USER_KEY } from '$lib/context';
	import { getContext } from 'svelte';
	import type { PublicUser } from '@lemuria/types';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let user = $derived(data.profile.user);

	const getUser = getContext<() => PublicUser>(USER_KEY);
	let sessionUser = $derived(getUser());

	let editModalOpen = $state(false);
</script>

<EditModal
	open={editModalOpen}
	onClose={() => (editModalOpen = false)}
	profile={data.profile}
	{form}
/>

<div
	class="header"
	style="
        --image: url('{data.profile.bannerUrl || MockupHeader}');
        --user-accent: var(--{user.accentColor || 'red'}-bright);
    "
>
	<img src={user.avatarUrl || PlaceholderAvatar} alt="{user.displayName}'s Avatar" class="avatar" />
	<div class="card">
		<span class="name">{user.displayName} <span class="mono">@{user.username}</span></span>
	</div>
	<div class="card">
		{#if sessionUser && sessionUser.id === user.id}
			<button class="edit-profile" onclick={() => (editModalOpen = true)}><Edit /></button>
		{/if}
	</div>
</div>

<div class="details">
	<p class="bio">{data.profile.bio}</p>
</div>

<!--<Shelves />-->

<h1>Posts</h1>

<style>
	.header {
		width: 100%;
		height: 8rem;
		position: relative;
		margin: 3px;
		margin-bottom: 2rem;
		box-shadow:
			0 0 0 2px var(--bg),
			0 0 0 3px var(--user-accent);
		background: var(--image);
		background-size: cover;
		background-position: center;
		font-size: var(--text-sm);
	}
	.avatar {
		width: 5rem;
		height: 5rem;
		position: absolute;
		bottom: -1.5rem;
		left: var(--space-lg);
		margin: 3px;
		box-shadow:
			0 0 0 2px var(--bg),
			0 0 0 3px var(--user-accent);
	}
	.card {
		width: fit-content;
		padding: var(--space-xs) var(--space-sm);
		position: absolute;
		bottom: var(--space-sm);
		background-color: var(--bg);
	}
	.card:has(.name) {
		left: calc(var(--space-lg) * 2 + 5rem);
	}
	.card:has(.edit-profile) {
		right: var(--space-sm);
	}
	.details {
		font-size: var(--text-sm);
		margin-bottom: 2rem; /* TODO: this should be a var */
	}
	h1 {
		margin-top: 2rem;
	}
</style>
