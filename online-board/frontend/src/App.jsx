import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:3000");

const Canvas = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#ff5733");
  const [usersCount, setUsersCount] = useState(1);
  const [clearVotes, setClearVotes] = useState(0);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.8;
    ctxRef.current = canvas.getContext("2d");

    ctxRef.current.lineCap = "round";
    ctxRef.current.lineJoin = "round";
    ctxRef.current.lineWidth = 5;

    socket.emit("userConnected");

    socket.on("usersCount", (count) => setUsersCount(count));

    socket.on("draw", ({ x, y, color, isNewStroke }) => {
      const ctx = ctxRef.current;
      ctx.strokeStyle = color;

      if (isNewStroke) {
        ctx.beginPath();
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    });

    socket.on("clearRequest", (votes) => {
      setClearVotes(votes);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    });

    socket.on("clearApproved", () => {
      ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
      setClearVotes(0);
      setShowNotification(false);
    });

    return () => {
      socket.off("draw");
      socket.off("clearRequest");
      socket.off("clearApproved");
      socket.off("usersCount");
      socket.emit("userDisconnected");
    };
  }, []);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);

    socket.emit("draw", { x: offsetX, y: offsetY, color, isNewStroke: true });
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    socket.emit("draw", { x: offsetX, y: offsetY, color, isNewStroke: false });

    ctxRef.current.lineTo(offsetX, offsetY);
    ctxRef.current.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const requestClear = () => {
    socket.emit("requestClear");
  };

  return (
    <div className="canvas-container">
      <canvas ref={canvasRef} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseOut={stopDrawing} />
      <div className="controls">
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="color-picker" />
        <button onClick={requestClear} className="clear-btn">Clear</button>
      </div>

      {showNotification && (
        <div className={`notification ${showNotification ? "show" : ""}`}>
          ⚠ {clearVotes} / {usersCount} want to clear the canvas!
        </div>
      )}

    </div>
  );
};

export default Canvas;
