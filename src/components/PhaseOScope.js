import React, { useState, useReducer, useContext } from "react";
import styled from "styled-components";

// import Waveform from "./Waveform";
// import PlayList from "./PlayList";
import Oscilloscope from "./Oscilloscope";
import {
  boxShadow,
  oscilloscopeSettings,
  waveformSettings,
  border
} from "../constants";
import DragAndDrop from "./DragAndDrop";
import PlayList from './PlayList'
import Waveform from './Waveform'
import { AppContext } from './AppContext'
import ResizingOscilloscope from './ResizingOscilloscope'

const PhaseOScope = () => {
    const {selectedTrack, setSelectedTrack} = useContext(AppContext)
    const [analyserL, setAnalyserL] = useState(null);
    const [analyserR, setAnalyserR] = useState(null);
    const [files, setFiles] = useState([]);
    const [showSpectrogram, setShowSpectrogram] = useState(false)
    
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

      return (<AppWrapper>
    <Top>
        <Left>           
            <DragAndDropWrapper>
            <DragAndDrop data={data} dispatch={dispatch} />
            </DragAndDropWrapper>
            <PlayList files={data.fileList}/>
        </Left>
        <Right>
        <OscilloscopeWrapper>
        {analyserR && (
            <Oscilloscope analyserL={analyserL} analyserR={analyserR} />
          )}
            {/* {analyserR && (
            <ResizingOscilloscope analyserL={analyserL} analyserR={analyserR} />
          )} */}
          </OscilloscopeWrapper>
        </Right>
        </Top>
    <Bottom>
      <WaveformWrapper>
    <Waveform
            setAnalyserL={setAnalyserL}
            setAnalyserR={setAnalyserR}
            files={data.fileList}
            showSpectrogram={showSpectrogram}
          />
          </WaveformWrapper>
              </Bottom>
     </AppWrapper>)
}


const OscilloscopeWrapper = styled.div`
  width: ${oscilloscopeSettings.width}px;
  height: ${oscilloscopeSettings.width}px;
  margin: ${oscilloscopeSettings.margin}px;
  background-color: ${oscilloscopeSettings.backgroundColour};
  border: ${oscilloscopeSettings.border};
  border-radius: ${oscilloscopeSettings.borderRadius};
  box-shadow: ${boxShadow};
`;

const AppWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 85vw;;
    margin: 0 auto;
`;

const Left = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
`;

const Right = styled.div``;

const DragAndDropWrapper = styled.div`
    display: flex;
   
`;
const Top = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Bottom = styled.div``;

const WaveformWrapper = styled.div`
  margin: 10px;
  border: ${border};
  background-color: ${waveformSettings.bgColour};
  box-shadow: ${boxShadow};
`;


export default PhaseOScope;