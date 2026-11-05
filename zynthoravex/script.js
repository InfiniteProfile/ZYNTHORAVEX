(()=>{'use strict';
const $=s=>document.querySelector(s);
const gridEl=$('#grid'),sent=$('#sent'),q=$('#q'),clr=$('#clr'),tag=$('#tag'),toast=$('#toast'),empty=$('#empty');
const GAP=14,CH=196,ROW=CH+GAP,MINW=250,BUF=2,SHIFT=20000,FIRST=360,BATCH=300,TRIG=100,TAG=tag.textContent;

/* ---------- string-based decimal arithmetic (no Number/parseInt for IDs) ---------- */
const norm=s=>s.replace(/^0+/,'')||'0';
const cmp=(a,b)=>a.length!==b.length?(a.length<b.length?-1:1):(a<b?-1:a>b?1:0);
function add(a,n){let b=String(n),i=a.length-1,j=b.length-1,c=0,o=[];
  while(i>=0||j>=0||c){const x=(i>=0?a.charCodeAt(i--)-48:0)+(j>=0?b.charCodeAt(j--)-48:0)+c;o.push(x%10);c=x>9?1:0}
  return o.reverse().join('')}

/* ---------- deterministic identity generation from an ID string ---------- */
function rng(s){let a=1779033703,b=3144134277,c=1013904242,d=2773480762;
  for(let i=0;i<s.length;i++){const k=s.charCodeAt(i);a=b^Math.imul(a^k,597399067);b=c^Math.imul(b^k,2869860233);c=d^Math.imul(c^k,951274213);d=a^Math.imul(d^k,2716044179)}
  a=Math.imul(c^(a>>>18),597399067);b=Math.imul(d^(b>>>22),2869860233);c=Math.imul(a^(c>>>17),951274213);d=Math.imul(b^(d>>>19),2716044179);
  const f=()=>{a>>>=0;b>>>=0;c>>>=0;d>>>=0;let t=(a+b)|0;a=b^(b>>>9);b=(c+(c<<3))|0;c=(c<<21)|(c>>>11);d=(d+1)|0;t=(t+d)|0;c=(c+t)|0;return(t>>>0)/4294967296};
  for(let i=0;i<12;i++)f();return f}
const L=s=>s.split('|');
const FN=L('Aria|Kai|Nova|Leo|Mira|Zane|Luca|Ines|Orin|Sana|Theo|Yara|Dax|Lena|Milo|Rhea|Jax|Anya|Soren|Talia|Idris|Noor|Cass|Elio|Vera|Joss|Amara|Felix|Naomi|Ravi|Sasha|Imani|Bram|Keiko|Odin|Livia|Tariq|Mina|Colt|Zuri|Hana|Ezra|Petra|Niko|Selene|Arlo|Dara|Kian'),
LN=L('Voss|Hale|Okoye|Marlow|Quill|Sato|Vance|Reyes|Kovac|Adler|Drake|Ibarra|Nakamura|Frost|Laurent|Bishop|Khan|Moreau|Sterling|Ashby|Novak|Rivera|Chen|Holloway|Petrov|Duarte|Lindqvist|Mbeki|Ortega|Wilde|Castell|Rao|Ferro|Lange|Zhou|Abara|Thorne|Kline|Varga|Sorel|Ito|Barros|Maddox|Penn|Rahman|Ebner|Solano'),
AD=L('ember|crimson|velvet|ghost|lunar|neon|quiet|static|hollow|silver|midnight|rogue|solar|vivid|arcane|feral|cosmic|noble|drift|pale|wired|lucid|raven|binary|violet|scarlet|frozen|echo|hyper|sable|rapid|gilded|bleak|wild'),
NO=L('fox|orbit|comet|wolf|cipher|signal|moth|halo|pilot|vortex|shard|nomad|lynx|pulse|relic|raven|tide|spark|atlas|drone|quartz|falcon|mirage|prism|viper|zenith|glitch|cobra|nebula|blade|harbor'),
RO=L('Night-shift cartographer|Street photographer|Indie game tinkerer|Synth composer|Marine biologist|Late-night baker|Astronaut trainer|Typeface hunter|Urban gardener|Rooftop astronomer|Vinyl archivist|Trail runner|Origami engineer|Jazz bassist|Robotics student|Tea sommelier|Skateboard coach|Mural painter|Podcast editor|Chess hustler|Storm chaser|Pastry experimenter|Night-train traveler|Open-source maintainer'),
PL=L('Lisbon|Osaka|Nairobi|Reykjavik|Lagos|Oaxaca|Seoul|Tallinn|Marseille|Hanoi|Cape Town|Montreal|Dhaka|Istanbul|Lima|Krakow|Mumbai|Sydney|Bergen|Cairo|Tbilisi|Medellin|Perth|Kyoto'),
PH=L('Collects stories nobody asked for.|Chasing the last good sunset.|Always one coffee behind.|Believes every city hides a song.|Fluent in silence and sarcasm.|Currently lost, thoroughly enjoying it.|Makes small things loud.|Sleeps in daylight, thrives after dark.|Trades maps for rumors.|Keeps a notebook of strangers\' laughs.|Still learning how to rest.|Here for the strange and beautiful.|Builds bridges, burns playlists.|Talks to plants. They answer.|Never met a rooftop I didn\'t like.|Planning a quiet revolution.|Ask me about my 4 a.m. ideas.|Light traveler, heavy thinker.|Say hi, I rarely bite.|Gravity is optional.'),
SK=L('#f1c9a5|#e0ac82|#c68642|#a86a3c|#8d5524|#6b3e26|#f6d9bf|#4a2c1a'),
HC=L('#0d0b0c|#2b1710|#5a3420|#8a5a2b|#c9a46a|#b01030|#5b2bb8|#d9d9e0');

function avatar(r,h,h2){
  const p=a=>a[(r()*a.length)|0],sk=p(SK),hc=p(HC),hs=(r()*6)|0;
  const cl='hsl('+(((h+r()*50-25)+360)%360|0)+' '+((40+r()*30)|0)+'% '+((20+r()*18)|0)+'%)';
  let s='<svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" fill="hsl('+(h|0)+' 55% 12%)"/><circle cx="32" cy="30" r="25" fill="hsl('+(h2|0)+' 70% 30%)" opacity=".55"/>';
  if(hs===1)s+='<path d="M17 34c-3-18 6-24 15-24s18 6 15 24l-5 12H22z" fill="'+hc+'"/>';
  s+='<path d="M6 64c1-13 11-17 26-17s25 4 26 17z" fill="'+cl+'"/><rect x="28" y="38" width="8" height="10" rx="3" fill="'+sk+'"/><ellipse cx="32" cy="30" rx="10" ry="12" fill="'+sk+'"/>';
  const cap='<path d="M21 28c-1-11 5-15 11-15s12 4 11 15c-2-5-5-7-11-7s-9 2-11 7z" fill="'+hc+'"/>';
  if(hs<3)s+=cap;
  if(hs===2)s+='<circle cx="32" cy="11" r="5" fill="'+hc+'"/>';
  if(hs===4)s+='<path d="M21 27l1-10 5 4 3-8 4 8 5-4 1 10c-3-5-6-6-10-6s-7 1-10 6z" fill="'+hc+'"/>';
  if(hs===5)s+='<path d="M21 27c0-9 6-14 13-13 6 1 9 6 8 13-1-4-4-7-9-7-5 0-10 2-12 7z" fill="'+hc+'"/>';
  s+='<circle cx="28" cy="30" r="1.3" fill="#111"/><circle cx="36" cy="30" r="1.3" fill="#111"/><path d="M28 36q4 '+(2+((r()*3)|0))+' 8 0" stroke="#5a1a22" stroke-width="1.2" fill="none" stroke-linecap="round"/>';
  if(r()<.28)s+='<g fill="none" stroke="hsl('+(h2|0)+' 80% 70%)" stroke-width="1"><rect x="24" y="27" width="7" height="6" rx="2"/><rect x="33" y="27" width="7" height="6" rx="2"/><path d="M31 30h2"/></g>';
  if(r()<.3)s+='<circle cx="22" cy="34" r="1.3" fill="hsl('+(h2|0)+' 90% 70%)"/>';
  return s+'</svg>'}

function make(id,lite){
  const r=rng(id),p=a=>a[(r()*a.length)|0];
  const name=p(FN)+' '+p(LN),user=p(AD)+p(NO)+'_'+id;
  const o={id,name,user,hay:(name+' '+user).toLowerCase()};
  if(lite)return o;
  const red=r()<.72,h=red?(345+r()*40)%360:262+r()*30,h2=red?275+r()*15:350+r()*20;
  o.bio=p(RO)+' in '+p(PL)+'. '+p(PH);o.on=r()<.62;
  o.ca='hsl('+(h|0)+' 88% 54%)';o.cb='hsl('+(h2|0)+' 72% 46%)';o.bd='hsla('+(h|0)+',80%,50%,.28)';
  o.av=avatar(r,h,h2);return o}

const cache=new Map();
function prof(id){let p=cache.get(id);if(!p){p=make(id);cache.set(id,p);
  if(cache.size>5000){let i=0;for(const k of cache.keys()){cache.delete(k);if(++i>1500)break}}}return p}

/* ---------- sources: endless sequence from a base ID, or streaming text-search results ---------- */
function Seq(base,start,hit){return{base,gen:0,start,busy:false,hit:!!hit,dead:false,
  get count(){return this.gen},
  get(n){return prof(add(this.base,n))},
  trig(){return this.start+TRIG},
  prime(from,n){for(let i=from;i<from+n;i++)prof(add(this.base,i));this.gen=from+n;this.start=from},
  grow(last){if(this.busy||last<this.start+TRIG)return;this.busy=true;
    const self=this,from=this.gen,to=from+BATCH;let i=from;
    (function step(){if(self.dead){self.busy=false;return}
      const t=performance.now();while(i<to&&performance.now()-t<6){prof(add(self.base,i));i++}
      if(i<to)setTimeout(step,0);else{self.start=from;self.gen=to;self.busy=false;layoutHeight();sched()}})()}}}
function Txt(tk){return{res:[],k:0,busy:false,done:false,dead:false,need:60,tk,
  get count(){return this.res.length},
  get(n){return prof(this.res[n])},
  trig(){return Math.max(0,this.res.length-40)},
  grow(last){this.need=last+150;if(this.busy||this.done||this.res.length>=this.need)return;this.busy=true;this.step()},
  step(){if(this.dead){this.busy=false;return}
    const t=performance.now();
    while(performance.now()-t<7&&this.res.length<this.need){const id=add('1',this.k++),p=make(id,true);
      if(this.tk.every(x=>p.hay.includes(x)))this.res.push(id);
      if(this.k>600000&&!this.res.length){this.done=true;break}}
    layoutHeight();sched();showEmpty();
    if(!this.done&&this.res.length<this.need)setTimeout(()=>this.step(),20);else this.busy=false}}}
const NONE={count:0,get(){},trig(){return 0},grow(){},done:true,dead:false};

/* ---------- virtualized renderer ---------- */
const browse=Seq('1',0);
let src=browse,saved=0,cols=1,cw=300,rebase=0,top=0,lastVis=0,lastW=0,raf=0;
const active=new Map(),pool=[];

function measure(){const w=gridEl.clientWidth;lastW=w;cols=Math.max(1,Math.floor((w+GAP)/(MINW+GAP)));cw=(w-GAP*(cols-1))/cols;top=gridEl.getBoundingClientRect().top+scrollY}
function layoutHeight(){const rows=Math.ceil(src.count/cols);
  gridEl.style.height=Math.max(0,rows-rebase)*ROW+'px';
  const tr=Math.max(0,Math.floor(src.trig()/cols)-rebase);sent.style.transform='translateY('+tr*ROW+'px)'}
function mk(){const e=document.createElement('div');e.className='card';
  e.innerHTML='<div class="in"><div class="top"><div class="av"></div><div class="who"><b class="nm"></b><div class="un"></div></div><i class="on"></i></div><div class="pid"></div><p class="bio"></p></div>';
  const g=c=>e.querySelector('.'+c);e._a=[g('av'),g('nm'),g('un'),g('pid'),g('bio'),g('in')];return e}
function place(e,n){const r=Math.floor(n/cols),c=n-r*cols;e.style.width=cw+'px';e.style.transform='translate3d('+c*(cw+GAP)+'px,'+(r-rebase)*ROW+'px,0)'}
function bind(e,n){const p=src.get(n),a=e._a;
  a[0].innerHTML=p.av;a[1].textContent=p.name;a[2].textContent='@'+p.user;a[3].textContent='#'+p.id;a[4].textContent=p.bio;
  const s=e.style;s.setProperty('--a',p.ca);s.setProperty('--b',p.cb);s.setProperty('--bd',p.bd);
  e.classList.toggle('off',!p.on);e.classList.toggle('hit',!!src.hit&&n===0);e.dataset.id=p.id}
function recycle(){for(const e of active.values()){e.remove();pool.push(e)}active.clear()}
function sched(){if(!raf)raf=requestAnimationFrame(render)}
function render(){raf=0;
  let y=scrollY-top;
  if(y>8e6){rebase+=SHIFT;scrollTo(0,scrollY-SHIFT*ROW);y-=SHIFT*ROW;for(const[n,e]of active)place(e,n);layoutHeight()}
  const vh=innerHeight,r0=Math.max(0,Math.floor(y/ROW)+rebase-BUF),r1=Math.floor((y+vh)/ROW)+rebase+BUF;
  const n0=r0*cols,n1=Math.min(src.count-1,(r1+1)*cols-1);
  for(const[n,e]of active)if(n<n0||n>n1){active.delete(n);e.remove();pool.push(e)}
  const fr=document.createDocumentFragment();
  for(let n=n0;n<=n1;n++){if(active.has(n))continue;const e=pool.pop()||mk();bind(e,n);place(e,n);active.set(n,e);fr.appendChild(e)}
  gridEl.appendChild(fr);
  lastVis=(Math.floor((y+vh)/ROW)+rebase+1)*cols;
  src.grow(lastVis)}
function anchorN(){return Math.max(0,(Math.floor((scrollY-top)/ROW)+rebase)*cols)}
function relayout(n){measure();const row=Math.floor(n/cols);rebase=Math.floor(row/SHIFT)*SHIFT;recycle();layoutHeight();scrollTo(0,top+(row-rebase)*ROW);render()}
function showEmpty(){const e=src.count===0&&(src.done||src===NONE);
  if(src.count===0&&src!==browse&&src!==NONE&&!src.done){empty.hidden=false;empty.textContent='Scanning the universe for matches\u2026'}
  else{empty.hidden=!e;empty.textContent='No profile matches that search.'}}

/* ---------- search ---------- */
function setSrc(s,label){if(src===browse&&s!==browse)saved=anchorN();src.dead=src!==browse;src=s;
  tag.textContent=label||TAG;showEmpty();relayout(s===browse?saved:0)}
function search(raw){let v=raw.trim().replace(/^[#@]/,'');clr.hidden=!raw;
  if(!v){if(src!==browse)setSrc(browse);return}
  const low=v.toLowerCase();let m;
  if(/^\d+$/.test(v)){const id=norm(v);
    if(cmp(id,'1')<0){setSrc(NONE,'Profile IDs start at 1');return}
    const s=Seq(id,0,true);s.prime(0,FIRST);setSrc(s,'Profile #'+id+' and onward');return}
  if((m=low.match(/^(.+)_(\d+)$/))){const id=norm(m[2]);
    if(cmp(id,'1')>=0&&make(id,true).user.toLowerCase()===m[1]+'_'+id){const s=Seq(id,0,true);s.prime(0,FIRST);setSrc(s,'@'+m[1]+'_'+id);return}}
  const s=Txt(low.split(/\s+/));setSrc(s,'Matches for \u201c'+v+'\u201d')}

/* ---------- boot ---------- */
let st=null;try{st=JSON.parse(localStorage.getItem('zynthoravex.v1'))}catch(e){}
const n0=st&&Number.isSafeInteger(st.n)&&st.n>0?st.n:0;
browse.prime(n0,FIRST);   /* 360 profiles generated immediately */
measure();relayout(n0);
addEventListener('scroll',sched,{passive:true});
addEventListener('resize',()=>{if(gridEl.clientWidth!==lastW)relayout(anchorN())});
if('IntersectionObserver' in window){try{new IntersectionObserver(es=>{if(es.some(x=>x.isIntersecting))sched()},{rootMargin:'1500px 0px'}).observe(sent)}catch(e){}}
setInterval(()=>{src.grow(lastVis)},700);   /* time-based fallback, independent of scroll/IO */
setInterval(()=>{if(src===browse)try{localStorage.setItem('zynthoravex.v1',JSON.stringify({n:anchorN()}))}catch(e){}},1500);
q.addEventListener('input',()=>search(q.value));
q.addEventListener('keydown',e=>{if(e.key==='Enter')q.blur()});
clr.addEventListener('click',()=>{q.value='';search('');q.focus()});
let tt=0;
gridEl.addEventListener('click',e=>{const c=e.target.closest('.card');if(!c)return;
  const id=c.dataset.id,done=()=>{toast.textContent='ID copied';toast.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>toast.classList.remove('show'),1300)};
  const fb=()=>{const t=document.createElement('textarea');t.value=id;t.style.cssText='position:fixed;opacity:0';document.body.appendChild(t);t.select();try{document.execCommand('copy');done()}catch(x){}t.remove()};
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(id).then(done,fb);else fb()});
})();
