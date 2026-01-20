import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);

// Laravel API Base URL
const baseUrl = process.env.API_BASE_URL || "https://api.wovo.love/api";

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const users = {};

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  socket.on("login", ({ userId }) => {
    console.log(`User ${userId} logged in`);
    updateUserStatus(userId, true);
  });

  socket.on("joinRoom", ({ userId, receiverId }) => {
    users[userId] = socket.id;

    const roomId = [userId, receiverId].sort().join("-");
    socket.join(roomId);

    console.log(`User ${userId} joined room ${roomId}`);

    socket.on("send_message", ({ userId, receiverId, conversation_id }) => {
      const roomId = [userId, receiverId].sort().join("-");
      io.to(roomId).emit("receive_message", { conversation_id });
    });
  });

  socket.on("disconnect", () => {
    const userId = Object.keys(users).find(
      (key) => users[key] === socket.id
    );

    if (userId) {
      delete users[userId];
      updateUserStatus(userId, false);
      console.log(`User ${userId} disconnected`);
    }
  });
});

server.listen(3000, "0.0.0.0", () => {
  console.log("🚀 Socket server running on http://0.0.0.0:3000");
});

// ---------------------
// Update user status
// ---------------------
async function updateUserStatus(userId, isActive) {
  try {
    const res = await fetch(`${baseUrl}/update-status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        is_active: isActive,
      }),
    });

    const data = await res.json();
    console.log("Status updated:", data);
  } catch (error) {
    console.error("Status update failed:", error.message);
  }
}

