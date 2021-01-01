import React, { useEffect, useRef, useState, useContext } from "react";
import WaveSurfer from "wavesurfer.js";
import SpectrogramPlugin from 'wavesurfer.js/src/plugin/spectrogram'
import styled from 'styled-components'


import { oscilloscopeSettings, waveformSettings } from "../constants";
import { AppContext } from "./AppContext";
import {colorMap} from '../assets/colourmap.js'
import PlayIcon from './PlayIcon'
import PauseIcon from './PauseIcon'

// TODO: instantiate waveform once in App Context, instead of per track


export default function Waveform({ setAnalyserL, setAnalyserR, files, showSpectrogram }) {
  const { selectedTrack, setSelectedTrack, isLoading, setIsLoading } = useContext(AppContext);
  
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const spectrogramRef = useRef(null)
  const [playing, setPlay] = useState(false);
  const [volume, setVolume] = useState(1);

  const formWaveSurferOptions = (waveRef, spectRef) => ({
    container: waveRef,
    waveColor: waveformSettings.waveColour,
    progressColor: waveformSettings.progressColour,
    cursorColor: waveformSettings.cursorColour,
    cursorWidth: 2,
    barWidth: 1,
    barRadius: 1,
    responsive: true,
    height: waveformSettings.height,
    normalize: false ,
    partialRender: true,
    plugins: [
        SpectrogramPlugin.create({
          container: spectRef,
          labels: false,
          resize: true,
          responsive: true,
          fftSamples: 512,
          colorMap: colorMap,
          height: 20,
      })
  ]
  });

  // create new WaveSurfer instance on mount
  useEffect(() => {
    if (!selectedTrack){
        return
    }
    setPlay(false);
    setIsLoading(true)

    const options = formWaveSurferOptions(waveformRef.current, spectrogramRef.current);
    wavesurfer.current = WaveSurfer.create(options);
    wavesurfer.current.load(URL.createObjectURL(selectedTrack));

    const analyserLeft = wavesurfer.current.backend.ac.createAnalyser();
    analyserLeft.minDecibels = oscilloscopeSettings.minDecibels;
    analyserLeft.maxDecibels = oscilloscopeSettings.maxDecibels;
    analyserLeft.smoothingTimeConstant = oscilloscopeSettings.smoothingTimeConstant;
    analyserLeft.fftSize = oscilloscopeSettings.fftSize;

    const analyserRight = wavesurfer.current.backend.ac.createAnalyser();
    analyserRight.minDecibels = oscilloscopeSettings.minDecibels;
    analyserRight.maxDecibels = oscilloscopeSettings.maxDecibels;
    analyserRight.smoothingTimeConstant =
      oscilloscopeSettings.smoothingTimeConstant;
    analyserRight.fftSize = oscilloscopeSettings.fftSize;

    const splitter = wavesurfer.current.backend.ac.createChannelSplitter(2);
    const merger = wavesurfer.current.backend.ac.createChannelMerger(2);
    // const gainNode = wavesurfer.current.backend.ac.createGain();

    // audio routing graph:
    //                  ----> analyserL ----|
    //                  |                   v
    // source -> splitter --> analyserR --> merger -> destination
 
    splitter.connect(analyserLeft, 0, 0);
    splitter.connect(analyserRight, 1, 0);
    analyserLeft.connect(merger, 0, 0);
    analyserRight.connect(merger, 0, 1);

    // merger.connect(contextObj.destination)
    wavesurfer.current.backend.setFilters([
      splitter,
    //   analyserLeft,      //do not connect analysers here, this flattens to mono
    //   analyserRight,
      merger,
    ]);
    setAnalyserL(analyserLeft);
    setAnalyserR(analyserRight);

    // setAnalyserL, setAnalyserR callbacks here
    // should be stored in parent

    wavesurfer.current.on("ready", function () {
      // https://wavesurfer-js.org/docs/methods.html
      // wavesurfer.current.play();
      // setPlay(true);

      // make sure object stillavailable when file loaded
      if (wavesurfer.current) {
        wavesurfer.current.setVolume(volume);
        setVolume(volume);
      }
      setIsLoading(false)
      wavesurfer.current.play();

    });

    // wavesurfer.on('load', wavesurfer.current.play());


    

    // Removes events, elements and disconnects Web Audio nodes.
    // when component unmount
    return () => wavesurfer.current.destroy();
  }, [selectedTrack]);





  const handlePlayPause = () => {
    setPlay(!playing);
    wavesurfer.current.playPause();
  };

  // const onVolumeChange = (e) => {
  //   const { target } = e;
  //   const newVolume = +target.value;

  //   if (newVolume) {
  //     setVolume(newVolume);
  //     wavesurfer.current.setVolume(newVolume || 1);
  //   }
  // };

  // const showPlayIcon = () => {
  //   if (playing) {
  //       return false;
  //   }
  //     if(isLoading ){
  //         return true
  //     }
  //     return false
  // }

//   FIX UGLY CONTROLS
  return (
    <div>
      <div id="waveform" ref={waveformRef} />
      <div className="controls">                
        <Button onClick={handlePlayPause}><IconWrapper>{playing ? <PlayIcon/> : <PauseIcon/>}</IconWrapper></Button>
        {/* <input
          type="range"
          id="volume"
          name="volume"
          // waveSurfer recognize value of `0` same as `1`
          //  so we need to set some zero-ish value for silence
          min="0.01"
          max="1"
          step=".025"
          onChange={onVolumeChange}
          defaultValue={volume}
        />
        <label htmlFor="volume">Volume</label> */}
        <SpectrogramWrapper>
        <div ref={spectrogramRef}/>
        </SpectrogramWrapper>
      </div>
    </div>
  );
}


const SpectrogramWrapper = styled.div``;

const IconWrapper = styled.div`
    background-color: ${oscilloscopeSettings.backgroundColour} ;
    margin: 0;
    padding: 0;
`;

const Button = styled.button`
    border: 0;

    :focus {
        outline: none;
    }
`;

// To go to the next track on finish
//   wavesurfer.on('finish', function() {
//     setCurrentSong((currentTrack + 1) % links.length);
// });
