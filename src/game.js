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

// Function to draw the player
function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Keyboard input handler for jumping
document.addEventListener('keydown', function(event) {
  if (event.code === 'Enter' && !player.isJumping) {
    player.velocityY = -player.jumpStrength;
    player.isJumping = true;
  }
});

// Game loop
function gameLoop() {
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

  // Draw the player at its new position
  drawPlayer();

  // Request the next animation frame
  requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
