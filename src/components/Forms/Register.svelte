<script lang="ts">
	import { createUser } from "$lib/firebase/createUser";
	import Login from "$components/Forms/Login.svelte";

	let email = "";
	let password = "";
	let response = null;

	async function register() {
		response = await createUser(email, password);
	}
</script>

{#if response && response.status === 200}
	<p>{email} に認証メールを送信しました。</p>
	<p>メール本文に記載してある認証リンクにアクセスするとユーザー登録が完了します。</p>
{:else}
	<Login />
	<form on:submit={register}>
		<input type="email" bind:value={email} placeholder="E メール" />
		<input type="password" bind:value={password} placeholder="パスワード" />
		<button on:click={register}>Register</button>
	</form>
{/if}
