/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// src/components/Plate.js
import React from 'react';

const Plate = ({ posX, posY, width, color }) => {
    
    const plateStyle = {
      position: 'absolute',
      left: `${posX}px`,
      top: `${posY}px`,
      width: `${width}px`,
      height: `${width}px`, // Ensure height is non-zero
      backgroundColor: color,
      borderRadius: `${width/2}px`,
      border: '1px solid #333',
    };
  
    return <div style={plateStyle}></div>;
  };
  

export default Plate;
