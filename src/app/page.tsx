"use client";

import { HomePageContent } from "@/ui/HomePageContent";
import { ConversationContextProvider } from "@/context/ConversationContext";
import { UserContextProvider } from "@/context/UserContext";
import { MessageContextProvider } from "@/context/MessageContext";
import { VocabularyContextProvider } from "@/context/VocabularyContext";

export default function Home() {
  return (
    <UserContextProvider>
      <ConversationContextProvider>
        <MessageContextProvider>
          <VocabularyContextProvider>
            <HomePageContent />
          </VocabularyContextProvider>
        </MessageContextProvider>
      </ConversationContextProvider>
    </UserContextProvider>
  );
}
