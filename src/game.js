const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Player properties
const player = {
  x: 50,
  y: 50,
  width: 50,
  height: 50,
  color: 'blue',
  speed: 2
};

// Function to draw the player
function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Game loop
function gameLoop() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Move the player
  if (player.x + player.width < canvas.width) {
    player.x += player.speed;
  }

  // Draw the player
  drawPlayer();

  // Request the next frame
  requestAnimationFrame(gameLoop);
}

// Start the game loop when the DOM is ready
document.addEventListener('DOMContentLoaded', (event) => {
    gameLoop();
});
