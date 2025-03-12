import React, { useState, useEffect } from 'react';
import './App.css';

const checkWinner = (board) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (let [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
};

const getBestMove = (board) => {
  const winningLines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  
  for (let line of winningLines) {
    const [a, b, c] = line;
    const values = [board[a], board[b], board[c]];
    if (values.filter(v => v === 'O').length === 2 && values.includes(null)) {
      return line[values.indexOf(null)];
    }
  }
  
  for (let line of winningLines) {
    const [a, b, c] = line;
    const values = [board[a], board[b], board[c]];
    if (values.filter(v => v === 'X').length === 2 && values.includes(null)) {
      return line[values.indexOf(null)];
    }
  }
  
  const priorityMoves = [4, 0, 2, 6, 8, 1, 3, 5, 7];
  return priorityMoves.find(index => board[index] === null);
};

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [gameMode, setGameMode] = useState('player-vs-player');
  const [isBotTurn, setIsBotTurn] = useState(false);

  useEffect(() => {
    if (gameMode === 'player-vs-bot' && isBotTurn && !winner) {
      const botMove = () => {
        const bestMove = getBestMove(board);
        if (bestMove === null) return;

        setBoard(prevBoard => {
          const newBoard = [...prevBoard];
          newBoard[bestMove] = 'O';
          return newBoard;
        });

        setIsXNext(true);
        setIsBotTurn(false);
      };
      setTimeout(botMove, 500);
    }
  }, [isBotTurn, board, gameMode, winner]);

  const handleGameModeChange = (mode) => {
    setGameMode(mode);
    resetGame();
  };

  const handleClick = (index) => {
    if (board[index] || winner || (gameMode === 'player-vs-bot' && isBotTurn)) return;

    setBoard(prevBoard => {
      const newBoard = [...prevBoard];
      newBoard[index] = isXNext ? 'X' : 'O';
      return newBoard;
    });
    setIsXNext(!isXNext);

    if (!checkWinner([...board])) {
      if (gameMode === 'player-vs-bot') {
        setIsBotTurn(true);
      }
    }
  };

  useEffect(() => {
    const gameWinner = checkWinner(board);
    if (gameWinner) {
      setWinner(gameWinner);
    }
  }, [board]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsXNext(true);
    setIsBotTurn(false);
  };

  return (
    <div className="game-container">
      <div className="side-panel">
        <div className="game-mode">
          <button className={`mode-button ${gameMode === 'player-vs-player' ? 'active' : ''}`} onClick={() => handleGameModeChange('player-vs-player')}>
            Player vs Player
          </button>
          <button className={`mode-button ${gameMode === 'player-vs-bot' ? 'active' : ''}`} onClick={() => handleGameModeChange('player-vs-bot')}>
            Player vs Bot
          </button>
        </div>
      </div>

      <div className="game">
        <div className="board">
          {board.map((cell, index) => (
            <button key={index} className={`cell ${cell === 'X' ? 'cell-x' : cell === 'O' ? 'cell-o' : ''}`} onClick={() => handleClick(index)} disabled={cell !== null || winner}>
              {cell}
            </button>
          ))}
        </div>
        <div className="status-reset">
          <h2>{winner ? `${winner} wins!` : !board.includes(null) ? "It's a draw!" : `Next player: ${isXNext ? 'X' : 'O'}`}</h2>
          <button className="reset" onClick={resetGame}>Reset Game</button>
        </div>
      </div>
    </div>
  );
}

export default App;