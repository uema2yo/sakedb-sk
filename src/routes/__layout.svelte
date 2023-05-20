<script>
  import { onMount } from "svelte";
  import { auth } from "$lib/firebase/init";
  import { user } from "$lib/sveltefire";
  import { goto } from '$app/navigation';

  let currentPath;

  onMount(() => {
    $page.subscribe((value) => {
      currentPath = value.path;
    });

    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      user.set(firebaseUser);
    });
    return () => {
      unsubscribe();
    };
  });

</script>
