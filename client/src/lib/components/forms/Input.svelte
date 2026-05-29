<script lang="ts">
	type Props = {
		name: string;
		label: string;
		placeholder?: string;
		initialValue?: string;
		required?: boolean;
		type?: 'text' | 'email' | 'password';
	};

	let {
		name,
		label,
		placeholder = '',
		initialValue = '',
		required = false,
		type = 'text'
	}: Props = $props();

	// svelte-ignore state_referenced_locally
	let value = $state(initialValue);
</script>

<div class="form-row">
	<label for={name}>{label}:</label>
	<div class="input-sizer">
		<input {type} {name} {placeholder} {required} size="1" bind:value />
		<span aria-hidden="true">{value || placeholder}</span>
	</div>
</div>

<style>
	.input-sizer {
		display: inline-grid;
		min-width: 0;
		max-width: 100%;
		flex: 1;
	}
	.input-sizer input,
	.input-sizer span {
		grid-area: 1 / 1;
		min-width: 1ch;
		font-family: var(--monospace);
		font-size: inherit;
		padding: 0;
		white-space: pre;
		width: 100%;
	}
	.input-sizer span {
		width: auto;
		visibility: hidden;
		pointer-events: none;
	}
</style>
