import { useAuth } from "../context/AuthContext";
import { useEffect, useRef } from "react";

const MessageList = ({ messages }) => {
  const { user } = useAuth();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!messages.length) {
    return (
      <div className="h-full flex items-center justify-center text-slate-400 text-lg">
        👋 Start a conversation
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-4">
      {messages.map((msg, index) => {
        const isMe = msg.sender === user?.username;

        return (
          <div
            key={index}
            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] px-4 py-3 shadow-md break-word ${
                isMe
                  ? "bg-gradient from-blue-600 to-indigo-700 text-black rounded-2xl rounded-br-md"
                  : "bg-white text-slate-800 border border-slate-200 rounded-2xl rounded-bl-md"
              }`}
            >
              {!isMe && (
                <div className="text-xs font-bold text-blue-500 mb-1">
                  {msg.sender}
                </div>
              )}

              <div className="text-sm leading-relaxed">{msg.text}</div>

              <div
                className={`flex justify-end items-center gap-1 mt-1 text-[10px] ${
                  isMe ? "text-blue-200" : "text-slate-400"
                }`}
              >
                <span>
                  {msg.createdAt
                    ? new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </span>

                {isMe && (
                  <span className="text-green-300 font-medium">✓✓ Seen</span>
                )}
              </div>
            </div>
          </div>
        );
      })}

      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
