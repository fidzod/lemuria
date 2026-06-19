<script lang="ts">
	import { onMount } from 'svelte';

	import { XIcon } from '@lucide/svelte/icons';

	let { file, onRemove } = $props();

	let preview = $state(' ');
	const reader = new FileReader();
	reader.onload = (e) => {
		preview = (e.target?.result as string) || '';
	};

	onMount(() => {
		reader.readAsDataURL(file);
	});
</script>

{#if preview}
	<button type="button" class="remove-btn unset" onclick={onRemove}>
		<div class="close"><XIcon size={15} /></div>
		<div class="img" style={`background-image: url('${preview}');`}></div>
	</button>
{/if}

<style>
	.img {
		width: 2rem;
		height: 2rem;
		background-size: cover;
		margin: 3px;
		box-shadow:
			0 0 0 2px var(--bg),
			0 0 0 3px var(--border-subtle);
	}
	button {
		padding: 0;
		background: none;
		border: none;
		position: relative;
	}
	button:hover {
		transform-origin: center;
		.close {
			display: flex;
		}
	}
	button .close {
		color: var(--text-primary);
		background-color: var(--border-subtle);
		border-radius: 50%;
		padding: 1px;
		position: absolute;
		top: -6px;
		right: -6px;
		justify-content: center;
		align-items: center;
		display: none;
	}
</style>
