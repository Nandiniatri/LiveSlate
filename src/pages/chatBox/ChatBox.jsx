// import { useEffect, useState, useRef } from "react";
// import { io } from "socket.io-client";
// import axios from "axios";
// import EmojiPicker from "emoji-picker-react";
// import { IoMdSend } from "react-icons/io";

// const socket = io("https://chat-backend-52d6.onrender.com");

// function ChatBox() {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [username, setUsername] = useState("");
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     const name = prompt("Enter your name:");
//     setUsername(name || "Anonymous");
//   }, []);

//   useEffect(() => {
//     axios
//       .get("https://chat-backend-52d6.onrender.com/messages")
//       .then((res) => setMessages(res.data))
//       .catch((err) => console.error("Failed to fetch messages:", err));

//     socket.on("chat message", (msg) => {
//       setMessages((prev) => [...prev, msg]);
//     });

//     socket.on("user joined", (joinedUser) => {
//       setMessages((prev) => [
//         ...prev,
//         { username: "System", message: `${joinedUser} has joined the chat`, timestamp: new Date() },
//       ]);
//     });

//     socket.on("connect_error", (err) => {
//       console.error("Socket connection error:", err);
//     });

//     return () => {
//       socket.off("chat message");
//       socket.off("user joined");
//       socket.off("connect_error");
//     };
//   }, []);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const sendMessage = () => {
//     if (newMessage.trim() === "") return;
//     socket.emit("chat message", {
//       username,
//       message: newMessage,
//       timestamp: new Date().toISOString(),
//     });
//     setNewMessage("");
//     setShowEmojiPicker(false);
//   };

//   const handleEmojiClick = (emojiData) => {
//     setNewMessage((prev) => prev + emojiData.emoji);
//   };

//   const toggleEmojiPicker = () => {
//     setShowEmojiPicker((prev) => !prev);
//   };

//   return (
//     <div className="chat-container">
//       <div className="chat-box">
//         {messages.map((msg, i) => (
//           <div
//             key={i}
//             className={`chat-bubble ${msg.username === username ? "sender" : "receiver"}`}
//           >
//             <div className="message-text">{msg.message}</div>
//             <div className="message-meta">
//               <span>{msg.username}</span> |{" "}
//               <span>
//                 {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ""}
//               </span>
//             </div>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       <div className="chat-input">
//         <input
//           type="text"
//           placeholder="Type a message"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//         />
//         <button onClick={sendMessage}><IoMdSend /></button>
//         <button onClick={toggleEmojiPicker}>😊</button>

//         {showEmojiPicker && (
//           <div className="emoji-picker">
//             <EmojiPicker onEmojiClick={handleEmojiClick} />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ChatBox;



import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import { IoMdSend } from "react-icons/io";

const socket = io("https://chat-backend-52d6.onrender.com");

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const name = prompt("Enter your name:");
    setUsername(name || "Anonymous");
  }, []);

  useEffect(() => {
    axios
      .get("https://chat-backend-52d6.onrender.com/messages")
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Failed to fetch messages:", err));

    socket.on("chat message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("user joined", (joinedUser) => {
      setMessages((prev) => [
        ...prev,
        { username: "System", message: `${joinedUser} has joined the chat`, timestamp: new Date() },
      ]);
    });

    return () => {
      socket.off("chat message");
      socket.off("user joined");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim() === "") return;
    socket.emit("chat message", {
      username,
      message: newMessage,
      timestamp: new Date().toISOString(),
    });
    setNewMessage("");
    setShowEmojiPicker(false);
  };

  return (
    <div className="chat-panel">
      <h2 className="chat-title">CHAT</h2>
      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble ${msg.username === username ? "sender" : "receiver"}`}>
            <div className="message-text">{msg.message}</div>
            <div className="message-meta">
              <span>{msg.username}</span> |{" "}
              <span>{msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ""}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}><IoMdSend size={20} /></button>
        <button onClick={() => setShowEmojiPicker(prev => !prev)}>😊</button>
      </div>

      {showEmojiPicker && (
        <div className="emoji-picker">
          <EmojiPicker onEmojiClick={(e) => setNewMessage(prev => prev + e.emoji)} />
        </div>
      )}
    </div>
  );
}

export default ChatBox;
