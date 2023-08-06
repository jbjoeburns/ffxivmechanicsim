import React, { useState } from "react";
import Menu from '../../components/menu'
import "./homepage.css";

// perhaps add youtube api afterwards?

const Homepage = () => {
  const [open, setOpen] = useState(false)
  const handleStart = () => {
    setOpen(!open);
  };
  return (
    <div className="backgroundVid">
      <div className="hex"></div>
      <div className="startContainer">
        {open ?
          <Menu/>
        :
          <button onClick={handleStart}>START</button>
        }
      </div>
    </div>
  );
};

export default Homepage;