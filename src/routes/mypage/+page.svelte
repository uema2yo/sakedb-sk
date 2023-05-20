<script>
  import { user } from "$lib/sveltefire";
  import Logout from "../../components/Forms/Logout.svelte";
</script>

{#if $user}
<Logout />
{:else}
ログイン
{/if}
