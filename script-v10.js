const $=id=>document.getElementById(id), zfill=n=>String(n).padStart(2,'0');
let is24Hour=true,soundOn=true;const UI_KEY='cclock_ui_prefs_v1';let uiPrefs={};try{uiPrefs=JSON.parse(localStorage.getItem(UI_KEY)||'{}')||{}}catch(e){uiPrefs={}}if(typeof uiPrefs.is24Hour==='boolean')is24Hour=uiPrefs.is24Hour;
const alarmSound=$('alarm-sound');
const clockDisplay=$('clock-display'),dateDisplay=$('date-display'),timezoneDisplay=$('timezone-display');
const dateFormatter=new Intl.DateTimeFormat('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
const timezone=Intl.DateTimeFormat().resolvedOptions().timeZone.replace('_',' ');
let lastDate='';
function updateClock(){
  const now=new Date(); let h=now.getHours(),suffix='';
  if(!is24Hour){suffix=h>=12?' PM':' AM';h=h%12||12}
  // Keep the digit DOM stable: replacing innerHTML every second can cause transient glyph painting artifacts.
  const timePrefix=`${zfill(h)}:${zfill(now.getMinutes())}:`;
  const secondText=zfill(now.getSeconds());
  let secondsNode=clockDisplay.querySelector('[data-clock-seconds]');
  if(!secondsNode){
    clockDisplay.replaceChildren(document.createTextNode(timePrefix));
    secondsNode=document.createElement('span');
    secondsNode.dataset.clockSeconds='';
    clockDisplay.appendChild(secondsNode);
    const period=document.createElement('span');
    period.className='clock-period';
    clockDisplay.appendChild(period);
  }
  if(clockDisplay.firstChild.nodeValue!==timePrefix)clockDisplay.firstChild.nodeValue=timePrefix;
  if(secondsNode.textContent!==secondText)secondsNode.textContent=secondText;
  const period=clockDisplay.querySelector('.clock-period');
  if(period.textContent!==suffix.trim())period.textContent=suffix.trim();
  period.hidden=is24Hour;
  clockDisplay.classList.toggle('clock-12h',!is24Hour);
  const dateKey=now.toDateString();
  if(dateKey!==lastDate){dateDisplay.textContent=dateFormatter.format(now);lastDate=dateKey}
}
timezoneDisplay.textContent=timezone;
if(uiPrefs.theme==='light')document.body.classList.add('light');
updateClock();
setInterval(updateClock,1000);

const full=()=>!document.fullscreenElement?document.documentElement.requestFullscreen():document.exitFullscreen();
$('fullscreen-btn').onclick=full;$('hero-fullscreen').onclick=full;
$('toggle-format').textContent=is24Hour?'24H':'12H';$('toggle-format').onclick=function(){is24Hour=!is24Hour;this.textContent=is24Hour?'24H':'12H';try{localStorage.setItem(UI_KEY,JSON.stringify({...uiPrefs,is24Hour,theme:document.body.classList.contains('light')?'light':'dark'}))}catch(e){};uiPrefs={...uiPrefs,is24Hour};updateClock()};
$('toggle-sound').onclick=function(){soundOn=!soundOn;alarmSound.muted=!soundOn;this.textContent=soundOn?'♪ Sound On':'♪ Sound Off'};
$('theme-toggle').textContent=document.body.classList.contains('light')?'☀':'☾';$('theme-toggle').onclick=function(){document.body.classList.toggle('light');const light=document.body.classList.contains('light');this.textContent=light?'☀':'☾';try{localStorage.setItem(UI_KEY,JSON.stringify({...uiPrefs,is24Hour,theme:light?'light':'dark'}))}catch(e){};uiPrefs={...uiPrefs,theme:light?'light':'dark'};const selected=document.querySelector('.clock-color[aria-pressed="true"]');if(selected&&clockDisplay){const c=selected.dataset.color||'#ffffff';clockDisplay.style.setProperty('--clock-color',c);clockDisplay.style.setProperty('color',c,'important')}};

let alarmTimeout=null;const alarmInput=$('alarm-time'),stopAlarm=$('stop-alarm'),alarmStatus=$('alarm-status');
$('set-alarm').onclick=()=>{if(!alarmInput.value)return;clearTimeout(alarmTimeout);const [h,m]=alarmInput.value.split(':').map(Number),now=new Date(),at=new Date();at.setHours(h,m,0,0);if(at<=now)at.setDate(at.getDate()+1);alarmTimeout=setTimeout(()=>{alarmSound.loop=true;alarmSound.play().catch(()=>{});stopAlarm.disabled=false;alarmStatus.textContent='Alarm is ringing!'},at-now);alarmStatus.textContent=`Alarm set for ${alarmInput.value}`;stopAlarm.disabled=false};
stopAlarm.onclick=()=>{clearTimeout(alarmTimeout);alarmSound.pause();alarmSound.currentTime=0;alarmSound.loop=false;stopAlarm.disabled=true;alarmStatus.textContent='No alarm set'};

function formatHMSms(ms){ms=Math.max(0,ms);const hrs=Math.floor(ms/3600000),mins=Math.floor(ms%3600000/60000),secs=Math.floor(ms%60000/1000),msec=Math.floor(ms%1000);return `${zfill(hrs)}:${zfill(mins)}:${zfill(secs)}.${String(msec).padStart(3,'0')}`}
function formatMSms(ms){ms=Math.max(0,ms);const totalSec=Math.floor(ms/1000),mins=Math.floor(totalSec/60),secs=totalSec%60,msec=Math.floor(ms%1000);return `${zfill(mins)}:${zfill(secs)}.${String(msec).padStart(3,'0')}`}

const pulseTitle=(id,on)=>document.querySelector('#'+id+' h2')?.classList.toggle('is-running',on);
let swFrame=0,swTime=0,swStartedAt=0;const swDisplay=$('stopwatch-display'),swStart=$('start-stopwatch'),swReset=$('reset-stopwatch');
function swTick(){swTime=performance.now()-swStartedAt;swDisplay.textContent=formatHMSms(swTime);swFrame=requestAnimationFrame(swTick)}
swStart.onclick=()=>{if(swFrame){cancelAnimationFrame(swFrame);swFrame=0;swTime=performance.now()-swStartedAt;swStart.textContent='Continue';pulseTitle('stopwatch',false);swReset.disabled=false}else{swStartedAt=performance.now()-swTime;swFrame=requestAnimationFrame(swTick);swStart.textContent='Pause';pulseTitle('stopwatch',true);swReset.disabled=true}};
swReset.onclick=()=>{if(swFrame)cancelAnimationFrame(swFrame);swFrame=0;swTime=0;swDisplay.textContent='00:00:00.000';swStart.textContent='Start';pulseTitle('stopwatch',false);swReset.disabled=true};

let timerFrame=0,timerRemainingMs=0,timerEnd=0;const td=$('timer-display'),ts=$('start-timer'),tr=$('reset-timer'),th=$('timer-h'),tm=$('timer-m'),tsec=$('timer-s');
function showTimer(){td.textContent=formatHMSms(timerRemainingMs)}
function tickTimer(){timerRemainingMs=Math.max(0,timerEnd-performance.now());showTimer();if(timerRemainingMs<=0){timerFrame=0;ts.textContent='Start';pulseTitle('timer',false);if(soundOn)alarmSound.play().catch(()=>{});th.disabled=tm.disabled=tsec.disabled=false;return}timerFrame=requestAnimationFrame(tickTimer)}
ts.onclick=()=>{if(timerFrame){timerRemainingMs=Math.max(0,timerEnd-performance.now());cancelAnimationFrame(timerFrame);timerFrame=0;ts.textContent='Continue';pulseTitle('timer',false);return}if(timerRemainingMs<=0)timerRemainingMs=((+th.value||0)*3600+(+tm.value||0)*60+(+tsec.value||0))*1000;if(timerRemainingMs>0){timerEnd=performance.now()+timerRemainingMs;showTimer();timerFrame=requestAnimationFrame(tickTimer);ts.textContent='Pause';pulseTitle('timer',true);tr.disabled=false;th.disabled=tm.disabled=tsec.disabled=true}};
tr.onclick=()=>{if(timerFrame)cancelAnimationFrame(timerFrame);timerFrame=0;timerRemainingMs=0;td.textContent='00:00:00.000';ts.textContent='Start';pulseTitle('timer',false);tr.disabled=true;th.disabled=tm.disabled=tsec.disabled=false};
document.querySelectorAll('[data-minutes]').forEach(b=>b.onclick=()=>{if(timerFrame)cancelAnimationFrame(timerFrame);timerFrame=0;timerRemainingMs=+b.dataset.minutes*60000;th.value=Math.floor(timerRemainingMs/3600000);tm.value=Math.floor(timerRemainingMs%3600000/60000);tsec.value=0;showTimer();ts.textContent='Start';th.disabled=tm.disabled=tsec.disabled=false;tr.disabled=false});

const worldEls=[...document.querySelectorAll('.world-time')];
function updateWorld(){const now=new Date();worldEls.forEach(el=>el.querySelector('span').textContent=now.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit',timeZone:el.dataset.timezone}))}
const startWorld=()=>{updateWorld();setInterval(updateWorld,1000)};
if('requestIdleCallback'in window)requestIdleCallback(startWorld,{timeout:1800});else setTimeout(startWorld,600);

let pomoFrame=0,pomoRemainingMs=25*60000,pomoSelected=25,pomoEnd=0;const pd=$('pomodoro-display'),ps=$('pomodoro-start');
function showPomo(){pd.textContent=formatMSms(pomoRemainingMs)}
function tickPomo(){pomoRemainingMs=Math.max(0,pomoEnd-performance.now());showPomo();if(pomoRemainingMs<=0){pomoFrame=0;ps.textContent='Start';pulseTitle('pomodoro',false);if(soundOn)alarmSound.play().catch(()=>{});return}pomoFrame=requestAnimationFrame(tickPomo)}
document.querySelectorAll('[data-pomodoro]').forEach(b=>b.onclick=()=>{if(pomoFrame)cancelAnimationFrame(pomoFrame);pomoFrame=0;pomoSelected=+b.dataset.pomodoro;pomoRemainingMs=pomoSelected*60000;ps.textContent='Start';pulseTitle('pomodoro',false);showPomo()});
ps.onclick=()=>{if(pomoFrame){pomoRemainingMs=Math.max(0,pomoEnd-performance.now());cancelAnimationFrame(pomoFrame);pomoFrame=0;ps.textContent='Continue';pulseTitle('pomodoro',false)}else if(pomoRemainingMs>0){pomoEnd=performance.now()+pomoRemainingMs;pomoFrame=requestAnimationFrame(tickPomo);ps.textContent='Pause';pulseTitle('pomodoro',true)}};
$('pomodoro-reset').onclick=()=>{if(pomoFrame)cancelAnimationFrame(pomoFrame);pomoFrame=0;pomoRemainingMs=pomoSelected*60000;ps.textContent='Start';pulseTitle('pomodoro',false);showPomo()};

const homeAlarmPicker=$('home-alarm-picker');
if(homeAlarmPicker&&alarmInput){homeAlarmPicker.addEventListener('click',()=>{try{if(typeof alarmInput.showPicker==='function')alarmInput.showPicker();else{alarmInput.focus();alarmInput.click()}}catch(e){alarmInput.focus();alarmInput.click()}})}


// cclock-3 desktop appearance preferences
(()=>{
  const display=document.getElementById('clock-display');
  const minus=document.getElementById('clock-size-minus');
  const plus=document.getElementById('clock-size-plus');
  const paletteToggle=document.getElementById('clock-palette-toggle');
  const palette=document.getElementById('clock-palette');
  const colors=[...document.querySelectorAll('.clock-color')];
  if(!display||!minus||!plus)return;

  const KEY='cclock_desktop_prefs_v1';
  let saved={};
  try{saved=JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(e){saved={}}
  let scale=typeof saved.scale==='number'?Math.min(1.25,Math.max(.75,saved.scale)):.75;
  const allowedColors=colors.map(x=>x.dataset.color);let color=typeof saved.color==='string'&&allowedColors.includes(saved.color)?saved.color:'#ffffff';

  const persist=()=>{
    try{
      const current=JSON.parse(localStorage.getItem(KEY)||'{}')||{};
      localStorage.setItem(KEY,JSON.stringify({...current,scale,color}));
    }catch(e){}
  };
  const applyScale=()=>{
    display.style.setProperty('--clock-scale',scale.toFixed(2));
    minus.disabled=scale<=.75;
    plus.disabled=scale>=1.25;
  };
  const applyColor=()=>{
    display.style.setProperty('--clock-color',color);
    display.style.setProperty('color',color,'important');
    colors.forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.color===color)));
  };

  minus.addEventListener('click',()=>{scale=Math.max(.75,+(scale-.1).toFixed(2));applyScale();persist()});
  plus.addEventListener('click',()=>{scale=Math.min(1.25,+(scale+.1).toFixed(2));applyScale();persist()});

  if(paletteToggle&&palette){
    paletteToggle.addEventListener('click',e=>{e.stopPropagation();const open=palette.classList.toggle('show');paletteToggle.setAttribute('aria-expanded',String(open));});
    palette.addEventListener('click',e=>e.stopPropagation());
    document.addEventListener('click',()=>{if(palette.classList.contains('show')){palette.classList.remove('show');paletteToggle.setAttribute('aria-expanded','false')}});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&palette.classList.contains('show')){palette.classList.remove('show');paletteToggle.setAttribute('aria-expanded','false');paletteToggle.focus()}});
  }

  colors.forEach(btn=>btn.addEventListener('click',()=>{
    color=btn.dataset.color||'#ffffff';
    applyColor();
    persist();
  }));

  applyScale();
  applyColor();
})();

// cclock-3 desktop background image toggle
(()=>{
  const hero=document.getElementById('clock');
  const toggle=document.getElementById('clock-background-toggle');
  if(!hero||!toggle)return;
  const KEY='cclock_desktop_prefs_v1';let saved={};try{saved=JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(e){saved={}}let photoOn=typeof saved.photoOn==='boolean'?saved.photoOn:true;const applyBg=()=>{hero.classList.toggle('no-photo',!photoOn);toggle.setAttribute('aria-pressed',String(photoOn));toggle.setAttribute('aria-label',photoOn?'Hide background image':'Show background image');toggle.textContent=photoOn?'BG':'BG×'};applyBg();
  toggle.addEventListener('click',()=>{
    photoOn=!photoOn;applyBg();try{const current=JSON.parse(localStorage.getItem(KEY)||'{}')||{};localStorage.setItem(KEY,JSON.stringify({...current,photoOn}))}catch(e){}
  });
})();
