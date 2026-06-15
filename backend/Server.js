const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const authRoutes = require("./routes/auth");
const Message = require("./models/Message");

dotenv.config();

const app = express();
const server = http.createServer(app);
const path = require("path");
const userRoutes =
  require("./routes/user");

app.use("/api/user", userRoutes);

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) =>
    console.log("❌ MongoDB Error:", err)
  );

// Online Users
const onlineUsers = {};

io.on("connection", (socket) => {
  console.log(`🟢 User Connected: ${socket.id}`);

  // User Connected
  socket.on("user_connected", (userData) => {
    onlineUsers[socket.id] = userData;

    io.emit(
      "online_users",
      Object.values(onlineUsers)
    );

    console.log(
      `👤 ${userData.username} joined chat`
    );
  });

  // Join Room + Load History
  socket.on("join_room", async (room) => {
    socket.join(room);

    console.log(
      `🚪 ${socket.id} joined room ${room}`
    );

    try {
      const messages = await Message.find({
        room,
      }).sort({ createdAt: 1 });

      socket.emit("chat_history", messages);

    } catch (err) {
      console.log(
        "History Error:",
        err.message
      );
    }
  });

  // Send Message + Save MongoDB
  socket.on("send_message", async (data) => {
    try {
      const newMessage = new Message({
        room: data.room,
        sender: data.sender,
        senderId: data.senderId || "guest",
        text: data.text,
      });

      const savedMessage =
        await newMessage.save();

      io.to(data.room).emit(
        "receive_message",
        savedMessage
      );

      io.to(data.room).emit(
        "user_stop_typing",
        data.sender
      );

      console.log(
        `💬 ${data.sender}: ${data.text}`
      );

    } catch (err) {
      console.log(
        "Message Save Error:",
        err.message
      );
    }
  });

  // Typing Start
  socket.on(
    "typing",
    ({ room, username }) => {
      socket
        .to(room)
        .emit("user_typing", username);
    }
  );

  // Typing Stop
  socket.on(
    "stop_typing",
    ({ room, username }) => {
      socket
        .to(room)
        .emit(
          "user_stop_typing",
          username
        );
    }
  );

  // Disconnect
  socket.on("disconnect", () => {
    const disconnectedUser =
      onlineUsers[socket.id];

    if (disconnectedUser) {
      console.log(
        `🔴 ${disconnectedUser.username} left chat`
      );
    }

    delete onlineUsers[socket.id];

    io.emit(
      "online_users",
      Object.values(onlineUsers)
    );
  });
});

// Health Route
app.get("/", (req, res) => {
  res.send("🚀 Chat Server Running...");
});

// Start Server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(
    `🚀 Server running on port ${PORT}`
  );
});