// import Canvas from "./canvas/Canvas";
// import ChatBox from "./chatBox/ChatBox";
// import Header from "./header/Header";
// import VideoCall from "./videoCall/VideoCall";


// const LiveSlate = () => {
//     return (
//         <div className="liveSlate-main-container">
//             <Header />
//             <div className="liveSlate-div2">

//                 <div className="video-call-section">
//                     <VideoCall />
//                 </div>

//                 <Canvas />

//                 <div className="chat-section">
//                     <ChatBox />
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default LiveSlate;



import Canvas from "./canvas/Canvas";
import ChatBox from "./chatBox/ChatBox";
import Header from "./header/Header";
import VideoCall from "./videoCall/VideoCall";


const LiveSlate = () => {
    return (
        <div className="liveSlate-main-container">
            <Header />
            <div className="liveSlate-div2">

                <VideoCall />

                <Canvas />

                <ChatBox />
            </div>
        </div>
    )
}

export default LiveSlate;