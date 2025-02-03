import { FaTimes } from "react-icons/fa";

export function Information({ onClose }: { onClose: () => void }) {
  const chineseSections = [
    {
      title: "Tonal Language",
      content:
        "Chinese is a tonal language because the meaning of a word can change significantly based on the pitch or intonation used when pronouncing it. ",
    },
    {
      title: "Hanzi",
      content:
        "Hanzi (汉字) refers to the Chinese characters used in the written form of the Chinese language. Hanzi is used in both Mandarin and other Chinese dialects. The characters are logograms, meaning each one generally represents a word or a meaningful part of a word. Hanzi characters can be composed of different elements, including radicals (which often indicate meaning) and phonetic components (which often indicate pronunciation).",
    },
    {
      title: "Pinyin",
      content: (
        <>
          <p>
            Pinyin (拼音) is the Romanization system used to represent the
            sounds of Mandarin Chinese using the Latin alphabet. It is widely
            used by people who are new to Chinese to understand pronunciation.
            Pinyin uses a combination of letters and diacritical marks to
            indicate the four tones of Mandarin, which are essential for
            distinguishing meaning.
          </p>
          <ul className="mt-2 list-disc list-inside">
            <li>
              <b>First tone (high level):</b> <i>mā (妈)</i> - mother
            </li>
            <li>
              <b>Second tone (rising):</b> <i>má (麻)</i> - hemp
            </li>
            <li>
              <b>Third tone (falling-rising):</b> <i>mǎ (马)</i> - horse
            </li>
            <li>
              <b>Fourth tone (falling):</b> <i>mà (骂)</i> - scold
            </li>
          </ul>
        </>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg w-[40rem] max-h-[80vh] overflow-y-auto relative shadow-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
        >
          <FaTimes size={24} />
        </button>

        {/* Information Sections */}
        {chineseSections.map((section, index) => (
          <div key={index} className="mb-6">
            <h3 className="text-xl font-semibold text-center">
              {section.title}
            </h3>
            <div className="text-gray-700">{section.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
