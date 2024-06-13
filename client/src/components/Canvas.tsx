import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useNavigate, useParams } from "react-router";
import link from "../assets/link.json";
import NavBar from "./NavBar";
import axios from "axios";
import Alert from "@mui/material/Alert";
const socket = io(`${link.url}`);

function Canvas() {
  const { projid } = useParams();
  const id = localStorage.getItem("id");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [pencilThickness, setPencilThickness] = useState<number>(1);
  const [isErasing, setIsErasing] = useState<boolean>(false);
  const [color, setColor] = useState<string>("white");
  const [showPallet, setShowPallet] = useState<boolean>(false);
  const [err, setErr] = useState<string>("");
  const navigate = useNavigate();
  const { projname } = useParams();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    const updateCanvasSize = () => {
      if (canvas) {
        canvas.width = window.innerWidth * 0.9;
        canvas.height = window.innerHeight * 0.9;
      }
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    const savedDrawing = async () => {
      const data = await axios.post(`${link.url}/load-canvas`, {
        projectId: projid,
      });
      const savedCanvasData = data.data;
      if (savedCanvasData && context) {
        const img = new Image();
        img.onload = function () {
          context.clearRect(0, 0, canvas?.width, canvas?.height);
          context.drawImage(img, 0, 0);
        };
        img.src = savedCanvasData;
      }
    };

    savedDrawing();

    return () => window.removeEventListener("resize", updateCanvasSize);
  }, [projid]);

  useEffect(() => {
    socket.emit("joinProject", projid);

    socket.on("connect", () => {
      console.log(`Connected to the server ${socket.id}`);
    });

    socket.on("draw", (data) => {
      if (data.projectId !== projid) return;
      const canvas = canvasRef.current;
      if (canvas) {
        const context = canvas.getContext("2d");
        if (context) {
          context.strokeStyle = data.color;
          context.lineWidth = data.pencilThickness;
          context.globalCompositeOperation = data.isErasing
            ? "destination-out"
            : "source-over";
          context.beginPath();
          context.moveTo(data.prevX, data.prevY);
          context.lineTo(data.x, data.y);
          context.stroke();
        }
      }
    });

    socket.on("clear", () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const context = canvas.getContext("2d");
        if (context) {
          context.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    });

    return () => {
      socket.emit("leaveProject", projid);
      socket.off("connect");
      socket.off("draw");
      socket.off("clear");
    };
  }, [projid]);

  const savecanvas = async (drawing: string) => {
    try {
      await axios.post(`${link.url}/save-canvas`, {
        projectId: projid,
        drawing,
      });
    } catch (error) {
      setErr(error.response.message);
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        context.lastX = undefined;
        context.lastY = undefined;
      }
      const drawing = canvas.toDataURL();
      savecanvas(drawing);
      localStorage.setItem("canvasData", drawing);
    }
  };

  const startDrawing = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        setIsDrawing(true);
        context.beginPath();
        context.lineWidth = pencilThickness;
        context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        context.lastX = e.nativeEvent.offsetX;
        context.lastY = e.nativeEvent.offsetY;
      }
    }
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        context.strokeStyle = color;
        context.lineWidth = pencilThickness;
        context.globalCompositeOperation = isErasing
          ? "destination-out"
          : "source-over";

        const prevX = context.lastX;
        const prevY = context.lastY;

        context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        context.stroke();

        socket.emit("draw", {
          color,
          pencilThickness,
          isErasing,
          prevX,
          prevY,
          x: e.nativeEvent.offsetX,
          y: e.nativeEvent.offsetY,
          projectId: projid,
        });

        context.lastX = e.nativeEvent.offsetX;
        context.lastY = e.nativeEvent.offsetY;
      }
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        socket.emit("clear", projid);
      }
      savecanvas(canvas?.toDataURL());
    }
  };

  const leaveProject = () => {
    socket.emit("leaveProject", projid);
    navigate(`/${id}/home`);
  };

  return (
    <div className="bg-gray-600 dark:bg-gray-800 min-h-screen text-white">
      {err && <Alert severity="error">{err}</Alert>}
      <NavBar
        pencilThickness={pencilThickness}
        setPencilThickness={setPencilThickness}
        color={color}
        setColor={setColor}
        isErasing={isErasing}
        setIsErasing={setIsErasing}
        clearCanvas={clearCanvas}
        leaveProject={leaveProject}
        showPallet={showPallet}
        setShowPallet={setShowPallet}
      />
      <h1 className="text-left text-2xl m-10">Project Name: {projname}</h1>
      <div className="flex items-center justify-center min-h-screen">
        <canvas
          ref={canvasRef}
          className="border-2 border-white bg-black"
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onMouseLeave={stopDrawing}
        />
      </div>
    </div>
  );
}

export default Canvas;
