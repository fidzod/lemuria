<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		open,
		onClose,
		style = '',
		children
	}: {
		open: boolean;
		onClose: () => void;
		style?: string;
		children: Snippet;
	} = $props();
</script>

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="backdrop" onclick={onClose}>
		<div class="modal" onclick={(e) => e.stopPropagation()} {style}>
			{@render children()}
		</div>
	</div>
{/if}

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		display: flex;
		padding-top: 30vh;
		justify-content: center;
		z-index: 1;
	}
	.modal {
		width: 50vw;
		max-width: 600px;
		height: fit-content;
		padding: var(--space-lg);
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
		text-align: center;
		align-items: center;
		background-color: var(--bg);
		border-radius: 8px;
		border: 1px solid var(--border-subtle);
	}
	@media (max-width: 580px) {
		.modal {
			width: 400px;
		}
	}
</style>
