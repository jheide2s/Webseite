const player = document.getElementById('player');
const obstacles = [document.getElementById('obstacle1'), document.getElementById('obstacle2')];
const gameStatus = document.getElementById('gameStatus');
const restartBtn = document.getElementById('restartBtn');
const pauseBtn = document.getElementById('pauseBtn');
const minimizeBtn = document.getElementById('minimizeBtn');
const gameArea = document.getElementById('gameArea');
const gameContainer = document.getElementById('gameContainer');
const gamePreviewContainer = document.getElementById('gamePreviewContainer');

const playerSpeed = 10;
const obstacleSpeed = 5;

let playerX = parseInt(player.getAttribute('cx'));
let playerY = parseInt(player.getAttribute('cy'));

let obstaclePositions = obstacles.map(obstacle => ({
    x: parseInt(obstacle.getAttribute('x')),
    y: parseInt(obstacle.getAttribute('y'))
}));

let isGameOver = false;
let isPaused = false;
let isMinimized = false;

document.addEventListener('keydown', (e) => {
    if (isGameOver || isPaused || isMinimized) return;

    if (e.key === 'ArrowUp') playerY -= playerSpeed;
    if (e.key === 'ArrowDown') playerY += playerSpeed;
    if (e.key === 'ArrowLeft') playerX -= playerSpeed;
    if (e.key === 'ArrowRight') playerX += playerSpeed;

    player.setAttribute('cx', playerX);
    player.setAttribute('cy', playerY);
});

function startGame() {
    gamePreviewContainer.style.display = 'none';  // Verstecke die Vorschau
    gameContainer.style.display = 'block';        // Zeige das Spiel an
    if (isMinimized) {
        // Wenn das Spiel minimiert war, starte es nach dem Öffnen
        isMinimized = false;
        minimizeBtn.textContent = '_'; // Setze den Minimieren-Button zurück
    }
    gameLoop();                                  // Starte das Spiel
}

function gameLoop() {
    if (isGameOver || isPaused || isMinimized) return;

    obstaclePositions.forEach((position, index) => {
        position.x -= obstacleSpeed;
        if (position.x < -20) {
            position.x = 600 + Math.random() * 100;
            position.y = Math.random() * 380;
        }
        obstacles[index].setAttribute('x', position.x);
        obstacles[index].setAttribute('y', position.y);

        if (checkCollision(playerX, playerY, position.x, position.y)) {
            gameOver();
            return;
        }
    });

    requestAnimationFrame(gameLoop);
}

function checkCollision(px, py, ox, oy) {
    const playerRadius = 20;
    const obstacleWidth = 20;
    const obstacleHeight = 20;

    if (px < ox + obstacleWidth && px + playerRadius > ox &&
        py < oy + obstacleHeight && py + playerRadius > oy) {
        return true;
    }
    return false;
}

function gameOver() {
    isGameOver = true;
    gameStatus.textContent = "Game Over!";
    player.classList.add('exploding');
    restartBtn.style.display = 'block';
}

function restartGame() {
    isGameOver = false;
    gameStatus.textContent = "Spiel läuft...";
    restartBtn.style.display = 'none';

    player.setAttribute('cx', 50);
    player.setAttribute('cy', 200);
    player.classList.remove('exploding');

    obstaclePositions = obstacles.map(obstacle => ({
        x: 600 + Math.random() * 100,
        y: Math.random() * 380
    }));
    obstacles.forEach((obstacle, index) => {
        obstacle.setAttribute('x', obstaclePositions[index].x);
        obstacle.setAttribute('y', obstaclePositions[index].y);
    });

    gameLoop();
}

function togglePause() {
    if (isPaused) {
        isPaused = false;
        pauseBtn.textContent = "II";
        gameLoop();
    } else {
        isPaused = true;
        pauseBtn.textContent = "►";
    }
}

function minimizeGame() {
    if (isMinimized) {
        gameContainer.style.display = 'block';
        gamePreviewContainer.style.display = 'none';  // Verstecke die Vorschau
        minimizeBtn.textContent = '_';
        isMinimized = false;
        // Das Spiel startet automatisch nach dem Öffnen
        isPaused = false;
        pauseBtn.textContent = "II";  // Pause-Button zurücksetzen
        gameLoop();                   // Spiel fortsetzen
    } else {
        gameContainer.style.display = 'none';
        gamePreviewContainer.style.display = 'block'; // Zeige die Vorschau
        minimizeBtn.textContent = '◻';
        isMinimized = true;
        // Das Spiel wird beim Minimieren automatisch pausiert
        isPaused = true;
        pauseBtn.textContent = "►";  // Setze den Pause-Button auf "►"
    }
}
