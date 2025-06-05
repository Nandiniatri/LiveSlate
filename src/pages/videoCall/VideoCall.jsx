import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { v4 as uuid } from "uuid";

const SOCKET_SERVER_URL = "https://videocallbackend-rjrw.onrender.com";

const socket = io(SOCKET_SERVER_URL, {
  transports: ["websocket", "polling"],
});

const VideoCall = ({ roomID }) => {
  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peersRef = useRef({});  // key: socketId, value: RTCPeerConnection
  const [remoteStreams, setRemoteStreams] = useState({}); // key: socketId, value: MediaStream
  const userId = useRef(uuid()); // unique id for this user

  useEffect(() => {
    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        socket.emit("join-room", {
          roomId: roomID,
          userId: userId.current,
        });
      } catch (err) {
        console.error("Failed to get local media", err);
      }
    };

    init();

    // 1. Receive list of users already in the room
    socket.on("all-users", (users) => {
      users.forEach(({ userId: remoteUserId, socketId }) => {
        if (!peersRef.current[socketId]) {
          const pc = createPeerConnection(socketId);
          peersRef.current[socketId] = pc;

          // Add local tracks
          localStreamRef.current.getTracks().forEach((track) => {
            pc.addTrack(track, localStreamRef.current);
          });

          pc.createOffer().then((offer) => {
            pc.setLocalDescription(offer);
            socket.emit("signal", {
              to: socketId,
              from: socket.id,
              data: { sdp: offer },
            });
          });
        }
      });
    });

    // 2. A new user joined after you
    socket.on("user-joined", ({ userId: remoteUserId, socketId }) => {
      if (!peersRef.current[socketId]) {
        const pc = createPeerConnection(socketId);
        peersRef.current[socketId] = pc;

        localStreamRef.current.getTracks().forEach((track) => {
          pc.addTrack(track, localStreamRef.current);
        });
      }
    });

    // 3. Handle signaling data (SDP / ICE candidates)
    socket.on("signal", async ({ from, data }) => {
      let pc = peersRef.current[from];
      if (!pc) {
        pc = createPeerConnection(from);
        peersRef.current[from] = pc;

        localStreamRef.current.getTracks().forEach((track) => {
          pc.addTrack(track, localStreamRef.current);
        });
      }

      if (data.sdp) {
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
          if (data.sdp.type === "offer") {
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socket.emit("signal", {
              to: from,
              from: socket.id,
              data: { sdp: answer },
            });
          }
        } catch (err) {
          console.error("Error handling SDP", err);
        }
      }

      if (data.candidate) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (err) {
          console.error("Error adding ICE candidate", err);
        }
      }
    });

    // 4. Handle user leaving
    socket.on("user-left", (socketId) => {
      const pc = peersRef.current[socketId];
      if (pc) {
        pc.close();
        delete peersRef.current[socketId];
      }
      setRemoteStreams((prev) => {
        const updated = { ...prev };
        delete updated[socketId];
        return updated;
      });
    });

    // Cleanup on unmount
    return () => {
      socket.off("all-users");
      socket.off("user-joined");
      socket.off("signal");
      socket.off("user-left");
      socket.disconnect();
      Object.values(peersRef.current).forEach((pc) => pc.close());
      peersRef.current = {};
    };
  }, []);

  // Create RTCPeerConnection and define handlers
  const createPeerConnection = (peerSocketId) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("signal", {
          to: peerSocketId,
          from: socket.id,
          data: { candidate: event.candidate },
        });
      }
    };

    pc.ontrack = (event) => {
      setRemoteStreams((prev) => ({
        ...prev,
        [peerSocketId]: event.streams[0],
      }));
    };

    return pc;
  };

  return (
    <div style={{ padding: "10px" }}>
      <h2>📹 Classroom Video Call</h2>
      <video
        ref={localVideoRef}
        autoPlay
        muted
        playsInline
        width={250}
        style={{ border: "3px solid green", marginBottom: "10px" }}
      />
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          justifyContent: "start",
        }}
      >
        {Object.entries(remoteStreams).map(([id, stream]) => (
          <video
            key={id}
            autoPlay
            playsInline
            width={250}
            ref={(video) => {
              if (video) video.srcObject = stream;
            }}
            style={{ border: "2px solid blue" }}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoCall;   
