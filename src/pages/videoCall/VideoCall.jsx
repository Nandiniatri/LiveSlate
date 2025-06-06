// import { useEffect, useRef, useState } from "react";
// import { io } from "socket.io-client";
// import { v4 as uuid } from "uuid";

// const SOCKET_SERVER_URL = "https://videocallbackend-rjrw.onrender.com";

// const socket = io(SOCKET_SERVER_URL, {
//   transports: ["websocket", "polling"],
// });

// const VideoCall = ({ roomID }) => {
//   const localVideoRef = useRef(null);
//   const localStreamRef = useRef(null);
//   const peersRef = useRef({});  // key: socketId, value: RTCPeerConnection
//   const [remoteStreams, setRemoteStreams] = useState({}); // key: socketId, value: MediaStream
//   const userId = useRef(uuid()); // unique id for this user
//   const [mutedUsers, setMutedUsers] = useState({});


//   const toggleMute = () => {
//     if (localStreamRef.current) {
//       const audioTrack = localStreamRef.current.getAudioTracks()[0];
//       if (audioTrack) {
//         const newMuteState = !audioTrack.enabled;
//         audioTrack.enabled = newMuteState;
//         setIsMuted(!audioTrack.enabled);

//         // Broadcast to others
//         socket.emit("toggle-mute", {
//           socketId: socket.id,
//           muted: !audioTrack.enabled,
//         });
//       }
//     }
//   };


//   useEffect(() => {
//     const init = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: true,
//           audio: true,
//         });

//         localStreamRef.current = stream;
//         if (localVideoRef.current) {
//           localVideoRef.current.srcObject = stream;
//         }

//         socket.emit("join-room", {
//           roomId: roomID,
//           userId: userId.current,
//         });
//       } catch (err) {
//         console.error("Failed to get local media", err);
//       }
//     };

//     init();

//     // 1. Receive list of users already in the room
//     socket.on("all-users", (users) => {
//       users.forEach(({ userId: remoteUserId, socketId }) => {
//         if (!peersRef.current[socketId]) {
//           const pc = createPeerConnection(socketId);
//           peersRef.current[socketId] = pc;

//           // Add local tracks
//           localStreamRef.current.getTracks().forEach((track) => {
//             pc.addTrack(track, localStreamRef.current);
//           });

//           pc.createOffer().then((offer) => {
//             pc.setLocalDescription(offer);
//             socket.emit("signal", {
//               to: socketId,
//               from: socket.id,
//               data: { sdp: offer },
//             });
//           });
//         }
//       });
//     });

//     // 2. A new user joined after you
//     socket.on("user-joined", ({ userId: remoteUserId, socketId }) => {
//       if (!peersRef.current[socketId]) {
//         const pc = createPeerConnection(socketId);
//         peersRef.current[socketId] = pc;

//         localStreamRef.current.getTracks().forEach((track) => {
//           pc.addTrack(track, localStreamRef.current);
//         });
//       }
//     });

//     // 3. Handle signaling data (SDP / ICE candidates)
//     socket.on("signal", async ({ from, data }) => {
//       let pc = peersRef.current[from];
//       if (!pc) {
//         pc = createPeerConnection(from);
//         peersRef.current[from] = pc;

//         localStreamRef.current.getTracks().forEach((track) => {
//           pc.addTrack(track, localStreamRef.current);
//         });
//       }

//       if (data.sdp) {
//         try {
//           await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
//           if (data.sdp.type === "offer") {
//             const answer = await pc.createAnswer();
//             await pc.setLocalDescription(answer);
//             socket.emit("signal", {
//               to: from,
//               from: socket.id,
//               data: { sdp: answer },
//             });
//           }
//         } catch (err) {
//           console.error("Error handling SDP", err);
//         }
//       }

//       if (data.candidate) {
//         try {
//           await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
//         } catch (err) {
//           console.error("Error adding ICE candidate", err);
//         }
//       }
//     });

//     // 4. Handle user leaving
//     socket.on("user-left", (socketId) => {
//       const pc = peersRef.current[socketId];
//       if (pc) {
//         pc.close();
//         delete peersRef.current[socketId];
//       }
//       setRemoteStreams((prev) => {
//         const updated = { ...prev };
//         delete updated[socketId];
//         return updated;
//       });
//     });

//     // Cleanup on unmount
//     return () => {
//       socket.off("all-users");
//       socket.off("user-joined");
//       socket.off("signal");
//       socket.off("user-left");
//       socket.disconnect();
//       Object.values(peersRef.current).forEach((pc) => pc.close());
//       peersRef.current = {};
//     };
//   }, []);

//   // Create RTCPeerConnection and define handlers
//   const createPeerConnection = (peerSocketId) => {
//     const pc = new RTCPeerConnection({
//       iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//     });

//     pc.onicecandidate = (event) => {
//       if (event.candidate) {
//         socket.emit("signal", {
//           to: peerSocketId,
//           from: socket.id,
//           data: { candidate: event.candidate },
//         });
//       }
//     };

//     pc.ontrack = (event) => {
//       setRemoteStreams((prev) => ({
//         ...prev,
//         [peerSocketId]: event.streams[0],
//       }));
//     };

//     return pc;
//   };

//   return (
//     <div style={{ padding: "10px" }}>
//       <button
//         onClick={toggleMute}
//         style={{
//           marginBottom: "10px",
//           padding: "8px 16px",
//           backgroundColor: mute ? "red" : "green",
//           color: "white",
//           border: "none",
//           borderRadius: "5px",
//           cursor: "pointer",
//         }}
//       >
//         {mute ? "Unmute" : "Mute"}
//       </button>

//       <video
//         ref={localVideoRef}
//         autoPlay
//         muted
//         playsInline
//         width={250}
//         style={{ marginBottom: "10px" }}
//       />
//       <div
//         style={{
//           display: "flex",
//           gap: "10px",
//           flexWrap: "wrap",
//           justifyContent: "start",
//         }}
//       >
//         {Object.entries(remoteStreams).map(([id, stream]) => (
//           <video
//             key={id}
//             autoPlay
//             playsInline
//             width={250}
//             ref={(video) => {
//               if (video) video.srcObject = stream;
//             }}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default VideoCall;   



import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { v4 as uuid } from "uuid";


const SOCKET_SERVER_URL = "https://videocallbackend-rjrw.onrender.com";
const socket = io(SOCKET_SERVER_URL, { transports: ["websocket", "polling"] });

const VideoCall = ({ roomID }) => {
  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peersRef = useRef({});
  const [remoteStreams, setRemoteStreams] = useState({});
  const [mutedMap, setMutedMap] = useState({});
  const [isMuted, setIsMuted] = useState(false);
  const userId = useRef(uuid());

  useEffect(() => {
    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        socket.emit("join-room", { roomId: roomID, userId: userId.current });
      } catch (err) {
        console.error("Failed to get local media", err);
      }
    };
    init();

    socket.on("all-users", (users) => {
      users.forEach(({ socketId }) => createOfferPeer(socketId));
    });

    socket.on("user-joined", ({ socketId }) => {
      if (!peersRef.current[socketId]) createPeer(socketId);
    });

    socket.on("signal", async ({ from, data }) => handleSignal(from, data));

    socket.on("user-left", (socketId) => {
      const pc = peersRef.current[socketId];
      if (pc) pc.close();
      delete peersRef.current[socketId];
      setRemoteStreams((prev) => {
        const copy = { ...prev };
        delete copy[socketId];
        return copy;
      });
      setMutedMap((prev) => {
        const copy = { ...prev };
        delete copy[socketId];
        return copy;
      });
    });

    socket.on("user-muted-status", ({ socketId, muted }) => {
      setMutedMap((prev) => ({ ...prev, [socketId]: muted }));
    });

    return () => {
      socket.disconnect();
      Object.values(peersRef.current).forEach((pc) => pc.close());
      peersRef.current = {};
    };
  }, []);

  const createPeer = (peerSocketId) => {
    const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
    pc.onicecandidate = ({ candidate }) => {
      if (candidate) {
        socket.emit("signal", { to: peerSocketId, from: socket.id, data: { candidate } });
      }
    };
    pc.ontrack = (event) => {
      setRemoteStreams((prev) => ({ ...prev, [peerSocketId]: event.streams[0] }));
    };
    localStreamRef.current.getTracks().forEach((t) => pc.addTrack(t, localStreamRef.current));
    peersRef.current[peerSocketId] = pc;
    return pc;
  };

  const createOfferPeer = async (peerSocketId) => {
    const pc = createPeer(peerSocketId);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit("signal", { to: peerSocketId, from: socket.id, data: { sdp: offer } });
  };

  const handleSignal = async (peerSocketId, data) => {
    let pc = peersRef.current[peerSocketId] || createPeer(peerSocketId);
    if (data.sdp) {
      await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
      if (data.sdp.type === "offer") {
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("signal", { to: peerSocketId, from: socket.id, data: { sdp: answer } });
      }
    }
    if (data.candidate) await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
  };

  const toggleMute = () => {
    if (!localStreamRef.current) return;
    const audioTrack = localStreamRef.current.getAudioTracks()[0];
    if (!audioTrack) return;
    audioTrack.enabled = !audioTrack.enabled;
    const nowMuted = !audioTrack.enabled;
    setIsMuted(nowMuted);
    socket.emit("toggle-mute", { socketId: socket.id, muted: nowMuted });
    setMutedMap((prev) => ({ ...prev, [socket.id]: nowMuted }));
  };

  const handleEndCall = () => {
    // Stop all local video/audio tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }

    // Emit disconnect event (optional, if backend handles cleanup)
    socket.emit("leave-room", roomID);

    // Close all peer connections
    Object.values(peersRef.current).forEach(peer => {
      if (peer.peerConnection) {
        peer.peerConnection.close();
      }
    });

    // Optionally reload or redirect
    window.location.href = "/"; // or navigate to lobby
  }

  return (
    // <div className="video-call-container">
    <>
      <div className="video-header">
        <button className={`mute-button ${isMuted ? "muted" : "unmuted"}`} onClick={toggleMute}>
          {isMuted ? "Unmute" : "Mute"}
        </button>
        <button className="end-call-btn" onClick={handleEndCall}>
          End Call
        </button>
      </div>

      <div className="video-grid">
        <div className="video-box">
          <video ref={localVideoRef} autoPlay muted playsInline />
          <p>You</p>
          {mutedMap[socket.id] && <Badge />}
        </div>

        {Object.entries(remoteStreams).map(([id, stream]) => (
          <div className="video-box" key={id}>
            <video
              autoPlay
              playsInline
              ref={(v) => v && (v.srcObject = stream)}
            />
            <p>{id}</p>
            {mutedMap[id] && <Badge />}
          </div>
        ))}
      </div>
      {/* </div> */}
    </>
  );
};

const Badge = () => (
  <span className="mute-badge">🔇</span>
);

export default VideoCall;
