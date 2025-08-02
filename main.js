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
btnMiniGame.addEventListener('click', () => showPage('pitstop-game'));

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

window.addEventListener('DOMContentLoaded', () => {
    // --- F1 Quiz Game ---
    const startQuizBtn = document.getElementById('start-quiz');
    const quizContainer = document.getElementById('quiz-container');

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
    const resetQuizBtn = document.getElementById('reset-quiz');
    const resultEl = document.getElementById('result');

    function loadQuiz() {
        const q = quizData[currentQuestion];
        questionEl.textContent = q.question;
        answersEl.innerHTML = '';
        resultEl.textContent = '';

        q.answers.forEach(answer => {
            const btn = document.createElement('button');
            btn.textContent = answer;
            btn.addEventListener('click', () => {
                if (btn.classList.contains('clicked')) return;

                btn.classList.add('clicked');

                if (answer === q.correct) {
                    btn.classList.add('correct');
                    score++;
                } else {
                    btn.classList.add('wrong');

                    // Highlight correct answer
                    const allBtns = answersEl.querySelectorAll('button');
                    allBtns.forEach(b => {
                        if (b.textContent === q.correct) {
                            b.classList.add('correct');
                        }
                        b.disabled = true;
                    });
                }

                nextBtn.style.display = 'block';
            });
            answersEl.appendChild(btn);
        });

        nextBtn.style.display = 'none';
    }

    // Start Quiz Button Logic
    startQuizBtn.addEventListener('click', () => {
        startQuizBtn.style.display = 'none';
        quizContainer.style.display = 'block';
        currentQuestion = 0;
        score = 0;
        loadQuiz();
    });

    // Next Question
    nextBtn.addEventListener('click', () => {
        currentQuestion++;
        if (currentQuestion < quizData.length) {
            loadQuiz();
        } else {
            questionEl.textContent = "Quiz Finished!";
            answersEl.innerHTML = '';
            resultEl.textContent = `Your Score: ${score} / ${quizData.length}`;
            nextBtn.style.display = 'none';
        }
    });

    // Reset Quiz Button
    resetQuizBtn.addEventListener('click', () => {
        currentQuestion = 0;
        score = 0;
        loadQuiz();
    });
});

// Pit Stop Challenge
const startPitstopBtn = document.getElementById('start-pitstop');
const tires = document.querySelectorAll('.tire');
const timerDisplay = document.getElementById('pitstop-timer');
const resultDisplay = document.getElementById('pitstop-result');

let pitstopStartTime;
let changedCount = 0;
let pitstopInterval;

startPitstopBtn.addEventListener('click', () => {
    changedCount = 0;
    resultDisplay.textContent = '';
    tires.forEach(tire => tire.classList.remove('changed'));

    // Disable tire clicks until countdown ends
    tires.forEach(tire => tire.removeEventListener('click', changeTire));

    // Start countdown lights
    startLightsCountdown(() => {
        pitstopStartTime = performance.now();
        pitstopInterval = setInterval(updatePitstopTimer, 10);
        tires.forEach(tire => tire.addEventListener('click', changeTire));
    });
});

function updatePitstopTimer() {
    const elapsed = (performance.now() - pitstopStartTime) / 1000;
    timerDisplay.textContent = `Time: ${elapsed.toFixed(3)}s`;
}

function changeTire(e) {
    const tire = e.target;
    if (!tire.classList.contains('changed')) {
        tire.classList.add('changed');
        changedCount++;

        if (changedCount === tires.length) {
            finishPitstop();
        }
    }
}

function finishPitstop() {
    clearInterval(pitstopInterval);
    const finalTime = (performance.now() - pitstopStartTime) / 1000;
    resultDisplay.textContent = `Pit Stop Complete! Time: ${finalTime.toFixed(3)} seconds`;

    // Disable further clicks
    tires.forEach(tire => tire.removeEventListener('click', changeTire));

    // Show Try Again button
    document.getElementById('try-again-pitstop').style.display = 'block';
}

const tryAgainBtn = document.getElementById('try-again-pitstop');

tryAgainBtn.addEventListener('click', () => {
    changedCount = 0;
    resultDisplay.textContent = '';
    tires.forEach(tire => tire.classList.remove('changed'));
    timerDisplay.textContent = 'Time: 0.000s';
    document.getElementById('try-again-pitstop').style.display = 'none';

    // Optionally re-enable countdown lights + start
    startLightsCountdown(() => {
        pitstopStartTime = performance.now();
        pitstopInterval = setInterval(updatePitstopTimer, 10);
        tires.forEach(tire => tire.addEventListener('click', changeTire));
    });
});

const startLights = document.querySelectorAll('#start-lights .light');

function startLightsCountdown(callback) {
    let index = 0;

    const interval = setInterval(() => {
        if (index < startLights.length) {
            startLights[index].classList.add('on');
            index++;
        } else {
            clearInterval(interval);
            // Turn off all reds and show green
            setTimeout(() => {
                startLights.forEach(light => light.classList.remove('on'));
                startLights.forEach(light => light.classList.add('go'));

                // Delay a bit before hiding lights and starting the pit stop
                setTimeout(() => {
                    startLights.forEach(light => light.classList.remove('go'));
                    callback(); // Start pit stop after countdown
                }, 800);
            }, 500);
        }
    }, 800);
}
