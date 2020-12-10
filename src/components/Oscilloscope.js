import React, { useContext, useEffect, useRef } from "react";

import {oscilloscopeSettings} from '../constants'

// range of ByteData
const dynamicRange = 256;

const Oscilloscope = ({ analyserL, analyserR }) => {
  const canvasRef = useRef(null);
  const canvasContextRef = useRef(null);

  const bufferLength = analyserL.fftSize;
  const bufferL = new Uint8Array(bufferLength);
  const bufferR = new Uint8Array(bufferLength);

  const draw = () => {
    const drawVisual = requestAnimationFrame(draw);
    analyserL.getByteTimeDomainData(bufferL);
    analyserR.getByteTimeDomainData(bufferR);

    canvasContextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    canvasContextRef.current.fillStyle = oscilloscopeSettings.scanColour;
    canvasContextRef.current.beginPath();
    const unitWidth = (oscilloscopeSettings.width / dynamicRange) 
    const unitHeight = unitWidth;
    for (let i=0; i<bufferLength; i++){
    
      const xVal = bufferR[i] * unitWidth;

      // yValues inverted since canvas grid y-axis increases **downwards**
      const yVal = (dynamicRange - bufferL[i] - 1) * unitHeight;
      canvasContextRef.current.lineTo(xVal, yVal);
    }
    canvasContextRef.current.stroke();
};

//   canvas init
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = oscilloscopeSettings.width*2;
    canvas.height = oscilloscopeSettings.width*2;
    canvas.style.width = `${oscilloscopeSettings.width}px`;
    canvas.style.height = `${oscilloscopeSettings.width}px`;

    const context = canvas.getContext("2d");
    context.scale(2, 2);
    context.lineCap = "round";
    context.lineWidth = 0.5;
    context.strokeStyle = "#00ab00";
    canvasContextRef.current = context;
    draw()
  }, []);

  return <canvas width={oscilloscopeSettings.width} height={oscilloscopeSettings.width} ref={canvasRef} />;

};
 

export default Oscilloscope;








