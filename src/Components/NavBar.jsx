import React, { useContext } from "react";
import logo from "../assets/youtube.png";
import bright from "../assets/Moon.svg";
import sun from "../assets/Sun.svg";
import { YtContext } from "../Context/YtContext";

const NavBar = () => {
  const { theme, toggleTheme } = useContext(YtContext);

  return (
    <div
      className={`w-full h-16 fixed top-0 z-50 flex items-center justify-between px-8 shadow-md backdrop-blur-lg transition-colors ${
        theme === "Dark" ? "bg-black/40" : "bg-white/60"
      }`}
    >
      <div className="flex items-center gap-3 cursor-pointer">
        <img
          src={logo}
          alt="Logo"
          className={`h-10 w-10 rounded-lg p-2 hover:scale-110 transition-transform ${
            theme === "Dark" ? "invert" : ""
          }`}
        />
        <span
          className={`text-xl font-extrabold tracking-wide drop-shadow-md hover:scale-105 transition-transform ${
            theme === "Dark" ? "text-white" : "text-black"
          }`}
        >
          PlayMeter
        </span>
      </div>
      <div
        onClick={toggleTheme}
        className={`p-2 rounded-full cursor-pointer transition-colors hover:scale-110 ${
          theme === "Dark" ? "hover:bg-white/20" : "hover:bg-black/10"
        }`}
      >
        <img
          src={`${theme==='Dark'? bright: sun}`}
          alt="Toggle Theme"
          className={`h-6 w-6 transition-transform hover:rotate-12 ${
            theme === "Dark" ? "invert" : ""
          }`}
        />
      </div>
    </div>
  );
};

export default NavBar;
