import { collection, addDoc, query, orderBy, limit, getDocs } from "firebase/firestore"; 
import { db } from "$lib/firebase/init";

export async function saveUserProfile(userId:string, profile:[]) {
  const userCollection = collection(db, `users/${userId}/profiles`);
  
  try {
    await addDoc(userCollection, { ...profile, timestamp: new Date() });
  } catch (e) {
    console.error("Error saving user profile: ", e);
  }
}

export async function getUserProfile(userId:string) {
  const userCollection = collection(db, `users/${userId}/profiles`);
  const q = query(userCollection, orderBy('timestamp', 'desc'), limit(1));
  
  try {
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data();
    } else {
      console.log("No such document!");
    }
  } catch (e) {
    console.error("Error getting document: ", e);
  }
}
