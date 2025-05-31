import VideoCall from "./videoCall/VideoCall";
import Canvas from "./canvas/Canvas";
import ChatBox from "./chatBox/ChatBox";
import Header from "./header/Header";


const LiveSlate = () => {
    return (
        <div className="liveSlate-main-container">
            <Header />
            <div className="liveSlate-layout">
                <div className="video-call-wrapper">
                    <VideoCall />
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
