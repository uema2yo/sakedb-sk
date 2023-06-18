<script lang="ts">
	import { auth, db } from "$lib/firebase/init";
	import { onAuthStateChanged } from "firebase/auth";
	import { doc, getDoc } from "firebase/firestore";
	import { onMount } from "svelte";
	import { checkLogin, login } from "$lib/checkLogin";
	import { SITE_TITLE, SUB_TITLE } from "../../constants";
	import Head from "$components/Head.svelte";
	import Login from "$components/Forms/Login.svelte";
	import Logout from "$components/Forms/Logout.svelte";
	import Loading from "$components/Loading.svelte";

	let name;
	let admin = false;
	let loading = true;

	onMount(async () => {
		try {
      await checkLogin();
			name = login.name;
			admin = login.admin;
			loading = false;
		} catch (error) {
			console.error("Failed to check login:", error);
		}
	});
</script>

<svelte:head>
	<Head />
	<title>管理画面 - {SITE_TITLE}</title>
</svelte:head>

<h1>管理画面</h1>
{#if admin}
	<p>管理者 {name} でログイン中</p>
	<Logout />
{:else if loading}
	<Loading />
{:else}
	<p>管理者専用ページです。管理者アカウントでログインしてください。</p>
	<Login />
{/if}

<style>
	h1 {
		color: red;
	}
</style>
