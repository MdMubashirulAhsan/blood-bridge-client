import React from "react";
import { HiAdjustments } from "react-icons/hi";
// import { Palette } from 'lucide-react';
const ThemeControl = () => {
  return (
    <div>
      <div className="dropdown dropdown-center">
        <div tabIndex={0} role="button" className="hover:text-primary">
          
          <Palette />
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content bg-base-300 rounded-box z-1 w-25 p-2 shadow-2xl"
        >
          <li>
            <input
              type="radio"
              name="theme-dropdown"
              className="theme-controller w-full btn btn-sm  btn-ghost "
              aria-label="Light"
              value="default"
            />
          </li>
          <li>
            <input
              type="radio"
              name="theme-dropdown"
              className="theme-controller w-full btn btn-sm  btn-ghost "
              aria-label="Dark"
              value="dark"
            />
          </li>
          <li>
            <input
              type="radio"
              name="theme-dropdown"
              className="theme-controller w-full btn btn-sm  btn-ghost "
              aria-label="Retro"
              value="retro"
            />
          </li>
          <li>
            <input
              type="radio"
              name="theme-dropdown"
              className="theme-controller w-full btn btn-sm  btn-ghost "
              aria-label="Cyberpunk"
              value="cyberpunk"
            />
          </li>
          <li>
            <input
              type="radio"
              name="theme-dropdown"
              className="theme-controller w-full btn btn-sm  btn-ghost j"
              aria-label="Forest"
              value="forest"
            />
          </li>
          <li>
            <input
              type="radio"
              name="theme-dropdown"
              className="theme-controller w-full btn btn-sm  btn-ghost "
              aria-label="Aqua"
              value="aqua"
            />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ThemeControl;
