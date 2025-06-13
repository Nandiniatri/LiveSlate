// import VideoCall from "./videoCall/VideoCall";
// import Canvas from "./canvas/Canvas";
// import ChatBox from "./chatBox/ChatBox";
// import Header from "./header/Header";
// import { UsernameProvider } from "../context/UsernamePrompt";
// import { useState } from "react";

// const LiveSlate = ({ roomID }) => {
//     const [isChatOpenHeader, setIsChatOpenHeader] = useState(false);

//     const handleSideChatBox = () => {
//         setIsChatOpenHeader(prev => !prev);
//     };

//     return (
//         <div className="liveSlate-main-container">
//             <UsernameProvider>
//                 <Header roomID={roomID} handleSideChatBox={handleSideChatBox} />

//                 <div className="liveSlate-layout">
//                     <div className="video-call-wrapper">
//                         <VideoCall roomID={roomID} />
//                     </div>

//                     <div className="wrap-comp-div2">
//                         <div className="canvas-wrapper">
//                             <Canvas />
//                         </div>

//                         {/* <div className="chatbox-wrapper">
//                             <ChatBox />
//                         </div> */}

//                         {/* <div className={`chatbox-wrapper ${isChatOpenHeader ? "active-chat" : ""}`}>
//                             <ChatBox />
//                         </div> */}

//                         <div className={`chatbox-wrapper ${isChatOpenHeader ? "active-chat" : ""}`}>
//                             <ChatBox />
//                         </div>

//                     </div>
//                 </div>
//             </UsernameProvider>
//         </div>
//     );
// };

// export default LiveSlate;



import VideoCall from "./videoCall/VideoCall";
import Canvas from "./canvas/Canvas";
import ChatBox from "./chatBox/ChatBox";
import Header from "./header/Header";
import { UsernameProvider } from "../context/UsernamePrompt";
import { useState } from "react";

const LiveSlate = ({ roomID }) => {
    const [isChatOpen, setIsChatOpen] = useState(false); 

    const handleSideChatBox = () => {
        setIsChatOpen(prev => !prev);
    };

    return (
        <div className="liveSlate-main-container" style={{ position: "relative" }}>
            <UsernameProvider>
                <Header roomID={roomID} handleSideChatBox={handleSideChatBox} />

                <div className="liveSlate-layout">
                    <div className="video-call-wrapper">
                        <VideoCall roomID={roomID} />
                    </div>

                    <div className="wrap-comp-div2" style={{ position: "relative" }}>
                        <div className="canvas-wrapper">
                            <Canvas />
                        </div>

                        {isChatOpen && (
                            <div className="floating-chatbox">
                                <ChatBox />
                            </div>
                        )}
                    </div>
                </div>
            </UsernameProvider>
        </div>
    );
};

export default LiveSlate;
