import React from "react";
import { Users, Phone, Video, MoreVertical, Info } from "lucide-react";
import { useChat } from "../context/ChatContext";
import { useSocket } from "../context/SocketContext";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "./ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import UserAvatar from "./UserAvatar";

const ChatHeader = () => {
  const { activeTab, selectedUser } = useChat();
  const { users } = useSocket();

  const selectedUserData = users.find((u) => u.id === selectedUser);

  return (
    <div className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {activeTab === "global" ? (
            <>
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Global Chat
                </h2>
                <p className="text-sm text-muted-foreground">
                  {users.length + 1} members online
                </p>
              </div>
            </>
          ) : selectedUserData ? (
            <>
              <UserAvatar user={selectedUserData} size="lg" showStatus={true} />
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {selectedUserData.username}
                </h2>
                <p className="text-sm text-green-600 flex items-center gap-1 dark:text-green-400">
                  <span className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full"></span>
                  Online
                </p>
              </div>
            </>
          ) : (
            <div className="text-muted-foreground">
              <h2 className="text-lg font-semibold">Select a chat</h2>
              <p className="text-sm">Choose a user to start messaging</p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-2 hover:bg-accent rounded-lg transition">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Voice call</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-2 hover:bg-accent rounded-lg transition">
                  <Video className="w-5 h-5 text-muted-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Video call</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-2 hover:bg-accent rounded-lg transition">
                  <Info className="w-5 h-5 text-muted-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Chat info</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 hover:bg-accent rounded-lg transition">
                <MoreVertical className="w-5 h-5 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Profile</DropdownMenuItem>
              <DropdownMenuItem>Search Messages</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Mute Notifications</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                Clear Chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
