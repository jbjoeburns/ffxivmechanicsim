// make victory/failstates a function with incrementing movement number as a way to refactor


import React, { useState, useEffect } from "react";
import {useLocation} from 'react-router-dom';
import "./caloric.css";

const Caloric = () => {
    // takes info from homepage
    const location = useLocation();
    // tracks which movement we're on
    const [movementNumber, setMovementNumber] = useState(1);
    // tracks previous position
    const [prevPos, setPrevPos] = useState("");
    // list of debuffs to randomise
    const [debuffs] = useState(["beacon", "fire", "fire", "wind"]);
    // tracks who is at what position for movement 3
    const [posTaken] = useState({"A" : "", "B" : "", "C" : "", "D" : "", "1" : "", "2" : "", "N" : "", "S" : ""});
    // debuffs each group member has; object
    const [groupStatus, setGroupStatus] = useState([]);
    // timer, counts down from 12
    const [timer, setTimer] = useState(12);
    // tracks successful clears
    const [consecutiveClears, setConsecutiveClears] = useState(-1)
    // used to display info once start is pressed
    const [open, setOpen] = useState(true)
    // checks if you failed, so useeffect can be triggered and debuffs re-randomised (toggles between true and false to do this)
    const [failCheck, setFailCheck] = useState(false)
    // checks if you won
    const [winCheck, setWinCheck] = useState(false)
    useEffect(() => {
        // function to randomise debuffs
        const randomiseDebuffs = async () => {
            let debuffs1 = debuffs.sort(() => Math.random() - 0.5)
            let debuffs2 = debuffs.sort(() => Math.random() - 0.5)
            setGroupStatus(Object.assign(...location.state.roleList.map((k, i) =>({
                [k]: debuffs1.concat(debuffs2)[i] }))))
    };
    randomiseDebuffs();
    // sets timer and movement counter and empties previous position hook
    setTimer(12)
    setMovementNumber(1)
    setPrevPos("")
    // re-randomises and resets timer+counter+previous position hook once the mechanic is cleared
    }, [consecutiveClears, failCheck])

    // function to start the sim once the start button is pressed
    function handleStart () {
        console.log(groupStatus)
        setOpen(!open);
        setFailCheck(false)
        setWinCheck(false)
        setConsecutiveClears(0)
    }

    // the function that handles all the fail/pass states once a position is selected from the map
    function handlePosition (value) {
        // defines indexes for the player, and their partner for use in fail checks
        let keysArr = Object.keys(groupStatus)
        let partnerIndex = keysArr.indexOf(location.state.selectedRole)
        let playerIndex = partnerIndex
        if(playerIndex % 2 == 0) {
            // player is in group 1, so partner is below them in list of roles
            partnerIndex++
        }
        else {
            // player is in group 2, so partner is above them in list of roles
            partnerIndex--
        }

        // partner role name variable
        let partner = Object.keys(groupStatus)[partnerIndex]
        
        // for testing 
        console.log("movement ", movementNumber)
        console.log("player is ", groupStatus[location.state.selectedRole])
        console.log("their partner is ", groupStatus[partner])
        console.log("player went to ", value)

        // checks if movement was correct, for initial movements
    }

    // new plan: track each players expected movements by iterating through the list of player positions

    // initial movements: find beacon player, then determine it's group
    // then add +1 or -1 depending on G1 or G2 to determine partner
    // rest go mid

    // movement 2: group 1 needs to go to opposite debuff going CCW starting D
    // so iterate through the positions list to find people at mid
    // then for each mid person in group 1, check their debuff then iterate through the positions list to find debuff of D, C, B in that order
    // first a non-matching debuff is found, place that player at that position and move onto the other group 1 member (skipping position first member took)
    // repeat for group 2 but CW starting A (A, B, C)

    // movement 3: winds go out, fires go CC or CCW
    // overwrite all fires with either no-debuff, or re-fire (only 2 re-fires max)
    // process wind movement first (A -> N, B - > 2, C -> S, D -> 1)
    // for person at C, check if person remaining at D has the same debuff as you
    // if so, go CC, if not go CC
    // same thing for person at A but for person at B instead

    return (
        <div className = "container">
            {open ?
                <>
                <div>{location.state.selectedMechanic} sim! Click start!</div>
                {failCheck ?
                    <b>
                        LOL u died XD
                    </b>
                        : 
                    <>
                        {winCheck ? 
                            <b>
                                omg U winned??
                            </b> 
                            :
                            <></>
                        }
                    </>
                }
                <button onClick={() => handleStart()}>START</button>
                </> 
                :
                <>
                CLEARS: {consecutiveClears}
                <br/>
                MOVEMENT: {movementNumber}
                <br/>
                ROLE: {location.state.selectedRole}
                <br/>
                DEBUFFS: 
                <br/>
                {
                    Object.entries(groupStatus).map( ([key, value]) => <>{key}: {value}<br></br></>)
                }
                <br/>
                TIMER: {timer}
                </>
            }
        <div className = "background">
            <button class="btn1" value={"1"} onClick={(e) => handlePosition(e.target.value)}>HERE?</button>
            <button class="btnD" value={"D"} onClick={(e) => handlePosition(e.target.value)}>HERE?</button>
            <button class="btnMid" value={"M"} onClick={(e) => handlePosition(e.target.value)}>HERE?</button>
            <button class="btnB" value={"B"} onClick={(e) => handlePosition(e.target.value)}>HERE?</button>
            <button class="btn2" value={"2"} onClick={(e) => handlePosition(e.target.value)}>HERE?</button>
            <button class="btnNorth" value={"N"} onClick={(e) => handlePosition(e.target.value)}>HERE?</button>
            <button class="btnSouth" value={"S"} onClick={(e) => handlePosition(e.target.value)}>HERE?</button>
            <button class="btnA" value={"A"} onClick={(e) => handlePosition(e.target.value)}>HERE?</button>
            <button class="btnC" value={"C"} onClick={(e) => handlePosition(e.target.value)}>HERE?</button>
        </div>
    </div>
  );
};

export default Caloric;