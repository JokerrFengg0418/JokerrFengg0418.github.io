// Page switching logic
const pages = document.querySelectorAll('.page');
const btnHome = document.getElementById('btn-home');
const btnHistory = document.getElementById('btn-history');
const btnTeams = document.getElementById('btn-teams');
const btnDrivers = document.getElementById('btn-drivers');
const btnMiniQuiz = document.getElementById('btn-mini-quiz');
const btnMiniGame = document.getElementById('btn-mini-game');


// Function to show only the selected page
function showPage(pageId) {
    pages.forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

// Event listeners for navigation
btnHome.addEventListener('click', () => showPage('home'));
btnHistory.addEventListener('click', () => showPage('history'));
btnTeams.addEventListener('click', () => showPage('teams'));
btnDrivers.addEventListener('click', () => showPage('drivers'));
btnMiniQuiz.addEventListener('click', () => showPage('quiz'));
btnMiniGame.addEventListener('click', () => showPage('reflex-game'));

// Music toggle logic
const bgMusic = document.getElementById('bg-music');
const toggleMusicBtn = document.getElementById('toggle-music');
let isPlaying = false;

toggleMusicBtn.addEventListener('click', function() {
    if (isPlaying) {
        bgMusic.pause();
        toggleMusicBtn.textContent = 'Play Music';
    } else {
        bgMusic.play();
        toggleMusicBtn.textContent = 'Pause Music';
    }
    isPlaying = !isPlaying;
});

// Auto-start Home page
showPage('home');

// Update button text on page load
toggleMusicBtn.textContent = 'Play Music';

// Simple F1 Quiz
const quizData = [
    {
        question: "Which team won the 2023 Constructors' Championship?",
        answers: ["Red Bull Racing", "Ferrari", "Mercedes"],
        correct: "Red Bull Racing"
    },
    {
        question: "How many drivers are there in the 2025 season Formula 1 race?",
        answers: ["20", "22", "18"],
        correct: "20"
    },
    {
        question: "What tyre colours represent Soft compound?",
        answers: ["Red", "Yellow", "White"],
        correct: "Red"
    }
];

let currentQuestion = 0;
let score = 0;

const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const nextBtn = document.getElementById('next-btn');
const resultEl = document.getElementById('result');

function loadQuiz() {
    const q = quizData[currentQuestion];
    questionEl.textContent = q.question;
    answersEl.innerHTML = '';
    q.answers.forEach(answer => {
        const btn = document.createElement('button');
        btn.textContent = answer;
        btn.addEventListener('click', () => {
            if (answer === q.correct) {
                score++;
            }
            nextBtn.style.display = 'block';
        });
        answersEl.appendChild(btn);
    });
    nextBtn.style.display = 'none';
}

nextBtn.addEventListener('click', () => {
    currentQuestion++;
    if (currentQuestion < quizData.length) {
        loadQuiz();
    } else {
        questionEl.textContent = "Quiz Finished!";
        answersEl.innerHTML = `Your Score: ${score} / ${quizData.length}`;
        nextBtn.style.display = 'none';
    }
});

loadQuiz();

// Reflex Game Logic with Reset
const countdownEl = document.getElementById('countdown');
const carEl = document.getElementById('game-car');
const reactionEl = document.getElementById('reaction-time');
const startBtn = document.getElementById('start-reflex');
const resetBtn = document.getElementById('reset-reflex');

let startTime, countdownInterval, timeoutID;

// Start Game
startBtn.addEventListener('click', function() {
    startBtn.disabled = true;
    countdownEl.textContent = 'Get Ready...';
    reactionEl.textContent = '';
    carEl.style.left = '0';
    carEl.style.transition = 'none';

    // Countdown (Timed Event)
    let countdown = 3;
    countdownInterval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            countdownEl.textContent = countdown;
        } else {
            clearInterval(countdownInterval);
            countdownEl.textContent = 'GO!';
            startTime = new Date().getTime();

            // Listen for click after GO!
            window.addEventListener('click', clickHandler);
        }
    }, 1000);

    // Auto-fail after timeout
    timeoutID = setTimeout(() => {
        window.removeEventListener('click', clickHandler);
        countdownEl.textContent = 'Too Slow!';
        reactionEl.textContent = 'Reaction Time: Too Slow!';
        carEl.style.left = '0';
        startBtn.disabled = false;
    }, 8000);
});

// Click Reaction
function clickHandler() {
    const reaction = (new Date().getTime() - startTime) / 1000;
    window.removeEventListener('click', clickHandler);
    clearTimeout(timeoutID);

    countdownEl.textContent = 'You clicked!';
    reactionEl.textContent = `Reaction Time: ${reaction.toFixed(3)} seconds`;

    // Car Animation
    let distance = Math.max(10, (3 - reaction) * 30);
    distance = Math.min(distance, 80);
    carEl.style.transition = 'left 1s ease';
    carEl.style.left = distance + '%';

    startBtn.disabled = false;
}

// Reset Button Logic 
resetBtn.addEventListener('click', function() {
    clearInterval(countdownInterval);
    clearTimeout(timeoutID);
    window.removeEventListener('click', clickHandler);
    countdownEl.textContent = 'Get Ready...';
    reactionEl.textContent = '';
    carEl.style.left = '0';
    carEl.style.transition = 'none';
    startBtn.disabled = false;
});


