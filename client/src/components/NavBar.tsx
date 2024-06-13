import React from "react";
import { Slider } from "@mui/material";
import ColorPicker from "react-pick-color";

interface NavbarProps {
  pencilThickness: number;
  setPencilThickness: (thickness: number) => void;
  color: string;
  setColor: (color: string) => void;
  isErasing: boolean;
  setIsErasing: (erasing: boolean) => void;
  clearCanvas: () => void;
  leaveProject: () => void;
  showPallet: boolean;
  setShowPallet: (show: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  pencilThickness,
  setPencilThickness,
  color,
  setColor,
  isErasing,
  setIsErasing,
  clearCanvas,
  leaveProject,
  showPallet,
  setShowPallet,
}) => {
  const handleThickness = (e: Event, value: number | number[]) => {
    e.preventDefault();
    setPencilThickness(Array.isArray(value) ? value[0] : value);
  };

  const handleEraser = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsErasing(!isErasing);
  };

  const handlePallet = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowPallet(!showPallet);
  };

  return (
    <div className="flex items-center justify-between p-5 bg-gray-900 text-white shadow-lg">
      <div className="flex items-center p-5 justify-evenly  w-full">
        <div className="flex items-center p-4 gap-4 w-full ">
          <label htmlFor="thickness-slider" className="text-sm text-gray-300">
            Thickness
          </label>
          <Slider
            id="thickness-slider"
            aria-label="Thickness"
            value={pencilThickness}
            onChange={handleThickness}
            max={30}
            min={1}
            className="w-60"
          />
          <span className="text-sm text-gray-300">{pencilThickness}</span>
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="color-picker" className="text-sm text-gray-300">
            Color
          </label>
          <div
            id="color-picker"
            style={{ backgroundColor: `${color}` }}
            className="h-10 w-10 cursor-pointer rounded-full border border-white mr-2"
            onClick={handlePallet}
          ></div>
          {showPallet && (
            <div className="absolute right-20 top-40 mt-10 z-10">
              <ColorPicker
                color={color}
                onChange={(color) => setColor(color.hex)}
              />
            </div>
          )}
        </div>
        <button
          className={`px-4 py-2 text-sm rounded ${isErasing ? "bg-yellow-500 hover:bg-yellow-700" : "bg-blue-500 hover:bg-blue-700"} text-white`}
          onClick={handleEraser}
        >
          {isErasing ? "Draw" : "Erase"}
        </button>
      </div>
      <div className="flex items-center space-x-4">
        <button
          className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white text-sm rounded"
          onClick={clearCanvas}
        >
          Clear
        </button>
        <button
          className="px-4 py-2 bg-green-500 hover:bg-green-700 text-white text-sm rounded"
          onClick={leaveProject}
        >
          Exit
        </button>
      </div>
    </div>
  );
};

export default Navbar;
