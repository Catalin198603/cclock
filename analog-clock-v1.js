(function(){
function init(){
const display=document.getElementById('clock-display'),hero=document.querySelector('.hero-content'),controls=document.querySelector('.clock-customizer');
if(!display||!hero)return;
const clock=document.createElement('div');clock.id='analog-clock';clock.setAttribute('role','img');clock.setAttribute('aria-label','Analog clock showing the current local time');
for(let i=0;i<12;i++){const tick=document.createElement('i');tick.className='analog-tick major';tick.style.transform='rotate('+i*30+'deg)';clock.appendChild(tick)}
for(const [name,id] of [['hour','analog-hour'],['minute','analog-minute'],['second','analog-second']]){const hand=document.createElement('div');hand.className='analog-hand';hand.id=id;clock.appendChild(hand)}
const center=document.createElement('div');center.className='analog-center';clock.appendChild(center);display.before(clock);
const toggle=document.createElement('button');toggle.id='analog-mode-toggle';toggle.type='button';toggle.className='clock-palette-toggle';toggle.textContent='ANALOG';toggle.title='Switch between analog and digital clock';toggle.setAttribute('aria-label','Toggle analog clock');toggle.setAttribute('aria-pressed','false');
if(controls)controls.prepend(toggle);else hero.prepend(toggle);
let analog=false;try{analog=localStorage.getItem('cclock-analog-mode')==='true'}catch(e){}
function apply(){document.body.classList.toggle('analog-mode',analog);toggle.setAttribute('aria-pressed',String(analog));toggle.textContent=analog?'DIGITAL':'ANALOG';draw()}
function draw(){if(!analog)return;const d=new Date(),seconds=d.getSeconds()+d.getMilliseconds()/1000,minutes=d.getMinutes()+seconds/60,hours=d.getHours()%12+minutes/60;document.getElementById('analog-hour').style.transform='rotate('+(hours*30)+'deg)';document.getElementById('analog-minute').style.transform='rotate('+(minutes*6)+'deg)';document.getElementById('analog-second').style.transform='rotate('+(seconds*6)+'deg)'}
toggle.addEventListener('click',()=>{analog=!analog;try{localStorage.setItem('cclock-analog-mode',String(analog))}catch(e){}apply()});apply();setInterval(draw,100);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
