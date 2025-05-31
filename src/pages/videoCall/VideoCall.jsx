import { io } from "socket.io-client";
import { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const socket = io("https://videocallbackend-rjrw.onrender.com");
const servers = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

const VideoCall = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const localStreamRef = useRef(null);
  const { roomID } = useParams();
  const [inCall, setInCall] = useState(false);

  const createPeerConnection = () => {
    peerConnection.current = new RTCPeerConnection(servers);

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("signal", {
          roomId: roomID,
          data: { candidate: event.candidate },
        });
      }
    };

    peerConnection.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        peerConnection.current.addTrack(track, localStreamRef.current);
      });
    }
  };

  useEffect(() => {
    const getLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing media devices.", error);
      }
    };

    getLocalStream();

    socket.emit("join-room", roomID);

    socket.on("created", async () => {
      createPeerConnection();
      setInCall(true);
    });

    socket.on("joined", async () => {
      createPeerConnection();
      socket.emit("ready", roomID);
      setInCall(true);
    });

    socket.on("ready", async () => {
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      socket.emit("signal", { roomId: roomID, data: { offer } });
    });

    socket.on("signal", async ({ data }) => {
      if (data.offer) {
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(data.offer)
        );
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        socket.emit("signal", { roomId: roomID, data: { answer } });
      } else if (data.answer) {
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(data.answer)
        );
      } else if (data.candidate) {
        try {
          await peerConnection.current.addIceCandidate(
            new RTCIceCandidate(data.candidate)
          );
        } catch (err) {
          console.error("ICE error", err);
        }
      }
    });

    return () => {
      socket.off("created");
      socket.off("joined");
      socket.off("ready");
      socket.off("signal");
    };
  }, [roomID]);

  return (
    <>
      <h2 className="video-call-title">VIDEO CALL</h2>

      <div className="video-box">
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="video-feed"
        />
        <span className="live-tag">LIVE</span>
      </div>

      <div className="video-box remote">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="video-feed"
        />
      </div>
    </>
  );
};

export default VideoCall;


















// import { io } from "socket.io-client";
// import { useRef, useState, useEffect } from "react";
// import { useParams } from "react-router-dom";

// const socket = io("https://videocallbackend-rjrw.onrender.com");
// const servers = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

// const VideoCall = () => {
//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const peerConnection = useRef(null);
//   const localStreamRef = useRef(null);
//   // const [roomId, setRoomId] = useState("");
//   const [inCall, setInCall] = useState(false);
//   const { roomID } = useParams();
//   console.log(roomID);
  

//   const startCall = () => {
//     socket.emit("join-room", roomID);
//   };

//   const createPeerConnection = () => {
//     peerConnection.current = new RTCPeerConnection(servers);

//     peerConnection.current.onicecandidate = (event) => {
//       if (event.candidate) {
//         socket.emit("signal", {
//           roomId,
//           data: { candidate: event.candidate },
//         });
//       }
//     };

//     peerConnection.current.ontrack = (event) => {
//       if (remoteVideoRef.current) {
//         remoteVideoRef.current.srcObject = event.streams[0];
//       }
//     };

//     if (localStreamRef.current) {
//       localStreamRef.current.getTracks().forEach((track) => {
//         peerConnection.current.addTrack(track, localStreamRef.current);
//       });
//     }
//   };

//   useEffect(() => {
//     const getLocalStream = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: true,
//           audio: true,
//         });
//         localStreamRef.current = stream;
//         localVideoRef.current.srcObject = stream;
//       } catch (error) {
//         console.error("Error accessing media devices.", error);
//       }
//     };

//     getLocalStream();

//     socket.on("created", async () => {
//       createPeerConnection();
//       setInCall(true);
//     });

//     socket.on("joined", async () => {
//       createPeerConnection();
//       socket.emit("ready", roomId);
//       setInCall(true);
//     });

//     socket.on("ready", async () => {
//       const offer = await peerConnection.current.createOffer();
//       await peerConnection.current.setLocalDescription(offer);
//       socket.emit("signal", { roomId, data: { offer } });
//     });

//     socket.on("signal", async ({ data }) => {
//       if (data.offer) {
//         await peerConnection.current.setRemoteDescription(
//           new RTCSessionDescription(data.offer)
//         );
//         const answer = await peerConnection.current.createAnswer();
//         await peerConnection.current.setLocalDescription(answer);
//         socket.emit("signal", { roomId, data: { answer } });
//       } else if (data.answer) {
//         await peerConnection.current.setRemoteDescription(
//           new RTCSessionDescription(data.answer)
//         );
//       } else if (data.candidate) {
//         try {
//           await peerConnection.current.addIceCandidate(
//             new RTCIceCandidate(data.candidate)
//           );
//         } catch (err) {
//           console.error("ICE error", err);
//         }
//       }
//     });

//     return () => {
//       socket.off("created");
//       socket.off("joined");
//       socket.off("ready");
//       socket.off("signal");
//     };
//   }, [roomId]);

//   return (
//     <>
//       <h2 className="video-call-title">VIDEO CALL</h2>

//       <div className="video-box">
//         <video
//           ref={localVideoRef}
//           autoPlay
//           playsInline
//           muted
//           className="video-feed"
//         />
//         <span className="live-tag">LIVE</span>
//       </div>

//       <div className="video-box remote">
//         <video
//           ref={remoteVideoRef}
//           autoPlay
//           playsInline
//           className="video-feed"
//         />
//       </div>

//       <div className="join-controls">
//         <input
//           placeholder="Enter Room ID"
//           value={roomId}
//           onChange={(e) => setRoomId(e.target.value)}
//           className="room-input"
//         />
//         <button onClick={startCall} disabled={inCall || !roomId} className="join-btn">
//           Join Call
//         </button>
//       </div>
//     </>
//   );

// };

// export default VideoCall;






























// import React, { useEffect, useRef, useState } from "react";
// import { io } from "socket.io-client";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faMicrophone,
//   faMicrophoneSlash,
//   faVolumeUp,
//   faVolumeMute,
// } from "@fortawesome/free-solid-svg-icons";

// const socket = io("https://videocallbackend-rjrw.onrender.com");
// const servers = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

// function VideoCall() {
//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const peerConnection = useRef(null);
//   const localStreamRef = useRef(null);

//   const [roomId, setRoomId] = useState("");
//   const [inCall, setInCall] = useState(false);
//   const [isLocalMuted, setIsLocalMuted] = useState(false);
//   const [isRemoteMuted, setIsRemoteMuted] = useState(false);

//   const startCall = () => {
//     socket.emit("join-room", roomId);
//   };

//   const toggleLocalMute = () => {
//     if (localStreamRef.current) {
//       localStreamRef.current.getAudioTracks().forEach((track) => {
//         track.enabled = !track.enabled;
//       });
//       setIsLocalMuted((prev) => !prev);
//     }
//   };

//   const toggleRemoteMute = () => {
//     if (remoteVideoRef.current) {
//       remoteVideoRef.current.muted = !remoteVideoRef.current.muted;
//       setIsRemoteMuted((prev) => !prev);
//     }
//   };

//   const createPeerConnection = () => {
//     peerConnection.current = new RTCPeerConnection(servers);

//     peerConnection.current.onicecandidate = (event) => {
//       if (event.candidate) {
//         socket.emit("signal", {
//           roomId,
//           data: { candidate: event.candidate },
//         });
//       }
//     };

//     peerConnection.current.ontrack = (event) => {
//       if (remoteVideoRef.current) {
//         remoteVideoRef.current.srcObject = event.streams[0];
//       }
//     };

//     if (localStreamRef.current) {
//       localStreamRef.current.getTracks().forEach((track) => {
//         peerConnection.current.addTrack(track, localStreamRef.current);
//       });
//     }
//   };

//   useEffect(() => {
//     const getLocalStream = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: true,
//           audio: true,
//         });
//         localStreamRef.current = stream;
//         localVideoRef.current.srcObject = stream;
//       } catch (error) {
//         console.error("Error accessing media devices.", error);
//       }
//     };

//     getLocalStream();

//     socket.on("created", () => {
//       createPeerConnection();
//       setInCall(true);
//     });

//     socket.on("joined", () => {
//       createPeerConnection();
//       socket.emit("ready", roomId);
//       setInCall(true);
//     });

//     socket.on("ready", async () => {
//       const offer = await peerConnection.current.createOffer();
//       await peerConnection.current.setLocalDescription(offer);
//       socket.emit("signal", { roomId, data: { offer } });
//     });

//     socket.on("signal", async ({ data }) => {
//       if (data.offer) {
//         await peerConnection.current.setRemoteDescription(
//           new RTCSessionDescription(data.offer)
//         );
//         const answer = await peerConnection.current.createAnswer();
//         await peerConnection.current.setLocalDescription(answer);
//         socket.emit("signal", { roomId, data: { answer } });
//       } else if (data.answer) {
//         await peerConnection.current.setRemoteDescription(
//           new RTCSessionDescription(data.answer)
//         );
//       } else if (data.candidate) {
//         try {
//           await peerConnection.current.addIceCandidate(
//             new RTCIceCandidate(data.candidate)
//           );
//         } catch (err) {
//           console.error("ICE error", err);
//         }
//       }
//     });

//     return () => {
//       socket.off("created");
//       socket.off("joined");
//       socket.off("ready");
//       socket.off("signal");
//     };
//   }, [roomId]);

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>🔵 WebRTC Video Call</h2>
//       <input
//         placeholder="Enter Room ID"
//         value={roomId}
//         onChange={(e) => setRoomId(e.target.value)}
//       />
//       <button onClick={startCall} disabled={inCall || !roomId}>
//         Join Call
//       </button>

//       <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
//         {/* Local Video */}
//         <div style={{ position: "relative", width: 300 }}>
//           <h4>📷 Your Video</h4>
//           <video
//             ref={localVideoRef}
//             autoPlay
//             playsInline
//             muted
//             style={{ width: "100%" }}
//           />
//           <button
//             onClick={toggleLocalMute}
//             style={overlayButtonStyle}
//             title={isLocalMuted ? "Unmute Mic" : "Mute Mic"}
//           >
//             <FontAwesomeIcon
//               icon={isLocalMuted ? faMicrophoneSlash : faMicrophone}
//               size="lg"
//             />
//           </button>
//         </div>

//         {/* Remote Video */}
//         <div style={{ position: "relative", width: 300 }}>
//           <h4>🎥 Remote Video</h4>
//           <video
//             ref={remoteVideoRef}
//             autoPlay
//             playsInline
//             style={{ width: "100%" }}
//           />
//           <button
//             onClick={toggleRemoteMute}
//             style={overlayButtonStyle}
//             title={isRemoteMuted ? "Unmute Remote" : "Mute Remote"}
//           >
//             <FontAwesomeIcon
//               icon={isRemoteMuted ? faVolumeMute : faVolumeUp}
//               size="lg"
//             />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
// const overlayButtonStyle = {
//   position: "absolute",
//   bottom: 10,
//   right: 10,
//   background: "rgba(0,0,0,0.6)",
//   color: "#fff",
//   border: "none",
//   borderRadius: "50%",
//   padding: "10px",
//   cursor: "pointer",
// };

// export default VideoCall;