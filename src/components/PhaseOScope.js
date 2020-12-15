import React, { useState, useReducer, useContext } from "react";
import styled from "styled-components";

import Loader from "./Loader";

import Oscilloscope from "./Oscilloscope";
import {
  boxShadow,
  oscilloscopeSettings,
  waveformSettings,
  border,
  DragAndDropSettings,
} from "../constants";
import DragAndDrop from "./DragAndDrop";
import PlayList from "./PlayList";
import Waveform from "./Waveform";
import { AppContext } from "./AppContext";

const PhaseOScope = () => {
  const { selectedTrack, setSelectedTrack, loading } = useContext(AppContext);
  const [analyserL, setAnalyserL] = useState(null);
  const [analyserR, setAnalyserR] = useState(null);
  const [showSpectrogram, setShowSpectrogram] = useState(false);

  // drag and drop reducer
  // adapted from https://github.com/chidimo/react-dnd
  const reducer = (state, action) => {
    switch (action.type) {
      case "SET_DROP_DEPTH":
        return { ...state, dropDepth: action.dropDepth };
      case "SET_IN_DROP_ZONE":
        return { ...state, inDropZone: action.inDropZone };
      case "ADD_FILE_TO_LIST":
        return { ...state, fileList: state.fileList.concat(action.files) };
      default:
        return state;
    }
  };

  const [data, dispatch] = useReducer(reducer, {
    dropDepth: 0,
    inDropZone: false,
    fileList: [],
  });

  return (
    <>
      <AppWrapper>
        <Top>
          <Left>
            <DragAndDropWrapper>
              <DragAndDrop data={data} dispatch={dispatch} />
            </DragAndDropWrapper>
            <PlayList files={data.fileList} />
          </Left>
          <Right>
            <OscilloscopeWrapper>
              <SmallOscilloscope>
              {loading && (
                  <LoadWrapper>
                    <Loader size={64} />
                  </LoadWrapper>
                )}
                {analyserR && (
                  <Oscilloscope analyserL={analyserL} analyserR={analyserR} width={oscilloscopeSettings.smallWidth} />
                )}
              </SmallOscilloscope>
              <StandardOscilloscope>
                {loading && (
                  <LoadWrapper>
                    <Loader size={128} />
                  </LoadWrapper>
                )}
                {analyserR && (
                  <Oscilloscope analyserL={analyserL} analyserR={analyserR} width={oscilloscopeSettings.width} />
                )}
              </StandardOscilloscope>
            </OscilloscopeWrapper>
          </Right>
        </Top>
        <Bottom>
          {selectedTrack && (
            <WaveformWrapper>
              <Waveform
                setAnalyserL={setAnalyserL}
                setAnalyserR={setAnalyserR}
                files={data.fileList}
                showSpectrogram={showSpectrogram}
              />
            </WaveformWrapper>
          )}
        </Bottom>
      </AppWrapper>
    </>
  );
};


const OscilloscopeWrapper = styled.div`
`;

const StandardOscilloscope = styled.div`
  width: ${oscilloscopeSettings.width}px;
  height: ${oscilloscopeSettings.width}px;
  margin: ${oscilloscopeSettings.margin}px;
  background-color: ${oscilloscopeSettings.backgroundColour};
  border: ${oscilloscopeSettings.border};
  border-radius: ${oscilloscopeSettings.borderRadius};
  box-shadow: ${boxShadow};

  @media (max-width: 810px) {
    display: none;
  }
`;

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px 20px;

  @media (max-width: 810px) {
    align-items: center;
    margin: 0px 20px;
  }

`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 0px;
`;

const Right = styled.div`
`;

const DragAndDropWrapper = styled.div`
  display: flex;
  margin: ${DragAndDropSettings.margin};
  /* max-width: ${DragAndDropSettings.maxWidth}; */
  width: 300px;

  @media (max-width: 810px) {
    width: 300px;
  }

`;
const Top = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  @media (max-width: 810px) {
    flex-direction: column;
  }
`;

const Bottom = styled.div`
  width: 100%;
  margin: 5px;
  display: flex;
  justify-content: center;

  @media (max-width: 810px) {
    width: 105%;   
    margin: 0;
    align-items: center;
  }

`;

const WaveformWrapper = styled.div`
  margin: 5px;
  border: ${border};
  background-color: ${waveformSettings.bgColour};
  box-shadow: ${boxShadow};
  width: 100%;

  @media (max-width: 810px) {
    width: 300px;
    margin: 10px 0;
  }
`;

const LoadWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 190px;

  @media (max-width: 810px) {
    padding: 10x;
  }
`;

// const ControlsWrapper = styled.div`
//   display: flex;
//   margin: 5px;
// `;

const SmallOscilloscope = styled.div`
  display: none;

  @media (max-width: 810px) {
    width: ${oscilloscopeSettings.smallWidth}px;
    height: ${oscilloscopeSettings.smallWidth}px;
    margin: ${oscilloscopeSettings.margin}px;
    background-color: ${oscilloscopeSettings.backgroundColour};
    border: ${oscilloscopeSettings.border};
    border-radius: ${oscilloscopeSettings.borderRadius};
    box-shadow: ${boxShadow};

    display: block;
    margin: 0 auto;
  }
`;

export default PhaseOScope;
