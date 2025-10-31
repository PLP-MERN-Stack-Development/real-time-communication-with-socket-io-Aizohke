
import React, { createContext, useState, useContext, useCallback } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children, user }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState("global");
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadCounts, setUnreadCounts] = useState({});

  const clearUnread = useCallback((userId) => {
    setUnreadCounts((prev) => ({
      ...prev,
      [userId]: 0,
    }));
  }, []);

  const incrementUnread = useCallback((userId) => {
    setUnreadCounts((prev) => ({
      ...prev,
      [userId]: (prev[userId] || 0) + 1,
    }));
  }, []);

  const value = {
    user,
    selectedUser,
    setSelectedUser,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    unreadCounts,
    setUnreadCounts,
    clearUnread,
    incrementUnread,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return context;
};