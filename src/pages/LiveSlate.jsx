import VideoCall from "./videoCall/VideoCall";
import Canvas from "./canvas/Canvas";
import ChatBox from "./chatBox/ChatBox";
import Header from "./header/Header";
import { useEffect, useState } from "react";


const LiveSlate = ({ roomID }) => {
    const [username, setUsername] = useState("");

    // Prompt only once when component mounts
    useEffect(() => {
        const name = prompt("Enter your name") || "Anonymous";
        setUsername(name);
        console.log("USERNAME FROM PROMPT:", name); // ✅ add this line
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


// import { useState, useEffect } from "react";
// import VideoCall from "./videoCall/VideoCall";
// import Canvas from "./canvas/Canvas";
// import ChatBox from "./chatBox/ChatBox";
// import Header from "./header/Header";


// const LiveSlate = ({ roomID }) => {
//   const [username, setUsername] = useState("");

//   // Ek baar yahi username prompt se le lo
//   useEffect(() => {
//     const name = prompt("Enter your name") || "Anonymous";
//     setUsername(name);
//   }, []);

//   return (
//     <div className="liveSlate-main-container">
//       <Header roomID={roomID} />

//       <div className="liveSlate-layout">
//         <div className="video-call-wrapper">
//           {/* Jab tak username na aaye tab tak VideoCall mat dikhana */}
//           {username && <VideoCall roomID={roomID} username={username} />}
//         </div>

//         <div className="canvas-wrapper">
//           <Canvas />
//         </div>

//         <div className="chatbox-wrapper">
//           {/* ChatBox ko username as prop do */}
//           <ChatBox username={username} setUsername={setUsername} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LiveSlate;
