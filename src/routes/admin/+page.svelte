
<script>
  import { SITE_TITLE, SUB_TITLE } from "../../constants";
  import Head from "../../components/Head.svelte";
  // 他の必要なインポートをここに追加します。
</script>

<svelte:head>
  <Head />
  <title>管理画面 - {SITE_TITLE}</title>
</svelte:head>

<h1>管理画面</h1>
<p></p>

<style>
  h1 {
    color: red;
  }
</style>
