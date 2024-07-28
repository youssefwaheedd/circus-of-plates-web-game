/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from 'react';
import ShapeFactory, { createRandomShape } from '../factory/ShapeFactory';
import Clown, { getClownInstance } from './Clown';

const GameBoard = (props) => {
  const { gameStrategy, onBackToMenu } = props;
  const [gameObjects, setGameObjects] = useState([]);
  const [clownHeight, setClownHeight] = useState(window.innerWidth < 640 ? 129.31 : 172);
  const [clownWidth, setClownWidth] = useState(window.innerWidth < 640 ? 100 : 133);
  const [maxPosX, setMaxPosX] = useState(window.innerWidth - clownWidth);
  const [rightCatchedItems, setRightCatchedItems] = useState([]);
  const [leftCatchedItems, setLeftCatchedItems] = useState([]);
  const [leftStackHeight, setLeftStackHeight] = useState(0);
  const [rightStackHeight, setRightStackHeight] = useState(window.innerWidth < 640 ? 38 : 50);
  const [clownPosX, setClownPosX] = useState(0);
  const [score, setScore] = useState(0);
  const lastTouchTime = useRef(0);
  const [gameOver, setGameOver] = useState(false);

  function checkStackHeight(stackHeight) {
    if (stackHeight >= window.innerHeight){
      endGame();
    }
  }

  const resetGame = () => {
    setGameObjects([]);
    setRightCatchedItems([]);
    setLeftCatchedItems([]);
    setLeftStackHeight(0);
    setRightStackHeight(window.innerWidth < 640 ? 38 : 50);
    setClownPosX(clownPosX);
    setScore(0);
    setGameOver(false);
  };

  function endGame() {
    setGameOver(true);
  }

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
    if (gameOver) return;
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
  }, [gameStrategy, gameOver]);

  useEffect(() => {
    if (gameOver) return;
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
  }, [maxPosX, gameOver]);

  useEffect(() => {
    if (gameOver) return;
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
    if (gameOver) return;
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
      if (checkIntersection(obj, leftStick) && obj.type === 'Bomb' && gameStrategy === 'medium') {
        setLeftCatchedItems([]);
        setLeftStackHeight(0);
      } else if (checkIntersection(obj, leftStick) && obj.type === 'Bomb' && gameStrategy === 'hard') {
        endGame();
      } else if (checkIntersection(obj, leftStick) && obj.type === 'Rectangle') {
        obj.posX = leftStick.posX;
        obj.posY = leftStick.posY - obj.height;
        newLeftCatchedItems.push(obj);
        return false;
      }

      if (checkIntersection(obj, rightStick) && obj.type === 'Bomb' && gameStrategy === 'medium') {
        setRightCatchedItems([]);
        setRightStackHeight(window.innerWidth < 640 ? 38 : 50);
      } else if (checkIntersection(obj, rightStick) && obj.type === 'Bomb' && gameStrategy === 'hard') {
        endGame();
      } else if (checkIntersection(obj, rightStick)) {
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
      checkStackHeight(rightStackHeight);
      checkStackHeight(rightStackHeight);
    }
  }, [gameObjects, rightStackHeight, leftStackHeight]);

  useEffect(() => {
    if (gameOver) return;
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
    if (gameOver) return;
    checkAndRemoveMatchingColors(leftCatchedItems, setLeftCatchedItems, setLeftStackHeight);
    checkAndRemoveMatchingColors(rightCatchedItems, setRightCatchedItems, setRightStackHeight);
  }, [leftCatchedItems, rightCatchedItems]);

  return (
    <div className="game-board h-screen w-full overflow-hidden relative">
      {!gameOver && 
      <div className='flex flex-col w-[100%] p-3'>
      <div className=' flex flex-col absolute left-0 top-0 gap-4 p-3'>
        <button
            className='border border-slate-950 p-2 px-5 rounded-xl bg-blue-400 text-white'
            onClick={resetGame} // Reset the game state
        >
            Restart
        </button>
        <button
          className='border border-slate-950 p-2 px-5 rounded-xl bg-blue-400 text-white'
          onClick={onBackToMenu}
        >
          Change game mode
        </button>
      </div>
      <h1 className='border-slate-950 border-2 rounded-lg p-2 px-5 bg-white text-blue-400 absolute top-0 mt-2 text-2xl self-end'>
        score : {score}
      </h1>
      </div>
        }
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
      {gameOver &&
        <div className='self-center flex flex-col items-center gap-3'>
          <h1 className='text-3xl'>You lost :( </h1>
          <h2 className='text-xl'>Score : {score}</h2>
          <button
            className='border border-slate-950 p-2 px-5 rounded-xl bg-blue-400 text-white'
            onClick={resetGame} // Reset the game state
          >
            Restart with same game mode
          </button>
          <button
            className='border border-slate-950 p-2 px-5 rounded-xl bg-blue-400 text-white'
            onClick={onBackToMenu}
          >
            Change game mode
          </button>
        </div>
      }
    </div>
  );
};

export default GameBoard;
