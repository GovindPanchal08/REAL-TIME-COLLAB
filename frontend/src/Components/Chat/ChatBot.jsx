import React, { useCallback, useEffect, useRef, useState } from "react";
import { SendData } from "../../Const/api";
const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const chatContainerRef = useRef(null);

  // Function to send a message
  const handleSendMessage = useCallback(async () => {
    if (!message.trim()) return;
    const userMessage = { sender: "user", text: message.trim() };
    setChatHistory((prev) => [...prev, userMessage]);
    setMessage(""); // Clear input immediately for better UX
    setIsLoading(true);
    try {
      const response = await SendData("/ai/ai-assistant", {
        message: userMessage.text,
      });
      if (response?.response) {
        setChatHistory((prev) => [
          ...prev,
          { sender: "ai", text: response.response },
        ]);
      } else {
        throw new Error("Invalid AI response");
      }
    } catch (error) {
      console.error("AI Response Error:", error);
      setChatHistory((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Sorry, I couldn't process your request. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [message]);

  // Auto-scroll chat to the bottom when a new message is added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);
  return (
    <>
      <div className="mt-2">
        <h5 className="text-2xl font-medium  tracking-tight">ChatBot</h5>
        <div className="h-[.5px] bg-gray-300 opacity-25 my-[1.04rem]"></div>
      </div>
      <div className="h-[80vh]">
        <div className="chatbot h-full overflow-y-auto bg-[#1e1e2f]/50 rounded-lg  p-2  scroll-smooth">
          {Array.isArray(chatHistory) && chatHistory.length > 0 ? (
            chatHistory.map((chat, index) => (
              <div
                key={index}
                className={`group p-2 mb-2 rounded-lg flex items-start ${
                  chat.sender === "user"
                    ? "bg-blue-500 text-white self-end"
                    : "bg-gray-700 text-white self-start"
                }`}
              >
                <pre className="text-sm leading-relaxed break-words whitespace-pre-wrap flex-grow">
                  {chat.text}
                  {chat?.sender !== "user" && (
                    <button
                      className="opacity-0 group-hover:opacity-100 p-1 text-sm text-gray-300 bg-gray-800 rounded hover:bg-gray-600 transition-all"
                      onClick={() => navigator.clipboard.writeText(chat.text)}
                      title="Copy message"
                    >
                      Copy
                    </button>
                  )}
                </pre>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center mt-4">
              No messages to display
            </p>
          )}
          {isLoading && (
            <div className="text-white font-mono text-base opacity-60">...</div>
          )}
        </div>
        <div className="mt-1 flex gap-1">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
            className="w-full p-2 bg-slate-200  text-black text-base  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <button
            className="p-2 text-white bg-blue-500  text-sm font-medium rounded-md"
            onClick={handleSendMessage}
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
