/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// src/components/Rectangle.jsx
import React from 'react';


const Rectangle = ({ posX, posY, width, height, color }) => {
  const style = {
    position: 'absolute',
    left: `${posX}px`,
    top: `${posY}px`,
    width: `${width}px`,
    height: `${height}px`,
    backgroundColor: color,
  };

  return <div style={style}></div>;
};

export default Rectangle;
