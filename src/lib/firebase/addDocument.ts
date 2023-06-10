import { db } from "$lib/firebase/init";
import { collection, addDoc } from "firebase/firestore";
import { checkLogin, login } from "$lib/checkLogin";

export async function setDocument(
	collection_name: string,
	document: Record<string, unknown>
) {
	try {
		await checkLogin();
		const uid = login.uid;
		const timestamp = new Date().getTime();
		document["timestamp"] = timestamp;
		document["uid"] = uid;
		await addDoc(collection(db, collection_name), document);
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
					message: "An unknown error occurred"
				}
			};
		}
	}
}
