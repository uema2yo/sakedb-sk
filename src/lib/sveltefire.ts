import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import { auth } from './firebase/init';
import type { User } from 'firebase/auth';

const user: Writable<User | null> = writable(null);

auth.onAuthStateChanged((firebaseUser: User | null) => {
    user.set(firebaseUser);
});

export { user };
