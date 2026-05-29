<script lang="ts">
	import GreenOrbs from '$lib/assets/green-orbs.png';
	import LoginForm from '$lib/components/forms/LoginForm.svelte';
	import Noise from '$lib/assets/noise.png';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<div class="backdrop" style="--noise: url({Noise})">
	<div class="login-modal">
		<div class="illustration">
			<img src={GreenOrbs} alt="Hazy green orbs floating in darkness" />
		</div>

		<div class="content">
			<div class="header">
				<p class="site-name">lemuria.so</p>
				<p class="tagline">
					<span>The sky above the port was the color of television,</span>
					<span>tuned to a dead channel.</span>
				</p>
			</div>
			<LoginForm {form} redirectTo={data.redirectTo} />
		</div>
	</div>
</div>

<style>
	.backdrop {
		position: fixed;
		inset: 0;

		display: flex;
		align-items: center;
		justify-content: center;

		background: linear-gradient(to bottom, #000000b2, #26282bb2 70%, #2f4a40b2), #000;

		z-index: 1;

		&::before {
			content: '';
			position: absolute;
			background: var(--noise);
			opacity: 0.05;
			inset: 0;
		}
	}
	.login-modal {
		width: 700px;
		height: 350px;

		display: flex;

		border: 1px solid var(--border-subtle);
		background-color: var(--bg);

		box-shadow: 0 0 0 3px var(--bg);

		z-index: 2;
	}
	.illustration {
		width: 50%;
		height: 100%;
		padding: var(--space-lg);

		display: flex;
		align-items: center;
		justify-content: center;

		img {
			width: 100%;
			margin: 3px;
		}
	}
	.content {
		width: 50%;
		height: 100%;
		padding: var(--space-lg);

		display: flex;
		flex-direction: column;
		gap: calc(var(--space-xl) * 3);
		justify-content: center;
	}
	.header {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}
	.site-name {
		color: var(--text-primary);
	}

	@media (max-width: 716px) {
		.login-modal {
			width: calc(100vw - var(--space-lg));
			max-width: 380px;
			height: fit-content;
			flex-direction: column;
		}
		.illustration {
			width: 30%;
			margin: var(--space-lg) auto;
			padding: 0;
			border: 1px solid var(--border-subtle);
		}
		.content {
			width: 100%;
		}
	}
</style>
