import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const UsernameContext = createContext();

const socket = io("https://chat-backend-52d6.onrender.com");

export function UsernameProvider({ children }) {
    const [username, setUsername] = useState("");
    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState(null);

    // useEffect(() => {
    //     const name = prompt("Enter your name:");
    //     const finalName = name?.trim() || "Anonymous";
    //     setUsername(finalName);
    //     socket.emit("join", finalName);
    // }, []);

    useEffect(() => {
        let name = sessionStorage.getItem("username");

        if (!name) {
            // name = prompt("Enter your name:");
            name = name?.trim() || "Anonymous";
            sessionStorage.setItem("username", name);
        }

        setUsername(name);
        socket.emit("join", name);
    }, []);


    if (!username) return <div className="loading">Loading...</div>;

    return (
        <UsernameContext.Provider value={{ username, socket, messages, setMessages, user, setUser }}>
            {children}
        </UsernameContext.Provider>
    );
}

export function useUsername() {
    return useContext(UsernameContext);
}
