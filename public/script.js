const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

const box = 20;
let snake = [{x: 9 * box, y: 10 * box}];
let food = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
};
let d = 'RIGHT';
let score = 0;
let game;

// Control buttons
document.getElementById('upBtn').addEventListener('click', () => d !== 'DOWN' && (d = 'UP'));
document.getElementById('leftBtn').addEventListener('click', () => d !== 'RIGHT' && (d = 'LEFT'));
document.getElementById('rightBtn').addEventListener('click', () => d !== 'LEFT' && (d = 'RIGHT'));
document.getElementById('downBtn').addEventListener('click', () => d !== 'UP' && (d = 'DOWN'));

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && d !== 'DOWN') d = 'UP';
    if (e.key === 'ArrowDown' && d !== 'UP') d = 'DOWN';
    if (e.key === 'ArrowLeft' && d !== 'RIGHT') d = 'LEFT';
    if (e.key === 'ArrowRight' && d !== 'LEFT') d = 'RIGHT';
});

function drawGame() {
    // Clear canvas
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? 'green' : 'lightgreen';
        ctx.fillRect(segment.x, segment.y, box, box);
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(segment.x, segment.y, box, box);
    });
    
    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);
    
    // Move snake
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;
    
    if (d === 'RIGHT') snakeX += box;
    if (d === 'LEFT') snakeX -= box;
    if (d === 'UP') snakeY -= box;
    if (d === 'DOWN') snakeY += box;
    
    // Check collision with food
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        scoreElement.textContent = score;
        food = {
            x: Math.floor(Math.random() * 20) * box,
            y: Math.floor(Math.random() * 20) * box
        };
    } else {
        snake.pop();
    }
    
    // Check collision with walls or self
    if (
        snakeX < 0 || snakeX >= canvas.width ||
        snakeY < 0 || snakeY >= canvas.height ||
        snake.some(segment => segment.x === snakeX && segment.y === snakeY)
    ) {
        clearInterval(game);
        alert('Game Over! Your score: ' + score);
        document.location.reload();
    }
    
    // Add new head
    snake.unshift({x: snakeX, y: snakeY});
}

function startGame() {
    game = setInterval(drawGame, 100);
}

startGame();
