// ===== Helper: Add leading zero =====
function zfill(num) {
  return num.toString().padStart(2, '0');
}

// ===== Digital Clock =====
let is24Hour = true;
function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = zfill(now.getMinutes());
  const seconds = zfill(now.getSeconds());
  let display = '';
  if (!is24Hour) {
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    display = `${zfill(hours)}:${minutes}:${seconds} ${ampm}`;
  } else {
    display = `${zfill(hours)}:${minutes}:${seconds}`;
  }
  document.getElementById('clock-display').textContent = display;
}
setInterval(updateClock, 1000);
updateClock();

// ===== Alarm =====
let alarmTimeout = null;
const alarmSound = document.getElementById('alarm-sound');
const alarmInput = document.getElementById('alarm-time');
const setAlarmBtn = document.getElementById('set-alarm');
const stopAlarmBtn = document.getElementById('stop-alarm');

setAlarmBtn.addEventListener('click', () => {
  if (alarmInput.value) {
    const [hour, minute] = alarmInput.value.split(":").map(Number);
    const now = new Date();
    const alarm = new Date();
    alarm.setHours(hour, minute, 0, 0);
    if (alarm < now) alarm.setDate(alarm.getDate() + 1);
    const timeout = alarm.getTime() - now.getTime();
    alarmTimeout = setTimeout(() => {
      alarmSound.loop = true;
      alarmSound.play();
      stopAlarmBtn.disabled = false;
      alert("⏰ Alarm is ringing!");
    }, timeout);
    stopAlarmBtn.disabled = true;
  }
});

stopAlarmBtn.addEventListener('click', () => {
  alarmSound.pause();
  alarmSound.currentTime = 0;
  alarmSound.loop = false;
  clearTimeout(alarmTimeout);
  stopAlarmBtn.disabled = true;
});

// ===== Stopwatch =====
let stopwatchInterval;
let stopwatchTime = 0;
const stopwatchDisplay = document.getElementById('stopwatch-display');
const startStopwatch = document.getElementById('start-stopwatch');
const resetStopwatch = document.getElementById('reset-stopwatch');

startStopwatch.addEventListener('click', () => {
  if (stopwatchInterval) {
    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
    startStopwatch.textContent = "Continue";
    resetStopwatch.disabled = false;
  } else {
    const start = Date.now() - stopwatchTime;
    stopwatchInterval = setInterval(() => {
      stopwatchTime = Date.now() - start;
      const hrs = Math.floor(stopwatchTime / 3600000);
      const mins = Math.floor((stopwatchTime % 3600000) / 60000);
      const secs = Math.floor((stopwatchTime % 60000) / 1000);
      stopwatchDisplay.textContent = `${zfill(hrs)}:${zfill(mins)}:${zfill(secs)}`;
    }, 1000);
    startStopwatch.textContent = "Pause";
    resetStopwatch.disabled = true;
  }
});

resetStopwatch.addEventListener('click', () => {
  clearInterval(stopwatchInterval);
  stopwatchTime = 0;
  stopwatchDisplay.textContent = "00:00:00";
  startStopwatch.textContent = "Start";
  resetStopwatch.disabled = true;
});

// ===== Timer =====
let timerInterval;
let timerRemaining = 0;
const timerDisplay = document.getElementById('timer-display');
const timerStart = document.getElementById('start-timer');
const timerReset = document.getElementById('reset-timer');
const timerH = document.getElementById('timer-h');
const timerM = document.getElementById('timer-m');
const timerS = document.getElementById('timer-s');

timerStart.addEventListener('click', () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    timerStart.textContent = 'Continue';
  } else {
    if (timerStart.textContent === 'Continue' && timerRemaining > 0) {
      timerInterval = setInterval(runTimer, 1000);
      timerStart.textContent = 'Pause';
    } else {
      const h = parseInt(timerH.value) || 0;
      const m = parseInt(timerM.value) || 0;
      const s = parseInt(timerS.value) || 0;
      timerRemaining = h * 3600 + m * 60 + s;
      if (timerRemaining > 0) {
        timerInterval = setInterval(runTimer, 1000);
        timerStart.textContent = 'Pause';
        timerReset.disabled = false;
        timerH.disabled = timerM.disabled = timerS.disabled = true;
      }
    }
  }
});

timerReset.addEventListener('click', () => {
  clearInterval(timerInterval);
  timerInterval = null;
  timerRemaining = 0;
  timerDisplay.textContent = '00:00:00';
  timerStart.textContent = 'Start';
  timerH.disabled = timerM.disabled = timerS.disabled = false;
  timerReset.disabled = true;
});

function runTimer() {
  if (timerRemaining > 0) {
    timerRemaining--;
    const hrs = Math.floor(timerRemaining / 3600);
    const mins = Math.floor((timerRemaining % 3600) / 60);
    const secs = timerRemaining % 60;
    timerDisplay.textContent = `${zfill(hrs)}:${zfill(mins)}:${zfill(secs)}`;
  } else {
    clearInterval(timerInterval);
    timerInterval = null;
    alert('⏳ Time is up!');
    try {
      alarmSound.play();
    } catch (e) {}
    timerStart.textContent = 'Start';
    timerH.disabled = timerM.disabled = timerS.disabled = false;
    timerReset.disabled = true;
  }
}

// ===== World Clock =====
const worldTimeEls = document.querySelectorAll('.world-time');
function updateWorldClocks() {
  worldTimeEls.forEach(el => {
    const tz = el.dataset.timezone;
    const now = new Date().toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: tz
    });
    el.querySelector('span').textContent = now;
  });
}
setInterval(updateWorldClocks, 1000);
updateWorldClocks();

// ===== Fullscreen Toggle =====
document.getElementById('fullscreen-btn').addEventListener('click', () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

// ===== Toggle Format 12h/24h =====
document.getElementById('toggle-format').addEventListener('click', function () {
  is24Hour = !is24Hour;
  this.textContent = is24Hour ? 'Switch to 12h' : 'Switch to 24h';
  updateClock();
});

// ===== Toggle Sound On/Off =====
let soundOn = true;
document.getElementById('toggle-sound').addEventListener('click', function () {
  soundOn = !soundOn;
  alarmSound.muted = !soundOn;
  this.textContent = soundOn ? 'Sound: On' : 'Sound: Off';
});
