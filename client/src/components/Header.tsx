import React from "react";
import { useLocation } from "react-router";

interface HeaderProps {
  username: string;
}

const Header: React.FC<HeaderProps> = ({ username }) => {
  const location = useLocation();
  const isLogin = location.pathname === "/login";
  const isRegister = location.pathname === "/register";

  if (isLogin || isRegister) return null;
  return (
    <>
      <div className="flex flex-wrap text-white text-3xl justify-between items-center px-12 py-6 border-2 border-white rounded-3xl w-full min-w-full">
        <h1>SketchSphere</h1>
        <h1>Welcome, {username}</h1>
      </div>
    </>
  );
};

export default Header;
