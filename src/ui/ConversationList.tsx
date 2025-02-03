"use client";

import { useConversationContext } from "@/context/ConversationContext";
import { useAuth } from "@/hooks/useAuth";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Edit, Trash2 } from "lucide-react";
import { Conversation } from "@/data/types";

export function ConversationList() {
  const {
    conversations,
    setSelectedConversation,
    setConversations,
    getConversationWithMessages,
    updateConversation,
    deleteConversation,
  } = useConversationContext()!;
  const { uid } = useAuth();

  const [openMenuId, setOpenMenuId] = useState<string | null>(null); // Track which conversation's menu is open
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 }); // Track the position of the "three dots" button
  const [editingConvId, setEditingConvId] = useState<string | null>(null); // Track which conversation is being edited
  const [editedTitle, setEditedTitle] = useState(""); // Track the edited title
  const [deleteConvId, setDeleteConvId] = useState<string | null>(null); // Track which conversation is being deleted
  const menuRef = useRef<HTMLDivElement | null>(null); // Ref for the popup menu
  const inputRef = useRef<HTMLInputElement | null>(null); // Ref for the input field
  const deleteRef = useRef<HTMLDivElement | null>(null);

  const handleSelectConversation = (conv: Conversation) => {
    getConversationWithMessages(uid!, conv.id).then(
      (conversationWithMessages) => {
        setSelectedConversation(conversationWithMessages);
      }
    );
  };

  const handleMenuClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    convId: string
  ) => {
    e.stopPropagation(); // Prevent event bubbling to the parent button
    if (!e.currentTarget) return;
    // Get the position of the "three dots" button
    const buttonRect = e.currentTarget.getBoundingClientRect();
    setMenuPosition({
      top: buttonRect.top - 48, // Position the popup above the button
      left: buttonRect.left,
    });

    setOpenMenuId(openMenuId === convId ? null : convId); // Toggle menu
  };

  const handleRename = (convId: string) => {
    if (!conversations) return;
    const conversation = conversations.find((conv) => conv.id === convId);
    if (conversation) {
      setEditedTitle(conversation.title); // Set the initial title for editing
      setEditingConvId(convId); // Set the conversation being edited
      setOpenMenuId(null); // Close the menu
    }
  };

  const handleDeleteClick = (convId: string) => {
    setDeleteConvId(convId); // Set the conversation to delete
    setOpenMenuId(null); // Close the menu
  };

  const handleDeleteConfirm = async () => {
    if (deleteConvId) {
      // Call your backend API to delete the conversation
      await deleteConversation(uid!, deleteConvId);

      // Select the first conversation in the list (excluding the deleted one)
      const remainingConversations = conversations!.filter(
        (conv) => conv.id !== deleteConvId
      );
      if (remainingConversations.length > 0) {
        handleSelectConversation(remainingConversations[0]);
        setConversations(remainingConversations);
      } else {
        setSelectedConversation(null); // No conversations left
      }

      setDeleteConvId(null); // Close the delete confirmation popup
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConvId(null); // Close the delete confirmation popup
  };

  const handleSaveTitle = async (convId: string) => {
    const conversation = conversations.find((conv) => conv.id === convId);
    if (conversation) {
      // Update the title locally
      conversation.title = editedTitle;
      setEditingConvId(null); // Stop editing

      // Call your backend API to update the title
      await updateConversation(uid!, convId, { title: editedTitle });
    }
  };

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: Event) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
      if (deleteRef.current && !deleteRef.current.contains(e.target as Node)) {
        setDeleteConvId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus the input field when editing starts
  useEffect(() => {
    if (editingConvId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingConvId]);

  return (
    <>
      <nav className="space-y-2 flex-1 overflow-y-auto">
        {conversations.map((conv) => (
          <div key={conv.id} className="flex items-center group">
            {/* Conversation Button or Input Field */}
            {editingConvId === conv.id ? (
              <input
                ref={inputRef}
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onBlur={() => handleSaveTitle(conv.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSaveTitle(conv.id);
                  }
                }}
                className="flex-1 block w-full rounded-full px-3 py-2 text-sm font-medium bg-transparent border border-gray-300 focus:outline-none focus:border-blue-500"
              />
            ) : (
              <button
                onClick={() => handleSelectConversation(conv)}
                className="flex-1 block w-full rounded-full px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-500 text-left truncate"
              >
                {conv.title}
              </button>
            )}

            {/* Three Dots Button */}
            <button
              onClick={(e) => handleMenuClick(e, conv.id)}
              className="p-2 rounded-full hover:bg-gray-500 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01"
                />
              </svg>
            </button>
          </div>
        ))}
      </nav>

      {/* Popup Menu (Rendered as a Portal) */}
      {openMenuId &&
        createPortal(
          <div
            ref={menuRef}
            className="fixed bg-white border border-gray-200 rounded-lg shadow-lg z-50"
            style={{
              top: menuPosition.top,
              left: menuPosition.left,
            }}
          >
            <button
              onClick={() => handleRename(openMenuId)}
              className="w-full px-4 pt-2 text-sm text-gray-500
              flex items-center gap-2 font-medium transition-colors hover:text-gray-700 mb-4"
            >
              <Edit />
              Rename
            </button>
            <button
              onClick={() => handleDeleteClick(openMenuId)}
              className="w-full px-4 pb-2 text-sm text-red-300
              flex items-center gap-2 font-medium transition-colors hover:text-red-500 mb-4"
            >
              <Trash2 />
              Delete
            </button>
          </div>,
          document.body // Render the popup at the root level
        )}

      {/* Delete Confirmation Popup (Rendered as a Portal) */}
      {deleteConvId &&
        createPortal(
          <div
            ref={deleteRef}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <div className="bg-white rounded-lg p-6 w-96">
              <h2 className="text-xl font-bold mb-4 text-black">
                Delete Chat?
              </h2>
              <p className="text-base text-gray-600 mb-6">
                Are you sure you want to delete this chat?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={handleDeleteCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>,
          document.body // Render the popup at the root level
        )}
    </>
  );
}
