<script lang="ts">
	import { Pencil as Edit } from '@lucide/svelte/icons';
	import PlaceholderBanner from '$lib/assets/mockup-header.jpg';
	import PlaceholderAvatar from '$lib/assets/default_avatar.jpeg';

	let {
		url,
		variant,
		onFileSelected
	}: {
		url: string | null;
		variant: 'avatar' | 'banner';
		onFileSelected: (files: File | undefined) => void;
	} = $props();

	let fileInput: HTMLInputElement;
	let preview = $state<string | null>(null);

	$effect(() => {
		return () => {
			if (preview) URL.revokeObjectURL(preview);
		};
	});
</script>

<div class="wrapper">
	<input
		type="file"
		class="hidden"
		bind:this={fileInput}
		onchange={(e: Event) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			onFileSelected(file);
			if (!file) return;
			preview = URL.createObjectURL(file);
		}}
	/>
	<button class="overlay unset" onclick={() => fileInput.click()}>
		<Edit />
		<span>Edit</span>
	</button>
	{#if variant === 'avatar'}
		<img src={preview ?? (url || PlaceholderAvatar)} alt="Your Avatar" class="avatar media" />
	{:else}
		<div class="banner media" style="--image: url('{preview ?? (url || PlaceholderBanner)}')"></div>
	{/if}
</div>

<style>
	.wrapper {
		position: relative;

		&:hover .overlay {
			display: flex;
		}
	}
	.avatar {
		width: 5rem;
		height: 5rem;
		margin: 3px;
		box-shadow:
			0 0 0 2px var(--bg),
			0 0 0 3px var(--user-accent);
	}
	.overlay {
		position: absolute;
		inset: 3px 3px 5px 3px;
		display: none;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: var(--bg-alpha);

		&:active {
			transform: none;
		}
	}
	.banner {
		width: 5rem;
		height: 2.5rem;
		background-image: var(--image);
		background-size: cover;
		background-position: center;

		margin: 3px;
		box-shadow:
			0 0 0 2px var(--bg),
			0 0 0 3px var(--user-accent);
	}
</style>
