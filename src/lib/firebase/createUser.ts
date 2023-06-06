import { SITE_URL } from '../../constants';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import type { ActionCodeSettings } from 'firebase/auth';
import { auth, db } from '$lib/firebase/init';
import { doc, setDoc } from 'firebase/firestore';

export async function createUser(
	id: string,
	email: string,
	password: string
): Promise<{ status: number; body: { message: string } }> {
	const currentPath = window.location.pathname;
	const timestamp = new Date().getTime();
	try {
		const userCredential = await createUserWithEmailAndPassword(auth, email, password);
		const user = userCredential.user;
		if (user) {
			const target_page = currentPath !== "/register" ? currentPath : "/mypage";
			const actionCodeSettings: ActionCodeSettings = {
				url: SITE_URL + target_page,
				handleCodeInApp: false
			};
			await sendEmailVerification(user, actionCodeSettings);
			await setDoc(doc(db, "m_user", user.uid), {
				uid: user.uid,
				timestamp: timestamp
			});
			await setDoc(doc(db, 'b_user_id', user.uid), {
				uid: user.uid,
				id: id,
				timestamp: timestamp
			});
			await setDoc(doc(db, 'b_user_email', user.uid), {
				uid: user.uid,
				email: email,
				timestamp: timestamp
			});
			await setDoc(doc(db, 'b_user_status', user.uid), {
				uid: user.uid,
				status: 1,
				timestamp: timestamp
			});
		}
		return {
			status: 200,
			body: {
				message: 'Signup successful'
			}
		};
	} catch (error: unknown) {
		if (error instanceof Error) {
			return {
				status: 500,
				body: {
					message: error.message
				}
			};
		} else {
			return {
				status: 500,
				body: {
					message: 'An unknown error occurred'
				}
			};
		}
	}
}
