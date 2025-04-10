// Helper: add leading zero to numbers < 10
function zfill(num) {
    return num.toString().padStart(2, '0');
  }
  
  // Digital Clock – updates every second
  function updateClock() {
    const now = new Date();
    const hh = zfill(now.getHours());
    const mm = zfill(now.getMinutes());
    const ss = zfill(now.getSeconds());
    document.getElementById('clock-display').textContent = `${hh}:${mm}:${ss}`;
  }
  
  setInterval(updateClock, 1000);
  updateClock(); // Initial call
  // Alarm
let alarmTimeout = null;
const alarmSound = document.getElementById('alarm-sound');
const alarmInput = document.getElementById('alarm-time');
const setAlarmBtn = document.getElementById('set-alarm');
const stopAlarmBtn = document.getElementById('stop-alarm');

setAlarmBtn.addEventListener('click', () => {
  if (alarmInput.value) {
    const [alarmHour, alarmMinute] = alarmInput.value.split(':').map(Number);
    const now = new Date();
    const alarmTime = new Date();
    alarmTime.setHours(alarmHour, alarmMinute, 0, 0);

    if (alarmTime <= now) {
      alarmTime.setDate(alarmTime.getDate() + 1);
    }

    const timeToAlarm = alarmTime - now;

    if (alarmTimeout) clearTimeout(alarmTimeout);

    alarmTimeout = setTimeout(() => {
      alarmSound.loop = true;
      alarmSound.play();
      stopAlarmBtn.disabled = false;
      alert('⏰ Alarm is ringing!');
    }, timeToAlarm);

    stopAlarmBtn.disabled = true;
  }
});

stopAlarmBtn.addEventListener('click', () => {
  alarmSound.pause();
  alarmSound.currentTime = 0;
  alarmSound.loop = false;
  stopAlarmBtn.disabled = true;
  if (alarmTimeout) {
    clearTimeout(alarmTimeout);
    alarmTimeout = null;
  }
});
// Stopwatch
let swInterval = null;
let swStartTime = 0;
let swElapsed = 0;

const swDisplay = document.getElementById('stopwatch-display');
const swStartBtn = document.getElementById('start-stopwatch');
const swResetBtn = document.getElementById('reset-stopwatch');

swStartBtn.addEventListener('click', () => {
  if (swInterval) {
    // Pause
    clearInterval(swInterval);
    swInterval = null;
    swElapsed += Date.now() - swStartTime;
    swStartBtn.textContent = 'Continue';
    swResetBtn.disabled = false;
  } else {
    // Start or Continue
    swStartTime = Date.now();
    swInterval = setInterval(() => {
      const elapsed = swElapsed + (Date.now() - swStartTime);
      const hrs = Math.floor(elapsed / 3600000);
      const mins = Math.floor((elapsed % 3600000) / 60000);
      const secs = Math.floor((elapsed % 60000) / 1000);
      swDisplay.textContent = `${zfill(hrs)}:${zfill(mins)}:${zfill(secs)}`;
    }, 1000);
    swStartBtn.textContent = 'Pause';
    swResetBtn.disabled = true;
  }
});

swResetBtn.addEventListener('click', () => {
  if (swInterval) {
    clearInterval(swInterval);
    swInterval = null;
  }
  swElapsed = 0;
  swDisplay.textContent = '00:00:00';
  swStartBtn.textContent = 'Start';
  swResetBtn.disabled = true;
});
// Countdown Timer
let timerInterval = null;
let timerRemaining = 0;

const timerDisplay = document.getElementById('timer-display');
const timerH = document.getElementById('timer-h');
const timerM = document.getElementById('timer-m');
const timerS = document.getElementById('timer-s');
const timerStartBtn = document.getElementById('start-timer');
const timerResetBtn = document.getElementById('reset-timer');

timerStartBtn.addEventListener('click', () => {
  if (timerInterval) {
    // Pause
    clearInterval(timerInterval);
    timerInterval = null;
    timerStartBtn.textContent = 'Continue';
  } else {
    if (timerStartBtn.textContent === 'Continue' && timerRemaining > 0) {
      timerInterval = setInterval(countdownTick, 1000);
      timerStartBtn.textContent = 'Pause';
    } else {
      const hours = parseInt(timerH.value) || 0;
      const mins = parseInt(timerM.value) || 0;
      const secs = parseInt(timerS.value) || 0;
      const total = hours * 3600 + mins * 60 + secs;

      if (total > 0) {
        timerRemaining = total;
        timerInterval = setInterval(countdownTick, 1000);
        timerStartBtn.textContent = 'Pause';
        timerResetBtn.disabled = false;
        timerH.disabled = timerM.disabled = timerS.disabled = true;
      }
    }
  }
});

timerResetBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  timerInterval = null;
  timerRemaining = 0;
  timerDisplay.textContent = '00:00:00';
  timerStartBtn.textContent = 'Start';
  timerH.disabled = timerM.disabled = timerS.disabled = false;
  timerResetBtn.disabled = true;
});

function countdownTick() {
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
      alarmSound.loop = false;
      alarmSound.play();
    } catch (e) {}
    timerStartBtn.textContent = 'Start';
    timerH.disabled = timerM.disabled = timerS.disabled = false;
    timerResetBtn.disabled = true;
  }
}
