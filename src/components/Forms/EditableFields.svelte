<script>
	import { createEventDispatcher, afterUpdate } from "svelte";

	export let field = {};
	export let isUserLoggedIn = false;
	export let isPublic = false;

	let isEditing = false;
	let editedFields = JSON.parse(JSON.stringify(field.fields));
	let inputElements = [];

	const dispatch = createEventDispatcher();

	function startEditing() {
		console.log("start editing");
		isEditing = true;
		focusFirstInput();
	}

	function saveFields() {
		field.fields = JSON.parse(JSON.stringify(editedFields));
		isEditing = false;
		dispatch("save", { field });
	}

	function cancelEdit() {
		editedFields = JSON.parse(JSON.stringify(field.fields));
		isEditing = false;
	}

	function focusFirstInput() {
		afterUpdate(() => {
			inputElements[0].focus();
		});
	}
</script>

{#if isEditing && isUserLoggedIn}
	<form on:submit|preventDefault={saveFields}>
		{#each field.fields as fieldData, i}
			{#if fieldData.type === "select"}
				<select
					id="editable-input-{i}"
					bind:this={inputElements[i]}
					bind:value={editedFields[i].value}
					on:blur={saveFields}
					on:keydown={(e) => e.key === "Enter" && saveFields()}
				>
					{#each fieldData.options as option}
						<option value={option}>{option}</option>
					{/each}
				</select>
			{:else if fieldData.type === "checkbox"}
				<input
					type="checkbox"
					id="editable-input-{i}"
					disabled={editedFields[i].disabled}
					bind:this={inputElements[i]}
					bind:checked={editedFields[i].value}
					on:blur={saveFields}
					on:keydown={(e) => e.key === "Enter" && saveFields()}
				/>
				{#if editedFields[i].label}
					<label for="editable-input-{i}">{editedFields[i].label}</label>
				{/if}
			{:else if fieldData.type === "radio"}
				{#each fieldData.options as option, j}
					<label>
						<input
							type="radio"
							name="editable-input-{i}"
							id="editable-input-{i}-{j}"
							bind:this={inputElements[i][j]}
							bind:group={editedFields[i].value}
							value={option}
						/>
						<span>{option}</span>
					</label>
				{/each}
			{:else}
				<input
					type="text"
					id="editable-input-{i}"
					bind:this={inputElements[i]}
					bind:value={editedFields[i].value}
					on:blur={saveFields}
					on:keydown={(e) => e.key === "Enter" && saveFields()}
					autofocus={i === 0}
				/>
			{/if}
		{/each}
		<button type="submit">保存</button>
		<button type="button" on:click={cancelEdit}>キャンセル</button>
	</form>
{:else if isUserLoggedIn}
	<button
		type="button"
		class="slot is-editable"
		tabindex="0"
		on:click={startEditing}
		on:keydown={(e) => e.key === "Enter" && startEditing()}
	>
		<slot />
	</button>
{:else if isPublic}
	<div class="slot">
		<slot />
	</div>
{/if}

<style>
	.slot {
		display: flex;
		justify-content: space-between;
		min-width: 320px;
		appearance: none;
		background: none;
		border: none;
		&.is-editable {
			cursor: pointer;
			&::after {
				content: "編集";
			}
		}
	}
</style>
