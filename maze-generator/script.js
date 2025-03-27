const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");
const newMazeBtn = document.getElementById("newMazeBtn");
const timerDisplay = document.getElementById("timer");

const cols = 25;
const rows = 25;
const cellSize = 20;
canvas.width = cols * cellSize;
canvas.height = rows * cellSize;

let grid = [];
let player = { x: 0, y: 0 };
let seconds = 0;
let timerInterval;

class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.visited = false;
        this.walls = { top: true, right: true, bottom: true, left: true };
    }
}

function createGrid() {
    grid = [];
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            grid.push(new Cell(x, y));
        }
    }
}

function getCell(x, y) {
    return grid.find(cell => cell.x === x && cell.y === y);
}

function generateMaze() {
    createGrid();
    let walls = [];
    let start = getCell(0, 0);
    start.visited = true;

    function addWalls(cell) {
        let { x, y } = cell;
        [[x, y - 1], [x + 1, y], [x, y + 1], [x - 1, y]].forEach(([nx, ny]) => {
            let next = getCell(nx, ny);
            if (next && !next.visited) walls.push({ cell, next });
        });
    }

    addWalls(start);

    while (walls.length > 0) {
        let randIndex = Math.floor(Math.random() * walls.length);
        let { cell, next } = walls[randIndex];
        walls.splice(randIndex, 1);

        if (!next.visited) {
            next.visited = true;

            if (next.x > cell.x) {
                cell.walls.right = false;
                next.walls.left = false;
            } else if (next.x < cell.x) {
                cell.walls.left = false;
                next.walls.right = false;
            } else if (next.y > cell.y) {
                cell.walls.bottom = false;
                next.walls.top = false;
            } else if (next.y < cell.y) {
                cell.walls.top = false;
                next.walls.bottom = false;
            }

            addWalls(next);
        }
    }
}

function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    grid.forEach(cell => {
        let x = cell.x * cellSize;
        let y = cell.y * cellSize;
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;

        if (cell.walls.top) drawLine(x, y, x + cellSize, y);
        if (cell.walls.right) drawLine(x + cellSize, y, x + cellSize, y + cellSize);
        if (cell.walls.bottom) drawLine(x, y + cellSize, x + cellSize, y + cellSize);
        if (cell.walls.left) drawLine(x, y, x, y + cellSize);
    });

    drawPlayer();
    drawExit();
}

function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function drawPlayer() {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(player.x * cellSize + cellSize / 2, player.y * cellSize + cellSize / 2, cellSize / 4, 0, Math.PI * 2);
    ctx.fill();
}

function drawExit() {
    ctx.fillStyle = "green";
    ctx.fillRect((cols - 1) * cellSize + 5, (rows - 1) * cellSize + 5, cellSize - 10, cellSize - 10);
}

document.addEventListener("keydown", (event) => {
    let cell = getCell(player.x, player.y);

    if (event.key === "ArrowUp" && !cell.walls.top) player.y--;
    if (event.key === "ArrowDown" && !cell.walls.bottom) player.y++;
    if (event.key === "ArrowLeft" && !cell.walls.left) player.x--;
    if (event.key === "ArrowRight" && !cell.walls.right) player.x++;

    drawMaze();

    if (player.x === cols - 1 && player.y === rows - 1) {
        setTimeout(() => {
            resetGame();
        }, 100);
    }
});

function startTimer() {
    clearInterval(timerInterval);
    seconds = 0;
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        seconds++;
        updateTimerDisplay();
    }, 1000);
}

function updateTimerDisplay() {
    timerDisplay.textContent = formatTime(seconds);
}

function formatTime(sec) {
    let minutes = Math.floor(sec / 60);
    let remainingSeconds = sec % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

function resetGame() {
    player = { x: 0, y: 0 };
    generateMaze();
    drawMaze();
    startTimer();
}

newMazeBtn.addEventListener("click", resetGame);

generateMaze();
drawMaze();
startTimer();
