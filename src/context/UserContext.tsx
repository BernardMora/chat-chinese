"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { UserPreferences } from "@/data/types";

interface UserContextType {
  preferences: UserPreferences | null;
  setPreferences: Dispatch<SetStateAction<UserPreferences | null>>;
  user: object | null;
  uid: string | null;
  updateUser: (uid: string, attributes: object) => Promise<object | null>;
}

interface UserContextProviderProps {
  children: ReactNode;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserContext = () => useContext(UserContext);

export const UserContextProvider = ({ children }: UserContextProviderProps) => {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [user, setUser] = useState<object | null>(null);
  const [uid, setUid] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid); // Set the user ID if logged in
        getUser(user.uid).then((fetchedUser) => {
          setUser(fetchedUser);
          setPreferences(fetchedUser.preferences);
        });
      } else {
        setUser(null); // Set to null if not logged in
        router.push("/login"); // Redirect to Login page if not logged in
      }
    });

    return () => unsubscribe();
  }, [router]);

  const getUser = async (uid: string) => {
    try {
      const response = await fetch(`/api/firestore/user?uid=${uid}`, {
        method: "GET",
      });
      const data = await response.json();
      if (data.success) {
        return data.user;
      } else {
        console.error("Error getting User:", data.error);
        return null;
      }
    } catch (error) {
      console.error("Error fetching the backend in getUser:", error);
      return null;
    }
  };

  const updateUser = async (uid: string, attributes: object) => {
    try {
      const response = await fetch(`/api/firestore/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: uid, attributes: attributes }),
      });
      const data = await response.json();
      if (data.success) {
        return data.User;
      } else {
        console.error("Error updating in User:", data.error);
        return null;
      }
    } catch (error) {
      console.error("Error fetching the backend in updateUser:", error);
      return null;
    }
  };

  return (
    <UserContext.Provider
      value={{
        uid,
        user,
        updateUser,
        preferences,
        setPreferences,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
