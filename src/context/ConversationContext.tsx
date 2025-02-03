"use client";

import { Conversation, Message } from "@/data/types";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

interface ConversationContextType {
  conversations: Conversation[];
  setConversations: Dispatch<SetStateAction<Conversation[]>>;
  selectedConversation: Conversation | null;
  setSelectedConversation: Dispatch<SetStateAction<Conversation | null>>;
  getConversations: (uid: string) => Promise<Conversation[] | null>;
  getConversationWithMessages: (
    uid: string,
    cid: string
  ) => Promise<Conversation | null>;
  createConversation: (
    uid: string,
    message: Message
  ) => Promise<Conversation | null>;
  createMessageInConversation: (
    uid: string,
    cid: string,
    message: Message
  ) => Promise<Conversation | null>;
  updateConversation: (
    uid: string,
    cid: string,
    attributes: object
  ) => Promise<object | null>;
  deleteConversation: (uid: string, cid: string) => Promise<object | null>;
}

interface ConversationContextProviderProps {
  children: ReactNode;
}

const ConversationContext = createContext<ConversationContextType | undefined>(
  undefined
);

export const useConversationContext = () => useContext(ConversationContext);

export const ConversationContextProvider = ({
  children,
}: ConversationContextProviderProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const getConversations = async (uid: string) => {
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

  const getConversationWithMessages = async (uid: string, cid: string) => {
    try {
      const response = await fetch(
        `/api/firestore/conversations/messages?uid=${uid}&cid=${cid}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      if (data.success) {
        return data.conversation;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching data from backend:", error);
      return null;
    }
  };

  const createConversation = async (uid: string, message: Message) => {
    try {
      const response = await fetch(`/api/firestore/conversations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: uid, message: message }),
      });
      const data = await response.json();
      if (data.success) {
        return data.conversation;
      } else {
        console.error(data.error);
        return null;
      }
    } catch (error) {
      console.error("Error fetching data from backend:", error);
      return null;
    }
  };

  const createMessageInConversation = async (
    uid: string,
    cid: string,
    message: Message
  ) => {
    try {
      const response = await fetch(`/api/firestore/conversations/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: uid, cid: cid, message: message }),
      });
      const data = await response.json();
      if (data.success) {
        return data.conversation;
      } else {
        console.error("Error creating message in conversation:", data.error);
        return null;
      }
    } catch (error) {
      console.error("Error fetching data from backend:", error);
      return null;
    }
  };

  const updateConversation = async (
    uid: string,
    cid: string,
    attributes: object
  ) => {
    try {
      const response = await fetch(`/api/firestore/conversations`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: uid, cid: cid, attributes: attributes }),
      });
      const data = await response.json();
      if (data.success) {
        return data.conversation;
      } else {
        console.error("Error updating in conversation:", data.error);
        return null;
      }
    } catch (error) {
      console.error("Error fetching the backend in updateConversation:", error);
      return null;
    }
  };

  const deleteConversation = async (uid: string, cid: string) => {
    try {
      const response = await fetch(`/api/firestore/conversations`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: uid, cid: cid }),
      });
      const data = await response.json();
      if (data.success) {
        return data.conversation;
      } else {
        console.error("Error deleting conversation:", data.error);
        return null;
      }
    } catch (error) {
      console.error("Error fetching the backend in deleteConversation:", error);
      return null;
    }
  };

  return (
    <ConversationContext.Provider
      value={{
        conversations,
        setConversations,
        selectedConversation,
        setSelectedConversation,
        getConversations,
        createConversation,
        createMessageInConversation,
        getConversationWithMessages,
        updateConversation,
        deleteConversation,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};
