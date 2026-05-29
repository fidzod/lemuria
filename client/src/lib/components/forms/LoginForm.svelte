<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from '../../../routes/login/$types';
	import Input from './Input.svelte';

	let { form, redirectTo }: { form: ActionData; redirectTo: string | null } = $props();

	let formMode: 'login' | 'signup' = $state('login');
</script>

{#if formMode === 'login'}
	<form method="POST" action="?/login" use:enhance>
		<input type="hidden" name="redirectTo" value={form?.redirectTo ?? redirectTo ?? ''} />
		{#if form?.error && form.action === 'login'}
			<p role="alert">{form.error}, please try again.</p>
		{/if}
		<Input name="identifier" label="username or email" placeholder="kaworu@tokyo.jp" required />
		<Input name="password" label="password" type="password" placeholder="•••••••" required />
		<button type="submit">Log In</button>
	</form>
{:else}
	<form method="POST" action="?/register" use:enhance>
		<input type="hidden" name="redirectTo" value={form?.redirectTo ?? redirectTo ?? ''} />
		{#if form?.error && form.action === 'register'}
			<p role="alert">{form.error}</p>
		{/if}
		<Input name="email" label="email" type="text" placeholder="kaworu@tokyo-3.jp" required />
		<Input name="username" label="username" type="text" placeholder="kaworu" required />
		<Input name="password" label="password" type="password" placeholder="•••••••" required />
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
	.switch-form-mode button {
		color: var(--text-primary);
		text-decoration: underline;

		&:hover {
			color: var(--text-secondary);
		}
	}
</style>
