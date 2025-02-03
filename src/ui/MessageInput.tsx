import { useState } from "react";
import { Message } from "@/data/Message";
import { FaTachometerAlt } from "react-icons/fa";
import { useConversationContext } from "@/context/ConversationContext";
import { useAuth } from "@/hooks/useAuth";
import { useResponseContext } from "@/context/ResponseContext";
import { ChangePlaybackSpeed } from "./ChangePlaybackSpeed";
import { Vocabulary } from "./Vocabulary";
import { Information } from "./Information";

export function MessageInput({
  setLoading,
}: {
  setLoading: (loading: boolean) => void;
}) {
  const { uid } = useAuth();
  const {
    selectedConversation,
    setSelectedConversation,
    setConversations,
    createConversation,
    createMessageInConversation,
  } = useConversationContext();
  const { fetchResponse } = useResponseContext();

  const [stateMessage, setStateMessage] = useState("");
  const [showPlaybackSpeed, setShowPlaybackSpeed] = useState(false);
  const [showVocabulary, setShowVocabulary] = useState(false);
  const [showInformation, setShowInformation] = useState(false);

  // Calculate the number of rows based on the message length
  const calculateRows = (text: string) => {
    const lineCount = (text.match(/\n/g) || []).length + 1; // Count lines
    return Math.min(Math.max(lineCount, 1), 12); // Clamp between 1 and 3 rows
  };

  const sendMessageToConversation = async (
    conversation: any,
    newMessage: Message
  ): Promise<any> => {
    // Create a new message in the conversation
    let newConversation = await createMessageInConversation(
      uid,
      conversation.id,
      newMessage
    );
    // Update the selectedConversation
    setSelectedConversation(newConversation);
    return newConversation;
  };

  const createConversationWithMessage = async (newMessage: Message) => {
    if (uid === null) {
      console.error("User not authenticated");
      return null;
    }

    const newConversation = await createConversation(uid, newMessage);
    setConversations((prev) => [...prev, newConversation]);

    if (newConversation) {
      setSelectedConversation(newConversation);
      return newConversation;
    }

    return null;
  };

  const sendUserMessageToDB = async (message: string): Promise<any> => {
    if (!message.trim()) return null;

    let conversation = selectedConversation;

    if (conversation === null) {
      conversation = await createConversationWithMessage({
        role: "user",
        content: message,
      });
      if (!conversation) return null; // If failed to create conversation, exit
    } else {
      conversation = await sendMessageToConversation(conversation, {
        role: "user",
        content: message,
      });
    }

    setStateMessage("");
    setLoading(true);
    return conversation;
  };

  const sendFullMessage = async (message: string) => {
    let conversation = await sendUserMessageToDB(message);
    if (!conversation) return;

    const data = await fetchResponse(message);
    if (data === null) return;

    conversation = await sendMessageToConversation(conversation, data);
    setLoading(false);
  };

  const handleShowPlaybackSpeed = () => {
    setShowPlaybackSpeed(!showPlaybackSpeed);
  };

  const handleShowVocabulary = () => {
    setShowVocabulary(!showVocabulary);
  };

  const handleShowInformation = () => {
    setShowInformation(!showInformation);
  };

  return (
    <div className="w-full bg-white sticky bottom-0 items-center">
      <div
        className="bg-gray-300 p-4 rounded-lg transition-all duration-200"
        style={{
          minHeight: "4rem", // Initial small height
          height: "auto", // Allow height to grow
        }}
      >
        <textarea
          placeholder="Write your message"
          value={stateMessage}
          onChange={(e) => setStateMessage(e.target.value)}
          className="w-full p-2 bg-transparent resize-none placeholder-black text-black focus:outline-none text-base overflow-y-auto"
          rows={calculateRows(stateMessage)} // Dynamic rows based on message length
          style={{
            scrollbarColor: "rgba(0, 0, 0, 0.3) transparent",
          }}
        />

        {/* Buttons */}
        <div className="mt-4 grid grid-cols-12 gap-4">
          <button
            className="col-start-1 col-end-1 p-2 rounded-full bg-red-400 text-white hover:bg-red-500 transition-colors"
            onClick={handleShowInformation}
          >
            ?
          </button>
          <button
            className="col-start-2 col-end-4 p-2 rounded-full bg-red-400 text-white hover:bg-red-500 transition-colors"
            onClick={handleShowVocabulary}
          >
            Vocabulary
          </button>
          <button
            className="col-start-4 col-end-4 p-2 rounded-full bg-red-400 text-white hover:bg-red-500 transition-colors flex items-center justify-center"
            onClick={handleShowPlaybackSpeed}
          >
            <FaTachometerAlt />
          </button>
          <button
            className="col-start-11 col-end-13 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
            onClick={() => {
              sendFullMessage(stateMessage);
            }}
          >
            Send
          </button>
        </div>
      </div>
      {/* Footer */}
      <div className="mt-2 text-center text-gray-400">
        <p>AI-generated, for reference only</p>
      </div>
      {showPlaybackSpeed && (
        <ChangePlaybackSpeed
          handleShowPlaybackSpeed={handleShowPlaybackSpeed}
        />
      )}
      {showVocabulary && <Vocabulary onClose={handleShowVocabulary} />}
      {showInformation && <Information onClose={handleShowInformation} />}{" "}
    </div>
  );
}
