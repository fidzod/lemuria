<script lang="ts">
	import Textarea from './Textarea.svelte';
	import { Image as AddImages } from '@lucide/svelte/icons';
	import ImagePreview from '../ImagePreview.svelte';
	import { addToast } from '$lib/stores/toast.svelte';
	import { api } from '$lib/api';
	import { invalidateAll } from '$app/navigation';

	let {
		message = null,
		parentId = null
	}: {
		message: string | null;
		parentId: number | null;
	} = $props();

	let textareaComponent: ReturnType<typeof Textarea>;
	let mediaInput: HTMLInputElement;

	let postFiles = $state<File[]>([]);

	const onFileChange = (e: Event) => {
		const input = e.target as HTMLInputElement;
		if (!input.files) return;
		const existing = new Set(postFiles.map((f) => f.name + f.size));
		postFiles = [
			...postFiles,
			...Array.from(input.files).filter((f) => !existing.has(f.name + f.size))
		];
		input.value = '';
	};

	const removeFile = (index: number) => {
		postFiles = postFiles.filter((_, i) => i !== index);
	};

	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		const textContent = textareaComponent.getValue();
		const result =
			parentId === null
				? await api.posts.createPost(fetch, textContent, postFiles)
				: await api.comments.create(fetch, parentId, textContent, postFiles);

		if (!result.success) {
			addToast(result.error ?? 'Something went wrong', 'error');
			return;
		}
		textareaComponent.reset();
		postFiles = [];
		invalidateAll();
	};
</script>

<form onsubmit={handleSubmit}>
	<Textarea
		name="text-content"
		placeholder={message || 'Share something...'}
		bind:this={textareaComponent}
	/>
	{#if postFiles.length}
		<div class="row image-preview">
			{#each postFiles as file, index (file.name + index)}
				<ImagePreview {file} onRemove={() => removeFile(index)} />
			{/each}
		</div>
	{/if}
	<input
		type="file"
		name="media"
		accept="image/*"
		multiple
		class="hidden"
		bind:this={mediaInput}
		onchange={onFileChange}
	/>
	<div class="row">
		<button
			onclick={(e) => {
				e.preventDefault();
				mediaInput.click();
			}}><AddImages /></button
		>
		<button type="submit">Post</button>
	</div>
</form>

<style>
	form {
		width: 100%;
		margin-block-start: var(--space-lg);

		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}
	.row {
		display: flex;
		align-items: center;
		width: 100%;
	}
	.image-preview {
		gap: var(--space-sm);
		flex-wrap: wrap;
	}
	button[type='submit'] {
		margin-block-start: 0;
		margin-inline-start: auto;
	}
	.hidden {
		position: absolute;
	}
</style>
