artButton.addEventListener("click", () => {
    stopTrafficLight(); // Reset before starting
    startTrafficLight();
    speak("Traffic light simulation started.");
});

stopButton.addEventListener("click", stopTrafficLight);
