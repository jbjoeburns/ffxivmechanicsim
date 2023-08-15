// make victory/failstates a function with incrementing movement number as a way to refactor


import React, { useState, useEffect } from "react";
import {useLocation} from 'react-router-dom';
import "./caloric.css";
import { motion, AnimatePresence } from "framer-motion"

const Caloric = () => {
    // takes info from homepage
    const location = useLocation();
    // tracks which movement we're on
    const [movementNumber, setMovementNumber] = useState(1);
    // list of debuffs to randomise
    const [debuffs] = useState(["beacon", "fire", "fire", "wind"]);
    // list of markers
    const [markers] = useState(["A", "B", "C", "D", "1", "2", "N", "S", "M"])
    // tracks who is at what position for movement 3
    const [posTaken, setPosTaken] = useState("");
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
    useEffect(() => {
        // function to randomise debuffs
        const randomiseDebuffs = async () => {
            let debuffs1 = debuffs.sort(() => Math.random() - 0.5)
            let debuffs2 = debuffs.sort(() => Math.random() - 0.5)
            setGroupStatus(Object.assign(...location.state.roleList.map((k, i) =>({
                [k]: debuffs1.concat(debuffs2)[i] }))))
        };
        randomiseDebuffs();
        // sets timer and movement counter
        setTimer(12)
        setMovementNumber(1)
        setPosTaken({"MT" : "M", "OT" : "M", "H1" : "M", "H2" : "M", "M1" : "M", "M2" : "M", "R1" : "M", "R2" : "M"})
        // re-randomises and resets timer+counter hook once the mechanic is cleared
    }, [consecutiveClears, failCheck])

    // function to start the sim once the start button is pressed
    function handleStart () {
        // this should reveal the debuffs
        console.log(groupStatus)
        setOpen(!open);
        setFailCheck(false)
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

        // positions expected, not updated until movement is passed
        let expectedPos = posTaken
        let ExpectedGroupStatus = groupStatus
        let incrementNum = 0
        
        //MOVEMENT 1, the beacons:
        if (movementNumber === 1) {
            Object.keys(expectedPos).forEach(function eachKey(key) {     
                if (groupStatus[key] === "beacon") {
                    ExpectedGroupStatus[key] = "wind"
                    if (incrementNum < 4) {
                        expectedPos[key] = "D"
                        if (incrementNum % 2 == 0) {
                            expectedPos[Object.keys(expectedPos)[incrementNum + 1]] = "C"
                        }
                        else {
                            expectedPos[Object.keys(expectedPos)[incrementNum - 1]] = "C"
                        }
                    }
                    else {
                        expectedPos[key] = "B"
                        if (incrementNum % 2 == 0) {
                            expectedPos[Object.keys(expectedPos)[incrementNum + 1]] = "A"
                        }
                        else {
                            expectedPos[Object.keys(expectedPos)[incrementNum - 1]] = "A"
                        }
                    }
                }
                incrementNum++
            });
        }
        //MOVEMENT 2, MIDS GO TO OPPOSITE DEBUFFS:
        // either iterate through the object twice, first to determine debuffs of DCBA then to set expected positions
        // or BETTER, make an array of debuffs at DCBA in order, then iterate through object assigning positions appropriately 
        let DCounter = 0
        let BCounter = 0
        let CCounter = 0
        let ACounter = 0
        if (movementNumber === 2) {
            Object.keys(posTaken).forEach(function eachKey(key) {
                if (posTaken[key] == "M") {
                    if (incrementNum % 2 == 0) {
                        // find a way to get debuff by position
                        // assuming support prio
                        // this was causing a problem, testing fix
                        if (groupStatus[Object.keys(posTaken).find(key => posTaken[key] === "D")] != groupStatus[key] && DCounter === 0) {
                            expectedPos[key] = "D"
                            DCounter++
                        }
                        else if (groupStatus[Object.keys(posTaken).find(key => posTaken[key] === "C")] != groupStatus[key] && CCounter === 0) {
                            expectedPos[key] = "C"
                            CCounter++
                        }
                        else if (groupStatus[Object.keys(posTaken).find(key => posTaken[key] === "B")] != groupStatus[key] && BCounter === 0) {
                            expectedPos[key] = "B"
                            BCounter++
                        }
                        else if (groupStatus[Object.keys(posTaken).find(key => posTaken[key] === "A")] != groupStatus[key] && ACounter === 0) {
                            expectedPos[key] = "A"
                            ACounter++
                        }
                        else {
                            alert("encountering that strange issue, take note of positions for debug")
                        }
                    }
                    else {
                        if (groupStatus[Object.keys(posTaken).find(key => posTaken[key] === "A")] != groupStatus[key] && ACounter === 0) {
                            expectedPos[key] = "A"
                            ACounter++
                        }
                        else if (groupStatus[Object.keys(posTaken).find(key => posTaken[key] === "B")] != groupStatus[key] && BCounter === 0) {
                            expectedPos[key] = "B"
                            BCounter++
                        }
                        else if (groupStatus[Object.keys(posTaken).find(key => posTaken[key] === "C")] != groupStatus[key] && CCounter === 0) {
                            expectedPos[key] = "C"
                            CCounter++
                        }
                        else if (groupStatus[Object.keys(posTaken).find(key => posTaken[key] === "D")] != groupStatus[key] && DCounter === 0) {
                            expectedPos[key] = "D"
                            DCounter++
                        }
                        else {
                            alert("encountering that strange issue, take note of positions for debug")
                        }
                    }
                }
                incrementNum++
            })

            // This block of code is to randomly remove 2 fires from the group in preperation for the next mechanic (not entirely random but irrelevant for purpose)
            let attemptNumber = 0
            let removedCount = 0
            Object.keys(ExpectedGroupStatus).forEach(function eachKey(key) {
                if (ExpectedGroupStatus[key] === "fire" && removedCount < 2) {
                    if (attemptNumber > 1) {
                        ExpectedGroupStatus[key] = "none"
                        removedCount++
                    }
                    else if (Math.floor(Math.random() * 2) === 1) {
                        ExpectedGroupStatus[key] = "none"
                        removedCount++
                    }
                    else {
                        attemptNumber++
                    }
                }
            })
        }

        // MOVEMENT 3, winds go out and A/C pair with opposite debuff, clockwise prio:
        if (movementNumber === 3) {
            Object.keys(posTaken).forEach(function eachKey(key) {
                if (groupStatus[key] === "wind") {
                    if (posTaken[key] === "D") {
                        expectedPos[key] = "1"
                    }
                    if (posTaken[key] === "A") {
                        expectedPos[key] = "N"
                    }
                    if (posTaken[key] === "B") {
                        expectedPos[key] = "2"
                    }
                    if (posTaken[key] === "C") {
                        expectedPos[key] = "S"
                    }
                }
                else {
                    if (posTaken[key] === "A") {
                        if (groupStatus[Object.keys(posTaken).find(key => posTaken[key] === "B")] != groupStatus[key]) {
                            expectedPos[key] = "B"
                        }
                        else {
                            expectedPos[key] = "D"
                        }
                    }
                    if (posTaken[key] === "C") {
                        if (groupStatus[Object.keys(posTaken).find(key => posTaken[key] === "D")] != groupStatus[key]) {
                            expectedPos[key] = "D"
                        }
                        else {
                            expectedPos[key] = "B"
                        }
                    }
                }
            })
        }

        // code to check if movement was correct
        if (expectedPos[location.state.selectedRole] === value) {
            if (movementNumber === 3) {
                alert("passed!")
                let consecutiveClearsPlus = consecutiveClears + 1
                setConsecutiveClears(consecutiveClearsPlus)
            }
            setPosTaken(expectedPos) 
            setGroupStatus(ExpectedGroupStatus)
            let movementNumberPlus = movementNumber + 1
            setMovementNumber(movementNumberPlus)
            return
        }
        else {
            setFailCheck(!failCheck)
            alert("fail")
            return
        }    
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
            <div className = "infobox">
                <p>This is a description of what MECHANIC does. WIP. Embed video below. </p>
                <iframe 
                    width="100%" 
                    height="315" 
                    src="https://www.youtube.com/embed/O3_V1DwPA1I?start=492" 
                    title="YouTube video player" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowfullscreen/>
                <motion.button 
                    key="goButton" 
                    style={{
                        position: "absolute",
                        display: "flex",
                        bottom: "50px"
                    }}
                    whileHover={{scale:1.5}} 
                    className="goButton" 
                    onClick={handleStart}
                >
                GO!
                </motion.button>
            </div>
            <div className = "mapContainer">
                <div>map goes here, remove this text later. find something else to include here, like a description of what the movement is, for example; "Initial positions/beacon movement before debuffs are given", and maybe add a button for a hint. Movement: {movementNumber}, Positions:
                    {
                        Object.keys(posTaken).map((keyName) => {
                            return(
                                <div>{keyName}: {posTaken[keyName]}, {groupStatus[keyName]}</div>
                            )
                        })
                    }
                </div>
                <div className="map">
                    <div className="mapFloor">                    
                    {markers.map((keyName) => {
                        return (
                            <button 
                                className={"btn".concat(String(keyName))} 
                                value={keyName} 
                                onClick={(e) => handlePosition(e.target.value)}>
                                {keyName}
                            </button>
                        )
                    })} </div>
                </div>
            </div>
        </div>
  );
};

export default Caloric;

{/* <div className = "container">
<div className = "infobox"></div>
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
</div> */}