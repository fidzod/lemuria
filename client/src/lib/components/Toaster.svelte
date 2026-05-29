<script lang="ts">
	import { getToasts } from '$lib/stores/toast.svelte.ts';
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
		position: absolute;
		top: var(--space-lg);
		right: var(--space-lg);
		display: flex;
		flex-direction: column;
		align-items: end;
		gap: var(--space-sm);
	}
	p {
		background-color: var(--bg);
		color: var(--gre-bright);

		display: flex;
		align-items: center;
		gap: var(--space-sm);

		&.error {
			color: var(--red-bright);
		}
	}
</style>
