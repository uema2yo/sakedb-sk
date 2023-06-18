<script lang="ts">
	import { onMount } from "svelte";
	import { getUserProfile, profile } from "$lib/firebase/userProfile";
	import { addDocument } from "$lib/firebase/addDocument";
	import { getDocuments } from "$lib/firebase/getDocuments";
	import Loading from "$components/Loading.svelte";
	import EditableFields from "$components/Forms/EditableFields.svelte";
	import { getGenderList } from "$lib/code/gender";
	import { generateDate } from "$lib/utility/date"

	export let uid;
	let loading = true;
	const currentUserProfile = {
		id: { public: true, value: "" },
		name: { public: true, value: "" },
		gender: { public: false, value: 0 },
		birthdate: { public: false, value: "" }
	};
	let idField, nameField, genderField, birthdateField;
	let saving = false;
	let genderOptions = [];
	let genderLabel;
	let birthdateOption = {};

	onMount(async () => {
		try {
			const generatedDate = generateDate({year: 1900, month: 1, date: 1,}, "today");
			const birthdateOption = {
				years: generatedDate.generateYears(),
				months: generatedDate.generateMonths(),
				days: generatedDate.generateDays(),
			}
			const genders = await getGenderList();
			genders.map(gender => {
				genderOptions.push({value: gender.code, label: gender.label });
			});
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
				}
			]);

			function getCurrentUserProfile(doc, alt) {
				return {
					public: doc ? doc.public : false,
					value: doc ? doc.value : alt
				}
			}

			const userAltName = "user"
			currentUserProfile.id = getCurrentUserProfile(documents[0], userAltName);
			currentUserProfile.name = getCurrentUserProfile(documents[1], "名無し");
			currentUserProfile.gender = getCurrentUserProfile(documents[2], 0);
			currentUserProfile.genderLabel = genderOptions.find(genderOption => genderOption.value === currentUserProfile.gender.value);
			currentUserProfile.birthdate = getCurrentUserProfile(documents[3], null);

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
						options: genderOptions
					}
				]
			};

			birthdateField = {
				id: "birthdate",
				collection_name: "b_user_birthdate",
				fields: [
					{
						name: "public",
						type: "checkbox",
						value: currentUserProfile.birthdate.public,
						disabled: false,
						label: "公開"
					},
					{
						name: "value",
						type: "select",
						options: birthdateOption.years,
						//value:,
						onchange: () => {}
					},
					{
						name: "value",
						type: "select",
						options: birthdateOption.months,
						//value:,
						onchange: () => {}
					},
					{
						name: "value",
						type: "select",
						options: birthdateOption.days,
						//value,
						onchange: () => {}
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
				currentUserProfile.genderLabel = genderOptions.find(genderOption => genderOption.value === document.value);
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
					<span>{currentUserProfile.gender.public ? "公開" : "非公開"}</span>{currentUserProfile.genderLabel.label}
				</EditableFields>
			</section>
			<section>
				<h3>生年月日</h3>
				<EditableFields field={birthdateField} isPublic isUserLoggedIn on:save={handleSave}>
					<span>{currentUserProfile.birthdate.public ? "公開" : "非公開"}</span>{currentUserProfile.birthdate.value}
				</EditableFields>
			</section>
		</article>
	{/if}
</div>
