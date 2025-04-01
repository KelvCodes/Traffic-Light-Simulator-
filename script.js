  greenLight.classList.add("active");
            speak("Walk now, the light is green.");
            vibrateFeedback();
        }

        step = (step + 1) % 3;
    }, 3000); // Change light every 3 seconds
}

// Function to reset all lights
function resetLights() {
    redLight.classList.remove("active");
    yellowLight.classList.remove("active");
    greenLight.classList.remove("active");
}

// Function to stop the traffic light
function stopTrafficLight() {
    clearInterval(interval);
    resetLights();
    statusMessage.textContent = "Simulation stopped.";
    speak("Simulation stopped.");
}

// Function to provide voice feedback using Speech Synthesis API
function speak(message) {
    let speech = new SpeechSynthesisUtterance(message);
    speech.lang = "en-US";
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
    statusMessage.textContent = message;
}

// Function to provide vibration feedback (for mobile users)
function vibrateFeedback() {
    if (navigator.vibrate) {
        navigator.vibrate([500, 200, 500]); // Vibrate pattern: 500ms, pause, 500ms
    }
}

// Event listeners for buttons
startButton.addEventListener("click", () => {
    stopTrafficLight(); // Reset before starting
    startTrafficLight();
    speak("Traffic light simulation started.");
});

stopButton.addEventListener("click", stopTrafficLight);
