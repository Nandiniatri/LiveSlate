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






// VideoCall.jsx
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { v4 as uuid } from "uuid";

/* 🔗 अपनी signaling-server URL डालें */
const SOCKET_URL = "https://videocallbackend-rjrw.onrender.com";

/* एक ही socket instance पूरे module में */
const socket = io(SOCKET_URL, { transports: ["websocket", "polling"] });

function VideoCall({ roomID, username }) {
  /* -------- Refs & States -------- */
  const localVideoRef   = useRef(null);
  const localStreamRef  = useRef(null);
  const peersRef        = useRef({});            // socketId ➜ RTCPeerConnection
  const [remoteStreams, setRemoteStreams] = useState({}); // socketId ➜ MediaStream
  const [nameMap,       setNameMap]       = useState({}); // socketId ➜ username
  const [mutedMap,      setMutedMap]      = useState({}); // socketId ➜ bool
  const [isMuted,       setIsMuted]       = useState(false);
  const myId = useRef(uuid());                     // arbitrary client-side id

  /* ---------- 1. initial media + join-room ---------- */
  useEffect(() => {
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;

        socket.emit("join-room", {
          roomId: roomID,
          userId: myId.current,        // aapka khud ka uuid
          username                     // prop se aaya naam
        });
      } catch (err) {
        console.error("getUserMedia fail:", err);
      }
    })();

    /* ---------- socket listeners ---------- */
    socket.on("all-users", handleExistingUsers);
    socket.on("user-joined", handleUserJoined);
    socket.on("signal",      ({ from, data }) => handleSignal(from, data));
    socket.on("user-left",   handleUserLeft);
    socket.on("user-muted-status", ({ socketId, muted }) =>
      setMutedMap((p) => ({ ...p, [socketId]: muted }))
    );

    /* ---------- cleanup on unmount ---------- */
    return () => {
      socket.emit("leave-room", roomID);
      socket.disconnect();
      Object.values(peersRef.current).forEach((pc) => pc.close());
      peersRef.current = {};
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [roomID, username]);

  /* ---------- handlers ---------- */

  /* A. existing users list */
  const handleExistingUsers = (users) => {
    const newMap = {};
    users.forEach(({ socketId, username }) => {
      newMap[socketId] = username;
      createOfferPeer(socketId);
    });
    setNameMap((p) => ({ ...p, ...newMap }));
  };

  /* B. when new user joins */
  const handleUserJoined = ({ socketId, username }) => {
    setNameMap((p) => ({ ...p, [socketId]: username }));
    if (!peersRef.current[socketId]) createPeer(socketId);
  };

  /* C. when user leaves */
  const handleUserLeft = ({ socketId }) => {
    removePeer(socketId);
    setNameMap((p) => {
      const c = { ...p };
      delete c[socketId];
      return c;
    });
  };

  /* create peer (answer side) */
  const createPeer = (peerSocketId) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.onicecandidate = ({ candidate }) => {
      if (candidate) socket.emit("signal", {
        to: peerSocketId,
        from: socket.id,
        data: { candidate }
      });
    };

    pc.ontrack = (e) =>
      setRemoteStreams((p) => ({ ...p, [peerSocketId]: e.streams[0] }));

    pc.oniceconnectionstatechange = () => {
      if (["failed", "disconnected", "closed"].includes(pc.iceConnectionState))
        handleUserLeft({ socketId: peerSocketId });
    };

    /* add local tracks */
    localStreamRef.current?.getTracks().forEach((t) =>
      pc.addTrack(t, localStreamRef.current)
    );

    peersRef.current[peerSocketId] = pc;
    return pc;
  };

  /* caller side create offer */
  const createOfferPeer = async (peerSocketId) => {
    const pc = createPeer(peerSocketId);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit("signal", { to: peerSocketId, from: socket.id, data: { sdp: offer } });
  };

  /* handle incoming offer/answer/candidate */
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

  /* remove peer util */
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

  /* Mute/unmute local mic */
  const toggleMute = () => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    const nowMuted = !track.enabled;
    setIsMuted(nowMuted);
    socket.emit("toggle-mute", { socketId: socket.id, muted: nowMuted });
    setMutedMap((p) => ({ ...p, [socket.id]: nowMuted }));
  };

  /* End call */
  const handleEndCall = () => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    socket.emit("leave-room", roomID);
    socket.disconnect();
    Object.values(peersRef.current).forEach((pc) => pc.close());
    peersRef.current = {};
    setRemoteStreams({});
    window.location.href = "/";   // ya navigate("/")
  };

  /* ---------- UI ---------- */
  return (
    <>
      <div className="video-header">
        <button className={`mute-btn ${isMuted ? "muted" : ""}`} onClick={toggleMute}>
          {isMuted ? "Unmute" : "Mute"}
        </button>
        <button className="end-call-btn" onClick={handleEndCall}>
          End&nbsp;Call
        </button>
      </div>

      <div className="video-grid">
        {/* Local video */}
        <div className="video-box">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            style={{ display: localStreamRef.current ? "block" : "none" }}
          />
          <p>{username || "You"}</p>
          {mutedMap[socket.id] && <MuteBadge />}
        </div>

        {/* Remote users */}
        {Object.entries(remoteStreams).map(([sid, stream]) => (
          <div className="video-box" key={sid}>
            <video
              autoPlay
              playsInline
              ref={(v) => v && (v.srcObject = stream)}
              style={{ display: stream ? "block" : "none" }}
            />
            <p>{nameMap[sid] || "Participant"}</p>
            {mutedMap[sid] && <MuteBadge />}
          </div>
        ))}
      </div>
    </>
  );
}

/* Simple 🔇 icon */
const MuteBadge = () => <span style={{ color: "red" }}>🔇</span>;

export default VideoCall;

