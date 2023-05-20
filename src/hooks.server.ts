import admin from "firebase-admin";
import serviceAccount from "../sake-db-firebase-adminsdk.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sake-db.firebaseio.com"
});
