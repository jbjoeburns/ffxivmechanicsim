import React, { useState } from "react";
import Menu from '../../components/Menu/menu'
import "./homepage.css";
import { motion, AnimatePresence } from "framer-motion"

// perhaps add youtube api afterwards?
const startFade = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
}


const Homepage = () => {
  const [open, setOpen] = useState(false)
  const handleStart = () => {
    setOpen(!open);
  };
  return (
    <div className="backgroundVid">
      <div className="elementContainer"></div>
        <div className="startContainer">
        <AnimatePresence
        initial={false}
        mode="wait"
        onExitComplete={() => null}
        > 
          {open && 
          
            <Menu handleStart = {handleStart} open = {open}/>
           

          }
        </AnimatePresence> 
        {
        Array.apply(null, { length: 3 }).map((e, i) => (
        <AnimatePresence>
          {open ||
            <motion.button 
            key={i} 
            whileHover={{scale:1.1}} 
            className="startButton" 
            onClick={handleStart}
            variants={startFade}
            initial="hidden"
            animate="visible"
            exit="exit"
            >
            START
            </motion.button>
          }
        </AnimatePresence>
        ))}
      </div>
    </div>
  );
};

export default Homepage;