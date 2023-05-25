import { auth, db } from "$lib/firebase/init";
import { onAuthStateChanged } from "firebase/auth";
import type { Unsubscribe } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export const loginInfo: { login: boolean; name: string; admin: boolean } = {
	login: false,
	name: "",
	admin: false
};

export function checkLogin(): Promise<void> {
	return new Promise((resolve, reject) => {
		if (typeof window !== "undefined") {
			const unsubscribe: Unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
				try {
					if (firebaseUser) {
						const userDoc = doc(db, "m_user", firebaseUser.uid);
						const userSnap = await getDoc(userDoc);
						loginInfo.login = userSnap.exists();
						loginInfo.admin = userSnap.exists() && Boolean(userSnap.data()?.admin);
					}
					unsubscribe();
					resolve();
				} catch (error) {
					unsubscribe();
					reject(error);
				}
			});
		} else {
			reject(new Error("window is undefined"));
		}
	});
}
