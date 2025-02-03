import { Chat } from "./Chat";
import { MessageInput } from "./MessageInput";
import { useState } from "react";
import Image from "next/image";
import { useConversationContext } from "@/context/ConversationContext";
import { ResponseContextProvider } from "@/context/ResponseContext";

export function MainChat() {
  const { selectedConversation } = useConversationContext() ?? {};

  const [loading, setLoading] = useState(false);

  return (
    <div className="flex-1 flex flex-col justify-center items-center w-2/4 mx-auto">
      {selectedConversation !== null ? (
        <>
          <Chat loading={loading} />

          <ResponseContextProvider>
            <MessageInput setLoading={setLoading} />
          </ResponseContextProvider>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1">
          <div className="flex flex-row items-center justify-center">
            <Image
              src="/panda_logo_processed.png"
              alt="Logo"
              width={300}
              height={300}
              className="w-[250px] h-[200px] mb-4"
            />
            <div>
              <h1 className="text-3xl mb-4">Welcome to ChatChinese!</h1>
              <p className="text-md">
                Type anything in English and I will comprehensively translate it
                to Chinese for you!
              </p>
            </div>
          </div>
          <ResponseContextProvider>
            <MessageInput setLoading={setLoading} />
          </ResponseContextProvider>
        </div>
      )}
    </div>
  );
}
