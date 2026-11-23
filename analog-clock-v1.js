(function(){
function init(){
const display=document.getElementById('clock-display'),hero=document.querySelector('.hero-content'),controls=document.querySelector('.top-actions');
if(!display||!hero)return;
const clock=document.createElement('div');clock.id='analog-clock';clock.setAttribute('role','img');clock.setAttribute('aria-label','Analog clock showing the current local time');
for(let i=0;i<60;i++){const tick=document.createElement('i');tick.className='analog-tick'+(i%5===0?' major':'')+(i%15===0?' quarter':'');tick.style.transform='translateX(-50%) rotate('+i*6+'deg)';tick.style.transformOrigin='50% 0';tick.style.left='50%';tick.style.top='50%';tick.style.height='0';tick.style.width='0';clock.appendChild(tick)}
// Use percentage-based positions so markers scale correctly on all screen sizes.
for(let i=0;i<60;i++){const tick=clock.children[i];const a=i*Math.PI/30-Math.PI/2;const radius=i%5===0?43:45;tick.style.left=(50+radius*Math.cos(a))+'%';tick.style.top=(50+radius*Math.sin(a))+'%';tick.style.width=i%15===0?'6px':i%5===0?'4px':'2px';tick.style.height=i%15===0?'5.5%':i%5===0?'4%':'2.1%';tick.style.transform='translate(-50%,-50%) rotate('+i*6+'deg)'}
for(let n=1;n<=12;n++){const label=document.createElement('span');label.className='analog-number';label.textContent=n;const a=n*Math.PI/6-Math.PI/2;label.style.left=(50+34*Math.cos(a))+'%';label.style.top=(50+34*Math.sin(a))+'%';clock.appendChild(label)}
const brand=document.createElement('div');brand.className='analog-brand';brand.innerHTML='<span>c</span>Clock';clock.appendChild(brand);
for(const [name,id] of [['hour','analog-hour'],['minute','analog-minute'],['second','analog-second']]){const hand=document.createElement('div');hand.className='analog-hand';hand.id=id;clock.appendChild(hand)}
const readout=document.createElement('div');readout.className='analog-readout';clock.appendChild(readout);
const paletteColors=[...document.querySelectorAll('.clock-color')];
function syncRingColor(){const selected=paletteColors.find(el=>el.getAttribute('aria-pressed')==='true');const color=selected?.dataset.color||'#ff6a00';clock.style.setProperty('--analog-ring-color',color);const rgb=color.match(/[a-f\d]{2}/gi)?.map(x=>parseInt(x,16))||[255,106,0];clock.style.setProperty('--analog-ring-glow','rgba('+rgb.join(',')+',.45)')}
paletteColors.forEach(el=>el.addEventListener('click',()=>requestAnimationFrame(syncRingColor)));syncRingColor();
const center=document.createElement('div');center.className='analog-center';clock.appendChild(center);display.before(clock);
const toggle=document.createElement('button');toggle.id='analog-mode-toggle';toggle.type='button';toggle.className='compact-btn';toggle.textContent='AN';toggle.title='Switch between analog and digital clock';toggle.setAttribute('aria-label','Toggle analog clock');toggle.setAttribute('aria-pressed','false');
if(controls){const share=document.getElementById('cclock-share');if(share)share.before(toggle);else controls.append(toggle)}else hero.prepend(toggle);
let analog=false;try{analog=localStorage.getItem('cclock-analog-mode')==='true'}catch(e){}
function apply(){document.body.classList.toggle('analog-mode',analog);toggle.setAttribute('aria-pressed',String(analog));draw()}
function draw(){if(!analog)return;const d=new Date(),seconds=d.getSeconds()+d.getMilliseconds()/1000,minutes=d.getMinutes()+seconds/60,hours=d.getHours()%12+minutes/60;document.getElementById('analog-hour').style.transform='rotate('+(hours*30)+'deg)';document.getElementById('analog-minute').style.transform='rotate('+(minutes*6)+'deg)';document.getElementById('analog-second').style.transform='rotate('+(seconds*6)+'deg)';const pad=n=>String(n).padStart(2,'0');const str=pad(d.getHours())+':'+pad(d.getMinutes())+':'+pad(d.getSeconds());if(readout.textContent!==str)readout.textContent=str}
toggle.addEventListener('click',()=>{analog=!analog;try{localStorage.setItem('cclock-analog-mode',String(analog))}catch(e){}apply()});apply();setInterval(draw,100);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
