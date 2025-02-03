import { adminDb } from "@/lib/firebase-admin";

export async function GET(request) {
  const uid = request.nextUrl.searchParams.get("uid");
  const cid = request.nextUrl.searchParams.get("cid");

  if (!uid || !cid) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "User ID (uid) and Conversation ID (cid) are required",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const conversationRef = adminDb
      .collection("users")
      .doc(uid)
      .collection("conversations")
      .doc(cid);

    // Fetch the conversation document
    const conversationDoc = await conversationRef.get();
    if (!conversationDoc.exists) {
      return new Response(
        JSON.stringify({ success: false, error: "Conversation not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const conversationData = {
      id: conversationDoc.id,
      ...conversationDoc.data(),
    };

    // Fetch messages associated with the conversation
    const messagesRef = conversationRef
      .collection("messages")
      .orderBy("timestamp", "asc");
    const messagesSnapshot = await messagesRef.get();

    const messages = messagesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Return conversation data along with messages
    return new Response(
      JSON.stringify({
        success: true,
        conversation: { ...conversationData, messages },
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching conversation and messages:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to fetch conversation and messages",
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
  const cid = params.cid;
  const message = params.message;

  if (!uid || !message) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "User ID (uid) and message are required",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    // Reference to the user's conversations subcollection
    const conversationRef = adminDb
      .collection("users")
      .doc(uid)
      .collection("conversations")
      .doc(cid);

    // Create a new conversation document
    const newMessageRef = conversationRef.collection("messages").doc(); // Auto-generate a document ID

    // Set the conversation metadata (e.g., title, creation date, etc.)
    await newMessageRef.set({
      content: message.content,
      role: message.role,
      timestamp: new Date().toISOString(),
    });

    // update the conversation updatedAt field
    await conversationRef.update({
      updatedAt: new Date().toISOString(),
    });

    // Combine conversation metadata with the new message
    const newMessage = newMessageRef.get();

    // Fetch messages associated with the conversation
    const messagesRef = conversationRef
      .collection("messages")
      .orderBy("timestamp", "asc");
    const messagesSnapshot = await messagesRef.get();

    const messages = messagesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Retrieve the conversation document
    const newConversationSnapshot = await conversationRef.get();
    let newConversation = newConversationSnapshot.data();
    newConversation.messages = messages;

    // Combine conversation metadata with the new message
    newConversation.messages = [...newConversation.messages, newMessage];

    return new Response(
      JSON.stringify({
        success: true,
        conversation: newConversation,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error creating conversation in backend:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to create conversation",
      }),
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
  const cid = params.cid;
  const mid = params.mid;

  const attributes = params.attributes;

  if (!uid | !attributes | !cid) {
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
    const messageRef = adminDb
      .collection("users")
      .doc(uid)
      .collection("conversations")
      .doc(cid)
      .collection("messages")
      .doc(mid);

    // Update the conversation with the provided attributes
    await messageRef.update(attributes);

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating conversation in backend:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to update conversation",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
