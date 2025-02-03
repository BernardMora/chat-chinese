import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "@/serviceAccountKey.json";

// Initialize the Firebase Admin SDK
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

// Get Firestore instance
const adminDb = getFirestore();

export { adminDb };
