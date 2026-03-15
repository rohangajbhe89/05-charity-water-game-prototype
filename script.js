const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const feedbackEl = document.getElementById("feedback");
const progressFillEl = document.getElementById("progressFill");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const playAgainBtn = document.getElementById("playAgainBtn");
const endScreen = document.getElementById("endScreen");
const endTitle = document.getElementById("endTitle");
const endMessage = document.getElementById("endMessage");
const confettiContainer = document.getElementById("confettiContainer");
const cells = document.querySelectorAll(".cell");

let score = 0;
let timeLeft = 30;
let gameRunning = false;
let timerInterval = null;
let spawnInterval = null;
let activeIndex = null;
let activeType = null;

function updateUI() {
  scoreEl.textContent = score;
  timerEl.textContent = timeLeft;

  const progress = Math.min((score / 100) * 100, 100);
  progressFillEl.style.width = `${progress}%`;
}

function clearBoard() {
  cells.forEach((cell) => {
    cell.className = "cell";
    cell.textContent = "";
  });
  activeIndex = null;
  activeType = null;
}

function showFeedback(message) {
  feedbackEl.textContent = message;
}

function spawnItem() {
  clearBoard();

  const index = Math.floor(Math.random() * cells.length);
  const type = Math.random() < 0.75 ? "can" : "pipe";

  activeIndex = index;
  activeType = type;

  const cell = cells[index];
  if (type === "can") {
    cell.classList.add("can");
    cell.textContent = "🟨";
  } else {
    cell.classList.add("pipe");
    cell.textContent = "🚫";
  }
}

function startGame() {
  resetGameState();
  gameRunning = true;
  endScreen.classList.add("hidden");
  showFeedback("Game started!");

  timerInterval = setInterval(() => {
    timeLeft--;
    updateUI();

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);

  spawnItem();
  spawnInterval = setInterval(spawnItem, 800);
}

function endGame() {
  gameRunning = false;
  clearInterval(timerInterval);
  clearInterval(spawnInterval);
  clearBoard();

  const won = score >= 100;
  endTitle.textContent = won ? "You Win!" : "Game Over";
  endMessage.textContent = `You collected ${score} liters.`;
  endScreen.classList.remove("hidden");

  showFeedback(won ? "Nice job! You won." : "Time is up.");

  if (won) {
    launchConfetti();
  }
}

function resetGameState() {
  clearInterval(timerInterval);
  clearInterval(spawnInterval);
  score = 0;
  timeLeft = 30;
  clearBoard();
  updateUI();
  showFeedback("Press Start to play");
}

function resetGame() {
  gameRunning = false;
  endScreen.classList.add("hidden");
  resetGameState();
}

function launchConfetti() {
  confettiContainer.innerHTML = "";

  for (let i = 0; i < 60; i++) {
    const piece = document.createElement("div");
    piece.classList.add("confetti");
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.animationDelay = `${Math.random() * 0.5}s`;
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    confettiContainer.appendChild(piece);
  }

  setTimeout(() => {
    confettiContainer.innerHTML = "";
  }, 3500);
}

cells.forEach((cell, index) => {
  cell.addEventListener("click", () => {
    if (!gameRunning || index !== activeIndex) return;

    if (activeType === "can") {
      score += 10;
      cell.classList.add("hit-good");
      showFeedback("+10 points! Clean water collected.");
    } else if (activeType === "pipe") {
      score = Math.max(0, score - 5);
      cell.classList.add("hit-bad");
      showFeedback("-5 points! Avoid broken pipes.");
    }

    activeIndex = null;
    activeType = null;
    updateUI();
  });
});

startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", resetGame);
playAgainBtn.addEventListener("click", startGame);

updateUI();
