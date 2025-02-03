import { createContext, useContext } from "react";

const ResponseContext = createContext(null);

export const useResponseContext = () => useContext(ResponseContext);

export const ResponseContextProvider = ({ children }) => {
  /**
   * @param message
   * @returns
   *
   * Returns the response as { role: "assistant", content: {JSON object with model response according to the context} }
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
