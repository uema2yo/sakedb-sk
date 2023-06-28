<script lang="ts">
	import { auth, db } from "$lib/firebase/init";
	import { onAuthStateChanged } from "firebase/auth";
	import { doc, getDoc } from "firebase/firestore";
	import { onMount } from "svelte";
	import { getDocuments } from "$lib/firebase/getDocuments";
	import { checkLogin, login } from "$lib/checkLogin";
	import { SITE_TITLE, SUB_TITLE } from "$src/constants";
	import { updateRegionCodes } from "$lib/code/updateRegionCodes";
	import { updateCountryCodes } from "$lib/code/updateCountryCodes";
	import { updatePrefectureCodes } from "$lib/code/updatePrefectureCodes";
	import { updateCityCodes } from "$lib/code/updateCityCodes";
	import Head from "$components/Head.svelte";
	import Login from "$components/Forms/Login.svelte";
	import Logout from "$components/Forms/Logout.svelte";
	import Loading from "$components/Loading.svelte";

	let loading = true;
	let admin = false;
	let id;
	let name;

	onMount(async () => {
		try {
			await checkLogin();
			const uid = login.uid;
			admin = login.admin;

			console.log(login);
			const documents = await getDocuments([
				{
					collectionName: "b_user_id",
					conditions: [{ name: "uid", operator: "==", value: uid }],
					public_only: false,
					order_by: { field: "timestamp", direction: "desc" },
					limit_num: 1
				},
				{
					collectionName: "b_user_name",
					conditions: [{ name: "uid", operator: "==", value: uid }],
					public_only: false,
					order_by: { field: "timestamp", direction: "desc" },
					limit_num: 1
				}
			]);
			id = documents[0] && documents[0].value;
			name = documents[1] && documents[1].value;
			loading = false;
		} catch (error) {
			console.error("Failed to check login:", error);
		}
	});
	async function apiImportHandler(ev) {
		switch (ev.target.name) {
			case "updateRegionCodes":
				await updateRegionCodes();
				break;
			case "updateCountryCodes":
				await updateCountryCodes();
				break;
			case "updatePrefectureCodes":
				updatePrefectureCodes();
				break;
			case "updateCityCodes":
				updateCityCodes();
				break;
			case "openPrefectureCodes":
				break;
		}
	}
	function openEditorHandler(ev) {}
</script>

<svelte:head>
	<Head />
	<title>管理画面 - {SITE_TITLE}</title>
</svelte:head>

<header>
	<h1>管理画面</h1>
	{#if admin}
		<p>管理者 {name}（ID: {id}） でログイン中</p>
		<Logout />
	{:else if loading}
		<Loading />
	{:else}
		<p>管理者専用ページです。管理者アカウントでログインしてください。</p>
		<Login />
	{/if}
</header>

{#if admin}
	<article>
		<h2>地域コード</h2>
		<button type="button" name="updateRegionCodes" on:click={apiImportHandler}
			>RESAS API で上書きする</button
		>
		<button type="button" name="openRegionCodes" on:click={openEditorHandler} disabled={true}
			>手動編集画面を開く</button
		>
	</article>
	<article>
		<h2>国コード</h2>
		<button type="button" name="updateCountryCodes" on:click={apiImportHandler}
			>RESAS API で上書きする</button
		>
		<button type="button" name="openCountryCodes" on:click={openEditorHandler} disabled={true}
			>手動編集画面を開く</button
		>
	</article>
	<article>
		<h2>都道府県コード</h2>
		<button type="button" name="updatePrefectureCodes" on:click={apiImportHandler}
			>RESAS API で上書きする</button
		>
		<button type="button" name="openPrefectureCodes" on:click={openEditorHandler} disabled={true}
			>手動編集画面を開く</button
		>
	</article>
	<article>
		<h2>市区町村コード</h2>
		<button type="button" name="updateCityCodes" on:click={apiImportHandler}
			>RESAS API で上書きする</button
		>
		<button type="button" name="openCityCodes" on:click={openEditorHandler} disabled={true}
			>手動編集画面を開く</button
		>
	</article>
{/if}

<style>
	h1 {
		color: red;
	}
</style>
