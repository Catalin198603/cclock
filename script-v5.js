const $=id=>document.getElementById(id), zfill=n=>String(n).padStart(2,'0');
let is24Hour=true,soundOn=true;
const alarmSound=$('alarm-sound');
const clockDisplay=$('clock-display'),dateDisplay=$('date-display'),timezoneDisplay=$('timezone-display');
const dateFormatter=new Intl.DateTimeFormat('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
const timezone=Intl.DateTimeFormat().resolvedOptions().timeZone.replace('_',' ');
let lastDate='';
function updateClock(){
  const now=new Date(); let h=now.getHours(),suffix='';
  if(!is24Hour){suffix=h>=12?' PM':' AM';h=h%12||12}
  clockDisplay.innerHTML=`${zfill(h)}:${zfill(now.getMinutes())}:<span>${zfill(now.getSeconds())}</span>${suffix}`;
  const dateKey=now.toDateString();
  if(dateKey!==lastDate){dateDisplay.textContent=dateFormatter.format(now);lastDate=dateKey}
}
timezoneDisplay.textContent=timezone;
updateClock();
setInterval(updateClock,1000);

const full=()=>!document.fullscreenElement?document.documentElement.requestFullscreen():document.exitFullscreen();
$('fullscreen-btn').onclick=full;$('hero-fullscreen').onclick=full;
$('toggle-format').onclick=function(){is24Hour=!is24Hour;this.textContent=is24Hour?'24H':'12H';updateClock()};
$('toggle-sound').onclick=function(){soundOn=!soundOn;alarmSound.muted=!soundOn;this.textContent=soundOn?'♪ Sound On':'♪ Sound Off'};
$('theme-toggle').onclick=function(){document.body.classList.toggle('light');this.textContent=document.body.classList.contains('light')?'☀':'☾'};

let alarmTimeout=null;const alarmInput=$('alarm-time'),stopAlarm=$('stop-alarm'),alarmStatus=$('alarm-status');
$('set-alarm').onclick=()=>{if(!alarmInput.value)return;clearTimeout(alarmTimeout);const [h,m]=alarmInput.value.split(':').map(Number),now=new Date(),at=new Date();at.setHours(h,m,0,0);if(at<=now)at.setDate(at.getDate()+1);alarmTimeout=setTimeout(()=>{alarmSound.loop=true;alarmSound.play().catch(()=>{});stopAlarm.disabled=false;alarmStatus.textContent='Alarm is ringing!'},at-now);alarmStatus.textContent=`Alarm set for ${alarmInput.value}`;stopAlarm.disabled=false};
stopAlarm.onclick=()=>{clearTimeout(alarmTimeout);alarmSound.pause();alarmSound.currentTime=0;alarmSound.loop=false;stopAlarm.disabled=true;alarmStatus.textContent='No alarm set'};

function formatHMSms(ms){ms=Math.max(0,ms);const hrs=Math.floor(ms/3600000),mins=Math.floor(ms%3600000/60000),secs=Math.floor(ms%60000/1000),msec=Math.floor(ms%1000);return `${zfill(hrs)}:${zfill(mins)}:${zfill(secs)}.${String(msec).padStart(3,'0')}`}
function formatMSms(ms){ms=Math.max(0,ms);const totalSec=Math.floor(ms/1000),mins=Math.floor(totalSec/60),secs=totalSec%60,msec=Math.floor(ms%1000);return `${zfill(mins)}:${zfill(secs)}.${String(msec).padStart(3,'0')}`}

let swFrame=0,swTime=0,swStartedAt=0;const swDisplay=$('stopwatch-display'),swStart=$('start-stopwatch'),swReset=$('reset-stopwatch');
function swTick(){swTime=performance.now()-swStartedAt;swDisplay.textContent=formatHMSms(swTime);swFrame=requestAnimationFrame(swTick)}
swStart.onclick=()=>{if(swFrame){cancelAnimationFrame(swFrame);swFrame=0;swTime=performance.now()-swStartedAt;swStart.textContent='Continue';swReset.disabled=false}else{swStartedAt=performance.now()-swTime;swFrame=requestAnimationFrame(swTick);swStart.textContent='Pause';swReset.disabled=true}};
swReset.onclick=()=>{if(swFrame)cancelAnimationFrame(swFrame);swFrame=0;swTime=0;swDisplay.textContent='00:00:00.000';swStart.textContent='Start';swReset.disabled=true};

let timerFrame=0,timerRemainingMs=0,timerEnd=0;const td=$('timer-display'),ts=$('start-timer'),tr=$('reset-timer'),th=$('timer-h'),tm=$('timer-m'),tsec=$('timer-s');
function showTimer(){td.textContent=formatHMSms(timerRemainingMs)}
function tickTimer(){timerRemainingMs=Math.max(0,timerEnd-performance.now());showTimer();if(timerRemainingMs<=0){timerFrame=0;ts.textContent='Start';if(soundOn)alarmSound.play().catch(()=>{});th.disabled=tm.disabled=tsec.disabled=false;return}timerFrame=requestAnimationFrame(tickTimer)}
ts.onclick=()=>{if(timerFrame){timerRemainingMs=Math.max(0,timerEnd-performance.now());cancelAnimationFrame(timerFrame);timerFrame=0;ts.textContent='Continue';return}if(timerRemainingMs<=0)timerRemainingMs=((+th.value||0)*3600+(+tm.value||0)*60+(+tsec.value||0))*1000;if(timerRemainingMs>0){timerEnd=performance.now()+timerRemainingMs;showTimer();timerFrame=requestAnimationFrame(tickTimer);ts.textContent='Pause';tr.disabled=false;th.disabled=tm.disabled=tsec.disabled=true}};
tr.onclick=()=>{if(timerFrame)cancelAnimationFrame(timerFrame);timerFrame=0;timerRemainingMs=0;td.textContent='00:00:00.000';ts.textContent='Start';tr.disabled=true;th.disabled=tm.disabled=tsec.disabled=false};
document.querySelectorAll('[data-minutes]').forEach(b=>b.onclick=()=>{if(timerFrame)cancelAnimationFrame(timerFrame);timerFrame=0;timerRemainingMs=+b.dataset.minutes*60000;th.value=Math.floor(timerRemainingMs/3600000);tm.value=Math.floor(timerRemainingMs%3600000/60000);tsec.value=0;showTimer();ts.textContent='Start';th.disabled=tm.disabled=tsec.disabled=false;tr.disabled=false});

const worldEls=[...document.querySelectorAll('.world-time')];
function updateWorld(){const now=new Date();worldEls.forEach(el=>el.querySelector('span').textContent=now.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit',timeZone:el.dataset.timezone}))}
const startWorld=()=>{updateWorld();setInterval(updateWorld,1000)};
if('requestIdleCallback'in window)requestIdleCallback(startWorld,{timeout:1800});else setTimeout(startWorld,600);

let pomoFrame=0,pomoRemainingMs=25*60000,pomoSelected=25,pomoEnd=0;const pd=$('pomodoro-display'),ps=$('pomodoro-start');
function showPomo(){pd.textContent=formatMSms(pomoRemainingMs)}
function tickPomo(){pomoRemainingMs=Math.max(0,pomoEnd-performance.now());showPomo();if(pomoRemainingMs<=0){pomoFrame=0;ps.textContent='Start';if(soundOn)alarmSound.play().catch(()=>{});return}pomoFrame=requestAnimationFrame(tickPomo)}
document.querySelectorAll('[data-pomodoro]').forEach(b=>b.onclick=()=>{if(pomoFrame)cancelAnimationFrame(pomoFrame);pomoFrame=0;pomoSelected=+b.dataset.pomodoro;pomoRemainingMs=pomoSelected*60000;ps.textContent='Start';showPomo()});
ps.onclick=()=>{if(pomoFrame){pomoRemainingMs=Math.max(0,pomoEnd-performance.now());cancelAnimationFrame(pomoFrame);pomoFrame=0;ps.textContent='Continue'}else if(pomoRemainingMs>0){pomoEnd=performance.now()+pomoRemainingMs;pomoFrame=requestAnimationFrame(tickPomo);ps.textContent='Pause'}};
$('pomodoro-reset').onclick=()=>{if(pomoFrame)cancelAnimationFrame(pomoFrame);pomoFrame=0;pomoRemainingMs=pomoSelected*60000;ps.textContent='Start';showPomo()};

const homeAlarmPicker=$('home-alarm-picker');
if(homeAlarmPicker&&alarmInput){homeAlarmPicker.addEventListener('click',()=>{try{if(typeof alarmInput.showPicker==='function')alarmInput.showPicker();else{alarmInput.focus();alarmInput.click()}}catch(e){alarmInput.focus();alarmInput.click()}})}
