import VideoCall from "./videoCall/VideoCall";
import Canvas from "./canvas/Canvas";
import ChatBox from "./chatBox/ChatBox";
import Header from "./header/Header";
import { UsernameProvider } from "../context/UsernamePrompt";
import { useState } from "react";

const LiveSlate = ({ roomID }) => {
    const [isChatOpenHeader, setIsChatOpenHeader] = useState(false);

    const handleSideChatBox = () => {
        setIsChatOpenHeader(prev => !prev);
    };

    return (
        <div className="liveSlate-main-container">
            <UsernameProvider>
                <Header roomID={roomID} handleSideChatBox={handleSideChatBox} />

                <div className="liveSlate-layout">
                    <div className="video-call-wrapper">
                        <VideoCall roomID={roomID} />
                    </div>

                    <div className="wrap-comp-div2">
                        <div className="canvas-wrapper">
                            <Canvas />
                        </div>

                        {/* <div className="chatbox-wrapper">
                            <ChatBox />
                        </div> */}

                        <div className={`chatbox-wrapper ${isChatOpenHeader ? "active-chat" : ""}`}>
                            <ChatBox />
                        </div>
                    </div>
                </div>
            </UsernameProvider>
        </div>
    );
};

export default LiveSlate;
