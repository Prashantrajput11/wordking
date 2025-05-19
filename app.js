const words = {
	easy: [
		"run",
		"jump",
		"play",
		"code",
		"work",
		"chat",
		"easy",
		"book",
		"game",
		"word",
		"test",
		"hello",
		"world",
		"learn",
		"happy",
		"smile",
		"laugh",
		"dance",
		"sing",
		"type",
	],
	medium: [
		"program",
		"function",
		"interface",
		"developer",
		"keyboard",
		"computer",
		"software",
		"language",
		"algorithm",
		"variable",
		"challenge",
		"database",
		"structure",
		"document",
		"framework",
		"template",
		"library",
		"platform",
		"resource",
		"solution",
	],
	hard: [
		"implementation",
		"authentication",
		"asynchronous",
		"concatenation",
		"compatibility",
		"documentation",
		"functionality",
		"infrastructure",
		"optimization",
		"specification",
		"visualization",
		"accessibility",
		"communication",
		"configuration",
		"decomposition",
		"encapsulation",
		"internationalization",
		"parallelization",
		"representation",
		"virtualization",
	],
};

// DOM Elements
const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startButton");
const currentWordElement = document.getElementById("currentWord");
const userInputElement = document.getElementById("userInput");
const timeDisplay = document.getElementById("timeDisplay");
const scoreDisplay = document.getElementById("scoreDisplay");
const streakDisplay = document.getElementById("streakDisplay");
const timeProgressBar = document.getElementById("timeProgressBar");
const endGameScreen = document.getElementById("endGameScreen");
const finalScore = document.getElementById("finalScore");
const highScoreMessage = document.getElementById("highScoreMessage");
const restartButton = document.getElementById("restartButton");
const difficultyButtons = document.querySelectorAll(".difficulty-btn");

// Game state
let score = 0;
let streak = 0;
let time = 0;
let timer;
let currentWord = "";
let isPlaying = false;
let difficulty = "easy";
let maxTime = 10; // Default timer value for easy mode

// Initialize the game
function init() {
	// Set up event listeners
	startButton.addEventListener("click", startGame);
	userInputElement.addEventListener("input", checkMatch);
	restartButton.addEventListener("click", restartGame);

	// Set up difficulty selector
	difficultyButtons.forEach((button) => {
		button.addEventListener("click", () => {
			// Allow changing difficulty even during gameplay
			difficultyButtons.forEach((btn) => btn.classList.remove("active"));
			button.classList.add("active");
			difficulty = button.dataset.difficulty;

			// Adjust timer based on difficulty
			if (difficulty === "easy") {
				maxTime = 10;
			} else if (difficulty === "medium") {
				maxTime = 7;
			} else {
				maxTime = 5;
			}

			// If game is not playing, just update the display
			if (!isPlaying) {
				timeDisplay.textContent = maxTime;
			} else {
				// If game is already in progress, we'll keep current time but update for next word
				showWord(); // Get a new word from the selected difficulty
			}

			console.log("Difficulty changed to:", difficulty);
		});
	});

	// Load high score from local storage
	updateHighScoreMessage();
}

// Start the game
function startGame() {
	isPlaying = true;
	score = 0;
	streak = 0;

	// Reset displays
	scoreDisplay.textContent = score;
	streakDisplay.textContent = streak;

	// Hide start screen
	startScreen.style.display = "none";

	// Enable input
	userInputElement.disabled = false;
	userInputElement.focus();

	// Get new word
	showWord();

	// Start timer
	time = maxTime;
	timeDisplay.textContent = time;
	timeProgressBar.style.width = "100%";

	if (timer) {
		clearInterval(timer);
	}

	timer = setInterval(updateTimer, 1000);
}

// Show a new random word
function showWord() {
	// Get a word from the selected difficulty
	const wordArray = words[difficulty];
	const randomIndex = Math.floor(Math.random() * wordArray.length);
	currentWord = wordArray[randomIndex];
	currentWordElement.textContent = currentWord;
	userInputElement.value = "";

	console.log("New word:", currentWord, "Difficulty:", difficulty);
}

// Check if input matches the current word
function checkMatch() {
	if (userInputElement.value.toLowerCase() === currentWord.toLowerCase()) {
		// Correct word typed
		currentWordElement.classList.add("word-correct");

		// Add score based on difficulty
		let pointsToAdd = 1;
		if (difficulty === "medium") {
			pointsToAdd = 2;
		} else if (difficulty === "hard") {
			pointsToAdd = 3;
		}

		// Add streak bonus
		streak++;
		streakDisplay.textContent = streak;

		if (streak > 1) {
			pointsToAdd += Math.min(streak - 1, 5); // Max streak bonus of 5
		}

		score += pointsToAdd;
		scoreDisplay.textContent = score;

		// Reset input
		userInputElement.value = "";

		// Add some time as a reward (less for harder difficulties)
		let timeBonus = 0;
		if (difficulty === "easy") {
			timeBonus = 2;
		} else if (difficulty === "medium") {
			timeBonus = 1;
		} else {
			timeBonus = 0.5;
		}

		time = Math.min(time + timeBonus, maxTime);
		timeDisplay.textContent = time;
		updateProgressBar();

		// Show a new word after a brief delay to show the "correct" feedback
		setTimeout(() => {
			currentWordElement.classList.remove("word-correct");
			showWord();
		}, 200);
	}
}

// Update timer
function updateTimer() {
	if (time > 0) {
		time--;
		timeDisplay.textContent = time;
		updateProgressBar();

		if (time === 0) {
			gameOver();
		}
	}
}

// Update progress bar
function updateProgressBar() {
	const percentage = (time / maxTime) * 100;
	timeProgressBar.style.width = `${percentage}%`;

	// Change color based on time remaining
	if (percentage > 60) {
		timeProgressBar.style.backgroundColor = "var(--success)";
	} else if (percentage > 30) {
		timeProgressBar.style.backgroundColor = "var(--warning)";
	} else {
		timeProgressBar.style.backgroundColor = "var(--danger)";
	}
}

// Game over
function gameOver() {
	clearInterval(timer);
	isPlaying = false;

	// Show game over screen
	endGameScreen.style.display = "flex";
	finalScore.textContent = score;

	// Check if high score
	const currentHighScore = localStorage.getItem("wordRushHighScore") || 0;
	if (score > currentHighScore) {
		localStorage.setItem("wordRushHighScore", score);
		highScoreMessage.textContent = "New High Score! 🎉";
	} else {
		highScoreMessage.textContent = `High Score: ${currentHighScore}`;
	}

	// Disable input
	userInputElement.disabled = true;
}

// Restart game
function restartGame() {
	endGameScreen.style.display = "none";
	startGame();
}

// Update high score message
function updateHighScoreMessage() {
	const currentHighScore = localStorage.getItem("wordRushHighScore") || 0;
	if (currentHighScore > 0) {
		highScoreMessage.textContent = `High Score: ${currentHighScore}`;
	}
}

// Initialize on page load
window.addEventListener("load", init);
