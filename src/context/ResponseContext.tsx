import { AssistantMessage } from "@/data/types";
import { createContext, ReactNode, useContext } from "react";

interface ResponseContextType {
  fetchResponse: (message: string) => Promise<AssistantMessage | null>;
}

interface ResponseContextProps {
  children: ReactNode;
}

const ResponseContext = createContext<ResponseContextType | undefined>(
  undefined
);

export const useResponseContext = () => useContext(ResponseContext);

export const ResponseContextProvider = ({ children }: ResponseContextProps) => {
  /**
   * Returns the response as { role: "assistant", content: {JSON object with model response according to the context} }
   *
   * @param message
   * @returns
   *
   */
  const fetchResponse = async (message: string) => {
    try {
      const response = await fetch(`/api/response?message=${message}`);
      let data = await response.json();
      data = data.response;
      data.content = JSON.parse(data.content); // Parse JSON content
      return data;
    } catch (error) {
      console.error("Error fetching the backend:", error);
      return null;
    }
  };

  return (
    <ResponseContext.Provider
      value={{
        fetchResponse,
      }}
    >
      {children}
    </ResponseContext.Provider>
  );
};
