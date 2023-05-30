<script>
	import { onMount } from "svelte";
	import { saveUserProfile, getUserProfile } from "$lib/firebase/userProfile";
	import Checkbox from "$components/Forms/Elements/Checkbox.svelte";
	import Submit from "$components/Forms/Elements/Submit.svelte";
	

	let userId;
	let name = "";
	let birthdate = "";
	let gender = "";
	let introduction = "";



</script>

<form>
	<article>
		<h2>{name} さんのプロフィール</h2>
		<section>
			<Checkbox checked />
			<h3>名前</h3>
			<p>{name}</p>
		</section>
	</article>
	<Submit text="登録する" />
</form>
