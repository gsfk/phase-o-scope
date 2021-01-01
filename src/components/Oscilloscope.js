import React, { useEffect, useRef } from "react";

import {oscilloscopeSettings} from '../constants'

// range of ByteData
const dynamicRange = 256;

const Oscilloscope = ({ analyserL, analyserR, width }) => {
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
    const unitLength = (width / dynamicRange) 
    // console.log({unitLength: unitLength})
    let maxL = 0, maxR = 0;
    for (let i=0; i<bufferLength; i++){
      const xVal = bufferR[i] * unitLength;

      // yValues inverted since canvas grid y-axis increases **downwards**
      const yVal = (dynamicRange - bufferL[i] - 1) * unitLength;
      canvasContextRef.current.lineTo(xVal, yVal);

      if (bufferL[i] > maxL){
        maxL = bufferL[i]
      }

      if (bufferR[i] > maxR){
        maxR = bufferR[i]
      } 
    }
    // console.log({maxL: maxL, maxR: maxR})
    canvasContextRef.current.stroke();
};

//   canvas init
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = width*2;
    canvas.height = width*2;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${width}px`;

    const context = canvas.getContext("2d");
    context.scale(2, 2);
    context.lineCap = "round";
    context.lineWidth = 0.5;
    context.strokeStyle = "#00ab00";
    canvasContextRef.current = context;
    draw()
  }, [analyserL]);

  return <canvas width={width} height={width} ref={canvasRef} />;

};
 

export default Oscilloscope;








