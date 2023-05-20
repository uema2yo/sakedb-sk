<script lang="ts">
  import { createUser } from '$lib/firebase/auth'
  
  let email = ''
  let password = ''
  
  async function register() {
      await createUser(email, password)
  }
</script>
  
<input type="email" bind:value={email} placeholder="Email" />
<input type="password" bind:value={password} placeholder="Password" />
<button on:click={register}>Register</button>
  