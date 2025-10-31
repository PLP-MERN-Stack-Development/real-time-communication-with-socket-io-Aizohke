import React, { useState, useRef } from "react";
import { Send, Paperclip, Smile, Image as ImageIcon } from "lucide-react";
import { useChat } from "../context/ChatContext";
import { useSocket } from "../context/SocketContext";
import { socket } from "../socket/socket";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "./ui/tooltip";

const MessageInput = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const { activeTab, selectedUser } = useChat();
  const { users } = useSocket();

  const quickEmojis = ["😊", "😂", "❤️", "👍", "🎉", "🔥", "💯", "✨"];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    if (activeTab === "global") {
      socket.emit("send_message", { message: inputMessage });
    } else if (selectedUser) {
      socket.emit("private_message", {
        to: selectedUser,
        message: inputMessage,
      });
    }

    setInputMessage("");
    handleTyping(false);
  };

  const handleTyping = (isTyping) => {
    if (activeTab === "global") {
      socket.emit("typing", isTyping);
    }
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    handleTyping(true);

    typingTimeoutRef.current = setTimeout(() => {
      handleTyping(false);
    }, 1000);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const fileData = {
        name: file.name,
        type: file.type,
        data: event.target.result,
      };

      if (activeTab === "global") {
        socket.emit("send_message", {
          message: `📎 Shared a file: ${file.name}`,
          file: fileData,
        });
      } else if (selectedUser) {
        socket.emit("private_message", {
          to: selectedUser,
          message: `📎 Shared a file: ${file.name}`,
          file: fileData,
        });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const insertEmoji = (emoji) => {
    setInputMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const selectedUserData = users.find((u) => u.id === selectedUser);
  const placeholder =
    activeTab === "global"
      ? "Type a message..."
      : selectedUser
      ? `Message ${selectedUserData?.username || "user"}...`
      : "Select a chat to start messaging";

  const isDisabled = activeTab !== "global" && !selectedUser;

  return (
    <div className="bg-card border-t border-border p-4">
      <form onSubmit={handleSendMessage} className="flex items-center gap-3">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.txt"
          disabled={isDisabled}
        />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 hover:bg-accent rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isDisabled}
              >
                <Paperclip className="w-5 h-5 text-muted-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Attach file</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="relative">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 hover:bg-accent rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isDisabled}
                >
                  <Smile className="w-5 h-5 text-muted-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Add emoji</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {showEmojiPicker && (
            <div className="absolute bottom-full mb-2 left-0 bg-popover rounded-lg shadow-lg border border-border p-3 flex gap-2 z-10 animate-in fade-in-0 zoom-in-95">
              {quickEmojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => insertEmoji(emoji)}
                  className="hover:bg-accent p-2 rounded transition text-xl hover:scale-110"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        <input
          type="text"
          value={inputMessage}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={isDisabled}
          className="flex-1 px-4 py-3 bg-muted border border-input rounded-full focus:ring-2 focus:ring-ring focus:border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          maxLength={500}
        />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="submit"
                disabled={!inputMessage.trim() || isDisabled}
                className="bg-primary text-primary-foreground p-3 rounded-full hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none shadow-md"
              >
                <Send className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Send message</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </form>
    </div>
  );
};

export default MessageInput;
