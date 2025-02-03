import { adminDb } from "@/lib/firebase-admin";

export async function GET(request) {
  const uid = request.nextUrl.searchParams.get("uid");
  if (!uid) {
    return new Response(
      JSON.stringify({ success: false, error: "User ID (uid) is required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const conversations = [];
  try {
    // Get the sorted reference of the conversations in descending order
    const conversationsRef = adminDb
      .collection("users")
      .doc(uid)
      .collection("conversations")
      .orderBy("updatedAt", "desc");

    // Fetch documents from the collection
    const snapshot = await conversationsRef.get();

    // If conversations exist, process them
    snapshot.forEach((doc) => {
      conversations.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return new Response(
      JSON.stringify({ success: true, conversations: conversations }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching conversations in backend:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to fetch conversations",
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
    const conversationsRef = adminDb
      .collection("users")
      .doc(uid)
      .collection("conversations");

    // Create a new conversation document
    const newConversationRef = conversationsRef.doc(); // Auto-generate a document ID
    const conversationId = newConversationRef.id; // Get the auto-generated ID

    // Create the initial message object
    const initialMessage = {
      role: message.role, // Assuming the message is from the user
      content: message.content,
      timestamp: new Date().toISOString(), // Add a timestamp
    };

    // Add the initial message to the messages subcollection of the new conversation
    await newConversationRef.collection("messages").doc().set(initialMessage);

    // Set the conversation metadata (e.g., title, creation date, etc.)
    await newConversationRef.set({
      id: conversationId, // Include the conversation ID in the document
      title: "New Chat", // Example title
      createdAt: new Date().toISOString(), // Add a creation timestamp
      updatedAt: new Date().toISOString(), // Add an update timestamp
    });

    // Fetch the newly created conversation document
    const newConversationDoc = await newConversationRef.get();
    const newConversationData = newConversationDoc.data();

    // Fetch the initial message from the messages subcollection
    const messagesSnapshot = await newConversationRef
      .collection("messages")
      .get();
    const messages = messagesSnapshot.docs.map((doc) => doc.data());

    // Combine conversation metadata with its messages
    const newConversation = {
      ...newConversationData,
      messages: messages,
    };

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
    const conversationRef = adminDb
      .collection("users")
      .doc(uid)
      .collection("conversations")
      .doc(cid);

    // Update the conversation with the provided attributes
    await conversationRef.update({
      ...attributes,
      updatedAt: new Date().toISOString(),
    });

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

export async function DELETE(request) {
  const params = await request.json();
  const uid = params.uid;
  const cid = params.cid;

  if (!uid | !cid) {
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
    // Check if the user already exists in Firestore
    const conversationRef = adminDb
      .collection("users")
      .doc(uid)
      .collection("conversations")
      .doc(cid);

    // delete the conversation with the provided attributes
    await conversationRef.delete();

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
