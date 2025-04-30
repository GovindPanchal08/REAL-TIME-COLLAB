import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSocket } from "../../Context/context";

const ChitChat = () => {
  const { socket } = useSocket();
  const userId = localStorage.getItem("userId");
  const roomId = localStorage.getItem("roomId");
  const [message, setMessage] = useState("");
  const [receiveMessages, setReceiveMessages] = useState([]);
  const chatContainerRef = useRef(null);
  // Send message handler
  const handleSendMessage = useCallback(
    (event) => {
      if (event.key === "Enter" && socket && message.trim()) {
        socket.emit("send", { message, userId, roomId });
        setMessage(""); // Clear input immediately for better UX
      }
    },
    [socket, message, userId, roomId]
  );
  // Scroll chat to bottom if the user is near the bottom
  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight, scrollTop } =
        chatContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100; // 100px threshold
      if (isNearBottom) {
        chatContainerRef.current.scrollTop = scrollHeight;
      }
    }
  }, []);
  useEffect(() => {
    if (!socket) return;

    const handleChatHistory = (messages) => {
      setReceiveMessages(messages);
    };

    const handleReceivedMsg = (message) => {
      setReceiveMessages((prev) => [...prev, message]);
    };

    // Add event listeners
    socket.on("chat-history", handleChatHistory);
    socket.on("received-msg", handleReceivedMsg);

    // Cleanup listeners on unmount
    return () => {
      socket.off("chat-history", handleChatHistory);
      socket.off("received-msg", handleReceivedMsg);
    };
  }, [socket]);
  useEffect(() => {
    scrollToBottom();
  }, [receiveMessages, scrollToBottom]);
  return (
    <div className="">
      <div className="mt-2">
        <h5 className="text-2xl font-medium  tracking-tight">Group Chat</h5>
        <div className="h-[.5px] bg-gray-300 opacity-25 my-[1.04rem]"></div>
      </div>
      <div
        ref={chatContainerRef}
        className="h-[80vh]   overflow-y-auto bg-[#1e1e2f]/50 rounded-lg p-2 scroll-smooth	"
      >
        {/* Chat Messages */}
        {Array.isArray(receiveMessages) && receiveMessages.length > 0 ? (
          receiveMessages.map((msg, index) => {
            const isCurrentUser =
              msg?.userId === userId || msg?.sender?._id === userId;
            const senderName = msg?.sender?.fullname || msg?.senderName;
            const messageTime = msg?.timestamp
              ? new Date(msg.timestamp).toLocaleTimeString()
              : "";

            return (
              <div
                key={index}
                className={`mb-4 flex items-start ${
                  isCurrentUser ? "justify-end" : ""
                }`}
              >
                <div>
                  <p
                    className={`p-2 rounded-lg text-sm transition-transform duration-300 hover:scale-105 ${
                      isCurrentUser ? "bg-green-600" : "bg-blue-600"
                    }`}
                  >
                    {msg?.content || "No content available"}
                  </p>
                  <div className="flex gap-5">
                    {!isCurrentUser ? (
                      <p className="text-gray-800 text-xs font-semibold mt-[0.5px]">
                        {senderName}
                      </p>
                    ) : (
                      <p className="text-gray-800 text-xs font-semibold mt-[0.5px]">
                        You
                      </p>
                    )}
                    <p className="text-gray-400 text-xs mt-1">{messageTime}</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 text-center mt-4">
            No messages to display
          </p>
        )}
      </div>
      <div className="mt-1">
        <input
          onKeyDown={(event) => handleSendMessage(event)}
          onChange={(e) => setMessage(e.target.value)}
          type="text"
          value={message}
          placeholder="Type a message"
          className="w-full p-2  text-base  bg-gray-600  focus-within:outline-blue-600  text-white  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>
    </div>
  );
};
export default ChitChat;
