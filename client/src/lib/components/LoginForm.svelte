<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from '../../routes/login/$types';

	let { form, redirectTo }: { form: ActionData; redirectTo: string | null } = $props();

	let formMode: 'login' | 'signup' = $state('login');
	let identifier = $state('');
	let username = $state('');
	let email = $state('');
	let password = $state('');
</script>

{#if formMode === 'login'}
	<form class="col" method="POST" action="?/login" use:enhance>
		<input type="hidden" name="redirectTo" value={form?.redirectTo ?? redirectTo ?? ''} />
		{#if form?.error && form.action === 'login'}
			<p role="alert">{form.error}, please try again.</p>
		{/if}
		<div class="form-row row">
			<label for="identifier">username or email:</label>
			<div class="input-sizer">
				<input
					type="text"
					name="identifier"
					placeholder="kaworu"
					bind:value={identifier}
					required
					size="1"
				/>
				<span aria-hidden="true">{identifier || 'kaworu'}</span>
			</div>
		</div>

		<div class="form-row row">
			<label for="password">password:</label>
			<div class="input-sizer">
				<input
					type="password"
					name="password"
					placeholder="•••••••"
					bind:value={password}
					required
					size="1"
				/>
				<span aria-hidden="true">{password || '•••••••'}</span>
			</div>
		</div>

		<button type="submit">Log In</button>
	</form>
{:else}
	<form class="col" method="POST" action="?/register" use:enhance>
		{#if form?.error && form.action === 'register'}
			<p role="alert">{form.error}</p>
		{/if}
		<div class="form-row row">
			<label for="email">email:</label>
			<div class="input-sizer">
				<input
					type="email"
					name="email"
					placeholder="kaworu@tokyo3.jp"
					bind:value={email}
					required
					size="1"
				/>
				<span aria-hidden="true">{email || 'kaworu@tokyo3.jp'}</span>
			</div>
		</div>

		<div class="form-row row">
			<label for="username">username:</label>
			<div class="input-sizer">
				<input
					type="text"
					name="username"
					placeholder="kaworu"
					bind:value={username}
					required
					size="1"
				/>
				<span aria-hidden="true">{username || 'kaworu'}</span>
			</div>
		</div>

		<div class="form-row row">
			<label for="password">password:</label>
			<div class="input-sizer">
				<input
					type="password"
					name="password"
					placeholder="•••••••"
					bind:value={password}
					required
					size="1"
				/>
				<span aria-hidden="true">{password || '•••••••'}</span>
			</div>
		</div>

		<button type="submit">Register</button>
	</form>
{/if}

<span class="switch-form-mode">
	{#if formMode === 'login'}
		<span>New here? </span>
		<button class="unset" onclick={() => (formMode = 'signup')}>Sign Up</button>
	{:else}
		<span>Already have an account? </span>
		<button class="unset" onclick={() => (formMode = 'login')}>Log In</button>
	{/if}
</span>

<style>
	form {
		gap: var(--space-sm);
		align-items: flex-start;
	}
	.form-row {
		height: 1.5rem;
		gap: var(--space-sm);
		align-items: flex-end;
		min-width: 0;
	}
	input {
		background: none;
		border: none;
		color: var(--text-primary);

		&::placeholder {
			color: var(--text-muted);
		}

		&:focus {
			outline: none;
			border-bottom: 1px solid var(--text-secondary);
		}
	}
	button[type='submit'] {
		margin-block-start: var(--space-xl);
		color: var(--text-primary);

		&:hover {
			color: var(--text-secondary);
		}
	}
	.switch-form-mode button {
		color: var(--text-primary);
		text-decoration: underline;

		&:hover {
			color: var(--text-secondary);
		}
	}
	.input-sizer {
		display: inline-grid;
		min-width: 0;
		max-width: 100%;
		flex: 1;
	}
	.input-sizer input,
	.input-sizer span {
		grid-area: 1 / 1;
		min-width: 100px;
		font-family: var(--monospace);
		font-size: inherit;
		padding: 0;
		white-space: pre;
		width: 100%;
	}
	.input-sizer span {
		visibility: hidden;
		pointer-events: none;
	}
	p[role='alert'] {
		margin-block-end: var(--space-xl);
		color: var(--red-bright);
	}
</style>
