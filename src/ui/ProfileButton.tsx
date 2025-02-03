"use client"; // Mark this as a Client Component

import { useState } from "react";
import { UserCircleIcon } from "@heroicons/react/24/solid"; // Example profile icon
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase"; // Import your Firebase auth instance

type ProfileButtonProps = {
  onClick?: () => void; // Optional click handler
  className?: string; // Optional custom class names
  href?: string; // Optional link destination
};

export default function ProfileButton({}: ProfileButtonProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="mt-auto relative">
      <button
        onClick={toggleMenu}
        className="flex items-center gap-2 rounded-full bg-transparent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-500"
      >
        <UserCircleIcon className="h-5 w-5" />
        <span>Profile</span>
      </button>

      {/* Dropup Menu */}
      <div
        className={`absolute bottom-full left-0 w-full bg-white rounded-lg shadow-lg z-10 transition-all duration-300 ease-out transform ${
          isMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        <div className="py-1">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
