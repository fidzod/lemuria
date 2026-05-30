<script lang="ts">
	import PlaceholderAvatar from '$lib/assets/default_avatar.jpeg';
	import { Pencil as Edit } from '@lucide/svelte/icons';
	import MockupHeader from '$lib/assets/mockup-header.jpg';
	import EditModal from '$lib/components/profile/EditModal.svelte';
	import Post from '$lib/components/Post.svelte';
	import FriendButton from '$lib/components/profile/FriendButton.svelte';
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

{#if sessionUser.id === user.id}
	<h1>Your Profile</h1>
{:else}
	<h1>{user.displayName}'s Profile</h1>
{/if}

<div
	class="header"
	style="
        --image: url('{data.profile.bannerUrl || MockupHeader}');
        --user-accent-bright: var(--{user.accentColor}-bright);
        --user-accent-dark: var(--{user.accentColor}-dark);
    "
>
	<img src={user.avatarUrl || PlaceholderAvatar} alt="{user.displayName}'s Avatar" class="avatar" />
	<div class="card">
		<span class="name text-gradient"
			>{user.displayName} <span class="mono">@{user.username}</span></span
		>
	</div>
	<div class="card right">
		{#if sessionUser && sessionUser.id === user.id}
			<button class="edit-profile" onclick={() => (editModalOpen = true)}><Edit /></button>
		{:else}
			<FriendButton relationship={data.profile.relationship} userId={user.id} />
		{/if}
	</div>
</div>

<div class="details">
	<p class="bio">{data.profile.bio}</p>
</div>

<!--<Shelves />-->

<section>
	<h1>Posts</h1>
	{#each data.posts as post}
		<Post {post} />
	{/each}
</section>

<style>
	.header {
		width: 100%;
		height: 8rem;
		position: relative;
		margin: 3px;
		margin-bottom: var(--space-xl);
		box-shadow:
			0 0 0 2px var(--bg),
			0 0 0 3px var(--user-accent-bright);
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
		left: var(--space-md);
		margin: 3px;
		box-shadow:
			0 0 0 2px var(--bg),
			0 0 0 3px var(--user-accent-bright);
	}
	.card {
		width: fit-content;
		padding: var(--space-xs) var(--space-sm);
		position: absolute;
		bottom: var(--space-sm);
		background-color: var(--bg);
	}
	.card:has(.name) {
		left: calc(var(--space-md) * 2 + 5rem);
	}
	.card.right {
		right: var(--space-sm);
	}
	.details {
		font-size: var(--text-sm);
	}
	section {
		margin-top: var(--space-xl);
	}
</style>
