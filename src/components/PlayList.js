import React, { useState, useContext } from "react";
import styled from "styled-components";

import Track from "./Track";
import { AppContext } from "./AppContext";

const PlayList = ({ files }) => {
  const { selectedTrack, setSelectedTrack } = useContext(AppContext);

  return (
    <Wrapper>
      {selectedTrack && console.log({ selectedTrack: selectedTrack })}
      {files && files.map((file, index) => <Track file={file} key={index} />)}
    </Wrapper>
  );
};

const Wrapper = styled.div``;

export default PlayList;
