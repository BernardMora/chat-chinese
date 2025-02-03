"use client";

import { useAuth } from "@/hooks/useAuth";
import { MainChat } from "@/ui/MainChat";
import { Navbar } from "@/ui/Navbar";
import { useEffect } from "react";
import { useConversationContext } from "@/context/ConversationContext";
import { useVocabularyContext } from "@/context/VocabularyContext";

export function HomePageContent() {
  const { user, uid } = useAuth();
  const {
    setSelectedConversation,
    setConversations,
    getConversations,
    getConversationWithMessages,
  } = useConversationContext();
  const { fetchVocabulary } = useVocabularyContext();

  // We always call the useEffect here regardless of user state
  useEffect(() => {
    if (uid) {
      getConversations(uid).then((conversations) => {
        if (!conversations) return;
        setConversations(conversations);

        if (conversations.length > 0) {
          getConversationWithMessages(uid, conversations[0].id).then(
            (conversationWithMessages) => {
              setSelectedConversation(conversationWithMessages);
            }
          );
          fetchVocabulary(uid);
        } else {
          setSelectedConversation(null);
        }
      });
    }
  }, [user]); // Only re-run effect when user changes

  if (!user) {
    return <div>Loading...</div>; // You could show a loading state instead of null
  }

  return (
    <div className="font-sans flex min-h-screen bg-white text-black">
      <Navbar />
      <div className="flex-1 flex flex-col">
        <MainChat />
      </div>
    </div>
  );
}
