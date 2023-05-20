<script lang="ts">
  import { signOut } from "firebase/auth";
  import { auth } from "$lib/firebase/init";
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	const redirectPath = $page.url.pathname === "/login" ? "/mypage" : $page.url.pathname;

  const logout = async () => {
    try {
      await signOut(auth);
      goto(redirectPath);
    } catch (error) {
      console.error('Error signing out', error);
    }
  };
</script>

<button on:click={logout}>Logout</button>
