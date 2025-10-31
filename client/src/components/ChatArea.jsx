import React, { useEffect, useRef } from "react";
import { useSocket } from "../context/SocketContext";
import { useChat } from "../context/ChatContext";
import { useNotifications } from "../hooks/useNotifications";
import { ScrollArea } from "./ui/scroll-area";
import Message from "./Message";
import TypingIndicator from "./TypingIndicator";
import { socket } from "../socket/socket";
import { MessageSquare } from "lucide-react";

const ChatArea = () => {
  const { messages, typingUsers } = useSocket();
  const { activeTab, selectedUser, searchQuery, incrementUnread } = useChat();
  const { playNotificationSound, showBrowserNotification } = useNotifications();
  const messagesEndRef = useRef(null);
  const scrollAreaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle notifications
  useEffect(() => {
    if (messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];

    if (lastMessage.senderId !== socket.id && !lastMessage.system) {
      playNotificationSound();
      showBrowserNotification(lastMessage);

      // Update unread counts
      if (activeTab === "global" && !lastMessage.isPrivate) {
        // In global chat, message is visible
      } else if (lastMessage.isPrivate) {
        const otherUser =
          lastMessage.senderId === socket.id
            ? lastMessage.recipientId
            : lastMessage.senderId;
        if (selectedUser !== otherUser) {
          incrementUnread(otherUser);
        }
      } else if (activeTab !== "global" && !lastMessage.isPrivate) {
        // User is in private chat but message came to global
        incrementUnread("global");
      }
    }
  }, [messages]);

  const filteredMessages = messages.filter((msg) => {
    if (activeTab === "global") {
      return !msg.isPrivate;
    } else if (selectedUser) {
      return (
        msg.isPrivate &&
        (msg.senderId === selectedUser || msg.recipientId === selectedUser)
      );
    }
    return false;
  });

  const searchedMessages = searchQuery
    ? filteredMessages.filter(
        (msg) =>
          msg.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          msg.sender?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredMessages;

  return (
    <ScrollArea className="flex-1 p-6">
      <div className="space-y-4 pb-4">
        {searchedMessages.length === 0 ? (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground text-lg mb-2">
                No messages yet
              </p>
              <p className="text-muted-foreground/70 text-sm">
                {activeTab === "global"
                  ? "Be the first to send a message!"
                  : "Start a conversation!"}
              </p>
            </div>
          </div>
        ) : (
          <>
            {searchedMessages.map((msg) => (
              <Message
                key={msg.id}
                message={msg}
                isOwnMessage={msg.senderId === socket.id}
              />
            ))}

            {typingUsers.length > 0 && activeTab === "global" && (
              <TypingIndicator users={typingUsers} />
            )}
          </>
        )}

        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default ChatArea;
