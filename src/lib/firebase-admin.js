import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import dotenv from "dotenv";

dotenv.config();

// Now parse the JSON string into an object
let firebaseServiceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
firebaseServiceAccount["private_key"] = firebaseServiceAccount[
  "private_key"
].replaceAll("{code}", "\n");

// Initialize the Firebase Admin SDK
if (!getApps().length) {
  initializeApp({
    credential: cert(firebaseServiceAccount),
  });
}

// Get Firestore instance
const adminDb = getFirestore();

export { adminDb };
