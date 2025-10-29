const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Player properties
const player = {
  x: 50,
  y: 50,
  width: 50,
  height: 50,
  color: 'blue'
};

// Function to draw the player
function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Initial draw
drawPlayer();
