"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { GoogleLoginButton } from "@/ui/GoogleLoginButton";
import { GoogleCredentialResponse } from "@react-oauth/google";

export default function LoginPage() {
  const router = useRouter();

  // Redirect to MainChat if the user is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        router.push(`/`); // Redirect to MainChat page
      }
    });

    return () => unsubscribe();
  }, [router]);

  const createUser = async (email: string, uid: string) => {
    try {
      const response = await fetch(
        `/api/firestore/user?uid=${uid}&email=${email}`,
        {
          method: "POST",
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data from backend:", error);
    }
  };

  const handleGoogleLoginSuccess = async (
    response: GoogleCredentialResponse
  ) => {
    const credential = GoogleAuthProvider.credential(response.credential);
    const userCredential = await signInWithCredential(auth, credential);
    const user = userCredential.user;

    const res = await createUser(user.email!, user.uid);
    if (!res.success) {
      console.error(res.error);
    }
    router.push(`/`);
  };

  const handleGoogleLoginError = () => {
    console.error("Error in GoogleLoginButton.");
  };

  const [isSignup, setIsSignup] = useState(false); // Toggle between login and signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // New state for confirm password
  const [errorMessage, setErrorMessage] = useState("");

  const handleEmailPasswordAuth = async () => {
    try {
      if (isSignup) {
        if (password !== confirmPassword) {
          setErrorMessage("Passwords do not match.");
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        // Send a verification email
        await sendEmailVerification(user);
        console.log("Signup successful! Verification email sent.", user);

        setErrorMessage(
          "Signup successful! Please verify your email before logging in."
        );
      } else {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        if (!user.emailVerified) {
          setErrorMessage(
            "Email not verified. Please check your inbox and verify your email."
          );
          return;
        }
        // After email verification, create user record in Firestore
        const res = await createUser(email, user.uid);
        if (!res.success) {
          console.error(res.error);
        }
        router.push(`/`); // Redirect after login
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unknown error occurred.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-black">
      {/* Main container */}
      <div className="bg-white rounded-lg border-4 border-red-500 shadow-lg shadow-red-500/50 p-12 w-[90vw] max-w-6xl flex flex-col lg:flex-row lg:items-stretch lg:justify-between">
        {/* Left side */}
        <div className="h-[60vh] flex flex-col items-center justify-center space-y-8 lg:w-1/2">
          <h1 className="text-5xl font-bold">聊天中文</h1>
          <Image
            src="/panda_logo_processed.png"
            alt="Logo"
            width={300}
            height={300}
            className="w-[300px] h-[250px]" // Adjusted width and height for larger image
          />
          <h1 className="text-5xl font-bold">Chat Chinese</h1>
          <p className="text-xl text-gray-600">
            An app to practice your Chinese
          </p>
          <GoogleLoginButton
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginError}
          />
        </div>

        {/* Right side (Login/Signup) */}
        <div className="lg:w-1/2 p-8 flex flex-col justify-center h-[60vh] space-y-6">
          <h2 className="text-2xl font-bold">
            {isSignup ? "Sign Up" : "Log In"}
          </h2>
          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {isSignup && (
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full px-4 py-2 border rounded-lg"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}
          <button
            className="w-full px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-lg"
            onClick={handleEmailPasswordAuth}
          >
            {isSignup ? "Sign Up" : "Log In"}
          </button>
          <p className="text-center">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-blue-500 hover:text-blue-700 hover:underline"
            >
              {isSignup ? "Log In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
