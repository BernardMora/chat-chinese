const data = require('./examples.json');

// Define the Item type
export type Message = {
    role: string;
    content: string | Object;
  };

export const messages: Message[] = [
    { content: "Hello! How are you?", role: "user" },
    { content: data[0], role: "assistant"},
    { content: "This should be working now", role: "user" },
    { content: data[1], role: "assistant"},
    { content: "This is a JSON example of the text", role: "user" },
    { content: data[2], role: "assistant"},
  ];

export const messages2: Message[] = [
    { content: "This is a test", role: "user" },
    { content: data[0], role: "assistant"}
  ];