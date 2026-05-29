<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	let { ...rest }: HTMLTextareaAttributes = $props();

	let textarea: HTMLTextAreaElement;

	const resize = () => {
		textarea.style.height = 'auto';
		const next = Math.min(textarea.scrollHeight, 200);
		textarea.style.height = next + 'px';
		textarea.style.overflowY = next === 200 ? 'auto' : 'hidden';
	};

	export const reset = () => {
		textarea.value = '';
		resize();
	};

	$effect(() => resize());
</script>

<textarea bind:this={textarea} oninput={resize} {...rest}></textarea>

<style>
	textarea {
		width: 100%;
		font-family: var(--monospace);
		font-size: inherit;
		color: var(--text-primary);
		background-color: var(--bg);
		border: none;
		border-bottom: 1px solid var(--border-subtle);
		transition: border-bottom-color 0.25s;
		resize: none;
		min-height: 2rem;
		max-height: 16rem;
		overflow-y: auto;

		&:focus {
			outline: none;
			border-bottom-color: var(--border-strong);
		}
	}
</style>
