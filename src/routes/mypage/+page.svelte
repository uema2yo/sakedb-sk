<script lang="ts">
	import { onMount } from "svelte";
	import { checkLogin, login } from "$lib/checkLogin";
	import Login from "$components/Forms/Login.svelte";
	import Logout from "$components/Forms/Logout.svelte";
	import Loading from "$components/Loading.svelte";
	import UserProfile from "$components/UserProfile.svelte";

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
	<h1>マイページ</h1>
	{#if login.user}
		<Logout />
		<UserProfile login={login} />
	{:else if loading}
		<Loading />
	{:else}
		<Login />
	{/if}
</main>
