import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { Slider } from "@mui/material";
import ColorPicker from "react-pick-color";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

function Projectpage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [eraserWidth, setEraserWidth] = useState<number>(30);
  const [color, setColor] = useState<string>("#fff");

  useEffect(() => {
    console.log("Initial useEffect called");
    const canvasElement = canvasRef.current;
    if (!canvasElement) {
      console.error("Canvas element not found");
      return;
    }

    fabricCanvasRef.current = new fabric.Canvas(canvasElement, {
      isDrawingMode: true,
      backgroundColor: "black",
      selection: true,
    });

    const text = new fabric.Textbox("HELLO", {
      left: 100,
      top: 100,
      fontFamily: "Arial",
      fill: "wheat",
      fontSize: 45,
      selectable: true,
    });

    fabricCanvasRef.current.add(text);

    const pencilBrush = new fabric.PencilBrush(fabricCanvasRef.current);
    pencilBrush.color = color;
    pencilBrush.width = 5;
    fabricCanvasRef.current.freeDrawingBrush = pencilBrush;

    fabricCanvasRef.current.on("mouse:down" && "mouse:move", (event) => {
      if (!fabricCanvasRef.current) return;

      const pointer = fabricCanvasRef.current.getPointer(event.e);
      socket.emit("draw", {
        x: { start: pointer.x, end: pointer.x + 5 },
        y: { start: pointer.y, end: pointer.y + 5 },
        color: pencilBrush.color,
        width: pencilBrush.width,
        erasing: false,
      });
    });

    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    console.log("Color useEffect called");
    if (fabricCanvasRef.current && fabricCanvasRef.current.freeDrawingBrush) {
      const pencilBrush = new fabric.PencilBrush(fabricCanvasRef.current);
      pencilBrush.color = color;
      pencilBrush.width = 5;
      fabricCanvasRef.current.freeDrawingBrush = pencilBrush;

      // Emit color change to server
      socket.emit("colorChange", color);
    }
  }, [color]);

  useEffect(() => {
    console.log("Socket useEffect called");
    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });

    socket.on("draw", (data) => {
      console.log("Draw event received:", data);
      const { x, y, color, width, erasing } = data;
      const line = new fabric.Line([x.start, y.start, x.end, y.end], {
        stroke: color,
        strokeWidth: width,
        selectable: false,
        evented: false,
      });

      if (erasing) {
        line.stroke = "rgba(0,0,0,0)";
      }

      fabricCanvasRef.current?.add(line);
    });

    socket.on("clear", () => {
      console.log("Clear event received");
      fabricCanvasRef.current?.clear();
      fabricCanvasRef.current!.backgroundColor = "black";
    });

    socket.on("colorChange", (newColor) => {
      console.log("Color change received:", newColor);
      setColor(newColor);
    });

    return () => {
      socket.off("draw");
      socket.off("clear");
      socket.off("colorChange");
    };
  }, []);

  const handleErase = () => {
    if (fabricCanvasRef.current) {
      const eraserBrush = new fabric.PencilBrush(fabricCanvasRef.current);
      eraserBrush.color = "rgba(0,0,0,0)";
      eraserBrush.width = eraserWidth;
      fabricCanvasRef.current.freeDrawingBrush = eraserBrush;
      fabricCanvasRef.current.isDrawingMode = true;
    }
  };

  const handleDraw = () => {
    if (fabricCanvasRef.current) {
      const pencilBrush = new fabric.PencilBrush(fabricCanvasRef.current);
      pencilBrush.color = color;
      pencilBrush.width = 5;
      fabricCanvasRef.current.freeDrawingBrush = pencilBrush;
      fabricCanvasRef.current.isDrawingMode = true;
    }
  };

  const enableObjectSelection = () => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.isDrawingMode = false;
      fabricCanvasRef.current.selection = true;
      fabricCanvasRef.current.forEachObject((obj) => {
        obj.selectable = true;
        obj.evented = true;
      });
    }
  };

  return (
    <>
      <button onClick={handleErase} className="mr-4">
        ERASE
      </button>
      <Slider
        value={eraserWidth}
        onChange={(event, newValue) => setEraserWidth(newValue as number)}
        aria-label="Eraser Width"
        valueLabelDisplay="on"
        min={1}
        max={100}
      />

      <button onClick={handleDraw}>DRAW</button>
      <button onClick={enableObjectSelection}>SELECT</button>

      <ColorPicker color={color} onChange={(color) => setColor(color.hex)} />
      <canvas
        ref={canvasRef}
        height={window.innerHeight}
        width={window.innerWidth}
        onMouseDown={() => console.log("down")}
      />
    </>
  );
}

export default Projectpage;
