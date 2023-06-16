<script lang="ts">
	import { onMount } from "svelte";
	import { getUserProfile, profile } from "$lib/firebase/userProfile";
	import { addDocument } from "$lib/firebase/addDocument";
	import { getDocuments } from "$lib/firebase/getDocuments";
	import Loading from "$components/Loading.svelte";
	import EditableFields from "$components/Forms/EditableFields.svelte";
	import { Timestamp } from "firebase/firestore";

	export let uid;
	let loading = true;
	const currentUserProfile = {
		id: { public: true, value: "" },
		name: { public: true, value: "" },
		gender: { public: false, value: 0 }
	};
	let idField, nameField, genderField;
	let saving = false;

	onMount(async () => {
		try {
			const documents = await getDocuments([
				{
					name: "b_user_id",
					conditions: [{ name: "uid", operator: "==", value: uid }],
					public_only: false,
					order_by: { field: "timestamp", direction: "desc" },
					limit_num: 1
				},
				{
					name: "b_user_name",
					conditions: [{ name: "uid", operator: "==", value: uid }],
					public_only: false,
					order_by: { field: "timestamp", direction: "desc" },
					limit_num: 1
				},
				{
					name: "b_user_gender",
					conditions: [{ name: "uid", operator: "==", value: uid }],
					public_only: false,
					order_by: { field: "timestamp", direction: "desc" },
					limit_num: 1
				}
			]);

			currentUserProfile.id = documents[0] && documents[0].data();
			currentUserProfile.name = documents[1] && documents[1].data();
			currentUserProfile.gender = documents[2] && documents[2].data();

			loading = false;

			idField = {
				id: "id",
				collection_name: "b_user_id",
				fields: [
					{
						name: "public",
						type: "checkbox",
						value: currentUserProfile.id.public,
						disabled: true,
						label: "公開"
					},
					{ name: "value", type: "text", value: currentUserProfile.id.value }
				]
			};

			nameField = {
				id: "name",
				collection_name: "b_user_name",
				fields: [
					{
						name: "public",
						type: "checkbox",
						value: currentUserProfile.name.public,
						disabled: true,
						label: "公開"
					},
					{ name: "value", type: "text", value: currentUserProfile.name.value }
				]
			};

			genderField = {
				id: "gender",
				collection_name: "b_user_gender",
				fields: [
					{
						name: "public",
						type: "checkbox",
						value: currentUserProfile.gender.public,
						disabled: false,
						label: "公開"
					},
					{
						name: "value",
						type: "radio",
						value: currentUserProfile.gender.value,
						group_name: "profile-gender",
						options: [
							{ value: 1, label: "男性" },
							{ value: 2, label: "女性" },
							{ value: 9, label: "どちらでもない" },
							{ value: 0, label: "無回答" }
						]
					}
				]
			};
		} catch (error) {
			console.error("ログイン状態の確認中にエラーが発生しました。", error);
		}
	});

	function handleSave(ev) {
		if (saving) return;
		saving = true;
		let document = {};
		ev.detail.field.fields.forEach((field) => {
			document[field.name] = field.value;
		});
		addDocument(ev.detail.field.collection_name, document)
			.then(() => {
				currentUserProfile[ev.detail.field.id] = document;
				saving = false;
			})
			.catch((error) => {
				console.error("保存中にエラーが発生しました:", error);
				saving = false;
			});
	}
</script>

<div>
	{#if loading}
		<Loading />
	{:else}
		<article>
			<h2>{currentUserProfile.name.value}（{currentUserProfile.id.value}）さんのプロフィール</h2>

			<section>
				<h3>ユーザーID</h3>
				<EditableFields field={idField} isPublic isUserLoggedIn on:save={handleSave}>
					<span>{currentUserProfile.id.public ? "公開" : "非公開"}</span>{currentUserProfile.id
						.value}
				</EditableFields>
			</section>
			<section>
				<h3>名前</h3>
				<EditableFields field={nameField} isPublic isUserLoggedIn on:save={handleSave}>
					<span>{currentUserProfile.name.public ? "公開" : "非公開"}</span>{currentUserProfile.name
						.value}
				</EditableFields>
			</section>
			<section>
				<h3>性自認</h3>
				<EditableFields field={genderField} isPublic isUserLoggedIn on:save={handleSave}>
					<span>{currentUserProfile.gender.public ? "公開" : "非公開"}</span>{currentUserProfile
						.gender.value}
				</EditableFields>
			</section>
		</article>
	{/if}
</div>
