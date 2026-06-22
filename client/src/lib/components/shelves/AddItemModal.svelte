<script lang="ts">
	import {
		Check as SaveChanges,
		X as Discard,
		ChevronDown as DropdownIcon
	} from '@lucide/svelte/icons';
	import Modal from '../Modal.svelte';
	import Input from '../forms/Input.svelte';
	import type { ShelfItemType, SearchResult } from '@lemuria/types';
	import { api } from '$lib/api';
	import { invalidateAll } from '$app/navigation';

	let { open, onClose }: { open: boolean; onClose: () => void } = $props();

	let itemType = $state<ShelfItemType>('film');

	let noResults = $state(false);
	let results = $state<SearchResult[]>([]);
	let selected = $state<SearchResult | null>(null);

	let queryInput = $state('');

	let timer: ReturnType<typeof setTimeout> | undefined;
	const handleInput = () => {
		selected = null;
		if (timer) clearTimeout(timer);
		if (queryInput.length < 3) {
			results = [];
			return;
		}
		timer = setTimeout(async () => {
			noResults = false;
			const res = await api.shelves.search(fetch, itemType, queryInput);

			if (res.success && res.data && res.data.length > 0) {
				results = res.data;
				noResults = false;
			} else {
				results = [];
				noResults = true;
			}
		}, 300);
	};

	const handleSubmit = async () => {
		if (selected === null) return;
		await api.shelves.addItem(fetch, selected);
		invalidateAll();
		onClose();
	};
</script>

<Modal {open} {onClose}>
	<h1>Add an item to your shelves</h1>

	<form>
		<div class="form-row">
			<div class="select-wrapper">
				<DropdownIcon />
				<select name="item-type" bind:value={itemType}>
					<option value="film">Film</option>
					<option value="album">Album</option>
					<option value="book">Book</option>
				</select>
			</div>
			<Input
				name="query"
				label=""
				placeholder={itemType === 'film'
					? 'The End of Evangelion'
					: itemType === 'book'
						? 'Neuromancer'
						: '20 Jazz Funk Greats'}
				bind:value={queryInput}
				oninput={handleInput}
			/>
		</div>
	</form>
	<div class="results">
		{#if noResults}
			No results found.
		{/if}
		{#each results as result}
			<button
				class="result"
				class:selected={selected === result}
				onclick={() => (selected = result)}
			>
				{#if result.coverUrl.length > 0}
					<img
						src={result.coverUrl}
						alt="{result.title}
        {result.type === 'book' ? 'Cover Art' : result.type === 'film' ? 'Poster' : 'Album Art'}"
						onerror={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
					/>
				{:else}
					<div class="no-cover"></div>
				{/if}
				<span class="title">{result.title} <span class="subtitle">{result.subtitle}</span></span>
			</button>
		{/each}
	</div>
	{#if selected !== null}
		<div class="modal-buttons">
			<button onclick={handleSubmit}><SaveChanges />Save Changes</button>
			<button
				onclick={(e) => {
					e.preventDefault();
					onClose();
				}}><Discard />Discard Changes</button
			>
		</div>
	{/if}
</Modal>

<style>
	form {
		width: 100%;
	}
	.form-row {
		width: 100%;
	}
	.select-wrapper {
		position: relative;
		display: inline-block;
		width: 100px;
	}

	.select-wrapper select {
		appearance: none;
		-webkit-appearance: none;
		-moz-appearance: none;
		width: 100%;
		border: none;
		border-radius: 5px;
		background-color: black;
		color: var(--text-primary);
		cursor: pointer;
		font-family: inherit;
	}

	:global(.select-wrapper .lucide) {
		position: absolute;
		right: 10px;
		top: 50%;
		transform: translateY(-50%);
		pointer-events: none;
		color: var(--text-primary);
	}

	.results {
		width: 100%;
		max-height: 200px;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}
	.result {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		gap: var(--space-sm);
		text-align: left;

		img {
			width: 1.5rem;
		}
		.no-cover {
			width: 1.5rem;
			height: 2rem;
		}
		.subtitle {
			opacity: 0.8;
		}

		&.selected {
			background-color: color-mix(in srgb, var(--bg) 70%, white);
		}
	}
	.modal-buttons {
		display: flex;
		align-items: center;
		gap: var(--space-lg);
		margin-block-start: var(--space-lg);

		button {
			margin-block-start: 0;
			display: flex;
			align-items: center;
			gap: var(--space-sm);
		}
		button:first-child {
			color: var(--text-primary);
			&:hover {
				color: var(--text-secondary);
			}
		}
	}
</style>
