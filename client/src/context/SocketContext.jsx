import { createContext } from "react";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL || "http://localhost:5000", {
  autoConnect: true,
});

const SocketContext = createContext(socket);

export function SocketProvider({ children }) {
  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}

export { SocketContext };
