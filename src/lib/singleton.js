import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.DEEPSEEK_API;

class OpenAISingleton {
  constructor() {
    if (!OpenAISingleton.instance) {
      // Initialize the OpenAI instance directly
      this.openai = new OpenAI({
        baseURL: "https://api.deepseek.com",
        apiKey: apiKey,
      });

      // Add a context to the messages
      this.context = `You will act as my English-Chinese translator. I will give you phrases or words in English that you will have to translate into Chinese. You must output the translated text in Chinese characters as well as pinyin right below it. For every word or expression that you encounter, you must list a direct translation between words or concepts, for example, one English word could translate to another Chinese word, or a set of Chinese words, and vice-versa, this list must also have its pinyin translation. Try to make the translation as best as possible, prioritizing a day-to-day commonly used vocabulary. Your output must only be the translation of what my prompt is. Your output must be in a JSON format with the following structure:
{hanzi: "Hànzì", pinyin: "Pinyin", list: [{eng: "English word/expression", hanzi: "Hànzì", pinyin: "Pinyin", note: ""}]}
If for an English word there is no direct translation, it's implied in the sentence, or anything related, you must leave hanzi and pinyin empty (""), also attach those comments (such that "There is no direct translation", "Implied in the sentence structure" or any other comment that you may find helpful) in the note key inside the word. Only provide notes when required. Remember to ONLY use English characters for the "eng" key, ONLY use Hànzì for the "hanzi" key and ONLY use Pinyin for the "pinyin key".`;
    }
    return OpenAISingleton.instance;
  }

  async createChatCompletion(message, model = "deepseek-chat") {
    // Add the context to the messages
    const fullMessages = [{ role: "system", content: this.context }, message];
    return this.openai.chat.completions.create({
      model,
      messages: fullMessages,
      response_format: {
        type: "json_object",
      },
    });
  }
}

// Create a single instance of the Singleton class
const openai = new OpenAISingleton();

// Freeze the instance to prevent modifications
Object.freeze(openai);

// Export the instance
export default openai;
