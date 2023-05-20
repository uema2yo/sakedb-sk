<script lang="ts">
	import { signInWithEmailAndPassword } from "firebase/auth";
	import { auth } from "$lib/firebase/init";
  import { page } from "$app/stores";
	import { goto } from '$app/navigation';

	let email = "";
	let password = "";
	const login = async () => {
    const redirectPath = $page.url.pathname === "/login" ? "/mypage" : $page.url.pathname;
		try {
			await signInWithEmailAndPassword(auth, email, password);
      goto(redirectPath);
    } catch (error) {
			console.error('Error signing in', error);
		}
	};
</script>
<form on:submit={login}>
  <input type="email" bind:value={email} placeholder="Email" />
  <input type="password" bind:value={password} placeholder="Password" />
  <button on:click={login}>Login</button>
</form>
