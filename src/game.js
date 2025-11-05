
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const background = document.getElementById('background');

// Player properties
const player = {
  x: 50,
  y: canvas.height - 50, // Start player on the ground
  width: 50,
  height: 50,
  color: 'blue',
  speed: 20,
  velocityY: 0,
  isJumping: false,
  jumpStrength: 15
};

const gravity = 0.8;
let backgroundX = 0;
const obstacles = [];
let gameOver = false;

// Function to draw the player
function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Function to draw obstacles
function drawObstacles() {
  ctx.fillStyle = 'green';
  obstacles.forEach(obstacle => {
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });
}

// Keyboard input handler for jumping
document.addEventListener('keydown', function(event) {
  if (event.code === 'Enter' && !player.isJumping) {
    player.velocityY = -player.jumpStrength;
    player.isJumping = true;
  }
  if (event.code === 'c' && player.color === 'red') {
    player.color = 'blue';
  } else if (event.code === 'c' && player.color === 'blue') {
    player.color = 'red';
  }
});

// Function to add obstacles
function addObstacle() {
  const obstacle = {
    x: canvas.width,
    y: canvas.height - 50,
    width: 20,
    height: 50,
  };
  obstacles.push(obstacle);
}

// Function to detect collision
function detectCollision() {
  obstacles.forEach(obstacle => {
    if (
      player.x < obstacle.x + obstacle.width &&
      player.x + player.width > obstacle.x &&
      player.y < obstacle.y + obstacle.height &&
      player.y + player.height > obstacle.y
    ) {
      gameOver = true;
    }
  });
}

// Game loop
function gameLoop() {
  if (gameOver) {
    ctx.fillStyle = 'red';
    ctx.font = '50px Arial';
    ctx.fillText('Game Over', canvas.width / 2 - 150, canvas.height / 2);
    return;
  }

  // Clear the canvas for the next frame
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Apply gravity
  player.velocityY += gravity;
  player.y += player.velocityY;

  // Ground collision detection
  if (player.y + player.height > canvas.height) {
    player.y = canvas.height - player.height; // Snap to ground
    player.velocityY = 0;
    player.isJumping = false;
  }

  // Move the background to give the illusion of player movement
  backgroundX -= player.speed;
  if (backgroundX <= -canvas.width) {
    backgroundX = 0;
  }
  background.style.backgroundPositionX = backgroundX + 'px';

  // Add new obstacles
  if (Math.random() < 0.02) {
    addObstacle();
  }

  // Move and draw obstacles
  obstacles.forEach(obstacle => {
    obstacle.x -= player.speed;
  });

  drawObstacles();

  // Detect collision
  detectCollision();

  // Draw the player at its new position
  drawPlayer();

  // Request the next animation frame
  requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
