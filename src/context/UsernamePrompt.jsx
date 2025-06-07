import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const UsernameContext = createContext();

const socket = io("https://chat-backend-52d6.onrender.com");

export function UsernameProvider({ children }) {
    const [username, setUsername] = useState("");
    // console.log(username);
    const [messages, setMessages] = useState([]);
    // console.log(messages);

    useEffect(() => {
        const name = prompt("Enter your name:");
        const finalName = name?.trim() || "Anonymous";
        setUsername(finalName);
        socket.emit("join", finalName);
    }, []);

    if (!username) return <div className="loading">Loading...</div>;

    return (
        <UsernameContext.Provider value={{ username, socket , messages , setMessages}}>
            {children}
        </UsernameContext.Provider>
    );
}

export function useUsername() {
    return useContext(UsernameContext);
}
