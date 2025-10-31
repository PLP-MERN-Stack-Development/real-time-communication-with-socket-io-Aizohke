
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  transports: ["websocket", "polling"],
});

socket.on("connect_error", (error) => {
  console.error("Connection error:", error);
});

socket.on("reconnect", (attemptNumber) => {
  console.log("Reconnected after", attemptNumber, "attempts");
});

socket.on("reconnect_attempt", (attemptNumber) => {
  console.log("Reconnection attempt:", attemptNumber);
});

socket.on("reconnect_failed", () => {
  console.error("Failed to reconnect");
});

export default socket;