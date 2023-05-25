<script lang="ts">
	import { signOut } from "firebase/auth";
	import { auth } from "$lib/firebase/init";
	import { goto } from "$app/navigation";

	const logout = async () => {
		try {
			await signOut(auth);
			goto("/login");
		} catch (error) {
			console.error("Error signing out", error);
		}
	};
</script>

<button on:click={logout}>Logout</button>
