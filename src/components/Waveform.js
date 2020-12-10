import React, { useEffect, useRef, useState, useContext } from "react";
import WaveSurfer from "wavesurfer.js";

import { oscilloscopeSettings, waveformSettings } from "../constants";
import { AppContext } from "./AppContext";

const formWaveSurferOptions = (ref) => ({
  container: ref,
  waveColor: waveformSettings.waveColour,
  progressColor: waveformSettings.progressColour,
  cursorColor: waveformSettings.cursorColour,
  barWidth: 5,
  barRadius: 5,
  responsive: true,
  height: waveformSettings.height,
  // If true, normalize by the maximum peak instead of 1.0.
  normalize: false ,
  // Use the PeakCache to improve rendering speed of large waveforms.
  partialRender: true,
});

// url={URL.createObjectURL(selectedTrack)}

export default function Waveform({ setAnalyserL, setAnalyserR, files }) {
  const { selectedTrack, setSelectedTrack } = useContext(AppContext);
  //TODO: Waveform has no idea where selected file is in playlist
  //will this handle a change in file at all?
  // see wavesurfer.on() documentation

    // need to create new wavesurfer on change of file, or no?
    // certainly don't need to create new audio context every time. 
    // wavesurfer.on("finish", () => .....) can move to next track

    // can't we just create an audio chain conditionally when there 
    // are files to play?... rather than useEffect
    // there will be no files at all on first render
    // OR, on first render we could have a greyed out placeholder 
    // that's the same size as the waveform
    // another option is always having an example file loaded, 
    // and that's the waveform you see. 

  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [playing, setPlay] = useState(false);
  const [volume, setVolume] = useState(0.8);

  // create new WaveSurfer instance
  // On component mount
  useEffect(() => {
    if (!selectedTrack){
        return
    }

    setPlay(false);

    const options = formWaveSurferOptions(waveformRef.current);
    wavesurfer.current = WaveSurfer.create(options);
    wavesurfer.current.load(URL.createObjectURL(selectedTrack));

    const analyserLeft = wavesurfer.current.backend.ac.createAnalyser();
    analyserLeft.minDecibels = oscilloscopeSettings.minDecibels;
    analyserLeft.maxDecibels = oscilloscopeSettings.maxDecibels;
    analyserLeft.smoothingTimeConstant =
      oscilloscopeSettings.smoothingTimeConstant;
    analyserLeft.fftSize = oscilloscopeSettings.fftSize;

    const analyserRight = wavesurfer.current.backend.ac.createAnalyser();
    analyserRight.minDecibels = oscilloscopeSettings.minDecibels;
    analyserRight.maxDecibels = oscilloscopeSettings.maxDecibels;
    analyserRight.smoothingTimeConstant =
      oscilloscopeSettings.smoothingTimeConstant;
    analyserRight.fftSize = oscilloscopeSettings.fftSize;

    const splitter = wavesurfer.current.backend.ac.createChannelSplitter(2);
    const merger = wavesurfer.current.backend.ac.createChannelMerger(2);
    const gainNode = wavesurfer.current.backend.ac.createGain();

    // audio routing graph:
    //                  ----> analyserL ----|
    //                  |                   v
    // source -> splitter --> analyserR --> merger -> destination

    // sourceObj.connect(splitter);
    splitter.connect(analyserLeft, 0, 0);
    splitter.connect(analyserRight, 1, 0);
    analyserLeft.connect(merger, 0, 0);
    analyserRight.connect(merger, 0, 1);

    // merger.connect(contextObj.destination)
    wavesurfer.current.backend.setFilters([
      splitter,
      analyserLeft,
      analyserRight,
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
    });

    // Removes events, elements and disconnects Web Audio nodes.
    // when component unmount
    return () => wavesurfer.current.destroy();
  }, [selectedTrack]);





  const handlePlayPause = () => {
    setPlay(!playing);
    wavesurfer.current.playPause();
  };

  const onVolumeChange = (e) => {
    const { target } = e;
    const newVolume = +target.value;

    if (newVolume) {
      setVolume(newVolume);
      wavesurfer.current.setVolume(newVolume || 1);
    }
  };

  return (
    <div>
      <div id="waveform" ref={waveformRef} />
      <div className="controls">
        <button onClick={handlePlayPause}>{!playing ? "Play" : "Pause"}</button>
        <input
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
        <label htmlFor="volume">Volume</label>
      </div>
    </div>
  );
}

// https://github.com/katspaugh/wavesurfer.js/blob/master/example/playlist/app.js
// To go to the next track on finish
//   wavesurfer.on('finish', function() {
//     setCurrentSong((currentTrack + 1) % links.length);
// });
