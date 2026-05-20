<script lang="ts">
	import type { Board } from '$lib/types';
	let { board }: { board: Board } = $props();
</script>

<a href="/" class="board">
	<div class="info">
		<div class="avatar"></div>
		<div class="details">
			<p class="name">({board.mnemonic}) {board.name}</p>
			<p class="description">{board.description}</p>
		</div>
	</div>
	{board.mnemonic}
</a>

<style>
	.board {
		position: relative;

		&:before {
			content: '(';
		}
		&:after {
			content: ')';
		}
	}
	.info {
		width: 200px;
		overflow: hidden;
		position: absolute;
		top: calc(100% + var(--space-xs));
		right: calc(100% + var(--space-xs));
		padding: var(--space-xs);

		display: flex;
		gap: var(--space-sm);

		background-color: var(--bg);
		border: 1px solid var(--border-subtle);

		opacity: 0;
		pointer-events: none;
		transition: opacity 0.25s;

		z-index: 1;
	}
	.board:hover .info {
		opacity: 1;
		pointer-events: auto;
	}
	.avatar {
		flex-shrink: 0;
		width: 3rem;
		height: 3rem;
		border: 1px solid var(--border-subtle);
	}
	.details {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}
	.name {
		font-weight: bold;
	}
	.description {
		overflow: hidden;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 5;
	}
</style>
