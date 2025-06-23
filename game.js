const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game settings
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 90;
const BALL_RADIUS = 10;
const PLAYER_X = 30;
const AI_X = canvas.width - 30 - PADDLE_WIDTH;

let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 6 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 4 * (Math.random() * 2 - 1);

function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, false);
  ctx.closePath();
  ctx.fill();
}

function draw() {
  // Clear
  drawRect(0, 0, canvas.width, canvas.height, "#111");

  // Middle line
  ctx.strokeStyle = "#fff";
  ctx.beginPath();
  ctx.setLineDash([12, 16]);
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw paddles
  drawRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, "#0f0");
  drawRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT, "#f00");

  // Draw ball
  drawCircle(ballX, ballY, BALL_RADIUS, "#fff");
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(val, max));
}

function update() {
  // Ball movement
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Top/bottom wall collision
  if (ballY - BALL_RADIUS < 0) {
    ballY = BALL_RADIUS;
    ballSpeedY *= -1;
  }
  if (ballY + BALL_RADIUS > canvas.height) {
    ballY = canvas.height - BALL_RADIUS;
    ballSpeedY *= -1;
  }

  // Left paddle collision
  if (
    ballX - BALL_RADIUS < PLAYER_X + PADDLE_WIDTH &&
    ballY > playerY &&
    ballY < playerY + PADDLE_HEIGHT
  ) {
    ballX = PLAYER_X + PADDLE_WIDTH + BALL_RADIUS;
    ballSpeedX *= -1.03;
    // Add a bit of randomness
    let collidePoint = (ballY - (playerY + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
    ballSpeedY = collidePoint * 5;
  }

  // Right paddle (AI) collision
  if (
    ballX + BALL_RADIUS > AI_X &&
    ballY > aiY &&
    ballY < aiY + PADDLE_HEIGHT
  ) {
    ballX = AI_X - BALL_RADIUS;
    ballSpeedX *= -1.03;
    let collidePoint = (ballY - (aiY + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
    ballSpeedY = collidePoint * 5;
  }

  // Ball out of bounds (reset)
  if (ballX - BALL_RADIUS < 0 || ballX + BALL_RADIUS > canvas.width) {
    // Reset ball position and speed
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = 6 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = 4 * (Math.random() * 2 - 1);
  }

  // AI paddle movement (simple)
  let aiCenter = aiY + PADDLE_HEIGHT / 2;
  if (aiCenter < ballY - 15) aiY += 5;
  else if (aiCenter > ballY + 15) aiY -= 5;
  aiY = clamp(aiY, 0, canvas.height - PADDLE_HEIGHT);
}

// Mouse controls for player paddle
canvas.addEventListener('mousemove', function(evt) {
  const rect = canvas.getBoundingClientRect();
  const mouseY = evt.clientY - rect.top;
  playerY = clamp(mouseY - PADDLE_HEIGHT / 2, 0, canvas.height - PADDLE_HEIGHT);
});

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();