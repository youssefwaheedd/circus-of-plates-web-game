/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// src/components/Plate.js
import React from 'react';

const Bomb = ({ posX, posY, width, color }) => {
    
    const BombStyle = {
      position: 'absolute',
      left: `${posX}px`,
      top: `${posY}px`,
      width: "60px",
      height: `60px`,
    };
    return <img src="/bomb.gif" style={BombStyle}/>;
  };
  

export default Bomb;
