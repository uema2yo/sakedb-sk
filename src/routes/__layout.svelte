<script>
  import { onMount } from "svelte";
  // @ts-ignore
  import { auth } from "$lib/firebase/init";
  // @ts-ignore
  import { user } from "$lib/sveltefirefire";

  onMount(() => {
    // @ts-ignore
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      user.set(firebaseUser);
    });

    return () => {
      unsubscribe();
    };
  });
</script>

<slot />
