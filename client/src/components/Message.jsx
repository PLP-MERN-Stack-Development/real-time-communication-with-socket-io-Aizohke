import React, { useState } from "react";
import { CheckCheck, Smile, MoreVertical } from "lucide-react";
import { useSocket } from "../context/SocketContext";
import { useUser } from "@clerk/clerk-react";
import { socket } from "../socket/socket";
import { formatTimestamp } from "@/lib/utils";
import UserAvatar from "./UserAvatar";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Message = ({ message, isOwnMessage }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { messageReactions } = useSocket();
  const { user } = useUser();

  const emojis = ["👍", "❤️", "😂", "😮", "😢", "🎉"];
  const reactions = messageReactions[message.id] || [];

  const handleReaction = (emoji) => {
    socket.emit("add_reaction", { messageId: message.id, reaction: emoji });
    setShowEmojiPicker(false);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message.message);
  };

  if (message.system) {
    return (
      <div className="flex justify-center my-2">
        <span className="bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full">
          {message.message}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex gap-3 group animate-in fade-in-0 slide-in-from-bottom-2",
        isOwnMessage ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "flex gap-3 max-w-xl",
          isOwnMessage && "flex-row-reverse"
        )}
      >
        {!isOwnMessage && <UserAvatar user={message} size="sm" />}

        <div className="flex flex-col gap-1">
          {!isOwnMessage && (
            <p className="text-xs text-muted-foreground ml-1 font-medium">
              {message.sender}
            </p>
          )}

          <div className="relative">
            <div
              className={cn(
                "px-4 py-2 rounded-2xl max-w-md break-words",
                isOwnMessage
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-card text-card-foreground border border-border rounded-bl-sm shadow-sm"
              )}
            >
              <p className="whitespace-pre-wrap">{message.message}</p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={cn(
                    "text-xs",
                    isOwnMessage
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  )}
                >
                  {formatTimestamp(message.timestamp)}
                </span>
                {isOwnMessage && (
                  <CheckCheck
                    className={cn(
                      "w-3 h-3",
                      isOwnMessage
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    )}
                  />
                )}
              </div>
            </div>

            {/* Message Actions */}
            <div
              className={cn(
                "absolute top-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
                isOwnMessage ? "-left-20" : "-right-20"
              )}
            >
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-1.5 hover:bg-accent rounded-full transition"
                title="Add reaction"
              >
                <Smile className="w-4 h-4 text-muted-foreground" />
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1.5 hover:bg-accent rounded-full transition">
                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={isOwnMessage ? "end" : "start"}>
                  <DropdownMenuItem onClick={handleCopyMessage}>
                    Copy Message
                  </DropdownMenuItem>
                  <DropdownMenuItem>Reply</DropdownMenuItem>
                  <DropdownMenuItem>Forward</DropdownMenuItem>
                  {isOwnMessage && (
                    <DropdownMenuItem className="text-destructive">
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div
                className={cn(
                  "absolute top-full mt-2 bg-popover rounded-lg shadow-lg border border-border p-2 flex gap-1 z-10 animate-in fade-in-0 zoom-in-95",
                  isOwnMessage ? "right-0" : "left-0"
                )}
              >
                {emojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleReaction(emoji)}
                    className="hover:bg-accent p-2 rounded transition text-xl hover:scale-110"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}

            {/* Reactions Display */}
            {reactions.length > 0 && (
              <div
                className={cn(
                  "absolute -bottom-5 flex gap-1 flex-wrap",
                  isOwnMessage ? "right-0" : "left-0"
                )}
              >
                {Array.from(new Set(reactions.map((r) => r.reaction))).map(
                  (emoji) => {
                    const count = reactions.filter(
                      (r) => r.reaction === emoji
                    ).length;
                    const users = reactions
                      .filter((r) => r.reaction === emoji)
                      .map((r) => r.username);
                    return (
                      <span
                        key={emoji}
                        className="bg-card rounded-full px-2 py-0.5 text-xs border border-border flex items-center gap-1 cursor-help shadow-sm"
                        title={users.join(", ")}
                      >
                        {emoji}{" "}
                        {count > 1 && (
                          <span className="text-muted-foreground">{count}</span>
                        )}
                      </span>
                    );
                  }
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;