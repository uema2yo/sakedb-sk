<script>
	import { user } from "$lib/sveltefire";
	import { auth } from "$lib/firebase/init";
	import { page } from "$app/stores";
	import { onMount } from "svelte";
	import { checkLogin, loginInfo } from "$lib/checkLogin";
	import Login from "$components/Forms/Login.svelte";
	import Logout from "$components/Forms/Logout.svelte";
	import Loading from "$components/Loading.svelte";
	import UserProfile from "$components/UserProfile.svelte";
  

	let login = false;
	let name;
	let admin = false;
	let loading = true;

	onMount(async () => {
		try {
      await checkLogin();
			login = loginInfo.login;
			name = loginInfo.name;
			admin = loginInfo.admin;
			loading = false;
		} catch (error) {
			console.error("Failed to check login:", error);
		}
	});

</script>

<main>
  <h1>マイページ</h1>
{#if login}
	<Logout />
  <UserProfile />
{:else if loading}
  <Loading />
{:else}
	<Login />
{/if}
</main>
