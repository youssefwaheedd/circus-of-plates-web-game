/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// src/components/Clown.js
import React, { useState, useEffect } from 'react';

let instance = null;

const Clown = ({ initialPosX, initialPosY, leftStickHeight, rightStickHeight }) => {
  const [posX, setPosX] = useState(initialPosX);
  const [posY, setPosY] = useState(initialPosY);
  const leftStickOffsetX = (window.innerWidth < 640 ? -50 : -80); // Adjust according to actual offset
  const rightStickOffsetX = (window.innerWidth < 640 ? 110 : 130); // Adjust according to actual offset
  const stickWidth = 30; // Adjust according to actual width

  useEffect(() => {
    instance = {
      posX,
      posY,
      setPosX,
      setPosY,
      leftStickPosX: posX + leftStickOffsetX,
      rightStickPosX: posX + rightStickOffsetX,
      leftStickHeight,
      rightStickHeight,
      stickWidth,
    };
  }, [posX, posY, leftStickHeight, rightStickHeight]);

  return (
    <div
      className="sm:w-[133px] sm:h-[172px] w-[100px]"
      style={{ zIndex: 100, position: 'absolute', left: `${posX}px`, top: `${posY}px`, margin: 0, padding: 0 }}
    >
      <img
        id="clown-image"
        src="/clownn.png"
        alt="Clown"
        style={{ display: 'block', margin: 0, padding: 0 }}
      />
      <img
        id="left-stick"
        src="/leftStick.png"
        alt="Left Stick"
        className="absolute h-[70px] sm:h-[93px] top-[0%] left-[-45%]"
        style={{ margin: 0, padding: 0 }}
      />
      <img
        id="right-stick"
        src="/rightStick.png"
        alt="Right Stick"
        className="absolute h-[70px] sm:h-[93px] top-[-30%] left-[90%]"
        style={{ margin: 0, padding: 0 }}
      />
    </div>
  );
};

export const getClownInstance = () => instance;

export default Clown;
