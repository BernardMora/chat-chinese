// hooks/useAuth.js
"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [uid, setUid] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // Set the user if logged in
        setUid(user.uid); // Set the user ID if logged in
      } else {
        setUser(null); // Set to null if not logged in
        router.push("/login"); // Redirect to Login page if not logged in
      }
    });

    return () => unsubscribe();
  }, [router]);

  return { user, uid };
}
