import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Menu = () => {
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
    <div className="backgroundVid">
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
    </div>
  );
};

export default Menu;