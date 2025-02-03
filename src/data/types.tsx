export type Conversation = {
  id: string;
  title: string;
  messages: Message[] | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Word = {
  audio?: string;
  eng: string;
  hanzi: string;
  note: string;
  pinyin: string;
};

export type Message = {
  role: string;
  id?: string;
  timestamp?: string;
};

export type UserMessage = Message & {
  content: string;
};

export type AssistantMessage = Message & {
  content: {
    audio: string;
    hanzi: string;
    pinyin: string;
    list: Word[];
  };
};

export type UserPreferences = {
  playbackSpeed: number;
};
