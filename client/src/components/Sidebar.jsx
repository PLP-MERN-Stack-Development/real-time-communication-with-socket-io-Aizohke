
import React from "react";
import { Users, LogOut, Search, Bell, BellOff, Settings } from "lucide-react";
import { UserButton, useUser } from "@clerk/clerk-react";
import { useChat } from "../context/ChatContext";
import { useSocket } from "../context/SocketContext";
import { useNotifications } from "../hooks/useNotifications";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "./ui/tooltip";
import UserAvatar from "./UserAvatar";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const { user } = useUser();
  const {
    selectedUser,
    setSelectedUser,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    unreadCounts,
    clearUnread,
  } = useChat();
  const { users, isConnected } = useSocket();
  const { notificationsEnabled, toggleNotifications } = useNotifications();

  const handleUserClick = (clickedUser) => {
    setSelectedUser(clickedUser.id);
    setActiveTab("private");
    clearUnread(clickedUser.id);
  };

  const handleGlobalChat = () => {
    setActiveTab("global");
    setSelectedUser(null);
    clearUnread("global");
  };

  return (
    <div className="w-80 bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <UserAvatar user={user} size="default" showStatus={true} />
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-foreground truncate">
                {user?.firstName || user?.username || "User"}
              </h2>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <span
                  className={cn(
                    "w-2 h-2 rounded-full",
                    isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
                  )}
                ></span>
                {isConnected ? "Online" : "Offline"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={toggleNotifications}
                    className="p-2 hover:bg-accent rounded-lg transition"
                  >
                    {notificationsEnabled ? (
                      <Bell className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <BellOff className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  {notificationsEnabled
                    ? "Disable notifications"
                    : "Enable notifications"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-muted border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none text-sm"
          />
        </div>
      </div>

      {/* Global Chat Button */}
      <div className="p-4 border-b border-border">
        <button
          onClick={handleGlobalChat}
          className={cn(
            "w-full px-4 py-3 rounded-lg font-medium transition flex items-center justify-between",
            activeTab === "global"
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-muted text-foreground hover:bg-accent"
          )}
        >
          <span className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Global Chat
          </span>
          {unreadCounts.global > 0 && (
            <span className="bg-destructive text-destructive-foreground text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center font-semibold">
              {unreadCounts.global}
            </span>
          )}
        </button>
      </div>

      {/* Users List */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3 px-2">
            Online Users ({users.length})
          </h3>
          <div className="space-y-1">
            {users.map((chatUser) => (
              <button
                key={chatUser.id}
                onClick={() => handleUserClick(chatUser)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg transition group",
                  selectedUser === chatUser.id
                    ? "bg-accent border-2 border-primary"
                    : "hover:bg-accent/50 border-2 border-transparent"
                )}
              >
                <UserAvatar user={chatUser} size="default" showStatus={true} />
                <div className="flex-1 text-left min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {chatUser.username}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    Click to chat
                  </p>
                </div>
                {unreadCounts[chatUser.id] > 0 && (
                  <span className="bg-destructive text-destructive-foreground text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center font-semibold">
                    {unreadCounts[chatUser.id]}
                  </span>
                )}
              </button>
            ))}
            {users.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No users online</p>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;