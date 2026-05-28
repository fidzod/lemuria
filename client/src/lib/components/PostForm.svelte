<script lang="ts">
	import { Image as AddImages } from '@lucide/svelte/icons';
	import { enhance } from '$app/forms';
	import type { ActionData } from '../../routes/$types';

	let { form }: { form: ActionData } = $props();

	let textarea: HTMLTextAreaElement;

	const handleInput = () => {
		textarea.style.height = 'auto';
		textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
	};
</script>

<form method="POST" action="?/post" use:enhance>
	{#if form?.error}
		<p role="alert">{form.error}, please try again.</p>
	{/if}
	<textarea
		name="text-content"
		placeholder="Share something..."
		bind:this={textarea}
		oninput={handleInput}
	></textarea>
	<div class="row">
		<button onclick={(e) => e.preventDefault()}><AddImages /></button>
		<button type="submit">Post</button>
	</div>
</form>

<style>
	form {
		width: 100%;
		padding: var(--space-lg);

		display: flex;
		flex-direction: column;
		gap: var(--space-lg);

		border: 1px solid var(--border-subtle);
	}

	.row {
		display: flex;
		align-items: center;
		width: 100%;
	}

	button[type='submit'] {
		margin-left: auto;
	}

	textarea {
		width: 100%;
	}
</style>
