<script>
	import { onMount } from "svelte";
	import { browser } from "$app/environment";
	import { getAuth } from "firebase/auth";
	import { auth } from "$lib/firebase/init";
	import { user } from "$lib/sveltefire";
	import { emailVerified } from "$lib/store";
	import Login from "$components/Forms/Login.svelte";
	import Logout from "$components/Forms/Logout.svelte";
	import Register from "$components/Forms/Register.svelte";

	if (browser) {
		const auth = getAuth();
		onMount(async () => {
			if (auth.currentUser) {
				await auth.currentUser.reload();
				emailVerified.set(auth.currentUser.emailVerified);
			}
		});
	}
</script>

{#if $emailVerified}
	<Logout />
{:else }
	<Register />
{/if}
