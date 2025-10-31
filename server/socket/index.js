const onlineUsers = new Map();

export const handleSocketConnection = (io) => {
  io.on("connection", (socket) => {
    const userId = socket.user?.id;
    if (!userId) return socket.disconnect();

    console.log(`🔌 ${userId} connected`);
    onlineUsers.set(userId, socket.id);

    io.emit(
      "user_list",
      Array.from(onlineUsers.entries()).map(([id]) => ({ id }))
    );

    socket.on("disconnect", () => {
      console.log(`❌ ${userId} disconnected`);
      onlineUsers.delete(userId);
      io.emit(
        "user_list",
        Array.from(onlineUsers.entries()).map(([id]) => ({ id }))
      );
    });

    // Broadcast messages globally (example)
    socket.on("send_message", (msg) => {
      io.emit("receive_message", { userId, text: msg });
    });

    // Private message
    socket.on("private_message", ({ recipientId, text }) => {
      const recipientSocket = onlineUsers.get(recipientId);
      if (recipientSocket)
        io.to(recipientSocket).emit("receive_private_message", {
          from: userId,
          text,
        });
    });
  });
};
