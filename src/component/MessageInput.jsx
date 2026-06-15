import { useState } from "react";
import EmojiPicker from "./EmojiPicker";

const MessageInput = ({ sendMessage, onTyping }) => {
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setMessage(e.target.value);
    if (onTyping) onTyping();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    sendMessage(message);
    setMessage("");
  };

  // Emoji picker se emoji aane par message mein add karo
  const handleEmojiSelect = (emoji) => {
    setMessage((prev) => prev + emoji);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 p-4 bg-white"
    >
      {/* Emoji Picker Button */}
      <EmojiPicker onEmojiSelect={handleEmojiSelect} />

      <input
        type="text"
        value={message}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSubmit(e);
        }}
        placeholder="Type your message..."
        className="flex-1 border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition"
      >
        Send
      </button>
    </form>
  );
};

export default MessageInput;
