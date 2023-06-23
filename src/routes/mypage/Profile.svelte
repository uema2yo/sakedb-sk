<script lang="ts">
	import { onMount } from "svelte";
	import { getUserProfile, profile } from "$lib/firebase/userProfile";
	import { addDocument } from "$lib/firebase/addDocument";
	import { getDocuments } from "$lib/firebase/getDocuments";
	import Loading from "$components/Loading.svelte";
	import EditableFields from "$components/Forms/EditableFields.svelte";
	import { getGenderList } from "$lib/code/gender";
	import { createEventDispatcher, afterUpdate } from "svelte";
	import { getDateOffset, getFormatedDate } from "$lib/utility/date";

	export let uid;
	let loading = true;
	const currentUserProfile = {
		id: { public: true, value: "" },
		name: { public: true, value: "" },
		gender: { public: false, value: 0 },
		birthdate: { public: false, value: "", format: "" },
		residencePrefecture: { public: false, value: 0 }
	};
	let idField, nameField, genderField, birthdateField, residencePrefectureField;
	let saving = false;
	let genderOptions = [];
	let prefectureOptions = [];

	onMount(async () => {
		try {
			const genders = await getGenderList();
			genders.map((gender) => {
				genderOptions.push({ value: gender.code, label: gender.label });
			});
			const prefectures = await getDocuments([
				{
					name: "b_code_prefecture",
					order_by: { field: "code", direction: "asc" }
				}
			]);
			prefectures.map((prefecture) => {
				if (prefecture.code === 13) {
					prefectureOptions.push({ value: 0, innerText: "----" });
				}
				prefectureOptions.push({ value: prefecture.code, innerText: prefecture.label });
			});
			refreshCurrentUserProfile();
			const { id, name, gender, birthdate, residencePrefecture } = currentUserProfile;
			idField = {
				id: "id",
				collectionName: "b_user_id",
				fields: [
					{
						name: "public",
						type: "checkbox",
						value: id.public,
						disabled: true,
						label: "公開"
					},
					{ name: "value", type: "text", value: id.value }
				]
			};

			nameField = {
				id: "name",
				collectionName: "b_user_name",
				fields: [
					{
						name: "public",
						type: "checkbox",
						value: name.public,
						disabled: true,
						label: "公開"
					},
					{ name: "value", type: "text", value: name.value }
				]
			};

			genderField = {
				id: "gender",
				collectionName: "b_user_gender",
				fields: [
					{
						name: "public",
						type: "checkbox",
						value: gender.public,
						disabled: false,
						label: "公開"
					},
					{
						name: "value",
						type: "radio",
						value: gender.value,
						group_name: "profile-gender",
						options: genderOptions
					}
				]
			};
			birthdateField = {
				id: "birthdate",
				collectionName: "b_user_birthdate",
				fields: [
					{
						name: "public",
						type: "checkbox",
						value: birthdate.public,
						disabled: false,
						label: "公開"
					},
					{
						name: "value",
						type: "date",
						value: birthdate.value
							? getFormatedDate(birthdate.value)
							: getFormatedDate(getDateOffset("years", 40))
					}
				]
			};
			residencePrefectureField = {
				id: "residence_country",
				collectionName: "b_user_residence_prefecture",
				fields: [
					{
						name: "public",
						type: "checkbox",
						value: residencePrefecture.public,
						disabled: false,
						label: "公開"
					},
					{
						name: "value",
						type: "select",
						value: residencePrefecture.value,
						options: prefectureOptions
					}
				]
			};
		} catch (error) {
			console.error("ログイン状態の確認中にエラーが発生しました。", error);
		}
	});

	async function refreshCurrentUserProfile() {
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
			},
			{
				name: "b_user_birthdate",
				conditions: [{ name: "uid", operator: "==", value: uid }],
				public_only: false,
				order_by: { field: "timestamp", direction: "desc" },
				limit_num: 1
			},
			{
				name: "b_user_residence_prefecture",
				conditions: [{ name: "uid", operator: "==", value: uid }],
				public_only: false,
				order_by: { field: "timestamp", direction: "desc" },
				limit_num: 1
			}
		]);

		function getCurrentUserProfile(doc, alt) {
			return {
				public: doc ? doc.public : false,
				value: doc ? doc.value : alt
			};
		}

		const userAltName = "user";

		currentUserProfile.id = getCurrentUserProfile(documents[0], userAltName);
		currentUserProfile.name = getCurrentUserProfile(documents[1], "名無し");
		currentUserProfile.gender = getCurrentUserProfile(documents[2], 0);
		currentUserProfile.birthdate = getCurrentUserProfile(documents[3], null);
		currentUserProfile.residencePrefecture = getCurrentUserProfile(documents[4], 0);
		currentUserProfile.gender.format = genderOptions.find(
			(genderOption) => genderOption.value === currentUserProfile.gender.value
		).label;
		currentUserProfile.birthdate.format = getFormatedDate(currentUserProfile.birthdate.value, "ja");
		currentUserProfile.residencePrefecture.format = prefectureOptions.find(
			(prefectureOption) => prefectureOption.value === currentUserProfile.residencePrefecture.value
		).innerText;
		loading = false;
	}

	function handleSave(ev) {
		if (saving) return;
		saving = true;
		let document = {};
		ev.detail.field.fields.forEach((field) => {
			const { name, value } = field;
			document[name] = value;
		});
		addDocument(ev.detail.field.collectionName, document)
			.then(() => {
				currentUserProfile[ev.detail.field.id] = document;
				refreshCurrentUserProfile();
				//refreshLabel();
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
						.gender.format}
				</EditableFields>
			</section>
			<section>
				<h3>生年月日</h3>
				<EditableFields field={birthdateField} isPublic isUserLoggedIn on:save={handleSave}>
					<span>{currentUserProfile.birthdate.public ? "公開" : "非公開"}</span>{currentUserProfile
						.birthdate.value
						? currentUserProfile.birthdate.format
						: "未登録"}
				</EditableFields>
			</section>
			<section>
				<h3>居住地</h3>
				<EditableFields
					field={residencePrefectureField}
					isPublic
					isUserLoggedIn
					on:save={handleSave}
				>
					<span>{currentUserProfile.residencePrefecture.public ? "公開" : "非公開"}</span
					>{currentUserProfile.residencePrefecture.format}
				</EditableFields>
			</section>
		</article>
	{/if}
</div>
