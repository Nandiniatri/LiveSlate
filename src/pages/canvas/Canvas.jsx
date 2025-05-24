// import React, { useEffect, useRef, useState } from "react";
// import { io } from "socket.io-client";

// const socket = io("https://canvas-backend-ft79.onrender.com/");

// const Canvas = () => {
//     const canvasRef = useRef(null);
//     const [isDrawing, setIsDrawing] = useState(false);
//     const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
//     const [text, setText] = useState("");
//     const [mode, setMode] = useState("drawing");

//     useEffect(() => {
//         const canvas = canvasRef.current;
//         const ctx = canvas.getContext("2d");
//         ctx.strokeStyle = "#000";
//         ctx.lineWidth = 2;

//         socket.on("draw", (data) => {
//             ctx.beginPath();
//             ctx.moveTo(data.lastPos.x, data.lastPos.y);
//             ctx.lineTo(data.x, data.y);
//             ctx.stroke();
//         });

//         socket.on("text", (newText) => {
//             setText(newText);
//         });

//         return () => {
//             socket.off("draw");
//             socket.off("text");
//         };
//     }, []);

//     const clearCanvas = () => {
//         const canvas = canvasRef.current;
//         const ctx = canvas.getContext("2d");
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//     };

//     const handleClear = () => {
//         clearCanvas();
//         socket.emit("clear"); 
//     };

//     const handleMouseDown = (e) => {
//         if (mode !== "drawing") return;
//         setIsDrawing(true);
//         const { offsetX, offsetY } = e.nativeEvent;
//         setLastPos({ x: offsetX, y: offsetY });
//     };

//     const handleMouseMove = (e) => {
//         if (!isDrawing || mode !== "drawing") return;

//         const { offsetX, offsetY } = e.nativeEvent;
//         const ctx = canvasRef.current.getContext("2d");

//         ctx.beginPath();
//         ctx.moveTo(lastPos.x, lastPos.y);
//         ctx.lineTo(offsetX, offsetY);
//         ctx.stroke();

//         socket.emit("draw", {
//             lastPos,
//             x: offsetX,
//             y: offsetY,
//         });

//         setLastPos({ x: offsetX, y: offsetY });
//     };

//     const handleMouseUp = () => {
//         setIsDrawing(false);
//     };

//     const handleTextChange = (e) => {
//         const newText = e.target.value;
//         setText(newText);
//         socket.emit("text", newText);
//     };

//     return (
//         <div style={{ textAlign: "center" }} className="btn-container">

//             <div style={{ marginBottom: 20 }}>
//                 <button onClick={() => setMode("drawing")} style={{ marginRight: 10 }}>
//                     🎨 Drawing
//                 </button>
//                 <button onClick={() => setMode("text")}>📝 Text</button>
//                 <button onClick={handleClear} className="clear-btn">
//                     🧹 Clear
//                 </button>
//             </div>

//             <div
//                 style={{
//                     position: "relative",
//                     width: 500,
//                     height: 500,
//                     margin: "0 auto",
//                 }}
//             >
//                 <canvas
//                     ref={canvasRef}
//                     // width={400}
//                     // height={500}
//                     style={{
//                         border: "1px solid black",
//                         cursor: "crosshair",
//                         position: "absolute",
//                         top: 0,
//                         left: 0,
//                         zIndex: 1,
//                         visibility: mode === "drawing" ? "visible" : "hidden",
//                     }}
//                     onMouseDown={handleMouseDown}
//                     onMouseMove={handleMouseMove}
//                     onMouseUp={handleMouseUp}
//                     onMouseLeave={handleMouseUp}
//                 />

//                 {mode === "text" && (
//                     <textarea
//                         value={text}
//                         onChange={handleTextChange}
//                         rows="10"
//                         cols="80"
//                         placeholder="Start typing..."
//                         style={{
//                             position: "absolute",
//                             top: 0,
//                             left: 0,
//                             width: 800,
//                             height: 500,
//                             fontSize: "16px",
//                             padding: "10px",
//                             zIndex: 2,
//                             resize: "none",
//                         }}
//                     />
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Canvas;



import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io("https://canvas-backend-ft79.onrender.com/");

const Canvas = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null); // container reference
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
    ctx.strokeStyle = "#000";
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
        <button onClick={() => setMode("drawing")}>🎨 Drawing</button>
        <button onClick={() => setMode("text")}>📝 Text</button>
        <button onClick={handleClear} className="clear-btn">🧹 Clear</button>
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
