"use client"; // Mark this as a Client Component

import { useConversationContext } from "@/context/ConversationContext";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/solid"; // Chat icon

export default function NewChatButton() {
  const { setSelectedConversation } = useConversationContext()!;

  return (
    <div>
      <button
        onClick={() => setSelectedConversation(null)}
        className="flex items-center gap-2 rounded-full bg-red-400 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500 mb-4"
      >
        <ChatBubbleLeftIcon className="h-5 w-5" />
        <span>New Chat</span>
      </button>
    </div>
  );
}
