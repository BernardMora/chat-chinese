import { adminDb } from "@/lib/firebase-admin";

export async function GET(request) {
  const uid = request.nextUrl.searchParams.get("uid");

  if (!uid) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "User ID (uid) is required",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    // Check if the user exists in Firestore
    const vocabularyRef = adminDb.collection("vocabulary").doc(uid);
    const vocabularySnapshot = await vocabularyRef.get();
    const vocabulary = vocabularySnapshot.data();

    return new Response(
      JSON.stringify({ success: true, vocabulary: vocabulary }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error getting vocabulary in backend:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to get vocabulary user",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function POST(request) {
  const params = await request.json();
  const uid = params.uid;
  const word = params.word;

  if (!uid) {
    return new Response(
      JSON.stringify({ success: false, error: "UID is required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const userRef = adminDb.collection("vocabulary").doc(uid);
    await userRef.set({ [word.hanzi]: word }, { merge: true });

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating the user in backend:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Failed to create user" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
