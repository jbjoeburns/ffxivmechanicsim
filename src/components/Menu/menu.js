import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"
import Backdrop from "../Backdrop";

// lets you define multiple animation states
// gonna start thin, then expand downwards
const window = {
  hidden: {
    width: "clamp(50%, 700px, 90%)",
    height: "0%",
    opacity: 1,
  },
  visible: {
    width: "clamp(50%, 700px, 90%)",
    height: "min(50%, 600px)",
    opacity: 1,
    // does little bounce animation here
    transition: {
      duration: 1,
      type: "spring",
      damping: 25,
      stiffness: 500,
    }
  },
  exit: {
    width: "clamp(50%, 700px, 90%)",
    height: "0%",
    opacity: 1,
  },
}

const Menu = ({ handleStart }) => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("MT");
  const [selectedMechanic, setSelectedMechanic] = useState("Caloric");
  const [roleList]  = useState(["MT", "OT", "H1", "H2", "M1", "M2", "R1", "R2"])
  const [mechanicList]  = useState(["Caloric"])
  const [open, setOpen] = useState(false)

  const handleChangeRole = (event) => {
    setSelectedRole(event.target.value)
  }

  const handleChangeMechanic = (event) => {
    setSelectedMechanic(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate('/caloric',{state:{selectedRole:selectedRole, selectedMechanic: selectedMechanic, roleList: roleList}});
  }

  return (
    <Backdrop>
      <motion.div
        key="modal"
        onClick={(e) => e.stopPropagation()}
        className="modal menu"
        variants={window}
        initial="hidden"
        animate="visible"
        exit="exit"
        >
          <div className="backgroundCover">
            <div className="topbar">
              <p>MECHANICSELECTOR.EXE</p>
              <button onClick={handleStart}>
                <div>
                  o
                </div>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <legend className="formText">ROLE:</legend>
              <select value={selectedRole} onChange={handleChangeRole}>
                {
                roleList.map(role => {
                  return (
                  <>
                  <option value={role}>{role}</option>
                  </>
                  )
                })}
              </select>
              <legend className="formText">MECHANIC:</legend>
              <select value={selectedMechanic} onChange={handleChangeMechanic}>
                {
                mechanicList.map(mechanic => {
                  return (
                  <>
                  <option value={mechanic}>{mechanic}</option>
                  </>
                  )
                })}
              </select>

              <input className="formText" type="submit" value="START SIM!"/>
            </form>
          </div>
        </motion.div> 
    </Backdrop>
    
  );
};

export default Menu;

{/* <div className="backgroundVid">
<div className="backgroundCover">
  <form onSubmit={handleSubmit}>
    <legend>Select Role:</legend>
    <select value={selectedRole} onChange={handleChangeRole}>
      {
      roleList.map(role => {
        return (
        <>
        <option value={role}>{role}</option>
        </>
        )
      })}
    </select>
    <legend>Select Mechanic:</legend>
    <select value={selectedMechanic} onChange={handleChangeMechanic}>
      {
      mechanicList.map(mechanic => {
        return (
        <>
        <option value={mechanic}>{mechanic}</option>
        </>
        )
      })}
    </select>
    <br></br>
    <input type="submit" />
  </form>
</div>
</div> */}