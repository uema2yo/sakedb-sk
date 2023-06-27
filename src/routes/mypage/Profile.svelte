<script lang="ts">
	import { onMount } from "svelte";
	import { addDocument } from "$lib/firebase/addDocument";
	import { getDocuments } from "$lib/firebase/getDocuments";
	import Loading from "$components/Loading.svelte";
	import EditableFields from "$components/Forms/EditableFields.svelte";
	import { getGenderOptions } from "$lib/code/getGenderOptions";
	import { getPrefectureOptions } from "$lib/code/getPrefectureOptions";
	import { getCityOptions } from "$lib/code/getCityOptions";
	import { createEventDispatcher, afterUpdate } from "svelte";
	import { getDateOffset, getFormatedDate } from "$lib/utility/date";
	import { collection } from "firebase/firestore";

	export let uid;
	let loading = true;
	const currentUserProfile = {
		id: { public: true, value: "" },
		name: { public: true, value: "" },
		gender: { public: false, value: 0 },
		birthdate: { public: false, value: "", format: "" },
		residencePrefecture: { public: false, value: 0 },
		residenceCity: { public: false, value: 0 }
	};
	let idField, nameField, genderField, birthdateField, residencePrefectureField, residenceCityField;
	let saving = false;
	let genderOptions = [];
	let prefectureOptions = [];
	let cityOptions = [];

	onMount(async () => {
		try {
			genderOptions = getGenderOptions();
			prefectureOptions = await getPrefectureOptions();
			refreshCurrentUserProfile().then(async () => {
				cityOptions = await getCityOptions(currentUserProfile.residencePrefecture.value);
			});

			const { id, name, gender, birthdate, residencePrefecture, residenceCity } =
				currentUserProfile;

			setFields();
		} catch (error) {
			console.error("ログイン状態の確認中にエラーが発生しました。", error);
		}
	});

	async function setFields() {
		idField = {
			id: "id",
			collectionName: "b_user_id",
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
			collectionName: "b_user_name",
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
			collectionName: "b_user_gender",
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
			collectionName: "b_user_birthdate",
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
					type: "date",
					value:
						currentUserProfile.birthdate.value &&
						getFormatedDate(currentUserProfile.birthdate.value)
				}
			]
		};
		residencePrefectureField = {
			id: "residencePrefecture",
			collectionName: "b_user_residence_prefecture",
			fields: [
				{
					name: "public",
					type: "checkbox",
					value: currentUserProfile.residencePrefecture.public,
					disabled: false,
					label: "公開"
				},
				{
					name: "value",
					type: "select",
					value: currentUserProfile.residencePrefecture.value,
					options: prefectureOptions
				}
			]
		};
		residenceCityField = {
			id: "residenceCity",
			collectionName: "b_user_residence_city",
			fields: [
				{
					name: "public",
					type: "checkbox",
					value: currentUserProfile.residenceCity.public,
					disabled: false,
					label: "公開"
				},
				{
					name: "value",
					type: "select",
					value: currentUserProfile.residenceCity.value,
					options: cityOptions
				}
			]
		};
	}
	const profileConfig = {
		id: {
			collectionName: "b_user_id",
			conditions: [{ name: "uid", operator: "==", value: uid }],
			public_only: false,
			order_by: { field: "timestamp", direction: "desc" },
			limit_num: 1
		},
		name: {
			collectionName: "b_user_name",
			conditions: [{ name: "uid", operator: "==", value: uid }],
			public_only: false,
			order_by: { field: "timestamp", direction: "desc" },
			limit_num: 1
		},
		gender: {
			collectionName: "b_user_gender",
			conditions: [{ name: "uid", operator: "==", value: uid }],
			public_only: false,
			order_by: { field: "timestamp", direction: "desc" },
			limit_num: 1
		},
		birthdate: {
			collectionName: "b_user_birthdate",
			conditions: [{ name: "uid", operator: "==", value: uid }],
			public_only: false,
			order_by: { field: "timestamp", direction: "desc" },
			limit_num: 1
		},
		residencePrefecture: {
			collectionName: "b_user_residence_prefecture",
			conditions: [{ name: "uid", operator: "==", value: uid }],
			public_only: false,
			order_by: { field: "timestamp", direction: "desc" },
			limit_num: 1
		},
		residenceCity: {
			collectionName: "b_user_residence_city",
			conditions: [{ name: "uid", operator: "==", value: uid }],
			public_only: false,
			order_by: { field: "timestamp", direction: "desc" },
			limit_num: 1
		}
	};

	let document = {};

	async function refreshCurrentUserProfile(configName) {
		//const { id, name, gender, birthdate, residencePrefecture, residenceCity } = profileConfig;
		let res;

		if (configName && configName !== "") {
			res = await getDocuments([profileConfig[configName]]);
			document[configName] = res[0];
		} else {
			for (const [name, config] of Object.entries(profileConfig)) {
				res = await getDocuments([config]);
				document[name] = res[0];
			}
		}

		function getCurrentUserProfile(doc, alt) {
			return {
				public: doc ? doc.public : false,
				value: doc ? doc.value : alt
			};
		}

		const userAltName = "user";

		currentUserProfile.id = getCurrentUserProfile(document.id, userAltName);
		currentUserProfile.name = getCurrentUserProfile(document.name, "名無し");
		currentUserProfile.gender = getCurrentUserProfile(document.gender, 0);
		currentUserProfile.birthdate = getCurrentUserProfile(
			document.birthdate,
			getFormatedDate(getDateOffset("years", 30))
		);
		currentUserProfile.residencePrefecture = getCurrentUserProfile(document.residencePrefecture, 0);
		currentUserProfile.residenceCity = getCurrentUserProfile(document.residenceCity, 0);
		const currentUserGenderFormat = genderOptions.find(
			(genderOption) => genderOption.value === currentUserProfile.gender.value
		);
		currentUserProfile.gender.format = currentUserGenderFormat && currentUserGenderFormat.label;
		currentUserProfile.birthdate.format = getFormatedDate(currentUserProfile.birthdate.value, "ja");

		const residencePrefectureFormat = prefectureOptions.find(
			(prefectureOption) => prefectureOption.value === currentUserProfile.residencePrefecture.value
		);
		currentUserProfile.residencePrefecture.format =
			residencePrefectureFormat && residencePrefectureFormat.innerText;

		cityOptions = await getCityOptions(currentUserProfile.residencePrefecture.value);
		const residenceCityFormat = cityOptions.find(
			(cityOption) => cityOption.value === currentUserProfile.residenceCity.value
		);
		currentUserProfile.residenceCity.format = residenceCityFormat && residenceCityFormat.innerText;

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
			.then(async () => {
				currentUserProfile[ev.detail.field.id] = document;
				refreshCurrentUserProfile(ev.detail.field.id);
				if (ev.detail.field.id === "residencePrefecture") {
					cityOptions = await getCityOptions(currentUserProfile.residencePrefecture.value);
					currentUserProfile.residenceCity.value = 0;
				}
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
				<EditableFields
					field={idField}
					isPublic
					isUserLoggedIn
					on:save={handleSave}
					on:startEditing={setFields}
				>
					<span>{currentUserProfile.id.public ? "公開" : "非公開"}</span>{currentUserProfile.id
						.value}
				</EditableFields>
			</section>
			<section>
				<h3>名前</h3>
				<EditableFields
					field={nameField}
					isPublic
					isUserLoggedIn
					on:save={handleSave}
					on:startEditing={setFields}
				>
					<span>{currentUserProfile.name.public ? "公開" : "非公開"}</span>{currentUserProfile.name
						.value}
				</EditableFields>
			</section>
			<section>
				<h3>性自認</h3>
				<EditableFields
					field={genderField}
					isPublic
					isUserLoggedIn
					on:save={handleSave}
					on:startEditing={setFields}
				>
					<span>{currentUserProfile.gender.public ? "公開" : "非公開"}</span>{currentUserProfile
						.gender.format}
				</EditableFields>
			</section>
			<section>
				<h3>生年月日</h3>
				<EditableFields
					field={birthdateField}
					isPublic
					isUserLoggedIn
					on:save={handleSave}
					on:startEditing={setFields}
				>
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
					on:startEditing={setFields}
				>
					<span>{currentUserProfile.residencePrefecture.public ? "公開" : "非公開"}</span
					>{currentUserProfile.residencePrefecture.format}
				</EditableFields>
				<EditableFields
					field={residenceCityField}
					isPublic
					isUserLoggedIn
					on:save={handleSave}
					on:startEditing={setFields}
				>
					<span>{currentUserProfile.residenceCity.public ? "公開" : "非公開"}</span
					>{currentUserProfile.residenceCity.format}
				</EditableFields>
			</section>
		</article>
	{/if}
</div>
