(()=>{'use strict';
const allowed=new Set([
  '/','/index.html','/timer.html','/stopwatch.html','/alarm.html',
  '/pomodoro-timer.html','/world-clock.html',
  '/5-minute-timer.html','/10-minute-timer.html','/15-minute-timer.html',
  '/30-minute-timer.html','/1-hour-timer.html'
]);

let shell=null,frame=null,active=false,currentPath='/';

function ensureShell(){
  if(shell)return;
  shell=document.createElement('div');
  shell.id='fullscreen-app-shell';
  shell.setAttribute('aria-hidden','true');

  frame=document.createElement('iframe');
  frame.id='fullscreen-app-frame';
  frame.title='cClock fullscreen app';
  frame.setAttribute('allow','fullscreen');
  shell.appendChild(frame);
  document.body.appendChild(shell);

  frame.addEventListener('load',()=>{
    if(!active)return;
    try{
      const u=new URL(frame.contentWindow.location.href);
      if(u.origin===location.origin && allowed.has(u.pathname)){
        currentPath=u.pathname+(u.search||'')+(u.hash||'');
        history.replaceState({cclockFullscreen:true},'',currentPath);
      }
    }catch(e){}
  });
}

function openInShell(url){
  ensureShell();
  const u=new URL(url,location.href);
  if(u.origin!==location.origin || !allowed.has(u.pathname))return false;
  currentPath=u.pathname+(u.search||'')+(u.hash||'');
  frame.src=currentPath;
  shell.classList.add('active');
  shell.setAttribute('aria-hidden','false');
  active=true;
  history.replaceState({cclockFullscreen:true},'',currentPath);
  return true;
}

function closeShell(navigate){
  if(!shell||!active)return;
  const target=currentPath;
  active=false;
  shell.classList.remove('active');
  shell.setAttribute('aria-hidden','true');
  frame.removeAttribute('src');
  if(navigate && target && target!=='/' && target!=='/index.html'){
    location.href=target;
  }else if(navigate && (target==='/'||target==='/index.html')){
    history.replaceState({},'', '/');
  }
}

document.addEventListener('click',e=>{
  if(!document.fullscreenElement || active)return;
  const a=e.target.closest('a[href]');
  if(!a)return;
  if(a.target && a.target!=='_self')return;
  const href=a.getAttribute('href');
  if(!href || href.startsWith('#'))return;
  let u;
  try{u=new URL(href,location.href)}catch(err){return}
  if(u.origin!==location.origin || !allowed.has(u.pathname))return;
  e.preventDefault();
  openInShell(u.href);
},true);

document.addEventListener('fullscreenchange',()=>{
  if(!document.fullscreenElement && active){
    closeShell(true);
  }
});

window.addEventListener('popstate',()=>{
  if(!active)return;
  const p=location.pathname+(location.search||'')+(location.hash||'');
  if(allowed.has(location.pathname)){
    currentPath=p;
    frame.src=p;
  }
});
})();