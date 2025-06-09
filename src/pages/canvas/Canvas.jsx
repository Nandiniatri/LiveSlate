import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io("https://canvas-backend-ft79.onrender.com/");

const Canvas = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [text, setText] = useState("");
  const [mode, setMode] = useState("drawing");

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    // Set canvas attribute size same as CSS size
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;

    socket.on("draw", (data) => {
      ctx.beginPath();
      ctx.moveTo(data.lastPos.x, data.lastPos.y);
      ctx.lineTo(data.x, data.y);
      ctx.stroke();
    });

    socket.on("text", (newText) => {
      setText(newText);
    });

    return () => {
      socket.off("draw");
      socket.off("text");
    };
  }, []);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleClear = () => {
    clearCanvas();
    socket.emit("clear");
  };

  const handleMouseDown = (e) => {
    if (mode !== "drawing") return;
    setIsDrawing(true);
    const { offsetX, offsetY } = e.nativeEvent;
    setLastPos({ x: offsetX, y: offsetY });
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || mode !== "drawing") return;

    const { offsetX, offsetY } = e.nativeEvent;
    const ctx = canvasRef.current.getContext("2d");

    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();

    socket.emit("draw", {
      lastPos,
      x: offsetX,
      y: offsetY,
    });

    setLastPos({ x: offsetX, y: offsetY });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    socket.emit("text", newText);
  };

  return (
    <div className="canvas-section">
      <div className="button-container">
        <button
          className={`mode-btn ${mode === "drawing" ? "active" : ""}`}
          onClick={() => setMode("drawing")}
        >
          Drawing
        </button>
        <button
          className={`mode-btn ${mode === "text" ? "active" : ""}`}
          onClick={() => setMode("text")}
        >
          Text
        </button>
        <button className="clear-btn" onClick={handleClear}>
          Clear
        </button>
      </div>


      <div className="canvas-container" ref={containerRef}>
        <canvas
          ref={canvasRef}
          className="drawing-canvas"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            visibility: mode === "drawing" ? "visible" : "hidden",
          }}
        />

        {mode === "text" && (
          <textarea
            value={text}
            onChange={handleTextChange}
            placeholder="Start typing..."
          />
        )}
      </div>
    </div>
  );
};

export default Canvas;
