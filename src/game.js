const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const playerNameDisplay = document.getElementById('player-name');
const scoreDisplay = document.getElementById('score');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreDisplay = document.getElementById('final-score');
const playAgainButton = document.getElementById('play-again-button');
const background = document.getElementById('background');

let score = 0;
let gameOver = false;
let playername = localStorage.getItem('playername');
const playerColors = ['blue', '#00FF00', '#FFFF00', '#FF00FF', '#FFA500'];
let colorIndex = 0;
let backgroundX = 0;

// Player
const player = {
    x: 50,
    y: 350,
    width: 20,
    height: 20,
    color: playerColors[colorIndex],
    velocityY: 0,
    isJumping: false
};

// Obstacles
let obstacles = [];
let frameCount = 0;

function createObstacle() {
    const obstacle = {
        x: canvas.width,
        y: 350,
        width: 20,
        height: 20,
        color: 'red'
    };
    obstacles.push(obstacle);
}

function resetGame() {
    score = 0;
    gameOver = false;
    obstacles = [];
    frameCount = 0;
    player.y = 350;
    player.velocityY = 0;
    player.isJumping = false;
    backgroundX = 0;
    gameOverScreen.style.display = 'none';
    loop();
}

function update() {
    if (gameOver) return;

    // Move background for parallax effect
    backgroundX -= 2; 
    background.style.backgroundPositionX = backgroundX + 'px';

    // Update player position
    player.y += player.velocityY;
    player.velocityY += 0.5; // Gravity

    // Ground collision
    if (player.y > 350) {
        player.y = 350;
        player.velocityY = 0;
        player.isJumping = false;
    }

    // Update obstacle positions
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= 5;
        // Collision detection
        if (
            player.x < obstacles[i].x + obstacles[i].width &&
            player.x + player.width > obstacles[i].x &&
            player.y < obstacles[i].y + obstacles[i].height &&
            player.height + player.y > obstacles[i].y
        ) {
            endGame();
        }
    }

    // Remove off-screen obstacles
    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);

    // Create new obstacles
    frameCount++;
    if (frameCount % 60 === 0) {
        createObstacle();
    }

    // Update score
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw obstacles
    for (let i = 0; i < obstacles.length; i++) {
        ctx.fillStyle = obstacles[i].color;
        ctx.fillRect(obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);
    }
}

function loop() {
    if (gameOver) return;
    update();
    draw();
    requestAnimationFrame(loop);
}

async function endGame() {
    gameOver = true;
    finalScoreDisplay.textContent = score;
    gameOverScreen.style.display = 'flex';

    // Save score to the server
    if (playername) {
        try {
            await fetch(`/player/${playername}/score`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ score: score })
            });
        } catch (error) {
            console.error("Failed to save score:", error);
        }
    }
}

// Event Listeners
window.addEventListener('keydown', (e) => {
    if ((e.code === 'Space' || e.code === 'Enter') && !player.isJumping) {
        player.velocityY = -12; // Jump strength
        player.isJumping = true;
    }
    if (e.code === 'KeyC') {
        colorIndex = (colorIndex + 1) % playerColors.length;
        player.color = playerColors[colorIndex];
    }
});

playAgainButton.addEventListener('click', resetGame);

// Initial Setup
if (playername) {
    playerNameDisplay.textContent = playername;
} else {
    playerNameDisplay.textContent = 'Guest';
}

// Start the game loop
loop();