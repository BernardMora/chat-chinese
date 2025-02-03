"use client";

import { createContext, ReactNode, useContext, useState } from "react";

interface Word {
  hanzi: string;
  pinyin: string;
  english: string;
  audio: string;
}

interface VocabularyContextType {
  vocabulary: Map<string, Word>;
  getWord: (hanzi: string) => Word | undefined;
  addWord: (hanzi: string, word: Word) => void;
  fetchVocabulary: (uid: string) => Promise<void>;
  saveWordToVocabulary: (uid: string, word: Word) => Promise<void>;
}

interface VocabularyContextProviderProps {
  children: ReactNode;
}

const VocabularyContext = createContext<VocabularyContextType | undefined>(
  undefined
);

export const useVocabularyContext = () => useContext(VocabularyContext);

export const VocabularyContextProvider = ({
  children,
}: VocabularyContextProviderProps) => {
  const [vocabulary, setVocabulary] = useState<Map<string, Word>>(new Map());

  // Fetch the vocabulary from Firestore
  const fetchVocabulary = async (uid: string) => {
    try {
      const response = await fetch(
        `/api/firestore/user/vocabulary?uid=${uid}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      if (data.success) {
        // Check if data.vocabulary is empty or undefined
        if (!data.vocabulary || Object.keys(data.vocabulary).length === 0) {
          // Initialize an empty Map if vocabulary is empty
          setVocabulary(new Map<string, Word>());
        } else {
          // Convert the vocabulary object to a Map
          const vocabularyMap = new Map<string, Word>(
            Object.entries(data.vocabulary)
          );
          setVocabulary(vocabularyMap);
        }
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error fetching vocabulary:", error);
    }
  };

  const saveWordToVocabulary = async (uid: string, word: Word) => {
    try {
      const response = await fetch(`/api/firestore/user/vocabulary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid, word }),
      });
      const data = await response.json();
      if (!data.success) {
        console.error("Error saving word to Firestore:", data.error);
      }
    } catch (error) {
      console.error("Error saving word to Firestore:", error);
    }
  };

  // Add a word to the vocabulary
  const addWord = (hanzi: string, word: Word) => {
    setVocabulary((prev) => new Map(prev).set(hanzi, word));
  };

  // Get a word from the vocabulary
  const getWord = (hanzi: string) => {
    return vocabulary.get(hanzi);
  };

  return (
    <VocabularyContext.Provider
      value={{
        vocabulary,
        getWord,
        addWord,
        fetchVocabulary,
        saveWordToVocabulary,
      }}
    >
      {children}
    </VocabularyContext.Provider>
  );
};
