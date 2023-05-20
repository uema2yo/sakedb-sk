import pkg from 'firebase-admin';
const { initializeApp, credential: _credential } = pkg;
import serviceAccount from "./sake-db-firebase-adminsdk.json" assert { type: 'json' };

initializeApp({
  credential: _credential.cert(serviceAccount),
  databaseURL: "https://sake-db.firebaseio.com"
});

