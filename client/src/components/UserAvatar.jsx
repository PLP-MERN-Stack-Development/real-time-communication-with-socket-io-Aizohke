import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { getInitials, generateAvatarColor } from "@/lib/utils";

const UserAvatar = ({ user, size = "default", showStatus = false }) => {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    default: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
  };

  return (
    <div className="relative">
      <Avatar className={sizeClasses[size]}>
        <AvatarImage
          src={user?.avatar || user?.imageUrl}
          alt={user?.username || user?.firstName}
        />
        <AvatarFallback
          className={`bg-gradient-to-br ${generateAvatarColor(
            user?.username || user?.firstName || "User"
          )} text-white font-semibold`}
        >
          {getInitials(user?.username || user?.firstName || "User")}
        </AvatarFallback>
      </Avatar>
      {showStatus && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
      )}
    </div>
  );
};

export default UserAvatar;