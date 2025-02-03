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
    const userRef = adminDb.collection("users").doc(uid);
    const userSnapshot = await userRef.get();

    // Extract user data from the snapshot
    const user = userSnapshot.data();

    return new Response(JSON.stringify({ success: true, user: user }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating user in backend:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to update user",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function POST(request) {
  const uid = request.nextUrl.searchParams.get("uid");
  const email = request.nextUrl.searchParams.get("email");

  if (!uid || !email) {
    return new Response(
      JSON.stringify({ success: false, error: "UID and email are required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    // Check if the user already exists in Firestore
    const userDocRef = adminDb.collection("users").doc(uid);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      // If the user doesn't exist, create a new record in Firestore
      try {
        // Create user preferences document in Firestore
        const userPreferences = {
          playbackSpeed: 1.0,
        };

        // Use the Admin SDK's `set` method to create the document
        await userDocRef.set({
          email: email,
          createdAt: new Date(),
          preferences: userPreferences,
        });
      } catch (error) {
        console.error("Error adding user to Firestore: ", error);
      }
    }

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

export async function PUT(request) {
  const params = await request.json();
  const uid = params.uid;
  const attributes = params.attributes;

  if (!uid | !attributes) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "User ID (uid) and attributes are required",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    // Check if the user already exists in Firestore
    const userRef = adminDb.collection("users").doc(uid);

    // Update the conversation with the provided attributes
    await userRef.update(attributes);

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating user in backend:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to update user",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
