<script>
  import Login from "$components/Forms/Login.svelte";
  import Logout from "$components/Forms/Logout.svelte";
  import Register from "$components/Forms/Register.svelte";
  import { user } from "$lib/sveltefire";
</script>

{#if $user}
<Logout />
{:else}
<Login />
<Register />
{/if}
