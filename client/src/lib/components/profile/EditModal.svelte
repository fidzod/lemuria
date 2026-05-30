<script lang="ts">
	import { enhance } from '$app/forms';
	import Input from '../forms/Input.svelte';
	import Textarea from '../forms/Textarea.svelte';
	import { AccentColors, type AccentColor, type UserProfile } from '@lemuria/types';
	import ImageUpload from './ImageUpload.svelte';
	import type { ActionData } from '../../../routes/@[username]/$types';

	let {
		open,
		onClose,
		profile,
		form
	}: {
		open: boolean;
		onClose: () => void;
		profile: UserProfile;
		form: ActionData;
	} = $props();

	let user = $derived(profile.user);
	let avatarFile = $state<File | null>();
	let bannerFile = $state<File | null>();
	// svelte-ignore state_referenced_locally
	let accentColor = $state<AccentColor>(user.accentColor);
</script>

<!-- TODO: Leaking memory -->

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="backdrop" onclick={onClose}>
		<div
			class="modal"
			onclick={(e) => e.stopPropagation()}
			style="
                --user-accent: var(--{user.accentColor || 'red'}-bright)
            "
		>
			<div class="left">
				<ImageUpload
					url={user.avatarUrl}
					variant="avatar"
					onFileSelected={(file) => {
						avatarFile = file;
					}}
				/>
				<ImageUpload
					url={profile.bannerUrl}
					variant="banner"
					onFileSelected={(file) => {
						bannerFile = file;
					}}
				/>
			</div>
			<form
				method="POST"
				action="/@{user.username}?/updateProfile"
				enctype="multipart/form-data"
				use:enhance={({ formData }) => {
					if (avatarFile) formData.append('avatar', avatarFile);
					if (bannerFile) formData.append('banner', bannerFile);
					formData.append('accent-color', accentColor);
					formData.append('username', user.username);
					return async ({ update, result }) => {
						await update({ reset: false });
						if (result.type === 'success') onClose();
					};
				}}
			>
				{#if form?.error}
					<p role="alert">{form.error}, please try again.</p>
				{/if}
				<Input
					name="display-name"
					label="Display Name"
					placeholder="Kaworu Nagisa"
					initialValue={user.displayName}
					required
				/>
				<div class="form-row accent-color">
					<span>Accent Color:</span>
					<div class="buttons">
						{#each AccentColors as color}
							<button
								class="unset"
								value={color}
								onclick={(e) => {
									e.preventDefault();
									accentColor = color;
								}}
								class:selected={accentColor === color}
								aria-label={color}
								style="--color: var(--{color}-bright)"
							></button>
						{/each}
					</div>
				</div>
				<div class="form-row">
					<label for="bio">Bio:</label>
					<Textarea name="bio" value={profile.bio} placeholder="Your bio" />
				</div>
				<button type="submit">Save Changes</button>
			</form>
		</div>
	</div>
{/if}

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		display: flex;
		padding-top: 30vh;
		justify-content: center;
		z-index: 1;
	}
	.modal {
		width: 60vw;
		max-width: 600px;
		height: fit-content;
		padding: var(--space-md);
		display: flex;
		gap: var(--space-md);
		background-color: var(--bg);
		border: 1px solid var(--border-subtle);
	}
	.left {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-sm);
	}
	form {
		width: 100%;
	}
	.form-row {
		width: 100%;
	}
	.accent-color .buttons {
		display: flex;
		gap: var(--space-sm);
	}
	.accent-color button {
		width: 1rem;
		height: 1rem;
		background-color: var(--color);
		margin: 3px;

		&.selected,
		&:hover {
			box-shadow:
				0 0 0 2px var(--bg),
				0 0 0 3px var(--color);
		}
	}
	@media (max-width: 580px) {
		.modal {
			width: 400px;
		}
	}
</style>
