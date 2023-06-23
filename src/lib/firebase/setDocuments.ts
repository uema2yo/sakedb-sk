import { collection, writeBatch, doc } from "firebase/firestore";
import { db } from "$lib/firebase/init";

export async function setDocuments(
	collection_name: string,
	documents: { name: string; value: string | number | boolean }[]
) {
	const batch = writeBatch(db);
	const collectionRef = collection(db, collection_name);
	documents.forEach((document) => {
		const docRef = doc(collectionRef);
		batch.set(docRef, document);
	});
  await batch.commit();
}
