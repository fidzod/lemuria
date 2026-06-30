<script lang="ts">
	import { X as RemoveItem, Plus as Add } from '@lucide/svelte/icons';
	import AddItemModal from './AddItemModal.svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import type { ShelfItem } from '@lemuria/types';
	import { addToast } from '$lib/stores/toast.svelte';
	import { api } from '$lib/api';
	import { invalidateAll } from '$app/navigation';

	let { shelfItems, isOwner }: { shelfItems: ShelfItem[]; isOwner: boolean } = $props();

	const makeShelves = (items: ShelfItem[]): ShelfItem[][] => {
		const shelves: ShelfItem[][] = [];
		for (let i = 0; i < items.length; i += 4) shelves.push(items.slice(i, i + 4));
		return shelves;
	};

	let addItemModalOpen = $state(false);

	const handleRemove = async (itemId: number) => {
		const res = await api.shelves.remove(fetch, itemId);
		if (!res.success) {
			addToast('Failed to remove item', 'error');
			return;
		}
		await invalidateAll();
		addToast('Successfully removed item');
	};
</script>

{#snippet shelf(groupedItems: ShelfItem[])}
	<div class="shelf">
		<div class="items">
			{#each groupedItems as item}
				<div class="shelf-item">
					<Tooltip message={item.title} subtitle={item.subtitle}>
						<div
							class="cover"
							class:album={item.type === 'album'}
							style="--img-url: url({item.coverUrl})"
						>
							{#if isOwner}
								<button class="remove-item" onclick={() => handleRemove(item.id)}>
									<RemoveItem />
								</button>
							{/if}
						</div>
					</Tooltip>
				</div>
			{/each}
		</div>
		<div class="front"></div>
	</div>
{/snippet}

<h1>Shelves</h1>

{#if shelfItems.length === 0 && isOwner}
	Your shelves are empty
{:else if shelfItems.length === 0}
	This user's shelves are empty
{/if}

{#if isOwner}
	<AddItemModal open={addItemModalOpen} onClose={() => (addItemModalOpen = false)} />
	<button
		class="add-item-btn"
		onclick={() => {
			if (shelfItems.length < 12) {
				addItemModalOpen = true;
			} else {
				addToast('Your shelves are full. Remove an item.', 'error');
			}
		}}
	>
		<Add /> Add Item
	</button>
{/if}

{#if shelfItems.length > 0}
	<div class="shelves">
		{#each makeShelves(shelfItems) as groupedItems}
			{@render shelf(groupedItems)}
		{/each}
	</div>
{/if}

<style>
	button {
		display: flex;
		gap: var(--space-sm);
	}
	.add-item-btn {
		position: absolute;
		top: 0;
		right: 0;
	}
	.shelves {
		width: 100%;
		padding: var(--space-md);
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
		border: 1px solid var(--border-subtle);
	}
	.shelf {
		--depth: 3rem;
		--thickness: 1rem;
		position: relative;

		&:before,
		&:after {
			content: '';
			width: 1px;
			height: var(--depth);
			position: absolute;
			bottom: 0.8rem;
			background-color: var(--border-strong);
		}
		&:before {
			left: 11px;
			transform: rotate(30deg);
		}
		&:after {
			right: 11px;
			transform: rotate(-30deg);
		}
		.front {
			width: 100%;
			height: var(--thickness);
			position: absolute;
			bottom: 0;
			border: 1px solid var(--border-strong);
		}
	}
	.shelf .items {
		padding: 0 2rem;
		margin-bottom: calc(var(--thickness) + var(--space-sm));
		display: flex;
		align-items: flex-end;
		gap: 2.3rem;
	}
	.shelf-item {
		.cover {
			width: 4rem;
			height: 6rem;
			background-image: var(--img-url);
			background-size: cover;
			background-position: center;
			border: 2px solid var(--border-subtle);
			border-radius: 3px;
		}
		.cover.album {
			height: 4rem;
		}
	}
	.shelf-item:hover {
		transform: translateY(-0.5rem);
		z-index: 1;

		.remove-item {
			display: block;
		}
	}
	.remove-item {
		background-color: var(--bg);
		border-radius: 50%;
		padding: var(--space-xs) var(--space-xs) 0;
		position: absolute;
		top: -6px;
		right: -3px;
		display: none;
	}
</style>
