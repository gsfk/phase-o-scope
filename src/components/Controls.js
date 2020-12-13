import React, {useContext} from "react";
import styled from "styled-components";

import PlayIcon from "./PlayIcon";
import PauseIcon from "./PauseIcon";
import MuteIcon from "./MuteIcon";
import UnMuteIcon from "./UnMuteIcon";
import { AppContext } from "./AppContext";

const Controls = () => {
  const { isPlaying, setIsPlaying, isMuted, setIsMuted } = useContext(
    AppContext
  );

  const handlePlayPause = () => {};

  const handleMute = () => {};

  return (
    <Wrapper>
      {isPlaying ? (
        <PauseIcon onClick={handlePlayPause} />
      ) : (
        <PlayIcon onClick={handlePlayPause} />
      )}
      {isMuted ? (
        <UnMuteIcon onClick={handleMute} />
      ) : (
        <MuteIcon onClick={handleMute} />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
`;

export default Controls;
