// import { useEffect, useRef, useState } from "react";
// import { io } from "socket.io-client";
// import { v4 as uuid } from "uuid";
// import { useUsername } from "../../context/UsernamePrompt";

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
//   const { username } = useUsername();
//   // console.log(username);
//   const [usernamesMap, setUsernamesMap] = useState({});

//   useEffect(() => {
//     const init = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//         localStreamRef.current = stream;
//         if (localVideoRef.current) localVideoRef.current.srcObject = stream;
//         socket.emit("join-room", { roomId: roomID, userId: userId.current , username});
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

//     socket.on("user-left", (userId) => removePeer(userId));

//     socket.on("user-muted-status", ({ socketId, muted }) => {
//       setMutedMap((prev) => ({ ...prev, [socketId]: muted }));
//     });

//     return () => {
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

//   const handleEndCall = () => {
//     if (localStreamRef.current) {
//       localStreamRef.current.getTracks().forEach((track) => track.stop());
//       localStreamRef.current = null;
//     }

//     setRemoteStreams({});
//     setMutedMap({});
//     peersRef.current = {};
//     socket.emit("leave-room", roomID);
//     socket.disconnect();

//     setTimeout(() => {
//       window.location.href = "/";
//     }, 100);
//   };

//   return (
//     <div className="video-call-wrapper">
//       <div className="video-controls">
//         <button
//           onClick={toggleMute}
//           className={`mute-button ${isMuted ? "muted" : "unmuted"}`}
//         >
//           {isMuted ? "Unmute" : "Mute"}
//         </button>

//         <button className="end-call-btn" onClick={handleEndCall}>
//           End Call
//         </button>
//       </div>

//       <div className="video-grid">
//         <div className="video-box">
//           <video ref={localVideoRef} autoPlay muted playsInline className="local-video" />
//           <p className="name-tag">{username || "You"}</p>
//           {mutedMap[socket.id] && <Badge />}
//         </div>

//         {Object.entries(remoteStreams).map(([id, stream]) => (
//           <div className="video-box" key={id}>
//             <video
//               autoPlay
//               playsInline
//               className="remote-video"
//               ref={(v) => {
//                 if (v) {
//                   v.srcObject = stream;
//                   if (!stream) v.style.display = "none";
//                 }
//               }}
//             />
//             <p>{id}</p>
//             {mutedMap[id] && <Badge />}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const Badge = () => <span className="mute-badge">🔇</span>;

// export default VideoCall;







import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { v4 as uuid } from "uuid";
import { useUsername } from "../../context/UsernamePrompt";

const SOCKET_SERVER_URL = "https://videocallbackend-rjrw.onrender.com";
const socket = io(SOCKET_SERVER_URL, { transports: ["websocket", "polling"] });

const VideoCall = ({ roomID }) => {
  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peersRef = useRef({});
  const [remoteStreams, setRemoteStreams] = useState({});
  const [mutedMap, setMutedMap] = useState({});
  const [usernamesMap, setUsernamesMap] = useState({});
  const [isMuted, setIsMuted] = useState(false);
  const userId = useRef(uuid());
  const { username } = useUsername();

  useEffect(() => {
    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        socket.emit("join-room", {
          roomId: roomID,
          userId: userId.current,
          username,
        });
      } catch (err) {
        console.error("Failed to get local media", err);
      }
    };

    init();

    socket.on("all-users", (users) => {
      users.forEach(({ socketId, username }) => {
        createOfferPeer(socketId);

        // ✅ Save their username
        setUsernamesMap((prev) => ({ ...prev, [socketId]: username }));
      });
    });

    socket.on("user-joined", ({ socketId, username }) => {
      if (!peersRef.current[socketId]) createPeer(socketId);

      // ✅ Save their username
      setUsernamesMap((prev) => ({ ...prev, [socketId]: username }));
    });

    socket.on("signal", async ({ from, data }) => handleSignal(from, data));

    socket.on("user-left", (userId) => removePeer(userId));

    socket.on("user-muted-status", ({ socketId, muted }) => {
      setMutedMap((prev) => ({ ...prev, [socketId]: muted }));
    });

    return () => {
      socket.disconnect();
      Object.values(peersRef.current).forEach((pc) => pc.close());
      peersRef.current = {};
    };
  }, [roomID]);

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

    pc.oniceconnectionstatechange = () => {
      if (["failed", "disconnected", "closed"].includes(pc.iceConnectionState)) {
        removePeer(peerSocketId);
      }
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

  const removePeer = (userId) => {
    const pc = peersRef.current[userId];
    if (pc) pc.close();
    delete peersRef.current[userId];

    setRemoteStreams((prev) => {
      const copy = { ...prev };
      delete copy[userId];
      return copy;
    });

    setMutedMap((prev) => {
      const copy = { ...prev };
      delete copy[userId];
      return copy;
    });

    setUsernamesMap((prev) => {
      const copy = { ...prev };
      delete copy[userId];
      return copy;
    });
  };

  const handleEndCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    setRemoteStreams({});
    setMutedMap({});
    peersRef.current = {};
    socket.emit("leave-room", roomID);
    socket.disconnect();

    setTimeout(() => {
      window.location.href = "/";
    }, 100);
  };

  return (
    <div className="video-call-wrapper">
      <div className="video-controls">
        <button
          onClick={toggleMute}
          className={`mute-button ${isMuted ? "muted" : "unmuted"}`}
        >
          {isMuted ? "Unmute" : "Mute"}
        </button>

        <button className="end-call-btn" onClick={handleEndCall}>
          End Call
        </button>
      </div>

      <div className="video-grid">
        <div className="video-box">
          <video ref={localVideoRef} autoPlay muted playsInline className="local-video" />
          <p className="name-tag">{username || "You"}</p>
          {mutedMap[socket.id] && <Badge />}
        </div>

        {Object.entries(remoteStreams).map(([id, stream]) => (
          <div className="video-box" key={id}>
            <video
              autoPlay
              playsInline
              className="remote-video"
              ref={(v) => {
                if (v) {
                  v.srcObject = stream;
                  if (!stream) v.style.display = "none";
                }
              }}
            />
            <p className="name-tag">{usernamesMap[id]}</p>
            {mutedMap[id] && <Badge />}
          </div>
        ))}
      </div>
    </div>
  );
};

const Badge = () => <span className="mute-badge">🔇</span>;

export default VideoCall;




