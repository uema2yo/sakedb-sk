import { SITE_URL } from "../../constants";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth"
import type { ActionCodeSettings } from "firebase/auth"
import { auth } from "$lib/firebase/init"

export async function createUser(email: string, password: string): Promise<void> {
  const currentPath = window.location.pathname;
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    if (user) {
      const target_page = currentPath !== "/register" ? currentPath : "/mypage";
      const actionCodeSettings: ActionCodeSettings = {
        url: SITE_URL + target_page,
        handleCodeInApp: false,
      };
      await sendEmailVerification(user, actionCodeSettings)
    }
  } catch (error) {
    console.error('Error creating user: ', error)
  }
}
