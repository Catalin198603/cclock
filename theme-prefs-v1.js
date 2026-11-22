(()=>{'use strict';
const KEY='cclock_ui_prefs_v1';

function readPrefs(){
  try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(e){return {}}
}
function saveTheme(theme){
  try{
    const current=readPrefs();
    localStorage.setItem(KEY,JSON.stringify({...current,theme}));
  }catch(e){}
}
function applySavedTheme(){
  const prefs=readPrefs();
  document.body.classList.toggle('light',prefs.theme==='light');
}
function bindThemeToggle(){
  const btn=document.getElementById('theme-toggle');
  if(!btn)return;
  btn.textContent=document.body.classList.contains('light')?'☀':'☾';
  btn.setAttribute('aria-label','Toggle theme');
  btn.onclick=()=>{
    const light=document.body.classList.toggle('light');
    btn.textContent=light?'☀':'☾';
    saveTheme(light?'light':'dark');
    const selected=document.querySelector('.clock-color[aria-pressed="true"]');
    const clock=document.getElementById('clock-display');
    if(selected&&clock){
      const color=selected.dataset.color||'#ffffff';
      clock.style.setProperty('--clock-color',color);
      clock.style.setProperty('color',color,'important');
    }
  };
}
applySavedTheme();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bindThemeToggle,{once:true});
else bindThemeToggle();
})();