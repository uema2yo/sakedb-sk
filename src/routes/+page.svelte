<script>
  import { user } from "$lib/sveltefire";
  import { auth } from '$lib/firebase/init';
  import { SITE_TITLE, SUB_TITLE } from "../constants";
  import { onMount } from "svelte";
  import Head from "../components/Head.svelte";
  import Register from "$components/Forms/Register.svelte";
  import Logout from "$components/Forms/Logout.svelte";
  import Loading from "$components/Loading.svelte";
	import { checkLogin, login } from "$lib/checkLogin";

	let loading = true;

	onMount(async () => {
		try {
      await checkLogin();
      console.log(login)
			loading = false;
		} catch (error) {
			console.error("Failed to check login:", error);
		}
	});

  auth.onAuthStateChanged((firebaseUser) => {
    if (firebaseUser) {
    }
  });
</script>

<svelte:head>
  <Head />
  <title>{SITE_TITLE} - {SUB_TITLE}</title>
</svelte:head>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

{#if login.user}
  <Logout />
{:else if loading}
  <Loading />
{:else}
  <Register />
{/if}

<style>
  h1 {
    color: red;
  }
</style>





