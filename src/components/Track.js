// individual track in a playlist 
import React, { useState, useContext } from "react";
import styled from "styled-components";
import {boxShadow} from '../constants'

import { AppContext } from './AppContext'


// TODO: add controls

const Track = ({file}) => {   
    const {selectedTrack, setSelectedTrack} = useContext(AppContext)
    const [isClicked, setIsClicked] = useState(false)

    const handleClick = () => {
        console.log(`clicked track ${file.name}`)
        setSelectedTrack(file)
    }

    const handleMouseDown  = () =>{
        setIsClicked(true)
        console.log(`clickDown`)
    }

    const handleMouseUp = () => {
        setIsClicked(false)
        console.log(`clickUp`)
    }

    return <Wrapper
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        isClicked={isClicked}
    >{file.name}</Wrapper>
}


const Wrapper = styled.div`
    color: #01dd01;
    background-color: ${props => props.isClicked ? "#404840" : "#012401"};
    width: 100%;
    max-width: 300px;
    padding: 10px 20px;
    margin: 5px 5px 0px 5px;;
    border: 3px solid black;
    border-radius: 50px / 50px;
    font-weight: 800;
    box-shadow: ${boxShadow};

    @media (max-width: 728px) {
    width: 300px;
    margin: 5px;
  }
`;

export default Track;