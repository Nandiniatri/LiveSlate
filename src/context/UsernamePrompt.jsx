// UsernameContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const UsernameContext = createContext();

const socket = io("https://chat-backend-52d6.onrender.com");

export function UsernameProvider({ children }) {
    const [username, setUsername] = useState("");

    //   useEffect(() => {
    //     const name = prompt("Enter your name:");
    //     const finalName = name || "Anonymous";
    //     setUsername(finalName);
    //     socket.emit("join", finalName); 
    //   }, []);

    useEffect(() => {
        const name = prompt("Enter your name:");
        console.log(name);

        setUsername(name || "Anonymous");
        socket.emit("join", name || "Anonymous");
    }, []);

    return (
        <UsernameContext.Provider value={{ username, socket }}>
            {children}
        </UsernameContext.Provider>
    );
}

export function useUsername() {
    return useContext(UsernameContext);
}
