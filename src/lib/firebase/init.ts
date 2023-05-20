import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

const firebaseConfig: FirebaseConfig = {
  apiKey: "AIzaSyC1REqEI0C1T5ioNavnSiKDI0NI_0p9Ywo",
  authDomain: "sake-db.firebaseapp.com",
  databaseURL: "https://sake-db.firebaseio.com",
  projectId: "sake-db",
  storageBucket: "sake-db.appspot.com",
  messagingSenderId: "640593644978",
  appId: "1:640593644978:web:cd2ad357719f6207eba8ab",
  measurementId: "G-EKS8CDL35L"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
