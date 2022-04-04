var startButton = document.getElementById("start-button");
var stopButton = document.getElementById("stop-button");
var resetButton = document.getElementById("reset-button");
var lapButton = document.getElementById("click", "lap-button");

var timer = document.getElementById("timer");
var sec = 0;
var min = 0;
var hour = 0;
var timerId;
var stop = true;
startButton.addEventListener("click", startTimer);
stopButton.addEventListener("click", stopTimer);
resetButton.addEventListener("click", resetTimer);

function startTimer(){
    if(stop == true){
        stop = false;
        stopWatch();
    }
    else{
        stopTimer();
        startTimer();
    }
}

function stopTimer(){
    if(stop == false){
        stop = true;
        clearInterval(timerId);
        showTimer();
        sec = 0;
        min = 0;
        hour = 0;
    }
}


function stopWatch(){
    if(stop == false){
        sec = parseInt(sec);
        min = parseInt(min);
        hour = parseInt(hour);
        sec+=1;
        if(sec == 60){
            min += 1;
            sec = 0;
        }
        if(min == 60){
            hour += 1;
            sec = 0;
            min = 0;
        }

        showTimer();
    }

    timerId = setTimeout(() => {
        stopWatch()
    }, 1000);
}

function showTimer(){
    if(stop == false){
        if (sec < 10 || sec == 0) {
        sec = '0' + sec;
        }
        if (min < 10 || min == 0) {
        min = '0' + min;
        }
        if (hour < 10 || hour == 0) {
        hour = '0' + hour;
        }
    }
    

    timer.innerHTML = `${hour}:${min}:${sec}`;
}

function resetTimer(){
    timer.innerHTML = "00:00:00";
    sec = 0;
    min == 0;
    hour = 0;
    stop = true;
}
