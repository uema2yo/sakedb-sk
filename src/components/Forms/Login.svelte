<script lang="ts">
	import {
		onAuthStateChanged,
		setPersistence,
		signInWithEmailAndPassword,
		browserSessionPersistence,
		getAuth
	} from "firebase/auth";
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";
	import { writable } from "svelte/store";
	import { addDocument } from "$lib/firebase/addDocument";

	let email = "";
	let password = "";

	const auth = getAuth();
	const isLoggedIn = writable(false);
	const redirectPath = $page.url.pathname === "/login" ? "/mypage" : $page.url.pathname;

	onAuthStateChanged(auth, (user) => {
		if (user) {
			isLoggedIn.set(true);
		} else {
			isLoggedIn.set(false);
		}
	});

	const login = () => {
		event.preventDefault();
		setPersistence(auth, browserSessionPersistence)
			.then(() => {
				return signInWithEmailAndPassword(auth, email, password);
			})
			.then(() => {
				goto(redirectPath);
			})
			.catch((error) => {
				console.error("Error signing in", error);
			});
	};

	const handleRedirect = (isLoggedIn, currentPath) => {
		if (!isLoggedIn) {
			return;
		}
		const redirectPath = currentPath === "/login" ? "/mypage" : currentPath;
		goto(redirectPath);
	};

	$: handleRedirect($isLoggedIn, $page.url.pathname);
</script>

<form on:submit|preventDefault={login}>
	<input type="email" bind:value={email} placeholder="Email" />
	<input type="password" bind:value={password} placeholder="Password" />
	<button on:click={login}>Login</button>
</form>
