import { useContext } from "react";

import { SocketContext } from "./SocketContext.jsx";

export function useSocketContext() {
  return useContext(SocketContext);
}
