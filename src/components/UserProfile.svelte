<script>
	import { onMount } from "svelte";
	import { saveUserProfile, getUserProfile, profile } from "$lib/firebase/userProfile";
	import Loading from "$components/Loading.svelte";
	import EditableFields from "$components/Forms/EditableFields.svelte";
	//import Checkbox from "$components/Forms/Elements/Checkbox.svelte";
	//import Submit from "$components/Forms/Elements/Submit.svelte";

	let loading = true;

	let currentUserProfile = {
		id: "",
		name: ""
	};

	let nameFields;

	onMount(async () => {
		try {
			await getUserProfile();
			currentUserProfile = profile;
			currentUserProfile.name = currentUserProfile.name || "名無し";
			loading = false;
			nameFields = [
				{ name: "name_public", type: "checkbox", value: true, disabled: true, label: "公開"  },
				{ name: "name", type: "text", value: currentUserProfile.name }
			];
		} catch (error) {
			console.error("An error occurred while checking the login status:", error);
		}
	});

	function handleSave(event) {
    console.log('Saved fields:', event.detail.fields);
  }

</script>

<form>
	{#if loading}
		<Loading />
	{:else}
		<article>
			<h2>{currentUserProfile.name}（{currentUserProfile.id}）さんのプロフィール</h2>
			<section>
				<h3>名前</h3>
				<EditableFields fields={nameFields} isPublic isUserLoggedIn on:save={handleSave}>
					<span>公開</span>{currentUserProfile.name}
				</EditableFields>
			</section>
		</article>
	{/if}
</form>
