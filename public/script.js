const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

// Game settings
const box = 20;
const gridSize = canvas.width / box; // Number of boxes in grid
let snake = [{x: 9 * box, y: 10 * box}];
let food = generateFood();
let direction = 'RIGHT';
let nextDirection = 'RIGHT';
let score = 0;
let gameSpeed = 150;
let game;

// Generate food at random position
function generateFood() {
    return {
        x: Math.floor(Math.random() * gridSize) * box,
        y: Math.floor(Math.random() * gridSize) * box
    };
}

// Control buttons
document.getElementById('upBtn').addEventListener('click', () => {
    if (direction !== 'DOWN') nextDirection = 'UP';
});
document.getElementById('leftBtn').addEventListener('click', () => {
    if (direction !== 'RIGHT') nextDirection = 'LEFT';
});
document.getElementById('rightBtn').addEventListener('click', () => {
    if (direction !== 'LEFT') nextDirection = 'RIGHT';
});
document.getElementById('downBtn').addEventListener('click', () => {
    if (direction !== 'UP') nextDirection = 'DOWN';
});

// Keyboard controls
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') nextDirection = 'UP'; break;
        case 'ArrowDown': if (direction !== 'UP') nextDirection = 'DOWN'; break;
        case 'ArrowLeft': if (direction !== 'RIGHT') nextDirection = 'LEFT'; break;
        case 'ArrowRight': if (direction !== 'LEFT') nextDirection = 'RIGHT'; break;
    }
});

function drawGame() {
    // Update direction
    direction = nextDirection;
    
    // Get head position
    let head = {x: snake[0].x, y: snake[0].y};
    
    // Move head based on direction
    switch(direction) {
        case 'UP': head.y -= box; break;
        case 'DOWN': head.y += box; break;
        case 'LEFT': head.x -= box; break;
        case 'RIGHT': head.x += box; break;
    }
    
    // Wall collision - make snake appear on opposite side
    if (head.x < 0) head.x = canvas.width - box;
    else if (head.x >= canvas.width) head.x = 0;
    if (head.y < 0) head.y = canvas.height - box;
    else if (head.y >= canvas.height) head.y = 0;
    
    // Check self collision
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }
    
    // Add new head
    snake.unshift(head);
    
    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreElement.textContent = score;
        food = generateFood();
    } else {
        // Remove tail if no food eaten
        snake.pop();
    }
    
    // Clear canvas
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? 'darkgreen' : 'green';
        ctx.fillRect(segment.x, segment.y, box-1, box-1);
    });
    
    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box-1, box-1);
}

function gameOver() {
    clearInterval(game);
    ctx.fillStyle = 'black';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvas.width/2, canvas.height/2 - 20);
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width/2, canvas.height/2 + 20);
}

function startGame() {
    // Reset game state
    snake = [{x: 9 * box, y: 10 * box}];
    direction = 'RIGHT';
    nextDirection = 'RIGHT';
    score = 0;
    scoreElement.textContent = '0';
    food = generateFood();
    
    // Clear canvas
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Clear any existing game interval
    if (game) clearInterval(game);
    
    // Start new game
    game = setInterval(drawGame, gameSpeed);
}

// Initialize game
startGame();

// Restart button
document.getElementById('restartBtn').addEventListener('click', startGame);
