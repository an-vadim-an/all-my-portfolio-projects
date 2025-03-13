import React, { useState, useEffect } from 'react';
import './index.css';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const SPEEDS = { easy: 200, medium: 150, hard: 100 };

function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(generateFood(INITIAL_SNAKE));
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [nextDirection, setNextDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [speed, setSpeed] = useState(SPEEDS.medium);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [directionChanged, setDirectionChanged] = useState(false);

  const [bestScore, setBestScore] = useState(() => {
    return localStorage.getItem('bestScore') ? Number(localStorage.getItem('bestScore')) : 0;
  });

  function generateFood(snakeBody) {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snakeBody.some((segment) => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }

  useEffect(() => {
    if (!gameStarted || isGameOver) return;

    const handleKeyPress = (e) => {
      if (directionChanged) return;

      const newDirection = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
        w: { x: 0, y: -1 },
        s: { x: 0, y: 1 },
        a: { x: -1, y: 0 },
        d: { x: 1, y: 0 },
      }[e.key];

      if (newDirection) {
        if (newDirection.x !== -direction.x || newDirection.y !== -direction.y) {
          setNextDirection(newDirection);
          setDirectionChanged(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, isGameOver, gameStarted, directionChanged]);

  useEffect(() => {
    if (!gameStarted || isGameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const newHead = {
          x: prevSnake[0].x + nextDirection.x,
          y: prevSnake[0].y + nextDirection.y,
        };

        setDirection(nextDirection);
        setDirectionChanged(false);

        if (
          newHead.x < 0 || newHead.y < 0 ||
          newHead.x >= GRID_SIZE || newHead.y >= GRID_SIZE ||
          prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
        ) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setFood(generateFood(newSnake));
          setScore((prevScore) => prevScore + 10);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [nextDirection, food, speed, isGameOver, gameStarted]);

  useEffect(() => {
    if (!gameStarted || isGameOver) return;

    const timer = setInterval(() => {
      setTimeElapsed((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, isGameOver]);

  useEffect(() => {
    if (isGameOver) {
      if (score > bestScore) {
        setBestScore(score);
        localStorage.setItem('bestScore', score);
      }
    }
  }, [isGameOver, score, bestScore]);

  const startGame = (difficulty) => {
    setSpeed(SPEEDS[difficulty]);
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setNextDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setGameStarted(true);
    setScore(0);
    setTimeElapsed(0);
  };

  return (
    <div className={`game-container ${!gameStarted ? 'menu-active' : ''}`}>
      {!gameStarted ? (
        <div className="menu">
          <h1>Snake Game</h1>
          <p>Select the level of difficulty:</p>
          <button onClick={() => startGame('easy')}>Easy</button>
          <button onClick={() => startGame('medium')}>Medium</button>
          <button onClick={() => startGame('hard')}>Hard</button>
        </div>
      ) : (
        <>
          {isGameOver && (
            <div className="game-over">
              <h2>Game Over!</h2>
              <p>Your Score: <strong>{score}</strong></p>
              <p>Best Score: <strong>{bestScore}</strong></p>
              <button onClick={() => startGame('medium')}>Restart</button>
              <button onClick={() => setGameStarted(false)}>Main Menu</button>
            </div>
          )}

          <div className="score-timer">
            <div className="score">Score: {score}</div>
            <div className="timer">Time: {timeElapsed}s</div>
          </div>

          <div className="grid">
            {Array.from({ length: GRID_SIZE }).map((_, row) => (
              <div key={row} className="row">
                {Array.from({ length: GRID_SIZE }).map((_, col) => {
                  const isSnake = snake.some((segment) => segment.x === col && segment.y === row);
                  const isFood = food.x === col && food.y === row;
                  return <div key={col} className={`cell ${isSnake ? 'snake' : ''} ${isFood ? 'food' : ''}`}></div>;
                })}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default SnakeGame;
