
<script>
  import { SITE_TITLE, SUB_TITLE } from "../constants";
  import Head from "../components/Head.svelte";
  // 他の必要なインポートをここに追加します。
</script>

<svelte:head>
  <Head />
  <title>{SITE_TITLE} - {SUB_TITLE}</title>
</svelte:head>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<style>
  h1 {
    color: red;
  }
</style>
