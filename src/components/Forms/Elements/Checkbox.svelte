<script>
	export let name = "";
	export let checked = false;
	export let label = "";
	export let disabled = false;
</script>

<label>
	{label}
	<input type="checkbox" {name} bind:checked {disabled} />
</label>
