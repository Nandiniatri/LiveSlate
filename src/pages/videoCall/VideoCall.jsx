import { io } from "socket.io-client";
import { useRef, useState, useEffect } from "react";


const socket = io("https://videocallbackend-rjrw.onrender.com");
const servers = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

const VideoCall = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const localStreamRef = useRef(null);
  const [roomId, setRoomId] = useState("");
  const [inCall, setInCall] = useState(false);

  const startCall = () => {
    socket.emit("join-room", roomId);
  };

  const createPeerConnection = () => {
    peerConnection.current = new RTCPeerConnection(servers);

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("signal", {
          roomId,
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
        localVideoRef.current.srcObject = stream;
      } catch (error) {
        console.error("Error accessing media devices.", error);
      }
    };

    getLocalStream();

    socket.on("created", async () => {
      createPeerConnection();
      setInCall(true);
    });

    socket.on("joined", async () => {
      createPeerConnection();
      socket.emit("ready", roomId);
      setInCall(true);
    });

    socket.on("ready", async () => {
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      socket.emit("signal", { roomId, data: { offer } });
    });

    socket.on("signal", async ({ data }) => {
      if (data.offer) {
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(data.offer)
        );
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        socket.emit("signal", { roomId, data: { answer } });
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
  }, [roomId]);

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

      <div className="join-controls">
        <input
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="room-input"
        />
        <button onClick={startCall} disabled={inCall || !roomId} className="join-btn">
          Join Call
        </button>
      </div>
    </>
  );

};

export default VideoCall;
