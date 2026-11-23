/* cClock share button — available on every page. */
(function(){
  function initShare(){
    const actions=document.querySelector('.top-actions');
    if(!actions||document.getElementById('cclock-share'))return;
    const style=document.createElement('style');
    style.textContent='#cclock-share{display:inline-flex;align-items:center;justify-content:center;gap:6px;white-space:nowrap}#cclock-share svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}#cclock-share-status{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:9999;padding:11px 18px;background:#202833;color:#fff;border:1px solid #596473;border-radius:10px;font:600 14px system-ui,sans-serif;box-shadow:0 6px 22px #0006}#cclock-share-status[hidden]{display:none}@media(max-width:560px){#cclock-share{min-width:40px;padding:9px!important}#cclock-share .share-label{display:none}.top-actions{gap:5px!important}}';
    document.head.appendChild(style);
    const button=document.createElement('button');
    button.id='cclock-share';button.type='button';button.className='compact-btn';button.title='Share this page';button.setAttribute('aria-label','Share this page');
    button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.7 10.7 15.3 6.3M8.7 13.3l6.6 4.4"/></svg><span class="share-label">Share</span>';
    actions.appendChild(button);
    const status=document.createElement('div');status.id='cclock-share-status';status.setAttribute('role','status');status.hidden=true;document.body.appendChild(status);
    let timeout;
    function notice(message){status.textContent=message;status.hidden=false;clearTimeout(timeout);timeout=setTimeout(()=>{status.hidden=true},3200)}
    button.addEventListener('click',async()=>{
      // Always share the published page URL, even when testing on a preview host.
      const canonical=document.querySelector('link[rel="canonical"]');
      let url;
      try{const candidate=new URL(canonical?.href||location.href);url=candidate.origin==='https://cclock.eu'?candidate.href:new URL(location.pathname.replace(/^\\/cclock\\//,'/'), 'https://cclock.eu').href}catch(e){url='https://cclock.eu/'}
      const data={title:document.title,text:'Check out this cClock tool',url};
      if(navigator.share){try{await navigator.share(data);return}catch(e){if(e.name==='AbortError')return}}
      try{await navigator.clipboard.writeText(url);notice('Link copied! Share it anywhere.');return}catch(e){}
      // Fallback for browsers without clipboard permissions.
      const input=document.createElement('input');input.value=url;input.setAttribute('readonly','');input.style.cssText='position:fixed;left:-9999px;top:0';document.body.appendChild(input);input.select();
      let copied=false;try{copied=document.execCommand('copy')}catch(e){}input.remove();
      if(copied)notice('Link copied! Share it anywhere.');
      else{window.prompt('Copy this page link:',url)}
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initShare);else initShare();
})();
