<script lang="ts">
	import type { Snippet } from 'svelte';

	let { message, children }: { message: string; children: Snippet } = $props();
</script>

<div class="tooltip-wrapper">
	<div class="children">
		{@render children()}
	</div>
	<div class="tooltip">
		<span>{message}</span>
	</div>
</div>

<style>
	.tooltip-wrapper {
		position: relative;
	}
	.tooltip {
		display: none;
		width: max-content;
		position: absolute;
		top: calc(100% + 1.1rem);
		left: 50%;
		transform: translateX(-50%);
		padding: var(--space-sm) var(--space-md);
		background-color: var(--bg);
		border-radius: 18px;
		border: 1px solid var(--border-subtle);

		/* Triangle */
		&:before {
			content: '';
			position: absolute;
			top: -10px;
			left: 50%;
			transform: translateX(-50%);
			border-left: 8px solid transparent;
			border-right: 8px solid transparent;
			border-bottom: 10px solid var(--border-subtle);
		}

		&:after {
			content: '';
			position: absolute;
			top: -9px;
			left: 50%;
			transform: translateX(-50%);
			border-left: 7px solid transparent;
			border-right: 7px solid transparent;
			border-bottom: 9px solid var(--bg);
		}
	}
	.children:hover + .tooltip {
		display: block;
	}
</style>
