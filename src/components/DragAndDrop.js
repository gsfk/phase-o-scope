import React, {useState} from "react";
import styled from "styled-components";
import { FiUpload } from "react-icons/fi";

import {boxShadow, DragAndDropSettings} from '../constants'

// drag and drop code adapted from https://github.com/chidimo/react-dnd
const DragAndDrop = ({ data, dispatch }) => {
  
  const [isHovering, setIsHovering] = useState(false)

  // fires once on entering
  const handleDragEnter = (e) => {
    e.preventDefault(); //default is to open file
    e.stopPropagation();
    dispatch({ type: "SET_DROP_DEPTH", dropDepth: data.dropDepth + 1 });
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: "SET_DROP_DEPTH", dropDepth: data.dropDepth - 1 });
    if (data.dropDepth > 0) {
      return;
    }
    dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: false });
    setIsHovering(false)
  };

  // fires repeatedly while over 
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsHovering(true)
    e.dataTransfer.dropEffect = "copy";
    dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: true });
  };

  const handleDrop = (e) => {
      console.log({dropEvent: e})
    e.preventDefault();
    e.stopPropagation();

    let files = [...e.dataTransfer.files];

    if (files && files.length > 0) {
    //   const existingFiles = data.fileList.map((f) => f.name);
    //   files = files.filter((f) => !existingFiles.includes(f.name));

      dispatch({ type: "ADD_FILE_TO_LIST", files });
    //   e.dataTransfer.clearData();
      dispatch({ type: "SET_DROP_DEPTH", dropDepth: 0 });
      dispatch({ type: "SET_IN_DROP_ZONE", inDropZone: false });
      setIsHovering(false)
    }
  };

  const handleOpen = (e) =>{
    e.preventDefault();         //this doesn't work
    e.stopPropagation();
    // add file to state 
   try { 
    const file = e.target.files[0]
    const files = [file];   //dispatch code requires repackaging
    dispatch({ type: "ADD_FILE_TO_LIST", files });
} catch (err){
    console.error(e.message)
}

  }
 



  return (
    <DragAndDropArea
      onDragEnter={(ev) => handleDragEnter(ev)}
      onDragLeave={(ev) => handleDragLeave(ev)}
      onDragOver={(ev) => handleDragOver(ev)}
      onDrop={(ev) => handleDrop(ev)}
      isHovering={isHovering}
    >
      <Title>PHASE-O-SCOPE</Title>
       <IconWrapper> <FiUpload size="2em" /></IconWrapper>
      <OpenFile id="open" type="file" accept="audio/*" onChange={(e) => handleOpen(e)} />
      <Label htmlFor="open">Open a file </Label>
      <span>or drag here</span>
      {/* <ThenClick>Then click file to load</ThenClick> */}
    </DragAndDropArea>
  );
};

const DragAndDropArea = styled.div`
  color: #01dd01;
  font-weight: bold;
  width: 100%;

  padding: ${DragAndDropSettings.padding};
  /* max-width: ${DragAndDropSettings.maxWidth}; */
  border-radius: ${DragAndDropSettings.borderRadius};
  text-align: center;
  background-color: ${props => props.isHovering ? "#404840" : "#012401" };
  font-weight: 400;
  box-shadow: ${boxShadow};
  border: ${DragAndDropSettings.border} 
`;

const Title = styled.p`
  font-weight: bold;
  margin-bottom: 20px;
`;


//hide ugly input rectangle
const OpenFile = styled.input`
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
`;

const Label = styled.label`
    font-weight: 800;
`;

const IconWrapper = styled.div`
    margin: 10px;
`;

const ThenClick = styled.p`
  margin: 5px;
`;


export default DragAndDrop;
