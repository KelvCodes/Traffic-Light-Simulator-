
const redLight = document.querySelector(".red");
const yellowLight = document.querySelector(".yellow");
const greenLight = document.querySelector(".green");
const statusMessage = document.getElementById("status-message");
const countdown = document.getElementById("countdown");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const pauseButton = document.getElementById("pause");
const resetButton = document.getElementById("reset");
const themeToggle = document.getElementById("theme-toggle");
const intervalSlider = document.getElementById("interval-slider");
const intervalValue = document.getElementById("interval-value");
const randomModeCheckbox = document.getElementById("random-mode");
const sequenceInput = document.getElementById("sequence-input");
const applySequenceButton = document.getElementById("apply-sequence");
const historyList = document.getElementById("history-list");
const cycleCountDisplay = document.getElementById("cycle-count");
const redTimeDisplay = document.getElementById("red-time");
const yellowTimeDisplay = document.getElementById("yellow-time");
const greenTimeDisplay = document.getElementById("green-time");

const redSound = document.getElementById("red-sound");
const yellowSound = document.getElementById("yellow-sound");
const greenSound = document.getElementById("green-sound");

let interval = null;
let paused = false;
let timeLeft = parseInt(intervalSlider.value);
let step = 0;
let isRunning = false;
let customSequence = [];
let useCustomSequence = false;
let randomMode = false;
let stats = { cycles: 0, redTime: 0, yellowTime: 0, greenTime: 0 };

// Load settings from localStorage
function loadSettings() {
    const savedInterval = localStorage.getItem("interval");
    const savedRandom = localStorage.getItem("randomMode");
    const savedSequence = localStorage.getItem("sequence");
    if (savedInterval) {
        intervalSlider.value = savedInterval;
        intervalValue.textContent = savedInterval;
        timeLeft = parseInt(savedInterval);
        countdown.textContent = timeLeft;
    }
    if (savedRandom) {
        randomModeCheckbox.checked = savedRandom === "true";
        randomMode = randomModeCheckbox.checked;
    }
    if (savedSequence) {
        sequenceInput.value = savedSequence;
        parseCustomSequence(savedSequence);
    }
}

// Save settings to localStorage
function saveSettings() {
    localStorage.setItem("interval", intervalSlider.value);
    localStorage.setItem("randomMode", randomModeCheckbox.checked.toString());
    localStorage.setItem("sequence", sequenceInput.value);
}

// Theme toggle
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
    speak(document.body.classList.contains("dark") ? "Dark mode enabled." : "Light mode enabled.");
});

// Interval slider update
intervalSlider.addEventListener("input", () => {
    intervalValue.textContent = intervalSlider.value;
    timeLeft = parseInt(intervalSlider.value);
    countdown.textContent = timeLeft;
    saveSettings();
    if (isRunning && !paused) restartSimulation();
});

// Random mode toggle
randomModeCheckbox.addEventListener("change", () => {
    randomMode = randomModeCheckbox.checked;
    saveSettings();
    if (isRunning && !paused) restartSimulation();
});

// Custom sequence handler
applySequenceButton.addEventListener("click", () => {
    const sequence = sequenceInput.value.trim().toUpperCase();
    parseCustomSequence(sequence);
    saveSettings();
    if (isRunning && !paused) restartSimulation();
});

function parseCustomSequence(sequence) {
    customSequence = sequence.split(",").map(s => s.trim());
    useCustomSequence = customSequence.every(s => ["R", "Y", "G"].includes(s)) && customSequence.length > 0;
    if (!useCustomSequence) {
        statusMessage.textContent = "Invalid sequence! Use R, Y, G (e.g., R,Y,G)";
        speak("Invalid sequence entered.");
    } else {
        statusMessage.textContent = "Custom sequence applied.";
        speak("Custom sequence applied.");
    }
}

// Start simulation
function startTrafficLight() {
    if (isRunning) stopTrafficLight();
    isRunning = true;
    timeLeft = parseInt(intervalSlider.value);
    countdown.textContent = timeLeft;
    updateLight();
    runSimulation();
    speak("Traffic light simulation started.");
}

// Run the simulation loop
function runSimulation() {
    interval = setInterval(() => {
        if (!paused) {
            timeLeft--;
            countdown.textContent = timeLeft;
            if (timeLeft <= 0) {
                updateStats();
                resetLights();
                updateLight();
                timeLeft = parseInt(intervalSlider.value);
                countdown.textContent = timeLeft;
            }
        }
    }, 1000);
}

// Update light based on mode
function updateLight() {
    resetLights();
    let light, message, sound;
    if (randomMode) {
        const lights = ["R", "Y", "G"];
        light = lights[Math.floor(Math.random() * lights.length)];
    } else if (useCustomSequence) {
        light = customSequence[step % customSequence.length];
    } else {
        light = step === 0 ? "R" : step === 1 ? "Y" : "G";
    }

    if (light === "R") {
        redLight.classList.add("active");
        message = "Stop, the light is red.";
        sound = redSound;
    } else if (light === "Y") {
        yellowLight.classList.add("active");
        message = "Get ready, the light is yellow.";
        sound = yellowSound;
    } else {
        greenLight.classList.add("active");
        message = "Walk now, the light is green.";
        sound = greenSound;
        vibrateFeedback();
    }

    speak(message);
    sound.play().catch(() => console.log("Audio playback failed."));
    logHistory(message);
    if (!randomMode && !useCustomSequence) step = (step + 1) % 3;
    else if (useCustomSequence) step = (step + 1) % customSequence.length;
}

// Reset lights
function resetLights() {
    redLight.classList.remove("active");
    yellowLight.classList.remove("active");
    greenLight.classList.remove("active");
}

// Stop simulation
function stopTrafficLight() {
    clearInterval(interval);
    interval = null;
    isRunning = false;
    paused = false;
    resetLights();
    timeLeft = parseInt(intervalSlider.value);
    countdown.textContent = timeLeft;
    statusMessage.textContent = "Simulation stopped.";
    speak("Filtering stopped.");
}

// Pause simulation
function pauseTrafficLight() {
    paused = !paused;
    statusMessage.textContent = paused ? "Simulation paused." : "Simulation resumed.";
    speak(paused ? "Simulation paused." : "Simulation resumed.");
}

// Reset simulation
function resetTrafficLight() {
    stopTrafficLight();
    step = 0;
    stats = { cycles: 0, redTime: 0, yellowTime: 0, greenTime: 0 };
    updateStatsDisplay();
    historyList.innerHTML = "";
    statusMessage.textContent = "Press 'Start' to begin.";
    speak("Simulation reset.");
}

// Restart simulation with new settings
function restartSimulation() {
    stopTrafficLight();
    startTrafficLight();
}

// Speech synthesis
function speak(message) {
    const speech = new SpeechSynthesisUtterance(message);
    speech.lang = "en-US";
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
    statusMessage.textContent = message;
}

// Vibration feedback
function vibrateFeedback() {
    if (navigator.vibrate) {
        navigator.vibrate([500, 200, 500]);
    }
}

// Log light changes to history
function logHistory(message) {
    const li = document.createElement("li");
    li.textContent = `${new Date().toLocaleTimeString()} - ${message}`;
    historyList.prepend(li);
    if (historyList.children.length > 10) {
        historyList.removeChild(historyList.lastChild);
    }
}

// Update statistics
function updateStats() {
    stats.cycles++;
    if (redLight.classList.contains("active")) stats.redTime += parseInt(intervalSlider.value);
    if (yellowLight.classList.contains("active")) stats.yellowTime += parseInt(intervalSlider.value);
    if (greenLight.classList.contains("active")) stats.greenTime += parseInt(intervalSlider.value);
    updateStatsDisplay();
}

function updateStatsDisplay() {
    cycleCountDisplay.textContent = stats.cycles;
    redTimeDisplay.textContent = stats.redTime;
    yellowTimeDisplay.textContent = stats.yellowTime;
    greenTimeDisplay.textContent = stats.greenTime;
}

// Event listeners
startButton.addEventListener("click", startTrafficLight);
stopButton.addEventListener("click", stopTrafficLight);
pauseButton.addEventListener("click", pauseTrafficLight);
resetButton.addEventListener("click", resetTrafficLight);

// Initialize settings
loadSettings();
