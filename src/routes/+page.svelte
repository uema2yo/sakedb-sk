<script>
  import Login from "$components/Forms/Login.svelte";
  import Logout from "$components/Forms/Logout.svelte";
  import { user } from "$lib/sveltefire";
  import { auth } from '$lib/firebase/init';
  import { SITE_TITLE, SUB_TITLE } from "../constants";
  import Head from "../components/Head.svelte";
  // 他の必要なインポートをここに追加します。
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

{#if $user}
<Logout />
{:else}
<Login />
{/if}

<style>
  h1 {
    color: red;
  }
</style>





