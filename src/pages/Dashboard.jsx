import { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";

import Navbar from "../component/Navbar";
import UserList from "../component/UserList";
import ChatRoom from "../component/ChatRoom";

const Dashboard = () => {
  const { socket } = useSocket();
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const room = "general";

  useEffect(() => {
    if (!socket || !user) return;

    socket.emit("join_room", room);

    socket.emit("user_connected", {
      username: user.username,
      userId: user.id,
    });

    socket.on("chat_history", (history) => {
      setMessages(history);
    });

    socket.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("online_users", (users) => {
      setOnlineUsers(users);
    });

    socket.on("user_typing", (username) => {
      if (username === user.username) return;
      setTypingUser(username);
    });

    socket.on("user_stop_typing", () => {
      setTypingUser("");
    });

    return () => {
      socket.off("chat_history");
      socket.off("receive_message");
      socket.off("online_users");
      socket.off("user_typing");
      socket.off("user_stop_typing");
    };
  }, [socket, user]);

  const sendMessage = (text) => {
    if (!socket || !user || !text.trim()) return;

    socket.emit("send_message", {
      room,
      sender: user.username,
      senderId: user.id,
      text,
    });
  };

  const handleTyping = () => {
    if (!socket || !user) return;

    socket.emit("typing", {
      room,
      username: user.username,
    });

    clearTimeout(window.typingTimeout);

    window.typingTimeout = setTimeout(() => {
      socket.emit("stop_typing", {
        room,
        username: user.username,
      });
    }, 1000);
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-100">
      <Navbar />

      {/* Mobile Users Button */}
      <div className="md:hidden px-4 py-2 bg-white border-b">
        <button
          onClick={() => setShowUsers(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          👥 Users ({onlineUsers.length})
        </button>
      </div>

      <div className="flex h-[calc(100vh-70px)]">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-60 bg-white border-r shadow-lg">
          <UserList
            users={onlineUsers}
            setSelectedUser={setSelectedUser}
          />
        </aside>

        {/* Mobile Sidebar */}
        {showUsers && (
          <>
            <div
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              onClick={() => setShowUsers(false)}
            />

            <div className="fixed top-0 left-0 z-50 w-72 h-screen bg-white shadow-2xl md:hidden">
              <button
                onClick={() => setShowUsers(false)}
                className="absolute top-4 right-4 text-xl text-slate-700"
              >
                ✕
              </button>

              <UserList
                users={onlineUsers}
                setSelectedUser={setSelectedUser}
              />
            </div>
          </>
        )}

        {/* Chat Area */}
        <main className="flex-1 flex flex-col min-w-0">
          <ChatRoom
            messages={messages}
            sendMessage={sendMessage}
            onTyping={handleTyping}
            typingUser={typingUser}
            selectedUser={selectedUser}
          />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;