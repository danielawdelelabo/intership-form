import * as admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json";

let firebaseAdmin: admin.app.App;

if (admin.apps.length === 0) {
  firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
} else {
  firebaseAdmin = admin.app(); 
}

export default firebaseAdmin;