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
