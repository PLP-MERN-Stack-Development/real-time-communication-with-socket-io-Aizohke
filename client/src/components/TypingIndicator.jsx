import React from "react";

const TypingIndicator = ({ users }) => {
  if (!users || users.length === 0) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground ml-12 py-2">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
        <span
          className="w-2 h-2 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: "0.1s" }}
        ></span>
        <span
          className="w-2 h-2 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></span>
      </div>
      <span>
        {users.join(", ")} {users.length === 1 ? "is" : "are"} typing...
      </span>
    </div>
  );
};

export default TypingIndicator;