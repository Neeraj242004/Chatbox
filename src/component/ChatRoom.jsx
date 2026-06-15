import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

const ChatRoom = ({
  messages,
  sendMessage,
  onTyping,
  typingUser,
  selectedUser,
}) => {
  return (
    <div className="flex flex-col h-full flex-1 bg-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-5 py-4">
        <h2 className="text-lg font-bold text-slate-800">
          {selectedUser
            ? selectedUser.username
            : "Select a User"}
        </h2>

        {selectedUser ? (
          typingUser ? (
            <p className="text-green-500 text-sm">
              ✍️ {typingUser} is typing...
            </p>
          ) : (
            <p className="text-green-500 text-sm">
              🟢 Online
            </p>
          )
        ) : (
          <p className="text-slate-500 text-sm">
            Choose a user from sidebar
          </p>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {selectedUser ? (
          <MessageList messages={messages} />
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400 text-lg">
            Select a user to start chatting
          </div>
        )}
      </div>

      {/* Input */}
      {selectedUser && (
        <div className="bg-white border-t border-slate-200 p-4">
          <MessageInput
            sendMessage={sendMessage}
            onTyping={onTyping}
          />
        </div>
      )}
    </div>
  );
};

export default ChatRoom;