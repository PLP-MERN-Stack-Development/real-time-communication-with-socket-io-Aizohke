
import React from "react";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import ChatHeader from "../components/ChatHeader";
import MessageInput from "../components/MessageInput";
import { useChat } from "../context/ChatContext";

const ChatPage = () => {
  const { selectedUser, activeTab } = useChat();

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col bg-muted/30">
        <ChatHeader />
        <ChatArea />
        <MessageInput />
      </div>
    </div>
  );
};

export default ChatPage;