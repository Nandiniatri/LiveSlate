import VideoCall from "./videoCall/VideoCall";
import Canvas from "./canvas/Canvas";
import ChatBox from "./chatBox/ChatBox";
import Header from "./header/Header";
import { useState } from "react";


const LiveSlate = ({ roomID }) => {
    const [username, setUsername] = useState("");

    // Prompt only once when component mounts
    useEffect(() => {
        const name = prompt("Enter your name") || "Anonymous";
        setUsername(name);
    }, []);

    return (
        <div className="liveSlate-main-container">
            <Header roomID={roomID} />
            <div className="liveSlate-layout">
                <div className="video-call-wrapper">
                    <VideoCall roomID={roomID} username={username} />
                </div>

                <div className="canvas-wrapper">
                    <Canvas />
                </div>

                <div className="chatbox-wrapper">
                    <ChatBox username={username} setUsername={setUsername} />
                </div>
            </div>
        </div>
    );
};

export default LiveSlate;
