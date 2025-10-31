
const User = require("../models/User");
const Message = require("../models/Message");

// Store active socket connections
const activeConnections = new Map();
const typingUsers = new Map();

function socketHandlers(io) {
  io.on("connection", (socket) => {
    console.log(`⚡ Socket connected: ${socket.id}`);

    // Handle user join
    socket.on("user_join", async (userData) => {
      try {
        const { username, userId, email, avatar } = userData;

        // Update or create user in database
        let user = await User.findOne({ clerkId: userId });

        if (user) {
          user.status = "online";
          await user.updateLastSeen();
        } else {
          user = await User.create({
            clerkId: userId,
            username,
            email,
            avatar,
            status: "online",
          });
        }

        // Store socket connection
        activeConnections.set(socket.id, {
          userId,
          username,
          email,
          avatar,
        });

        // Send user info back
        socket.emit("user_info", {
          id: socket.id,
          userId,
          username,
          email,
          avatar,
        });

        // Broadcast user list
        const onlineUsers = Array.from(activeConnections.entries()).map(
          ([socketId, data]) => ({
            id: socketId,
            ...data,
          })
        );

        io.emit(
          "user_list",
          onlineUsers.filter((u) => u.id !== socket.id)
        );

        // Broadcast user joined
        socket.broadcast.emit("user_joined", {
          id: socket.id,
          username,
        });

        // Send recent messages
        const recentMessages = await Message.find({
          isPrivate: false,
          isDeleted: false,
        })
          .sort({ createdAt: -1 })
          .limit(50);

        socket.emit("message_history", recentMessages.reverse());

        console.log(`👤 ${username} joined (Socket: ${socket.id})`);
      } catch (error) {
        console.error("User join error:", error);
        socket.emit("error", { message: "Failed to join chat" });
      }
    });

    // Handle global message
    socket.on("send_message", async (data) => {
      try {
        const userData = activeConnections.get(socket.id);

        if (!userData) {
          socket.emit("error", { message: "User not authenticated" });
          return;
        }

        // Save message to database
        const message = await Message.create({
          senderId: socket.id,
          senderName: userData.username,
          content: data.message,
          messageType: data.file ? "file" : "text",
          isPrivate: false,
          file: data.file || null,
          status: {
            delivered: true,
          },
        });

        // Update user message count
        const user = await User.findOne({ clerkId: userData.userId });
        if (user) {
          await user.incrementMessageCount();
        }

        // Broadcast to all users
        io.emit("receive_message", {
          id: message._id.toString(),
          senderId: socket.id,
          sender: userData.username,
          message: data.message,
          timestamp: message.createdAt.toISOString(),
          file: data.file,
        });

        // Send delivery acknowledgment
        socket.emit("message_delivered", { messageId: message._id.toString() });

        console.log(`💬 ${userData.username}: ${data.message}`);
      } catch (error) {
        console.error("Send message error:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // Handle private message
    socket.on("private_message", async ({ to, message }) => {
      try {
        const senderData = activeConnections.get(socket.id);
        const recipientData = activeConnections.get(to);

        if (!senderData) {
          socket.emit("error", { message: "Sender not authenticated" });
          return;
        }

        if (!recipientData) {
          socket.emit("error", { message: "Recipient not found" });
          return;
        }

        // Save message to database
        const dbMessage = await Message.create({
          senderId: socket.id,
          senderName: senderData.username,
          content: message,
          messageType: "text",
          isPrivate: true,
          recipientId: to,
          recipientName: recipientData.username,
          status: {
            delivered: true,
          },
        });

        const messageData = {
          id: dbMessage._id.toString(),
          senderId: socket.id,
          sender: senderData.username,
          message,
          timestamp: dbMessage.createdAt.toISOString(),
          isPrivate: true,
          recipientId: to,
          recipient: recipientData.username,
        };

        // Send to recipient
        socket.to(to).emit("private_message", messageData);

        // Send to sender (confirmation)
        socket.emit("private_message", messageData);

        // Send delivery acknowledgment
        socket.emit("message_delivered", {
          messageId: dbMessage._id.toString(),
        });

        console.log(
          `🔒 Private: ${senderData.username} -> ${recipientData.username}`
        );
      } catch (error) {
        console.error("Private message error:", error);
        socket.emit("error", { message: "Failed to send private message" });
      }
    });

    // Handle typing indicator
    socket.on("typing", (isTyping) => {
      const userData = activeConnections.get(socket.id);

      if (!userData) return;

      if (isTyping) {
        typingUsers.set(socket.id, userData.username);
      } else {
        typingUsers.delete(socket.id);
      }

      socket.broadcast.emit("typing_users", Array.from(typingUsers.values()));
    });

    // Handle message reaction
    socket.on("add_reaction", async ({ messageId, reaction }) => {
      try {
        const userData = activeConnections.get(socket.id);

        if (!userData) return;

        const message = await Message.findById(messageId);

        if (message) {
          await message.addReaction(socket.id, userData.username, reaction);

          // Broadcast reaction
          io.emit("message_reaction", {
            messageId,
            reaction,
            username: userData.username,
            userId: socket.id,
          });

          console.log(`❤️ ${userData.username} reacted with ${reaction}`);
        }
      } catch (error) {
        console.error("Add reaction error:", error);
      }
    });

    // Handle disconnect
    socket.on("disconnect", async () => {
      try {
        const userData = activeConnections.get(socket.id);

        if (userData) {
          // Update user status in database
          const user = await User.findOne({ clerkId: userData.userId });
          if (user) {
            await user.updateStatus("offline");
          }

          activeConnections.delete(socket.id);
          typingUsers.delete(socket.id);

          // Broadcast user left
          io.emit("user_left", {
            id: socket.id,
            username: userData.username,
          });

          // Broadcast updated user list
          const onlineUsers = Array.from(activeConnections.entries()).map(
            ([socketId, data]) => ({
              id: socketId,
              ...data,
            })
          );

          io.emit("user_list", onlineUsers);
          io.emit("typing_users", Array.from(typingUsers.values()));

          console.log(`👋 ${userData.username} disconnected`);
        }
      } catch (error) {
        console.error("Disconnect error:", error);
      }
    });

    // Error handling
    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  });
}

module.exports = socketHandlers;
