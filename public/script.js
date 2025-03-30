// Game elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const upBtn = document.getElementById('upBtn');
const downBtn = document.getElementById('downBtn');
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');
const restartBtn = document.getElementById('restartBtn');

// Game settings
const box = 20;
const gridSize = canvas.width / box;
let snake = [{x: 9 * box, y: 10 * box}];
let food = generateFood();
let direction = 'RIGHT';
let nextDirection = 'RIGHT';
let score = 0;
let gameSpeed = 150;
let game;
let isGameOver = false;

// Generate food at random position (not on snake)
function generateFood() {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * gridSize) * box,
      y: Math.floor(Math.random() * gridSize) * box
    };
  } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
  return newFood;
}

// Main game loop
function drawGame() {
  if (isGameOver) return;
  
  // Update direction
  direction = nextDirection;
  
  // Get head position
  let head = {x: snake[0].x, y: snake[0].y};
  
  // Move head
  switch(direction) {
    case 'UP': head.y -= box; break;
    case 'DOWN': head.y += box; break;
    case 'LEFT': head.x -= box; break;
    case 'RIGHT': head.x += box; break;
  }
  
  // Wall collision - wrap around
  if (head.x < 0) head.x = canvas.width - box;
  else if (head.x >= canvas.width) head.x = 0;
  if (head.y < 0) head.y = canvas.height - box;
  else if (head.y >= canvas.height) head.y = 0;
  
  // Self collision check
  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    gameOver();
    return;
  }
  
  // Add new head
  snake.unshift(head);
  
  // Food collision
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreElement.textContent = score;
    food = generateFood();
    
    // Increase speed every 5 points
    if (score % 5 === 0 && gameSpeed > 50) {
      gameSpeed -= 5;
      clearInterval(game);
      game = setInterval(drawGame, gameSpeed);
    }
  } else {
    snake.pop(); // Remove tail
  }
  
  // Draw game
  drawGameElements();
}

// Draw all game elements
function drawGameElements() {
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

// Game over handler
function gameOver() {
  isGameOver = true;
  clearInterval(game);
  
  // Draw game over overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'white';
  ctx.font = '40px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Game Over!', canvas.width/2, canvas.height/2 - 20);
  ctx.font = '20px Arial';
  ctx.fillText(`Final Score: ${score}`, canvas.width/2, canvas.height/2 + 20);
}

// Initialize new game
function startGame() {
  // Reset game state
  snake = [{x: 9 * box, y: 10 * box}];
  direction = 'RIGHT';
  nextDirection = 'RIGHT';
  score = 0;
  scoreElement.textContent = '0';
  gameSpeed = 150;
  food = generateFood();
  isGameOver = false;
  
  // Clear canvas
  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Clear existing game interval
  if (game) clearInterval(game);
  
  // Start new game
  game = setInterval(drawGame, gameSpeed);
}

// Event Listeners

// Prevent page scrolling with arrow keys
document.addEventListener('keydown', function(e) {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault();
  }
});

// Keyboard controls
document.addEventListener('keydown', (e) => {
  if (isGameOver) return;
  
  switch(e.key) {
    case 'ArrowUp': if (direction !== 'DOWN') nextDirection = 'UP'; break;
    case 'ArrowDown': if (direction !== 'UP') nextDirection = 'DOWN'; break;
    case 'ArrowLeft': if (direction !== 'RIGHT') nextDirection = 'LEFT'; break;
    case 'ArrowRight': if (direction !== 'LEFT') nextDirection = 'RIGHT'; break;
  }
});

// Button controls
upBtn.addEventListener('click', () => { if (direction !== 'DOWN') nextDirection = 'UP'; });
downBtn.addEventListener('click', () => { if (direction !== 'UP') nextDirection = 'DOWN'; });
leftBtn.addEventListener('click', () => { if (direction !== 'RIGHT') nextDirection = 'LEFT'; });
rightBtn.addEventListener('click', () => { if (direction !== 'LEFT') nextDirection = 'RIGHT'; });
restartBtn.addEventListener('click', startGame);

// Focus canvas for better keyboard control
canvas.addEventListener('click', () => canvas.focus());

// Start the game
startGame();
