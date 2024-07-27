import { useState } from 'react';
import './App.css';
import GameBoard from './components/GameBoard';

function App() {
  const [startGame, setStartGame] = useState(false);
  const [difficulty, setDiffculty] = useState("");
  const[title, setTitle] = useState("Select game mode !")
  return (
    <div className='relative h-screen w-full flex flex-col items-center justify-center'>
      <div className="background-container"></div>
      {!startGame && 
      <div className='absolute z-10 flex flex-col items-center text-xl gap-8 p-8  rounded-2xl border-white border-[0.2rem] bg-slate-500'>
        <h1 className='text-white text-3xl'>{title}</h1>
        <ul className='flex flex-col justify-center items-center gap-2'>
          <li onClick={()=> {setTitle("Easy mode selected"), setDiffculty("easy")}}>Easy</li>
          <li onClick={()=>{setTitle("Medium mode selected"), setDiffculty("medium")}}>Medium</li>
          <li onClick={()=>{setTitle("Hard mode selected"), setDiffculty("hard")}}>Hard</li>
        </ul>
        <button onClick={()=> setStartGame(true)} className='border border-slate-950 p-2 px-5 rounded-xl bg-blue-400 text-white'>Start Game!</button>
      </div>}
      {startGame && <GameBoard gameStrategy={difficulty}/>}
    </div>
  );
}

export default App;
