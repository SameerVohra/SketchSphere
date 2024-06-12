import { Slider } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import ColorPicker from "react-pick-color";
import io from "socket.io-client";
import link from "../assets/link.json";
import { useNavigate, useParams } from "react-router";
const socket = io(`${link.url}`);

function Canvas() {
  const { projid } = useParams();
  const id: string | null = localStorage.getItem("id");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [pencilThickness, setPencilThickness] = useState<number>(1);
  const [isErasing, setIsErasing] = useState<boolean>(false);
  const [color, setColor] = useState<string>("#000000");
  const navigate = useNavigate();
  useEffect(() => {
    console.log(`Joining project room: ${projid}`);
    socket.emit("joinProject", projid);

    socket.on("connect", () => {
      console.log(`Connected to the server ${socket.id}`);
    });

    socket.on("draw", (data) => {
      console.log("Received draw event:", data);
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
      console.log("Received clear event");
      const canvas = canvasRef.current;
      if (canvas) {
        const context = canvas.getContext("2d");
        if (context) {
          context.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    });

    return () => {
      console.log(`Leaving project room: ${projid}`);
      socket.emit("leaveProject", projid);
      socket.off("connect");
      socket.off("draw");
      socket.off("clear");
    };
  }, [projid]);

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        context.lastX = undefined;
        context.lastY = undefined;
      }
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

        console.log("Emitting draw event:", {
          color,
          pencilThickness,
          isErasing,
          prevX,
          prevY,
          x: e.nativeEvent.offsetX,
          y: e.nativeEvent.offsetY,
          projectId: projid,
        });

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

  const handleThickness = (e: Event, value: number | number[]) => {
    e.preventDefault();
    setPencilThickness(Array.isArray(value) ? value[0] : value);
  };

  const handleEraser = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsErasing(!isErasing);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        console.log("Emitting clear event for project:", projid);
        socket.emit("clear", projid);
      }
    }
  };

  const leaveProject = () => {
    socket.emit("leaveProject", projid);
    navigate(`/${id}/home`);
  };

  return (
    <div className="p-4">
      <div className="w-32">
        <Slider
          className=""
          aria-label="Thickness"
          value={pencilThickness}
          onChange={handleThickness}
          max={20}
          min={1}
        />
      </div>
      {pencilThickness}

      <ColorPicker color={color} onChange={(color) => setColor(color.hex)} />
      <canvas
        ref={canvasRef}
        width={1200}
        height={600}
        className="border-2 border-black bg-gray-200"
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseMove={draw}
        onMouseLeave={stopDrawing}
      />
      <button onClick={handleEraser}>{isErasing ? "Draw" : "Erase"}</button>
      <button onClick={clearCanvas}>Clear</button>
      <button onClick={leaveProject}>Exit</button>
    </div>
  );
}

export default Canvas;
