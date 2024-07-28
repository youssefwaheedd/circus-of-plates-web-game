/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import GameController from './GameController';

export const StartMenu = () => {
  const [startGame, setStartGame] = useState(false);
  const [difficulty, setDifficulty] = useState("");
  const [title, setTitle] = useState("Select game mode!");

  const handleStartGame = () => {
    setStartGame(true);
  };

  const handleBackToMenu = () => {
    setStartGame(false);
    setDifficulty("");
    setTitle("Select game mode!");
  };

  return (
    <div className='relative h-screen w-full flex flex-col items-center justify-center'>
      <div className="background-container"></div>
      {!startGame && 
        <div className='absolute z-10 flex flex-col items-center text-xl gap-8 p-8 rounded-2xl border-white border-[0.2rem] bg-slate-500'>
          <h1 className='text-white text-3xl'>{title}</h1>
          <ul className='flex flex-col justify-center items-center gap-2'>
            <button onClick={() => { setTitle("Easy mode"); setDifficulty("easy"); }}>Easy</button>
            <button onClick={() => { setTitle("Medium mode"); setDifficulty("medium"); }}>Medium</button>
            <button onClick={() => { setTitle("Hard mode"); setDifficulty("hard"); }}>Hard</button>
          </ul>
          <button onClick={handleStartGame} className='border border-slate-950 p-2 px-5 rounded-xl bg-blue-400 text-white'>Start Game!</button>
        </div>
      }
      {startGame && 
        <GameController 
          gameStrategy={difficulty}
          onRestart={handleStartGame}
          onBackToMenu={handleBackToMenu}
        />
      }
    </div>
  );
}
