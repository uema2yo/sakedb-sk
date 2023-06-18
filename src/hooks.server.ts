import * as admin from "firebase-admin";
import serviceAccount from "../sake-db-firebase-adminsdk.json" assert { type: "json" };

let isInitialized = false;

if (!isInitialized) {
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
		databaseURL: "https://sake-db.firebaseio.com"
	});
	isInitialized = true;
}
