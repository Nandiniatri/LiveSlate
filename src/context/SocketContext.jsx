// src/context/SocketContext.js
import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

// Create the context
const SocketContext = createContext();

// Provider component
export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect to your socket server
    socketRef.current = io("https://chat-backend-52d6.onrender.com"); 
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook
export const useSocket = () => useContext(SocketContext);
