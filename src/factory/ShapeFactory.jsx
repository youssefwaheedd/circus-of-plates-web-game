/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// src/factory/ShapeFactory.js
import React from "react";
import Rectangle from "../components/Rectangle";
import Plate from "../components/Plate";

const shapes = ["Rectangle"];

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min)) + min;

export function createRandomShape (props){
  const { gameStrategy } = props;
  const type = shapes[getRandomInt(0, shapes.length)];
  const posX = getRandomInt(0, window.innerWidth - 100);
  const posY = 0;
  var colors = [];
  var width;
  if (window.innerWidth < 640 || type === 'Circle') {
    width = getRandomInt(25, 40);
  }
  else{
     width = getRandomInt(50, 100);
  } 
  if (gameStrategy === 'easy'){
     colors =[ `rgb( 255,0, 0)`,`rgb( 0,0, 255)`];
  }
  else if(gameStrategy === 'medium'){
     colors =[ `rgb( 255,0, 0)`,`rgb( 0,255, 0)`,`rgb( 0,0, 255)`];
  }
  else if(gameStrategy === 'hard'){
     colors =[ `rgb( 255,0, 0)`,`rgb( 0,255, 0)`,`rgb( 0,0, 255)`, `rgb(128, 0, 128)`];
  }
  
  const randomColor = colors[Math.floor(Math.random() * colors.length)]
  

  return { type, posX, posY, width, height: 10, color: randomColor };
}

const ShapeFactory = ({ type, posX, posY, width, height, color }) => {

  switch (type) {
    case "Rectangle":
      return (
        <Rectangle
          posX={posX}
          posY={posY}
          width={width}
          height={height}
          color={color}
        />
      );
    case "Circle":
      return (
      <Plate 
      posX={posX} 
      posY={posY} 
      width={width} 
      color={color} 
      />
    );
    default:
      return null;
  }
};

export default ShapeFactory;
