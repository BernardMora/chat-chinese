import Image from "next/image";
import { AssistantMessage, Word } from "@/data/types";
import { ClipLoader } from "react-spinners";
import { FaVolumeUp } from "react-icons/fa";
import { useUserContext } from "@/context/UserContext";
import { useMessageContext } from "@/context/MessageContext";
import { useConversationContext } from "@/context/ConversationContext";
import { useVocabularyContext } from "@/context/VocabularyContext";

export function BotMessage({ message }: { message: AssistantMessage | null }) {
  const { selectedConversation } = useConversationContext()!;
  const { updateMessage } = useMessageContext()!;
  const { uid, preferences } = useUserContext() ?? {};
  const { getWord, addWord, saveWordToVocabulary } = useVocabularyContext()!;

  const playAudio = async (base64audio: string) => {
    try {
      const audioUrl = `data:audio/mp3;base64,${base64audio}`;
      const audio = new Audio(audioUrl);
      if (!preferences) {
        return;
      }
      audio.playbackRate = preferences.playbackSpeed;
      audio.play();

      audio.addEventListener("error", (e) => {
        console.error("Error playing audio:", e);
      });
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  const handleAudio = async (text: string) => {
    const playbackSpeed = 100;

    try {
      const url = `/api/tts?text=${encodeURIComponent(
        text
      )}&speed=${playbackSpeed}`;
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data.audio;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  if (!message) {
    return (
      <div className="flex flex-row gap-3 pb-6 mb-8 items-start">
        <Image
          src="/panda_logo_processed.png"
          alt="Logo"
          width={86}
          height={86}
          className="dark:*:"
        />
        <div className="flex justify-start">
          <div className="p-3 rounded-lg max-w-xs">
            <ClipLoader size={20} color="#808080" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-3 pb-6 mb-8 items-start">
      <Image
        src="/panda_logo_processed.png"
        alt="Logo"
        width={86}
        height={86}
        className="dark:*:"
      />
      <div className="text-black bg-inherit text-lg font-medium flex-1">
        <div>
          <h1 className="text-2xl">Translation:</h1>
          <div className="flex flex-wrap items-center pt-3">
            <p className="font-bold">
              Chinese Characters (汉字 - Hànzì):&nbsp;
            </p>
            <p>{message.content.hanzi}</p>
            {message.content.hanzi !== "" && (
              <button
                onClick={async () => {
                  if (!message.content.audio) {
                    console.log("No audio found, fetching...");
                    message.content.audio = await handleAudio(
                      message.content.hanzi
                    );
                    await updateMessage(
                      uid!,
                      selectedConversation!.id,
                      message.id!,
                      message
                    );
                  }
                  playAudio(message.content.audio);
                }}
                className="ml-2 text-gray-600 hover:text-gray-800"
              >
                <FaVolumeUp />
              </button>
            )}
          </div>
          <div className="flex flex-wrap pt-1">
            <p className="font-bold">Pinyin (拼音 - Pīnyīn):&nbsp;</p>
            <p>{message.content.pinyin}</p>
          </div>
        </div>
        <div>
          <h1 className="text-2xl pt-5">Direct Translation List:</h1>
          <ul className="list-disc pl-5 pt-4">
            {message.content.list.map((word: Word, index: number) => (
              <li key={index} className="mb-2 flex flex-wrap items-center">
                <span className="font-bold">{word.eng + " → "}</span>
                {word.hanzi !== "" ? word.hanzi + " (" + word.pinyin + ")" : ""}
                {word.note !== "" ? " (" + word.note + ")" : ""}
                {word.hanzi !== "" && (
                  <button
                    onClick={async () => {
                      // Check if the word exists in the vocabulary
                      const existingWord = getWord(word.hanzi);
                      if (existingWord) {
                        playAudio(existingWord.audio);
                      } else {
                        console.log("No audio found, fetching...");
                        const audio = await handleAudio(word.hanzi);
                        if (audio) {
                          const newWord = {
                            hanzi: word.hanzi,
                            pinyin: word.pinyin,
                            english: word.eng,
                            audio: audio,
                          };
                          addWord(word.hanzi, newWord);
                          if (!uid) return;
                          await saveWordToVocabulary(uid, newWord);
                          playAudio(audio);
                        } else {
                          console.error(
                            "There was a problem fetching the audio"
                          );
                        }
                      }
                    }}
                    className="ml-2 text-gray-600 hover:text-gray-800"
                  >
                    <FaVolumeUp />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
