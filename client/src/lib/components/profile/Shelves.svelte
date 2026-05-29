{#snippet shelf()}
	<div class="shelf">
		<div class="front"></div>
	</div>
{/snippet}

<div class="shelves">
	{@render shelf()}
	{@render shelf()}
	{@render shelf()}
</div>

<style>
	.shelves {
		width: 100%;
		padding: var(--space-lg);
		display: flex;
		flex-direction: column;
		gap: var(--space-xl);
		border: 1px solid var(--border-subtle);
	}
	.shelf {
		--depth: 3rem;
		--thickness: 1rem;
		height: 80px;
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
</style>
