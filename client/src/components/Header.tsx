import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { logout } from "../Store/authSlice";
interface HeaderProps {
  username: string;
}

const Header: React.FC<HeaderProps> = ({ username }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isLogin = location.pathname === "/";
  const isRegister = location.pathname === "/register";
  const navigate = useNavigate();
  const [showList, setShowList] = useState<boolean>(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("username");
    dispatch(logout());
    navigate("/");
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowList(!showList);
  };
  if (isLogin || isRegister) return null;
  return (
    <>
      <div className="flex flex-wrap text-white text-3xl justify-between items-center px-12 py-6 border-2 border-white rounded-3xl w-full min-w-full">
        <h1>SketchSphere</h1>
        <div className="flex flex-wrap flex-row items-end justify-center gap-10">
          <h1 onClick={handleClick} className="relative cursor-pointer">
            Welcome, {username}
            {showList && (
              <div
                className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10"
                onClick={handleClick}
              >
                <h4
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-200 cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </h4>
              </div>
            )}
          </h1>
        </div>
      </div>
    </>
  );
};

export default Header;
