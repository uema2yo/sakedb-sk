<script>
  import Login from "$components/Forms/Login.svelte";
  import Logout from "$components/Forms/Logout.svelte";
  import { user } from "$lib/sveltefire";
  import { auth } from '$lib/firebase/init';
	import { page } from '$app/stores';

  auth.onAuthStateChanged((firebaseUser) => {
    console.log(firebaseUser);
    if (firebaseUser) {
    }
  });
</script>

{#if $user}
<Logout />
{:else}
<Login />
{/if}
