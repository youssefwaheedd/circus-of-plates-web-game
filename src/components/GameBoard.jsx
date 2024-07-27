/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect ,useRef} from 'react';
import ShapeFactory, { createRandomShape } from '../factory/ShapeFactory';
import Clown, { getClownInstance } from '../components/Clown';

const GameBoard = (props) => {
  const { gameStrategy } = props;
  const [gameObjects, setGameObjects] = useState([]);
  const [clownHeight, setClownHeight] = useState(window.innerWidth < 640 ? 129.31 : 172);
  const [clownWidth, setClownWidth] = useState(window.innerWidth < 640 ? 100 : 133);
  const [maxPosX, setMaxPosX] = useState(window.innerWidth - clownWidth);
  const [rightCatchedItems, setRightCatchedItems] = useState([]);
  const [leftCatchedItems, setLeftCatchedItems] = useState([]);
  const [leftStackHeight, setLeftStackHeight] = useState(0);
  const [rightStackHeight, setRightStackHeight] = useState(window.innerWidth < 640 ? 38 :50);
  const [clownPosX, setClownPosX] = useState(0); // Track the clown's position
  const [score, setScore] = useState(0);
  const lastTouchTime = useRef(0); // To throttle touch events


  function checkIntersection(fallingObject, stick) {
    return (
      fallingObject.posY + fallingObject.height >= stick.posY &&  
      fallingObject.posY + fallingObject.height <= stick.posY + stick.height && 
      fallingObject.posX + fallingObject.width >= stick.posX &&  
      fallingObject.posX <= stick.posX + stick.width             
    );
  }

  const checkAndRemoveMatchingColors = (items, setItems, setStackHeight) => {
    if (items.length < 3) return;
    const lastThree = items.slice(-3);
    const [color1, color2, color3] = lastThree.map(item => item.color);
    if (color1 === color2 && color2 === color3) {
      const newItems = items.slice(0, -3);
      setItems(newItems);
      setStackHeight(prevHeight => prevHeight - lastThree.reduce((sum, item) => sum + item.height, 0));
      setScore(score => score + 1);
    }
  };

  useEffect(() => {
    const gameInterval = setInterval(() => {
      setGameObjects(prevObjects => prevObjects
        .map(obj => ({ ...obj, posY: obj.posY + (gameStrategy === 'easy' ? 2 : gameStrategy === 'medium' ? 3 : 5) }))
        .filter(obj => obj.posY < window.innerHeight)
      );
    }, 1000 / 60);

    const addObjectInterval = setInterval(() => {
      setGameObjects(prevObjects => [...prevObjects, createRandomShape({ gameStrategy })]);
    }, gameStrategy === 'easy' ? 2100 : 700);

    return () => {
      clearInterval(gameInterval);
      clearInterval(addObjectInterval);
    };
  }, [gameStrategy]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const clownInstance = getClownInstance();
      if (!clownInstance) return;

      switch (event.key) {
        case 'ArrowLeft':
          setClownPosX(prev => {
            const newPosX = Math.max(prev - 15, 0);
            clownInstance.setPosX(newPosX);
            return newPosX;
          });
          break;
        case 'ArrowRight':
          setClownPosX(prev => {
            const newPosX = Math.min(prev + 15, maxPosX);
            clownInstance.setPosX(newPosX);
            return newPosX;
          });
          break;
        default:
          break;
      }
    };

    const handleTouch = (event) => {
      const now = Date.now();
      if (now - lastTouchTime.current < 100) return;
      lastTouchTime.current = now;

      const touchX = event.touches[0].clientX;
      const screenWidth = window.innerWidth;
      const clownInstance = getClownInstance();
      if (!clownInstance) return;

      setClownPosX(prev => {
        let newPosX;
        if (touchX < screenWidth / 2) {
          newPosX = Math.max(prev - 15, 0);
        } else {
          newPosX = Math.min(prev + 15, maxPosX);
        }
        clownInstance.setPosX(newPosX);
        return newPosX;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouch);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouch);
    };
  }, [maxPosX]);

  useEffect(() => {
    const updateClownPosition = () => {
      const clownInstance = getClownInstance();
      if (!clownInstance) return;

      if (window.innerWidth < 640) {
        setClownHeight(129.31);
        setClownWidth(100);
        setMaxPosX(window.innerWidth - clownWidth);
      } else {
        setClownHeight(172);
        setClownWidth(133);
        setMaxPosX(window.innerWidth - clownWidth);
      }

      clownInstance.setPosY(window.innerHeight - clownHeight);

      clownInstance.setPosX(prevPosX => {
        if (prevPosX > maxPosX) {
          return maxPosX;
        }
        return prevPosX;
      });
    };

    updateClownPosition();
    window.addEventListener('resize', updateClownPosition);
    return () => {
      window.removeEventListener('resize', updateClownPosition);
    };
  }, [clownHeight, clownWidth]);

  useEffect(() => {
    const clownInstance = getClownInstance();
    if (!clownInstance) return;

    const leftStick = {
      posX: clownInstance.leftStickPosX,
      posY: window.innerHeight - clownHeight - leftStackHeight,
      width: clownInstance.stickWidth,
      height: 10
    };

    const rightStick = {
      posX: clownInstance.rightStickPosX,
      posY: window.innerHeight - clownHeight - rightStackHeight,
      width: clownInstance.stickWidth,
      height: 10
    };

    let newLeftCatchedItems = [];
    let newRightCatchedItems = [];
    const updatedGameObjects = gameObjects.filter(obj => {
      if (checkIntersection(obj, leftStick)) {
        obj.posX = leftStick.posX;
        obj.posY = leftStick.posY - obj.height;
        newLeftCatchedItems.push(obj);
        return false;
      }
      if (checkIntersection(obj, rightStick)) {
        obj.posX = rightStick.posX;
        obj.posY = rightStick.posY - obj.height;
        newRightCatchedItems.push(obj);
        return false;
      }
      return true;
    });

    if (newLeftCatchedItems.length > 0 || newRightCatchedItems.length > 0) {
      setGameObjects(updatedGameObjects);
      setLeftCatchedItems(prev => [...prev, ...newLeftCatchedItems]);
      setRightCatchedItems(prev => [...prev, ...newRightCatchedItems]);
      setLeftStackHeight(prev => prev + newLeftCatchedItems.reduce((sum, item) => sum + item.height, 0));
      setRightStackHeight(prev => prev + newRightCatchedItems.reduce((sum, item) => sum + item.height, 0));
    }
  }, [gameObjects]);

  useEffect(() => {
    const clownInstance = getClownInstance();
    if (!clownInstance) return;

    setLeftCatchedItems(prev =>
      prev.map(item => ({ ...item, posX: clownInstance.leftStickPosX }))
    );
    setRightCatchedItems(prev =>
      prev.map(item => ({ ...item, posX: clownInstance.rightStickPosX }))
    );
  }, [clownPosX]);

  useEffect(() => {
    checkAndRemoveMatchingColors(leftCatchedItems, setLeftCatchedItems, setLeftStackHeight);
    checkAndRemoveMatchingColors(rightCatchedItems, setRightCatchedItems, setRightStackHeight);
  }, [leftCatchedItems, rightCatchedItems]);


  return (
    
    <div className="game-board h-screen w-full overflow-hidden relative">
      <h1 className='border rounded-lg p-2 px-5 bg-slate-950 text-white absolute top-0 mt-2 text-2xl'>score : {score}</h1>
      <Clown initialPosX={0} initialPosY={window.innerHeight} leftStickHeight={leftStackHeight} rightStickHeight={rightStackHeight} />
      {gameObjects.map((obj, index) => (
        <ShapeFactory key={index} {...obj} />
      ))}
      {leftCatchedItems.map((obj, index) => (
        <ShapeFactory key={index + gameObjects.length} {...obj} />
      ))}
      {rightCatchedItems.map((obj, index) => (
        <ShapeFactory key={index + gameObjects.length + leftCatchedItems.length} {...obj} />
      ))}
    </div>
  );
};

export default GameBoard;
