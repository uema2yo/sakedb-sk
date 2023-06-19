<script lang="ts">
	import { createEventDispatcher, afterUpdate } from "svelte";

	export let field = {};
	export let isUserLoggedIn = false;
	export let isPublic = false;

	const dispatch = createEventDispatcher();
	let isEditing = false;
	let isCompositionInProgress = false;
	let editedFields = JSON.parse(JSON.stringify(field.fields));
	let isPageLoad = true;
	let value;
	let inputElements = [];

	function startEditing() {
		console.log("start editing");
		isEditing = true;
		isCompositionInProgress = false;
		inputElements = field.fields.map(() => ({}));
		field.fields.forEach((fieldData, i) => {
			if (fieldData.type === "radio") {
				inputElements[i] = fieldData.options.map(() => ({}));
			}
		});
	}
	function saveFields() {
		if (isCompositionInProgress) return;
		field.fields = JSON.parse(JSON.stringify(editedFields));
		field.fields.find((obj) => {
			if(obj.type === "date") {
				obj.value = new Date(obj.value).getTime();
			}
		});
		isEditing = false;
		dispatch("save", { field });
		resetInputElements();
	}

	function cancelEdit() {
		editedFields = JSON.parse(JSON.stringify(field.fields));
		isEditing = false;
		resetInputElements();
	}

	function focusFirstInput() {
		if (inputElements.length > 0) {
			inputElements.forEach((element) => {
				if (
					element &&
					element.name !== "public" &&
					!element.disabled &&
					(element.type === "text") | "checkbox"
				) {
					element.focus();
				}
			});
		}
	}

	function handleCompositionStart() {
		isCompositionInProgress = true;
	}

	function handleCompositionEnd() {
		isCompositionInProgress = false;
	}

	function resetInputElements() {
		inputElements = [];
	}

	document.addEventListener("compositionstart", handleCompositionStart);
	document.addEventListener("compositionend", handleCompositionEnd);

	afterUpdate(() => {
		if (isEditing) {
			focusFirstInput();
		}
	});
</script>

<!-- 省略 -->

{#if isEditing && isUserLoggedIn}
	<form on:submit|preventDefault={saveFields}>
		{#each field.fields as fieldData, i}
			{#if fieldData.type === "select"}
				<select
					id="editable-input-{i}"
					name={fieldData.selectName}
					bind:this={inputElements[i]}
					bind:value={editedFields[i].value}
					on:change={() =>
						fieldData.onchange({
							target: { name: fieldData.selectName, value: inputElements[i].value }
						})}
				>
					{#each fieldData.options as option}
						<option value={option.value}>{option.innerText}</option>
					{/each}
				</select>
			{:else if fieldData.type === "checkbox"}
				<input
					type="checkbox"
					id="editable-input-{i}"
					disabled={editedFields[i].disabled}
					bind:this={inputElements[i]}
					bind:checked={editedFields[i].value}
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
							bind:this={inputElements[`${i}-${j}`]}
							bind:group={editedFields[i].value}
							value={option.value}
						/>
						<span>{option.label}</span>
					</label>
				{/each}
			{:else if fieldData.type === "date"}
				<input
					type="date"
					id="editable-input-{i}"
					bind:this={inputElements[i]}
					bind:value={editedFields[i].value}
					on:keydown={(e) => e.key === "Enter" && saveFields()}
				/>
			{:else}
				<input
					type="text"
					id="editable-input-{i}"
					bind:this={inputElements[i]}
					bind:value={editedFields[i].value}
					on:keydown={(e) => e.key === "Enter" && saveFields()}
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
	}

	.slot.is-editable {
		cursor: pointer;
	}

	.slot.is-editable::after {
		content: "編集";
	}
</style>
