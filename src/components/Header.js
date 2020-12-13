import React, { useContext } from "react";
import styled from "styled-components";

import MuteIcon from "./MuteIcon";
import UnMuteIcon from "./UnMuteIcon";
import {
  oscilloscopeSettings,
  border,
  boxShadow,
  waveformSettings,
} from "../constants";
import { AppContext } from "./AppContext";

const Header = () => {
  const { isMuted, setIsMuted } = useContext(AppContext);

  const handleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <Wrapper>
      <Title>phase-o-scope</Title>
      <Controls>
        <MuteWrapper>{isMuted ? <UnMuteIcon /> : <MuteIcon />}</MuteWrapper>
        {/* <Toggle>too green?</Toggle> */}
      </Controls>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  /* background-color: #001500; */
  color: ${oscilloscopeSettings.scanColour};
`;

const Title = styled.p`
  /* font-family: "Montserrat"; */
  font-weight: 900;
  font-size: 1.2em;
  margin-left: 10px;
  border: ${border};
  background-color: ${waveformSettings.bgColour};
  box-shadow: ${boxShadow};
  padding: 10px;
  border-radius: 5px;
`;

const MuteWrapper = styled.button`
  background-color: ${oscilloscopeSettings.backgroundColour};
  outline: none;
  border: none;
  margin: 10px;
  border: ${border};
  background-color: ${waveformSettings.bgColour};
  box-shadow: ${boxShadow};
  padding: 8px;
  border-radius: 5px;
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const Toggle = styled.div`
  margin: 10px;
`;

export default Header;
