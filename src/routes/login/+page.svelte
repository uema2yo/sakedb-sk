<script>
  import Login from "../../components/Forms/Login.svelte";
</script>

<Login />

<!--
	<script lang="ts">
	import { signInWithEmailAndPassword } from 'firebase/auth';
	import { auth } from "$lib/firebase/init";

	let email = "";
	let password = "";

	const login = async () => {
		try {
			await signInWithEmailAndPassword(auth, email, password);
			goto("/mypage")
		} catch (error) {
			console.error('Error signing in', error);
		}
	};
</script>

<input type="email" bind:value={email} placeholder="Email" />
<input type="password" bind:value={password} placeholder="Password" />
<button on:click={login}>Login</button>
-->
