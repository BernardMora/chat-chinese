"use client";

import Image from "next/image";
import ProfileButton from "./ProfileButton";
import NewChatButton from "./NewChatButton";
import { ConversationList } from "./ConversationList";

export function Navbar() {
  return (
    <div className="sticky top-0 h-screen w-72 bg-gray-800 p-4 flex flex-col text-white">
      <div className="flex items-center gap-2 mb-6">
        <Image
          src="/panda_logo_processed.png"
          alt="Logo"
          width={86}
          height={86}
        />
        <h1 className="text-xl font-semibold">ChatChinese</h1>
      </div>
      <NewChatButton />
      <ConversationList />
      <ProfileButton />
    </div>
  );
}
