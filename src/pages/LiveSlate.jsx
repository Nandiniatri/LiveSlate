import VideoCall from "./videoCall/VideoCall";
import Canvas from "./canvas/Canvas";
import ChatBox from "./chatBox/ChatBox";
import Header from "./header/Header";


const LiveSlate = ({ roomID }) => {
    return (
        <div className="liveSlate-main-container">
            <Header roomID={roomID} />
            <div className="liveSlate-layout">
                <div className="video-call-wrapper">
                    <VideoCall roomID={roomID} />
                </div>

                <div className="canvas-wrapper">
                    <Canvas />
                </div>

                <div className="chatbox-wrapper">
                    <ChatBox />
                </div>
            </div>
        </div>
    );
};

export default LiveSlate;
