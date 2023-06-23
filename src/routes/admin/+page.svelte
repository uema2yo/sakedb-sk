<script lang="ts">
	import { auth, db } from "$lib/firebase/init";
	import { onAuthStateChanged } from "firebase/auth";
	import { doc, getDoc } from "firebase/firestore";
	import { onMount } from "svelte";
	import { getDocuments } from "$lib/firebase/getDocuments";
	import { checkLogin, login } from "$lib/checkLogin";
	import { SITE_TITLE, SUB_TITLE } from "../../constants";
	import { updatePrefectureCode } from "$lib/api/updatePrefectureCode";
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
				}
			]);
			id = documents[0].value;
			name = documents[1].value;
			loading = false;
		} catch (error) {
			console.error("Failed to check login:", error);
		}
	});
	function apiImportHandler(ev) {
		updatePrefectureCode()
	}
	function openEditorHandler(ev) {}
</script>

<svelte:head>
	<Head />
	<title>管理画面 - {SITE_TITLE}</title>
</svelte:head>

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

<article>
	<h2>都道府県コード</h2>
	<button type="button" name="updatePrefectureCode" on:click={apiImportHandler}
		>RESAS API で上書きする</button
	>
	<button type="button" name="openPrefecture" on:click={openEditorHandler}
		>手動編集画面を開く</button
	>
</article>

<style>
	h1 {
		color: red;
	}
</style>
