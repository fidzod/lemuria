<script lang="ts">
	import Textarea from './Textarea.svelte';
	import { Image as AddImages } from '@lucide/svelte/icons';
	import { enhance } from '$app/forms';
	import type { ActionData } from '../../../routes/$types';

	let { form }: { form: ActionData } = $props();

	let textareaComponent: ReturnType<typeof Textarea>;
</script>

<form
	method="POST"
	action="?/post"
	use:enhance={() => {
		return ({ update }) => {
			update();
			textareaComponent.reset();
		};
	}}
>
	{#if form?.error}
		<p role="alert">{form.error}, please try again.</p>
	{/if}
	<Textarea name="text-content" placeholder="Share something..." bind:this={textareaComponent} />
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
		margin-block-start: 0;
		margin-inline-start: auto;
	}
</style>
