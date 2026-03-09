let timerElement;
let timerButton;
var startTime = Date.now();
var timerRunning = false;
var timer;
var time; 

document.addEventListener("DOMContentLoaded", function (e) {
    timerElement = document.getElementById('timer');
    timerButton = document.getElementById('timer-button');
});

function timerPress() {
    if (timerRunning) {
        submitTime();
        clearInterval(timer);
        timerRunning = false;
        timerButton.innerHTML = "New Timer"
    } else {
        timerRunning = true;
        timerButton.innerHTML = "Stop Timer"
        startTime = Date.now(); // set the start time
        timer = setInterval(() => {
            time = Date.now() - startTime;
            var minutes = Math.floor(time / 60000);
            var seconds = Math.floor((time % 60000) / 1000);
            var cs = Math.floor((time % 1000) / 10); // centiseconds
            minutes = String(minutes).padStart(2, '0');
            seconds = String(seconds).padStart(2, '0');
            cs = String(cs).padStart(2, '0');
            timerElement.innerHTML = `${minutes}:${seconds}.${cs}`;
        }, 10);
    } 
}

async function submitTime() {
    try {
        const responce = await fetch('/entry', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: time, timestamp: Date.now() }),
        });
    } catch (error) {
        
    }
}
