<script lang="ts">
	import { onMount } from "svelte";
	import { setUserProfileItem, getUserProfile, profile } from "$lib/firebase/userProfile";
	import { setDocument } from "$lib/firebase/addDocument";
	import Loading from "$components/Loading.svelte";
	import EditableFields from "$components/Forms/EditableFields.svelte";

	let loading = true;
	let currentUserProfile = {
		id: "",
		name: ""
	};
	let nameField;
	let saving = false;

	onMount(async () => {
		try {
			await getUserProfile();
			currentUserProfile = profile;
			currentUserProfile.name = currentUserProfile.name || "名無し";
			loading = false;
			nameField = {
				collection_name: "b_user_name",
				fields: [
					{ name: "public", type: "checkbox", value: true, disabled: true, label: "公開" },
					{ name: "name", type: "text", value: currentUserProfile.name }
				]
			};
		} catch (error) {
			console.error("An error occurred while checking the login status:", error);
		}
	});

	function handleSave(ev) {
		if (saving) return;
		saving = true;
		let document = {};
		ev.detail.field.fields.forEach((field) => {
			document[field.name] = field.value;
		});
		setUserProfileItem(ev.detail.field.collection_name, document)
			.then(() => {
				saving = false;
			})
			.catch((error) => {
				console.error("保存中にエラーが発生しました:", error);
				saving = false;
			});
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
				<EditableFields field={nameField} isPublic isUserLoggedIn on:save={handleSave}>
					<span>公開</span>{currentUserProfile.name}
				</EditableFields>
			</section>
		</article>
	{/if}
</form>
