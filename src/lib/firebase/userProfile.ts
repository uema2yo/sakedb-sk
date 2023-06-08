import { getAuth, onAuthStateChanged } from "firebase/auth";
import type { Unsubscribe } from "firebase/auth";
import { collection, query, where, orderBy, limit, getDocs, addDoc } from "firebase/firestore";
import { db } from "$lib/firebase/init";

interface Profile {
	id?: string;
	name?: string;
}

export const profile: Profile = {};

export async function saveUserProfile(userId: string, profile: []) {
	const userCollection = collection(db, `users/${userId}/profiles`);

	try {
		await addDoc(userCollection, { ...profile, timestamp: new Date() });
	} catch (e) {
		console.error("Error saving user profile: ", e);
	}
}

export function getUserProfile(): Promise<void> {
	if (typeof window === "undefined") {
		return Promise.reject(new Error("window is undefined"));
	}

	return new Promise<void>((resolve, reject) => {
		const auth = getAuth();
		const unsubscribe: Unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
			if (!firebaseUser) {
				unsubscribe();
				resolve();
				return;
			}

			try {
				const uid = firebaseUser.uid;
				const collections = ["b_user_id", "b_user_name"];
				const docs = await Promise.all(
					collections.map(async (col) => {
						try {
							const collectionRef = collection(db, col);
							const q = query(
								collectionRef,
								where("uid", "==", uid),
								orderBy("timestamp", "desc"),
								limit(1)
							);
							const querySnapshot = await getDocs(q);
							return querySnapshot.docs.length > 0 ? querySnapshot.docs[0] : null;
						} catch (error) {
							console.error(`Error getting document from ${col}: `, error);
							return null;
						}
					})
				);

				profile.id = docs[0] ? docs[0].data().id : null;
				profile.name = docs[1] ? docs[1].data().email : null;

				console.log("profile", profile);

				unsubscribe();
				resolve();
			} catch (error) {
				unsubscribe();
				reject(error);
			}
		});
	});
}