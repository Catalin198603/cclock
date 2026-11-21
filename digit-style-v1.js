(()=>{'use strict';
const KEY='cclock_digit_style_v1';
const btn=document.getElementById('digit-style-toggle');
if(!btn)return;
let digital=false;
try{digital=localStorage.getItem(KEY)==='digital'}catch(e){}
const apply=()=>{
  document.body.classList.toggle('digital-digits',digital);
  btn.setAttribute('aria-pressed',String(digital));
  btn.textContent='DIGI';
  btn.title=digital?'Use standard digits':'Use digital digits';
  btn.setAttribute('aria-label',digital?'Use standard digit style':'Use digital digit style');
};
btn.addEventListener('click',()=>{
  digital=!digital;
  try{localStorage.setItem(KEY,digital?'digital':'standard')}catch(e){}
  apply();
});
apply();
})();