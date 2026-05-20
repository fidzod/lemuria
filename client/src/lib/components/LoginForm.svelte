<script lang="ts">
	let formMode: 'Log In' | 'Sign Up' = $state('Log In');
	let username_or_email = $state('');
	let password = $state('');
</script>

<form class="col">
	<div class="form-row row">
		<label for="username_or_email">username or email:</label>
		<div class="input-sizer">
			<input
				type="text"
				name="username_or_email"
				placeholder="kaworu"
				bind:value={username_or_email}
				size="1"
			/>
			<span aria-hidden="true">{username_or_email || 'kaworu'}</span>
		</div>
	</div>

	<div class="form-row row">
		<label for="password">password:</label>
		<div class="input-sizer">
			<input type="password" name="password" placeholder="•••••••" bind:value={password} size="1" />
			<span aria-hidden="true">{password || '•••••••'}</span>
		</div>
	</div>

	<button type="submit">{formMode}</button>
</form>

<span class="switch-form-mode">
	{#if formMode === 'Log In'}
		<span>New here? </span>
		<button class="unset" onclick={() => (formMode = 'Sign Up')}>Sign Up</button>
	{:else}
		<span>Already have an account? </span>
		<button class="unset" onclick={() => (formMode = 'Log In')}>Log In</button>
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
			border-bottom: 2px solid var(--text-secondary);
		}
	}
	button[type='submit'] {
		margin-top: var(--space-xl);
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
</style>
