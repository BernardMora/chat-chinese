import { UserMessage } from "@/data/types";

// UserMessage Component
export function UserMessageComponent({ message }: { message: UserMessage }) {
  return (
    <div className="pb-6 mb-8 flex">
      <div className="ml-auto flex justify-end rounded-lg bg-gray-100 p-4 text-lg font-medium">
        <p>{message.content}</p>
      </div>
    </div>
  );
}
