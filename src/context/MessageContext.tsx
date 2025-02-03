"use client";

import { createContext, ReactNode, useContext } from "react";

interface MessageContextType {
  getMessages: (uid: string) => Promise<object | null>;
  updateMessage: (
    uid: string,
    cid: string,
    mid: string,
    attributes: object
  ) => Promise<object | null>;
}

interface MessageContextProviderProps {
  children: ReactNode;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const useMessageContext = () => useContext(MessageContext);

export const MessageContextProvider = ({
  children,
}: MessageContextProviderProps) => {
  const getMessages = async (uid: string) => {
    try {
      const response = await fetch(`/api/firestore/conversations?uid=${uid}`, {
        method: "GET",
      });
      const data = await response.json();
      if (data.success) {
        return data.conversations;
      } else {
        console.error(data.error);
        return null;
      }
    } catch (error) {
      console.error("Error fetching data from backend:", error);
      return null;
    }
  };

  const updateMessage = async (
    uid: string,
    cid: string,
    mid: string,
    attributes: object
  ) => {
    try {
      const response = await fetch(`/api/firestore/conversations/messages`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: uid,
          cid: cid,
          mid: mid,
          attributes: attributes,
        }),
      });
      const data = await response.json();
      if (data.success) {
        return data.conversation;
      } else {
        console.error("Error updating in conversation:", data.error);
        return null;
      }
    } catch (error) {
      console.error("Error fetching the backend in updateMessage:", error);
      return null;
    }
  };

  return (
    <MessageContext.Provider
      value={{
        getMessages,
        updateMessage,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};
