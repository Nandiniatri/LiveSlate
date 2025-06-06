// import { useEffect, useRef, useState } from "react";
// import { io } from "socket.io-client";
// import { v4 as uuid } from "uuid";


// const SOCKET_SERVER_URL = "https://videocallbackend-rjrw.onrender.com";
// const socket = io(SOCKET_SERVER_URL, { transports: ["websocket", "polling"] });

// const VideoCall = ({ roomID }) => {
//   const localVideoRef = useRef(null);
//   const localStreamRef = useRef(null);
//   const peersRef = useRef({});
//   const [remoteStreams, setRemoteStreams] = useState({});
//   const [mutedMap, setMutedMap] = useState({});
//   const [isMuted, setIsMuted] = useState(false);
//   const userId = useRef(uuid());

//   useEffect(() => {
//     const init = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//         localStreamRef.current = stream;
//         if (localVideoRef.current) localVideoRef.current.srcObject = stream;
//         socket.emit("join-room", { roomId: roomID, userId: userId.current });
//       } catch (err) {
//         console.error("Failed to get local media", err);
//       }
//     };
//     init();

//     socket.on("all-users", (users) => {
//       users.forEach(({ socketId }) => createOfferPeer(socketId));
//     });

//     socket.on("user-joined", ({ socketId }) => {
//       if (!peersRef.current[socketId]) createPeer(socketId);
//     });

//     socket.on("signal", async ({ from, data }) => handleSignal(from, data));

//     socket.on("user-left", (socketId) => {
//       const pc = peersRef.current[socketId];
//       if (pc) pc.close();
//       delete peersRef.current[socketId];
//       setRemoteStreams((prev) => {
//         const copy = { ...prev };
//         delete copy[socketId];
//         return copy;
//       });
//       setMutedMap((prev) => {
//         const copy = { ...prev };
//         delete copy[socketId];
//         return copy;
//       });
//     });

//     socket.on("user-muted-status", ({ socketId, muted }) => {
//       setMutedMap((prev) => ({ ...prev, [socketId]: muted }));
//     });

//     return () => {
//       socket.disconnect();
//       Object.values(peersRef.current).forEach((pc) => pc.close());
//       peersRef.current = {};
//     };
//   }, []);

//   const createPeer = (peerSocketId) => {
//     const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
//     pc.onicecandidate = ({ candidate }) => {
//       if (candidate) {
//         socket.emit("signal", { to: peerSocketId, from: socket.id, data: { candidate } });
//       }
//     };
//     pc.ontrack = (event) => {
//       setRemoteStreams((prev) => ({ ...prev, [peerSocketId]: event.streams[0] }));
//     };
//     localStreamRef.current.getTracks().forEach((t) => pc.addTrack(t, localStreamRef.current));
//     peersRef.current[peerSocketId] = pc;
//     return pc;
//   };

//   const createOfferPeer = async (peerSocketId) => {
//     const pc = createPeer(peerSocketId);
//     const offer = await pc.createOffer();
//     await pc.setLocalDescription(offer);
//     socket.emit("signal", { to: peerSocketId, from: socket.id, data: { sdp: offer } });
//   };

//   const handleSignal = async (peerSocketId, data) => {
//     let pc = peersRef.current[peerSocketId] || createPeer(peerSocketId);
//     if (data.sdp) {
//       await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
//       if (data.sdp.type === "offer") {
//         const answer = await pc.createAnswer();
//         await pc.setLocalDescription(answer);
//         socket.emit("signal", { to: peerSocketId, from: socket.id, data: { sdp: answer } });
//       }
//     }
//     if (data.candidate) await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
//   };

//   const toggleMute = () => {
//     if (!localStreamRef.current) return;
//     const audioTrack = localStreamRef.current.getAudioTracks()[0];
//     if (!audioTrack) return;
//     audioTrack.enabled = !audioTrack.enabled;
//     const nowMuted = !audioTrack.enabled;
//     setIsMuted(nowMuted);
//     socket.emit("toggle-mute", { socketId: socket.id, muted: nowMuted });
//     setMutedMap((prev) => ({ ...prev, [socket.id]: nowMuted }));
//   };

//   const handleEndCall = () => {
//     // Stop all local video/audio tracks
//     if (localStreamRef.current) {
//       localStreamRef.current.getTracks().forEach(track => track.stop());
//     }

//     // Emit disconnect event (optional, if backend handles cleanup)
//     socket.emit("leave-room", roomID);

//     // Close all peer connections
//     Object.values(peersRef.current).forEach(peer => {
//       if (peer.peerConnection) {
//         peer.peerConnection.close();
//       }
//     });

//     // Optionally reload or redirect
//     window.location.href = "/"; // or navigate to lobby
//   }

//   return (
//     // <div className="video-call-container">
//     <>
//       <div className="video-header">
//         <button className={`mute-button ${isMuted ? "muted" : "unmuted"}`} onClick={toggleMute}>
//           {isMuted ? "Unmute" : "Mute"}
//         </button>
//         <button className="end-call-btn" onClick={handleEndCall}>
//           End Call
//         </button>
//       </div>

//       <div className="video-grid">
//         <div className="video-box">
//           <video ref={localVideoRef} autoPlay muted playsInline />
//           <p>You</p>
//           {mutedMap[socket.id] && <Badge />}
//         </div>

//         {Object.entries(remoteStreams).map(([id, stream]) => (
//           <div className="video-box" key={id}>
//             <video
//               autoPlay
//               playsInline
//               ref={(v) => v && (v.srcObject = stream)}
//             />
//             <p>{id}</p>
//             {mutedMap[id] && <Badge />}
//           </div>
//         ))}
//       </div>
//       {/* </div> */}
//     </>
//   );
// };

// const Badge = () => (
//   <span className="mute-badge">🔇</span>
// );

// export default VideoCall;












// import { useEffect, useRef, useState } from "react";
// import { io } from "socket.io-client";
// import { v4 as uuid } from "uuid";

// const SOCKET_SERVER_URL = "https://videocallbackend-rjrw.onrender.com";
// const socket = io(SOCKET_SERVER_URL, { transports: ["websocket", "polling"] });

// const VideoCall = ({ roomID , username }) => {
//   const localVideoRef = useRef(null);
//   const localStreamRef = useRef(null);
//   const peersRef = useRef({});
//   const [remoteStreams, setRemoteStreams] = useState({});
//   const [mutedMap, setMutedMap] = useState({});
//   const [isMuted, setIsMuted] = useState(false);
//   const userId = useRef(uuid());
//   console.log(username);

//   useEffect(() => {
//     const init = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//         localStreamRef.current = stream;
//         if (localVideoRef.current) localVideoRef.current.srcObject = stream;
//         socket.emit("join-room", { roomId: roomID, userId: userId.current });
//       } catch (err) {
//         console.error("Failed to get local media", err);
//       }
//     };
//     init();

//     socket.on("all-users", (users) => {
//       users.forEach(({ socketId }) => createOfferPeer(socketId));
//     });

//     socket.on("user-joined", ({ socketId }) => {
//       if (!peersRef.current[socketId]) createPeer(socketId);
//     });

//     socket.on("signal", async ({ from, data }) => handleSignal(from, data));

//     socket.on("user-left", (userId) => {
//       // Clean up peer connection and streams for the user who left
//       removePeer(userId);
//     });

//     socket.on("user-muted-status", ({ socketId, muted }) => {
//       setMutedMap((prev) => ({ ...prev, [socketId]: muted }));
//     });

//     return () => {
//       // Cleanup on unmount
//       socket.disconnect();
//       Object.values(peersRef.current).forEach((pc) => pc.close());
//       peersRef.current = {};
//     };
//   }, [roomID]);

//   const createPeer = (peerSocketId) => {
//     const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });

//     pc.onicecandidate = ({ candidate }) => {
//       if (candidate) {
//         socket.emit("signal", { to: peerSocketId, from: socket.id, data: { candidate } });
//       }
//     };

//     pc.ontrack = (event) => {
//       setRemoteStreams((prev) => ({ ...prev, [peerSocketId]: event.streams[0] }));
//     };

//     pc.oniceconnectionstatechange = () => {
//       if (["failed", "disconnected", "closed"].includes(pc.iceConnectionState)) {
//         removePeer(peerSocketId);
//       }
//     };

//     localStreamRef.current.getTracks().forEach((t) => pc.addTrack(t, localStreamRef.current));

//     peersRef.current[peerSocketId] = pc;
//     return pc;
//   };

//   const createOfferPeer = async (peerSocketId) => {
//     const pc = createPeer(peerSocketId);
//     const offer = await pc.createOffer();
//     await pc.setLocalDescription(offer);
//     socket.emit("signal", { to: peerSocketId, from: socket.id, data: { sdp: offer } });
//   };

//   const handleSignal = async (peerSocketId, data) => {
//     let pc = peersRef.current[peerSocketId] || createPeer(peerSocketId);
//     if (data.sdp) {
//       await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
//       if (data.sdp.type === "offer") {
//         const answer = await pc.createAnswer();
//         await pc.setLocalDescription(answer);
//         socket.emit("signal", { to: peerSocketId, from: socket.id, data: { sdp: answer } });
//       }
//     }
//     if (data.candidate) await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
//   };

//   const toggleMute = () => {
//     if (!localStreamRef.current) return;
//     const audioTrack = localStreamRef.current.getAudioTracks()[0];
//     if (!audioTrack) return;
//     audioTrack.enabled = !audioTrack.enabled;
//     const nowMuted = !audioTrack.enabled;
//     setIsMuted(nowMuted);
//     socket.emit("toggle-mute", { socketId: socket.id, muted: nowMuted });
//     setMutedMap((prev) => ({ ...prev, [socket.id]: nowMuted }));
//   };

//   const removePeer = (userId) => {
//     const pc = peersRef.current[userId];
//     if (pc) pc.close();
//     delete peersRef.current[userId];

//     setRemoteStreams((prev) => {
//       const copy = { ...prev };
//       delete copy[userId];
//       return copy;
//     });

//     setMutedMap((prev) => {
//       const copy = { ...prev };
//       delete copy[userId];
//       return copy;
//     });
//   };

//   // const handleEndCall = () => {
//   //   // Stop all local video/audio tracks
//   //   if (localStreamRef.current) {
//   //     localStreamRef.current.getTracks().forEach((track) => track.stop());
//   //   }

//   //   // Inform backend that user is leaving room explicitly
//   //   socket.emit("leave-room", roomID);

//   //   // Close all peer connections
//   //   Object.values(peersRef.current).forEach((pc) => pc.close());
//   //   peersRef.current = {};

//   //   // Disconnect socket to clean up listeners etc.
//   //   socket.disconnect();

//   //   // Redirect or reload page after call ends
//   //   window.location.href = "/"; // Or use router if available
//   // };

//   const handleEndCall = () => {
//     // Stop video/audio
//     if (localStreamRef.current) {
//       localStreamRef.current.getTracks().forEach(track => track.stop());
//       localStreamRef.current = null;
//     }

//     // Remove all UI data BEFORE redirect
//     setRemoteStreams({});
//     setMutedMap({});
//     peersRef.current = {};

//     // Emit leave-room and disconnect
//     socket.emit("leave-room", roomID);
//     socket.disconnect();

//     // Slight delay optional for smoother exit (or remove delay entirely)
//     setTimeout(() => {
//       window.location.href = "/";
//     }, 100); // just 100ms or even 0
//   };


//   return (
//     <>
//       <div className="video-header">
//         <button className={`mute-button ${isMuted ? "muted" : "unmuted"}`} onClick={toggleMute}>
//           {isMuted ? "Unmute" : "Mute"}
//         </button>
//         <button className="end-call-btn" onClick={handleEndCall}>
//           End Call
//         </button>
//       </div>

//       <div className="video-grid">
//         <div className="video-box">
//           <video ref={localVideoRef} autoPlay muted playsInline />
//           <p>You</p>
//           {mutedMap[socket.id] && <Badge />}
//         </div>

//         {/* {Object.entries(remoteStreams).map(([id, stream]) => (
//           <div className="video-box" key={id}>
//             <video
//               autoPlay
//               playsInline
//               ref={(v) => {
//                 if (v) v.srcObject = stream;
//               }}
//             />
//             <p>{id}</p>
//             {mutedMap[id] && <Badge />}
//           </div>
//         ))} */}
//         {Object.entries(remoteStreams).map(([id, stream]) => (
//           <div className="video-box" key={id}>
//             <video
//               autoPlay
//               playsInline
//               ref={(v) => {
//                 if (v) {
//                   v.srcObject = stream;
//                   if (!stream) v.style.display = "none"; // hide if no stream
//                 }
//               }}
//             />
//             <p>{id}</p>
//             {mutedMap[id] && <Badge />}
//           </div>
//         ))}

//       </div>
//     </>
//   );
// };

// const Badge = () => <span className="mute-badge">🔇</span>;

// export default VideoCall;








import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { v4 as uuid } from "uuid";

const SOCKET_URL = "https://videocallbackend-rjrw.onrender.com";
/* Global socket instance */
const socket = io(SOCKET_URL, { transports: ["websocket", "polling"] });

function VideoCall({ roomID, username }) {
  const userIdRef = useRef(uuid());  // Ek baar generate userId

  /* refs + states */
  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peersRef = useRef({});        // socketId → RTCPeerConnection
  const [remoteStreams, setRemoteStreams] = useState({}); // socketId → MediaStream
  const [nameMap, setNameMap] = useState({}); // socketId → username
  const [mutedMap, setMutedMap] = useState({});
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (username) {
      socket.emit("join-room", {
        roomId: roomID,
        userId: userIdRef.current,
        username,
      });
    }
  }, [roomID, username]);

  /* ---------- component mount ---------- */
  useEffect(() => {
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;

        socket.emit("join-room", {
          roomId: roomID,
          userId: userIdRef.current,
          username
        });
      } catch (e) {
        console.error("Media error:", e);
        alert("Media device error. Please allow camera and microphone.");
      }
    })();

    socket.on("all-users", handleExistingUsers);
    socket.on("user-joined", handleUserJoined);
    socket.on("signal", ({ from, data }) => handleSignal(from, data));
    socket.on("user-left", handleUserLeft);

    socket.on("user-muted-status", ({ socketId, muted }) => {
      setMutedMap((p) => ({ ...p, [socketId]: muted }));
    });

    return () => {
      socket.emit("leave-room", roomID);
      // ⚠️ Agar dusre components socket use kar rahe hain to yahan disconnect carefully use karein
      socket.disconnect();

      Object.values(peersRef.current).forEach((pc) => pc.close());
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [roomID, username]);

  /* ---------- helpers ---------- */
  const handleExistingUsers = (users) => {
    const map = {};
    users.forEach(({ socketId, username }) => {
      map[socketId] = username;
      createOfferPeer(socketId);
    });
    setNameMap((p) => ({ ...p, ...map }));
  };

  const handleUserJoined = ({ socketId, username }) => {
    setNameMap((p) => ({ ...p, [socketId]: username }));
    if (!peersRef.current[socketId]) createPeer(socketId);
  };

  const handleUserLeft = ({ socketId }) => {
    removePeer(socketId);
    setNameMap((p) => {
      const c = { ...p };
      delete c[socketId];
      return c;
    });
  };

  const createPeer = (socketId) => {
    const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });

    pc.onicecandidate = ({ candidate }) => {
      if (candidate) socket.emit("signal", { to: socketId, from: socket.id, data: { candidate } });
    };

    pc.ontrack = (ev) => setRemoteStreams((p) => ({ ...p, [socketId]: ev.streams[0] }));

    pc.oniceconnectionstatechange = () => {
      if (["failed", "disconnected", "closed"].includes(pc.iceConnectionState))
        handleUserLeft({ socketId });
    };

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => pc.addTrack(t, localStreamRef.current));
    }

    peersRef.current[socketId] = pc;
    return pc;
  };

  const createOfferPeer = async (socketId) => {
    const pc = createPeer(socketId);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit("signal", { to: socketId, from: socket.id, data: { sdp: offer } });
  };

  const handleSignal = async (socketId, data) => {
    const pc = peersRef.current[socketId] || createPeer(socketId);
    if (data.sdp) {
      await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
      if (data.sdp.type === "offer") {
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("signal", { to: socketId, from: socket.id, data: { sdp: answer } });
      }
    }
    if (data.candidate) await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
  };

  const removePeer = (socketId) => {
    peersRef.current[socketId]?.close();
    delete peersRef.current[socketId];
    setRemoteStreams((p) => {
      const c = { ...p };
      delete c[socketId];
      return c;
    });
    setMutedMap((p) => {
      const c = { ...p };
      delete c[socketId];
      return c;
    });
  };

  const toggleMute = () => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    const nowMuted = !track.enabled;
    setIsMuted(nowMuted);
    socket.emit("toggle-mute", { socketId: socket.id, muted: nowMuted });
    setMutedMap((p) => ({ ...p, [socket.id]: nowMuted }));
  };

  const endCall = () => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    socket.emit("leave-room", roomID);
    socket.disconnect();
    Object.values(peersRef.current).forEach((pc) => pc.close());
    peersRef.current = {};
    setRemoteStreams({});
    window.location.href = "/";
  };

  /* ---------- UI ---------- */
  return (
    <>
      <div className="video-header">
        <button onClick={toggleMute} className={`mute-btn ${isMuted ? "muted" : ""}`}>
          {isMuted ? "Unmute" : "Mute"}
        </button>
        <button onClick={endCall} className="end-call-btn">End&nbsp;Call</button>
      </div>

      <div className="video-grid">
        {/* Local */}
        <div className="video-box">
          <video ref={localVideoRef} autoPlay muted playsInline />
          <p>{username}</p>
          {mutedMap[socket.id] && <span className="mute-badge">🔇</span>}
        </div>

        {/* Remote */}
        {Object.entries(remoteStreams).map(([sid, stream]) => (
          <div className="video-box" key={sid}>
            <video
              autoPlay
              playsInline
              ref={(v) => v && (v.srcObject = stream)}
            />
            <p>{nameMap[sid] || "User"}</p>
            {mutedMap[sid] && <span className="mute-badge">🔇</span>}
          </div>
        ))}
      </div>
    </>
  );
}

export default VideoCall;
