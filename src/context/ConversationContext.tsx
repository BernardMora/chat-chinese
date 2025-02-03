"use client";

import { Message } from "@/data/Message";
import { createContext, useContext, useState } from "react";

const ConversationContext = createContext(null);

export const useConversationContext = () => useContext(ConversationContext);

export const ConversationContextProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);

  const getConversations = async (uid: string) => {
    try {
      const response = await fetch(`/api/firestore/conversations?uid=${uid}`, {
        method: "GET",
      });
      let data = await response.json();
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
      let data = await response.json();
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
      let data = await response.json();
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
      let data = await response.json();
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
    attributes: Object
  ) => {
    try {
      const response = await fetch(`/api/firestore/conversations`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: uid, cid: cid, attributes: attributes }),
      });
      let data = await response.json();
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
      let data = await response.json();
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
