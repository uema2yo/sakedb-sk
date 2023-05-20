import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from './init'

export async function createUser(email: string, password: string): Promise<void> {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        // signed in 
        const user = userCredential.user
        console.log('User created: ', user)
    } catch (error) {
        console.error('Error creating user: ', error)
    }
}
