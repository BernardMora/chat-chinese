import { UserMessageComponent } from "./UserMessageComponent";
import { BotMessage } from "./BotMessage";
import { useEffect, useRef } from "react";
import { useConversationContext } from "@/context/ConversationContext";
import { AssistantMessage, Message, UserMessage } from "@/data/types";

export function Chat({ loading }: { loading: boolean }) {
  const { selectedConversation } = useConversationContext()!;
  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref for the messages container

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedConversation!.messages]); // Trigger when messages change

  return (
    <div className="flex-1 p-4 relative">
      {/* Conversation Name */}
      <div className="sticky pt-8 top-0 bg-white">
        <h1 className="text-center text-2xl font-bold">
          {selectedConversation!.title}
        </h1>
      </div>

      {/* Gradient Overlay (Below Conversation Name) */}
      <div className="sticky top-[calc(3rem+1rem)] h-8 bg-gradient-to-b from-white to-transparent"></div>

      {/* Messages Container */}
      <div className="space-y-4 overflow-y-auto">
        {selectedConversation!.messages &&
          selectedConversation!.messages.map(
            (message: Message, index: number) =>
              message.role === "assistant" ? (
                <BotMessage key={index} message={message as AssistantMessage} />
              ) : message.role === "user" ? (
                <UserMessageComponent
                  key={index}
                  message={message as UserMessage}
                />
              ) : (
                <div key={index}></div>
              )
          )}
        {loading && <BotMessage message={null} />}
        {/* Empty div to act as the scroll target */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
