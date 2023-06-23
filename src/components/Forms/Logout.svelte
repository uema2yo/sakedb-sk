<script lang="ts">
	import { signOut } from "firebase/auth";
	import { auth } from "$lib/firebase/init";
	import { goto } from "$app/navigation";
	import { addDocument } from "$lib/firebase/addDocument";

	const logout = async () => {
		try {
			//await addDocument("m_user_status", { value: 0 });
			await signOut(auth);
			goto("/login");
		} catch (error) {
			console.error("ログアウトに失敗しました。", error);
		}
	};
</script>

<button on:click={logout}>Logout</button>
