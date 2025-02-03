"use client";

import { Message } from "@/data/Message";
import { createContext, useContext, useState } from "react";

const MessageContext = createContext(null);

export const useMessageContext = () => useContext(MessageContext);

export const MessageContextProvider = ({ children }) => {
  const getMessages = async (uid: string) => {
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

  const updateMessage = async (
    uid: string,
    cid: string,
    mid: string,
    attributes: Object
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
      let data = await response.json();
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
