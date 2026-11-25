(()=>{'use strict';
const KEY='cclock_consent_v1';
const GA='G-58B9TLL9QE';
let gaLoaded=false;

window.dataLayer=window.dataLayer||[];
window.gtag=window.gtag||function(){dataLayer.push(arguments)};

function defaultConsent(){
  gtag('consent','default',{
    analytics_storage:'denied',
    ad_storage:'denied',
    ad_user_data:'denied',
    ad_personalization:'denied',
    wait_for_update:500
  });
}
defaultConsent();

function loadAnalytics(){
  if (!['cclock.eu', 'www.cclock.eu'].includes(window.location.hostname)) return;
  if(gaLoaded)return;
  gaLoaded=true;
  gtag('consent','update',{
    analytics_storage:'granted',
    ad_storage:'denied',
    ad_user_data:'denied',
    ad_personalization:'denied'
  });
  const s=document.createElement('script');
  s.async=true;
  s.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(GA);
  document.head.appendChild(s);
  gtag('js',new Date());
  gtag('config',GA,{anonymize_ip:true});
}
function denyAnalytics(){
  gtag('consent','update',{
    analytics_storage:'denied',
    ad_storage:'denied',
    ad_user_data:'denied',
    ad_personalization:'denied'
  });
}
function read(){
  try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){return null}
}
function save(analytics){
  try{localStorage.setItem(KEY,JSON.stringify({analytics:!!analytics,ts:Date.now(),version:1}))}catch(e){}
  analytics?loadAnalytics():denyAnalytics();
  closeAll();
}
function closeAll(){
  document.getElementById('cc-consent')?.classList.remove('show');
  document.getElementById('cc-modal')?.classList.remove('show');
  document.getElementById('cc-backdrop')?.classList.remove('show');
}
function openBanner(){
  document.getElementById('cc-consent')?.classList.add('show');
}
function openSettings(){
  const saved=read();
  const toggle=document.getElementById('cc-analytics');
  if(toggle)toggle.checked=!!(saved&&saved.analytics);
  document.getElementById('cc-modal')?.classList.add('show');
  document.getElementById('cc-backdrop')?.classList.add('show');
  document.getElementById('cc-modal')?.querySelector('h2')?.focus();
}
function build(){
  const backdrop=document.createElement('div');
  backdrop.id='cc-backdrop';backdrop.className='cc-consent-backdrop';backdrop.setAttribute('aria-hidden','true');

  const banner=document.createElement('section');
  banner.id='cc-consent';banner.className='cc-consent';
  banner.setAttribute('role','dialog');banner.setAttribute('aria-label','Privacy choices');
  banner.innerHTML='<div class="cc-copy"><div class="cc-title"><span class="cc-shield" aria-hidden="true">✓</span><span>Your privacy choices</span></div><p class="cc-text">cClock uses optional Google Analytics to understand how the site is used and improve it. Analytics stays off unless you allow it. Essential site functions work without analytics.</p></div><div class="cc-actions"><button class="cc-btn primary" id="cc-accept" type="button">Accept analytics</button><button class="cc-btn" id="cc-reject" type="button">Reject</button><button class="cc-btn ghost" id="cc-settings" type="button">Settings</button></div>';

  const modal=document.createElement('section');
  modal.id='cc-modal';modal.className='cc-modal';modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');modal.setAttribute('aria-labelledby','cc-modal-title');
  modal.innerHTML='<h2 id="cc-modal-title" tabindex="-1">Privacy settings</h2><p>Choose whether cClock may use optional analytics. You can change this choice at any time using “Privacy settings” in the footer.</p><div class="cc-row"><div><strong>Essential</strong><small>Required for basic site functions and remembering your privacy choice.</small></div><span class="cc-state">Always on</span></div><div class="cc-row"><div><strong>Analytics</strong><small>Google Analytics helps us understand visits and improve cClock. It is disabled until you consent.</small></div><label class="cc-switch" aria-label="Allow analytics"><input id="cc-analytics" type="checkbox"><span class="cc-slider"></span></label></div><div class="cc-modal-actions"><button class="cc-btn" id="cc-cancel" type="button">Cancel</button><button class="cc-btn primary" id="cc-save" type="button">Save choices</button></div>';

  document.body.append(backdrop,banner,modal);

  document.getElementById('cc-accept').onclick=()=>save(true);
  document.getElementById('cc-reject').onclick=()=>save(false);
  document.getElementById('cc-settings').onclick=openSettings;
  document.getElementById('cc-save').onclick=()=>save(document.getElementById('cc-analytics').checked);
  document.getElementById('cc-cancel').onclick=closeAll;
  backdrop.onclick=closeAll;
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAll()});

  const footer=document.querySelector('footer');
  if(footer){
    const p=document.createElement('p');
    const b=document.createElement('button');
    b.type='button';b.className='cc-settings-link';b.textContent='Privacy settings';b.onclick=openSettings;
    p.appendChild(b);footer.appendChild(p);
  }

  const saved=read();
  if(saved&&typeof saved.analytics==='boolean'){
    saved.analytics?loadAnalytics():denyAnalytics();
  }else{
    openBanner();
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build,{once:true});else build();
})();