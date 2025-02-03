import { Message, messages, messages2 } from "@/data/Message";

// Define the Item type
export type Conversation = {
    id: string;
    name: string;
    messages: Message[];
  };

export const sampleConvs: Conversation[] = [
    {
      id: "conv1",
      name: "Conversation 1",
      messages: messages,
    },
    {
      id: "conv2",
      name: "Conversation 2",
      messages: messages2,
    },
  ];
