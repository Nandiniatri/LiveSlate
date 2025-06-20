// import { createContext, useContext, useEffect, useState } from "react";
// import { io } from "socket.io-client";

// const UsernameContext = createContext();

// const socket = io("https://chat-backend-52d6.onrender.com");

// export function UsernameProvider({ children }) {
//     const [username, setUsername] = useState("");
//     // console.log(username);
//     const [messages, setMessages] = useState([]);
//     // console.log(messages);

//     useEffect(() => {
//         const name = prompt("Enter your name:");
//         const finalName = name?.trim() || "Anonymous";
//         setUsername(finalName);
//         socket.emit("join", finalName); 
//     }, []);

//     if (!username) return <div className="loading">Loading...</div>;

//     return (
//         <UsernameContext.Provider value={{ username, socket , messages , setMessages}}>
//             {children}
//         </UsernameContext.Provider>
//     );
// }

// export function useUsername() {
//     return useContext(UsernameContext);
// }




import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { supabase } from "../supabaseClient";

const UsernameContext = createContext();

const socket = io("https://chat-backend-52d6.onrender.com");

export function UsernameProvider({ children }) {
    const [username, setUsername] = useState("");         // stores user's display name
    const [messages, setMessages] = useState([]);         // stores chat messages
    const [user, setUser] = useState(null);               // stores Supabase auth user
    const [loading, setLoading] = useState(true);         // to handle initial loading

    // Get name from sessionStorage or default to Anonymous
    useEffect(() => {
        let name = sessionStorage.getItem("username");

        if (!name) {
            // If name is missing or empty, default to "Anonymous"
            name = "Anonymous";
            sessionStorage.setItem("username", name);
        }

        setUsername(name);
        socket.emit("join", name);
    }, []);

    // Get Supabase authenticated user
    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false); // Loading complete
        };

        fetchUser();
    }, []);

    // Handle Google login
    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
        });
        if (error) {
            console.error("Login error:", error.message);
        }
    };

    // Handle logout
    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    // ⏳ Show loading screen while username/user is not ready
    if (loading || !username) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <UsernameContext.Provider
            value={{
                username,
                socket,
                messages,
                setMessages,
                user,
                setUser,
                handleGoogleLogin,
                handleLogout,
            }}
        >
            {children}
        </UsernameContext.Provider>
    );
}

export function useUsername() {
    return useContext(UsernameContext);
}
