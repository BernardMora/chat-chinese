import { FaTimes, FaVolumeUp } from "react-icons/fa";
import { useVocabularyContext } from "@/context/VocabularyContext";
import { useUserContext } from "@/context/UserContext";

export function Vocabulary({ onClose }: { onClose: () => void }) {
  const { vocabulary } = useVocabularyContext();
  const { preferences } = useUserContext();

  const playAudio = async (base64audio: string) => {
    try {
      const audioUrl = `data:audio/mp3;base64,${base64audio}`;
      const audio = new Audio(audioUrl);
      audio.playbackRate = preferences.playbackSpeed;
      audio.play();

      audio.addEventListener("error", (e) => {
        console.error("Error playing audio:", e);
      });
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-[30vw] h-[60vh] overflow-y-auto relative ">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white hover:text-gray-200"
        >
          <FaTimes size={24} />
        </button>

        {/* Vocabulary List */}
        <h2 className="text-xl font-bold text-center bg-red-500 text-white p-2 -mx-6 -mt-6 mb-4">
          Vocabulary
        </h2>
        <ul className="space-y-2 text-lg text-black">
          {Array.from(vocabulary.entries()).map(([hanzi, word]) => (
            <li key={hanzi} className="flex items-center">
              <button
                onClick={() => {
                  playAudio(word.audio);
                }}
                className="text-gray-600 hover:text-gray-800"
              >
                <FaVolumeUp />
              </button>
              <span className="ml-4">
                <span className="font-bold">{hanzi} </span>({word.pinyin}) →{" "}
                {word.english}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
