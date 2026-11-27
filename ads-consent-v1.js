(()=>{'use strict';
if(!['cclock.eu','www.cclock.eu'].includes(location.hostname))return;
window.googlefc=window.googlefc||{};
window.googlefc.callbackQueue=window.googlefc.callbackQueue||[];
const script=document.createElement('script');
script.async=true;
script.crossOrigin='anonymous';
script.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2305525768599419';
document.head.appendChild(script);
function addLink(){
 const target=document.querySelector('footer')||document.querySelector('main')||document.body;
 const p=document.createElement('p');
 p.style.textAlign='center';
 const link=document.createElement('button');
 link.type='button';
 link.textContent='Advertising privacy settings';
 link.style.cssText='font:inherit;color:inherit;background:none;border:0;text-decoration:underline;cursor:pointer;padding:8px';
 link.hidden=true;
 link.onclick=()=>window.googlefc.showRevocationMessage();
 p.appendChild(link);target.appendChild(p);
 window.googlefc.callbackQueue.push({CONSENT_API_READY:()=>{if(typeof window.googlefc.showRevocationMessage==='function')link.hidden=false;}});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',addLink,{once:true});else addLink();
})();
