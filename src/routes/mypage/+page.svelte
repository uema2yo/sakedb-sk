<script lang="ts">
	import { onMount } from "svelte";
	import { checkLogin, login } from "$lib/checkLogin";
	import Login from "$components/Forms/Login.svelte";
	import Logout from "$components/Forms/Logout.svelte";
	import Loading from "$components/Loading.svelte";
	import Profile from "./Profile.svelte";
	import "$styles/common.scss";

	let loading = true;

	onMount(async () => {
		try {
			await checkLogin();
			loading = false;
		} catch (error) {
			console.error("An error occurred while checking the login status:", error);
		}
	});
</script>

<main>
	<h1 class="myClass">マイページ</h1>
	{#if login.user}
		<Logout />
		<Profile uid={login.uid} />
	{:else if loading}
		<Loading />
	{:else}
		<Login />
	{/if}
</main>

<style>
  :global(.myClass) {
    color: red;
  }
</style>

