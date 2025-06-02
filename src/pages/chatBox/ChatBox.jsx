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
    socket.emit("join", name || "Anonymous");
  }, []);

  useEffect(() => {
    axios
      .get("https://chat-backend-52d6.onrender.com/messages")
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Failed to fetch messages:", err));

    socket.on("chat message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("user joined", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    return () => {
      socket.off("chat message");
      socket.off("user joined");
      socket.off("connect_error");
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
        <button onClick={() => setShowEmojiPicker(prev => !prev)}>😊</button>
        <button onClick={sendMessage}><IoMdSend size={20} /></button>
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
