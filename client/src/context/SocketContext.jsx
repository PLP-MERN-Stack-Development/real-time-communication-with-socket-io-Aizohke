
import React, { createContext, useEffect, useState, useContext } from "react";
import { socket } from "../socket/socket";
import { useToast } from "../hooks/use-toast";

const SocketContext = createContext();

export const SocketProvider = ({ children, user }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [messageReactions, setMessageReactions] = useState({});
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    function onConnect() {
      setIsConnected(true);
      console.log("Connected to server");

      // Join with Clerk user info
      socket.emit("user_join", {
        username: user.firstName || user.username || "User",
        userId: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        avatar: user.imageUrl,
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      console.log("Disconnected from server");
      toast({
        title: "Disconnected",
        description: "Connection lost. Attempting to reconnect...",
        variant: "destructive",
      });
    }

    function onReceiveMessage(message) {
      setMessages((prev) => [...prev, message]);
    }

    function onPrivateMessage(message) {
      setMessages((prev) => [...prev, message]);
    }

    function onUserList(userList) {
      setUsers(userList.filter((u) => u.id !== socket.id));
    }

    function onUserJoined(user) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          system: true,
          message: `${user.username} joined the chat`,
          timestamp: new Date().toISOString(),
        },
      ]);

      toast({
        title: "User Joined",
        description: `${user.username} has joined the chat`,
      });
    }

    function onUserLeft(user) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          system: true,
          message: `${user.username} left the chat`,
          timestamp: new Date().toISOString(),
        },
      ]);
    }

    function onTypingUsers(users) {
      setTypingUsers(users);
    }

    function onMessageReaction({ messageId, reaction, username }) {
      setMessageReactions((prev) => ({
        ...prev,
        [messageId]: [...(prev[messageId] || []), { reaction, username }],
      }));
    }

    function onUserInfo(userInfo) {
      console.log("User info received:", userInfo);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("receive_message", onReceiveMessage);
    socket.on("private_message", onPrivateMessage);
    socket.on("user_list", onUserList);
    socket.on("user_joined", onUserJoined);
    socket.on("user_left", onUserLeft);
    socket.on("typing_users", onTypingUsers);
    socket.on("message_reaction", onMessageReaction);
    socket.on("user_info", onUserInfo);

    socket.connect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("receive_message", onReceiveMessage);
      socket.off("private_message", onPrivateMessage);
      socket.off("user_list", onUserList);
      socket.off("user_joined", onUserJoined);
      socket.off("user_left", onUserLeft);
      socket.off("typing_users", onTypingUsers);
      socket.off("message_reaction", onMessageReaction);
      socket.off("user_info", onUserInfo);
      socket.disconnect();
    };
  }, [user, toast]);

  const value = {
    isConnected,
    messages,
    users,
    typingUsers,
    messageReactions,
    setMessages,
    setMessageReactions,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
};