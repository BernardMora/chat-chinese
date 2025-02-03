import { Message } from "@/data/Message";

// UserMessage Component
export function UserMessage({ message }: { message: Message }) {
  return (
    <div className="pb-6 mb-8 flex">
      <div className="ml-auto flex justify-end rounded-lg bg-gray-100 p-4 text-lg font-medium">
        <p>{message.content}</p>
      </div>
    </div>
  );
}
