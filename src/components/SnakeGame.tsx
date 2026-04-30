import { useEffect, useState, useCallback } from "react";
import { Gamepad2, Play, RotateCcw } from "lucide-react";

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 150;

type Point = { x: number; y: number };

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Use a ref to store the latest direction to prevent multiple rapid key presses
  // from causing the snake to reverse into itself before the next tick.
  const nextDirectionRef = useState<Point>(INITIAL_DIRECTION);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    let isOccupied = true;
    while (isOccupied) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      isOccupied = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
    }
    return newFood!;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    nextDirectionRef[1](INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setHasStarted(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
  };

  const startGame = () => {
    setHasStarted(true);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling handles
      if (["ArrowUp", "ArrowDown", "Space"].includes(e.code) && hasStarted) {
        e.preventDefault();
      }

      const { x: dx, y: dy } = nextDirectionRef[0];

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          if (dy !== 1) nextDirectionRef[1]({ x: 0, y: -1 });
          break;
        case "ArrowDown":
        case "s":
        case "S":
          if (dy !== -1) nextDirectionRef[1]({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          if (dx !== 1) nextDirectionRef[1]({ x: -1, y: 0 });
          break;
        case "ArrowRight":
        case "d":
        case "D":
          if (dx !== -1) nextDirectionRef[1]({ x: 1, y: 0 });
          break;
        case " ":
          if (gameOver) {
            resetGame();
            startGame();
          } else if (!hasStarted) {
            startGame();
          } else {
            setIsPaused((p) => !p);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameOver, hasStarted]);

  useEffect(() => {
    if (!hasStarted || isPaused || gameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const currentDirection = nextDirectionRef[0];
        setDirection(currentDirection);

        const newHead = {
          x: prevSnake[0].x + currentDirection.x,
          y: prevSnake[0].y + currentDirection.y,
        };

        // Wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Self collision
        if (
          prevSnake.some(
            (segment) => segment.x === newHead.x && segment.y === newHead.y
          )
        ) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => {
            const newScore = s + 10;
            if (newScore > highScore) setHighScore(newScore);
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const speed = Math.max(50, INITIAL_SPEED - Math.floor(score / 50) * 10);
    const intervalId = setInterval(moveSnake, speed);
    return () => clearInterval(intervalId);
  }, [food, gameOver, hasStarted, isPaused, score, generateFood]);

  return (
    <div className="flex flex-col items-center select-none" id="snake-game">
      {/* Score Header */}
      <div className="flex items-center justify-between w-full max-w-md mb-6 px-4 py-3 bg-slate-900/80 backdrop-blur border border-cyan-500/30 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.15)]">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-cyan-400" />
          <span className="text-slate-300 font-mono tracking-widest uppercase text-sm">
            Current
          </span>
          <span className="text-cyan-400 font-mono font-bold text-xl ml-2">
            {score.toString().padStart(4, "0")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-mono tracking-widest uppercase text-xs">
            High
          </span>
          <span className="text-fuchsia-400 font-mono font-bold text-lg ml-1">
            {highScore.toString().padStart(4, "0")}
          </span>
        </div>
      </div>

      {/* Game Board Container */}
      <div className="relative group">
        {/* Glow behind board */}
        <div className="absolute -inset-1 bg-gradient-to-br from-cyan-500 to-fuchsia-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
        
        {/* Actual Board */}
        <div 
          className="relative bg-slate-950 border-2 border-slate-800 rounded-xl overflow-hidden shadow-2xl"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            width: "min(90vw, 400px)",
            height: "min(90vw, 400px)",
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
            const x = index % GRID_SIZE;
            const y = Math.floor(index / GRID_SIZE);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isBody =
              !isHead &&
              snake.some((segment) => segment.x === x && segment.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={index}
                className={`
                  ${isHead ? "bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.8)] z-10 rounded-sm" : ""}
                  ${isBody ? "bg-cyan-500/80 border border-cyan-400/20 rounded-sm" : ""}
                  ${isFood ? "bg-fuchsia-500 shadow-[0_0_12px_rgba(217,70,239,0.9)] rounded-full transform scale-75 animate-pulse" : ""}
                `}
              />
            );
          })}

          {/* Overlays */}
          {(!hasStarted || gameOver || isPaused) && (
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm flex flex-col items-center justify-center">
              {!hasStarted && !gameOver && (
                <div className="text-center transform transition-transform hover:scale-105">
                  <button 
                    onClick={startGame}
                    className="group bg-cyan-500/10 border border-cyan-400 text-cyan-300 px-6 py-3 rounded-lg font-mono tracking-widest uppercase text-sm hover:bg-cyan-500 hover:text-slate-900 transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] flex items-center gap-2 mx-auto"
                  >
                    <Play className="w-4 h-4 fill-current group-hover:text-slate-900" />
                    Start System
                  </button>
                  <p className="text-slate-500 font-mono text-xs mt-4 animate-pulse">
                    Press SPACE to begin
                  </p>
                </div>
              )}

              {gameOver && (
                <div className="text-center animate-in zoom-in duration-300">
                  <h2 className="text-red-500 font-mono font-bold text-3xl mb-2 tracking-widest drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
                    SYS_CRASH
                  </h2>
                  <p className="text-slate-300 font-mono text-sm mb-6">
                    Final Score: <span className="text-cyan-400">{score}</span>
                  </p>
                  <button 
                    onClick={resetGame}
                    className="group bg-fuchsia-500/10 border border-fuchsia-400 text-fuchsia-300 px-6 py-3 rounded-lg font-mono tracking-widest uppercase text-sm hover:bg-fuchsia-500 hover:text-slate-900 transition-all duration-300 shadow-[0_0_15px_rgba(217,70,239,0.3)] hover:shadow-[0_0_25px_rgba(217,70,239,0.6)] flex items-center gap-2 mx-auto"
                  >
                    <RotateCcw className="w-4 h-4 group-hover:text-slate-900" />
                    Reboot
                  </button>
                  <p className="text-slate-500 font-mono text-xs mt-4">
                    Press SPACE to retry
                  </p>
                </div>
              )}

              {isPaused && hasStarted && !gameOver && (
                <div className="text-center">
                  <h2 className="text-yellow-400 font-mono font-bold text-2xl mb-6 tracking-widest animate-pulse">
                    PAUSED
                  </h2>
                  <button 
                    onClick={() => setIsPaused(false)}
                    className="bg-transparent border border-slate-500 text-slate-300 px-6 py-2 rounded-lg font-mono tracking-widest uppercase text-sm hover:bg-slate-800 transition-colors"
                  >
                    Resume
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Controls Hint */}
      <div className="mt-6 text-slate-500 font-mono text-xs tracking-widest uppercase flex gap-4 opacity-60">
        <span>WASD / Arrows to move</span>
        <span>•</span>
        <span>Space to pause</span>
      </div>
    </div>
  );
}
