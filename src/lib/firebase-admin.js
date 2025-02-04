import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import dotenv from "dotenv";

dotenv.config();

// Get the Base64-encoded environment variable
const firebaseServiceAccountBase64 =
  process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;

// Decode the Base64 string
const firebaseServiceAccountStr = Buffer.from(
  firebaseServiceAccountBase64,
  "base64"
).toString("utf-8");

// Parse the JSON string
let firebaseServiceAccount;
try {
  firebaseServiceAccount = JSON.parse(firebaseServiceAccountStr);
} catch (error) {
  console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT:", error);
  throw new Error("Invalid FIREBASE_SERVICE_ACCOUNT format");
}

// Initialize the Firebase Admin SDK
if (!getApps().length) {
  initializeApp({
    credential: cert(firebaseServiceAccount),
  });
}

// Get Firestore instance
const adminDb = getFirestore();

export { adminDb };
