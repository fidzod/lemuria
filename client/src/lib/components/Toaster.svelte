<script lang="ts">
	import { getToasts } from '$lib/stores/toast.svelte';
	import { CircleAlert as Error, CircleCheck as Success } from '@lucide/svelte/icons';
</script>

<div class="toasts">
	{#each getToasts() as toast}
		<p role="alert" class:error={toast.type === 'error'}>
			{#if toast.type === 'success'}
				<Success />
			{:else}
				<Error />
			{/if}
			{toast.message}
		</p>
	{/each}
</div>

<style>
	.toasts {
		position: fixed;
		top: var(--space-md);
		right: var(--space-md);
		display: flex;
		flex-direction: column;
		align-items: end;
		gap: var(--space-xs);
		z-index: 100;
	}
	p {
		background-color: var(--bg);
		color: var(--gre-bright);

		display: flex;
		align-items: center;
		gap: var(--space-xs);

		&.error {
			color: var(--red-bright);
		}
	}
</style>
