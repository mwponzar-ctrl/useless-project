(() => {
const $ = s => document.querySelector(s), KEY = 'many-lives-save';
const STATS = [['health','Health','#6ee7b7'],['happiness','Happiness','#fcd34d'],['smarts','Smarts','#93c5fd'],['looks','Looks','#f9a8d4'],['social','Social','#c4b5fd']];
const TRAITS = {Athletic:'Health declines slower',Bookworm:'Studying pays off more',Charming:'Socializing pays off more',Lucky:'Risks go your way more often',Frugal:'Lower living costs'};
const AVATARS = ['😀','😎','🧑‍🎤','🧑‍🚀','👩‍🔬','👨‍🍳','🧑‍🎨','🦸','🧙','🦊','🐱','🍊'];
const COLORS = ['#3b4a7a','#7a3b5a','#2f6b5a','#7a5a2f','#5a3b7a','#2f5a7a'];
const JOBS = [
 {t:'Cashier',pay:22e3,req:{}},{t:'Barista',pay:24e3,req:{}},
 {t:'Warehouse worker',pay:30e3,req:{health:40}},{t:'Salesperson',pay:42e3,req:{social:50}},
 {t:'Office assistant',pay:36e3,req:{smarts:45}},
 {t:'Nurse',pay:72e3,req:{smarts:65,college:1}},{t:'Software developer',pay:9e4,req:{smarts:70,college:1}}];
const E = (text, choices, o = {}) => ({text, choices, ...o});
const C = (t, fx, m, r, g = {}) => ({t, fx, m, r, ...g});
const EVENTS = [
 E('You find a wallet with $200 inside.',[C('Return it',{happiness:4,social:2},'The owner is grateful.'),C('Keep the cash',{money:200,happiness:-2},'You pocket it. Guilt lingers.')]),
 E('Friends invite you to a big party.',[C('Go',{happiness:5,social:4},'Great night!',{p:.25,fx:{health:-6,money:-200},m:'Rough night. You overdid it.'}),C('Stay in and read',{smarts:3,happiness:1},'Quiet, productive evening.')]),
 E('You feel really sick.',[C('See a doctor',{money:-400},'Treated quickly.',0,{minM:400}),C('Tough it out',{health:-3},'You recover slowly.',{p:.4,fx:{health:-12},m:'It got much worse.'})]),
 E('An email says you won a prize. It wants your bank details.',[C('Click the link',{},'You send your details.',{p:.8,fx:{money:-1500,happiness:-5},m:'It was a scam.'}),C('Delete it',{smarts:1},'Wise move.')]),
 E('Your car breaks down.',[C('Pay for repairs',{money:-1200},'Fixed.',0,{minM:1200}),C('Buy a new car ($15,000)',{money:-15000,happiness:6},'You love the new ride.',0,{minM:15000}),C('Take the bus for a while',{happiness:-4,health:1},'Inconvenient but cheap.')]),
 E('An online course could boost your skills.',[C('Enroll ($500)',{money:-500,smarts:8},'You learn a lot.',0,{minM:500}),C('Skip it',{},'Maybe next year.')]),
 E('A friend wants you to run a marathon.',[C('Train and run',{health:6,happiness:3},'You finish proud!',{p:.2,fx:{health:-10},m:'You got injured.'}),C('Cheer from the sidelines',{social:2},'Fun day out.')]),
 E('You have a crush on someone.',[C('Ask them out',{social:6,happiness:10},'They said yes!',{p:.5,fx:{happiness:-6},m:'They said no. Ouch.'}),C('Stay quiet',{},'The moment passes.')],{min:18}),
 E('A $5 lottery ticket catches your eye.',[C('Buy it',{money:-5,happiness:-1},'Nothing this time.',{p:.04,good:1,fx:{money:50000,happiness:20},m:'YOU WON $50,000!'}),C('Walk away',{},'Keep your money.')]),
 E('Your boss announces layoffs.',[C('Plead your case',{},'You keep your job.',{p:.4,fx:{},m:'No luck. You are let go.',lose:1}),C('Take the severance',{money:3000},'You leave with $3,000.',{lose:1})],{job:1}),
 E('A weekend gig pays well.',[C('Work it',{money:1500,health:-2,happiness:-2},'Extra cash, tired body.'),C('Rest',{happiness:4},'Recharged.')]),
 E('Walking home late, someone demands your wallet.',[C('Hand it over',{money:-300,happiness:-4},'You lose $300.'),C('Fight back',{},'You scare them off!',{p:.5,fx:{health:-18,money:-300},m:'You got hurt and robbed.'})]),
 E('A post of yours goes viral.',[C('Embrace the fame',{social:8,happiness:5},'You get lots of new followers.'),C('Delete it',{happiness:-1},'Back to quiet life.')]),
 E('A distant relative leaves you money.',[C('Wonderful news',{money:5000,happiness:5},'+$5,000.')],{rare:1}),
 E('Your back aches constantly.',[C('Physical therapy ($800)',{money:-800,health:4},'It helps.',0,{minM:800}),C('Ignore it',{health:-6},'It gets worse.')],{min:40}),
 E('A coworker shares a hot stock tip.',[C('Invest $2,000',{money:-2000},'You invest.',{p:.5,good:1,fx:{money:2000},m:'The stock jumped! Net +$2,000.'},{minM:2000}),C('Pass',{},'Playing it safe.')],{job:1}),
 E('A local shelter needs volunteers.',[C('Help out',{happiness:6,social:3},'It feels great.'),C('Not now',{},'Maybe later.')]),
 E('You can adopt a pet.',[C('Adopt ($400)',{money:-400,happiness:8},'A new best friend!',0,{minM:400}),C('Pass',{},'Not the right time.')])];
EVENTS.push(
 E('Your landlord raises the rent.',[C('Pay it',{money:-1500,happiness:-2},'You pay the extra rent.',0,{minM:1500}),C('Negotiate',{},'He backs down.',{p:.5,fx:{money:-1500,happiness:-3},m:'He refused and you owe more.'})],{home:'apartment'}),
 E('Your parents ask for help with bills.',[C('Chip in $500',{money:-500,happiness:3,social:2},'They are very grateful.',0,{minM:500}),C('Say you cannot',{happiness:-3},'It stays awkward.')],{home:'family'}),
 E('Your manager hints a promotion is possible.',[C('Ask for a raise',{},'You got a 10% raise!',{p:.5,fx:{happiness:-4},m:'Your request was denied.'},{raise:1}),C('Work overtime',{money:1500,health:-3},'The extra pay is nice.')],{job:1}),
 E('A friend pitches you a startup.',[C('Invest $5,000',{money:-5000},'The startup folded. You lost $5,000.',{p:.35,good:1,fx:{money:15000,happiness:6},m:'It took off! +$15,000.'},{minM:5000}),C('Pass',{},'You stay safe.')],{minM:5000}),
 E('You are invited to a charity gala.',[C('Attend and donate $3,000',{money:-3000,social:8,happiness:4,looks:1},'You made powerful friends.',0,{minM:3000}),C('Skip it',{},'Another quiet night.')],{minM:30000}),
 E('A neighbor asks to borrow $1,000.',[C('Lend it',{social:3},'They repay you gratefully.',{p:.4,fx:{money:-1000,social:-1},m:'They never paid you back.'},{minM:1000}),C('Say no',{},'You keep your money.')],{minM:2000}),
 E('A large medical bill arrives.',[C('Pay in full',{money:-3000},'Paid off.',0,{minM:3000}),C('Set up a payment plan',{money:-1000,happiness:-3},'You pay over time.')],{min:45}),
 E('You can afford something extravagant.',[C('Designer wardrobe ($5,000)',{money:-5000,looks:6,happiness:3},'You look incredible.'),C('Save it',{happiness:1},'Prudent.')],{minM:50000}),
 E('Cash is tight this month.',[C('Sell your stuff online',{money:400,happiness:-2},'You made a little cash.'),C('Borrow from family',{money:500,social:-2},'Awkward but helpful.'),C('Cut back on food',{health:-3,happiness:-3},'You get by, barely.')],{maxM:1500}));
const ACTIONS = [
 {i:'🏋️',t:'Hit the gym',d:'+Health, +Happiness',fx:{health:6,happiness:2},m:'You worked out.'},
 {i:'📚',t:'Study',d:'+Smarts',fx:{smarts:6,happiness:-1},m:'You studied hard.',trait:['Bookworm','smarts']},
 {i:'🎉',t:'Go out with friends',d:'+Social, +Happiness · $50',fx:{social:4,happiness:5,money:-50},m:'You hung out with friends.',trait:['Charming','social']},
 {i:'🩺',t:'See a doctor',d:'+Health · $300',fx:{health:8,money:-300},m:'You got a checkup.'},
 {i:'🛠️',t:'Do gig work',d:'+$1,200 · −Happiness',fx:{money:1200,happiness:-2,health:-1},m:'You picked up gig work.',show:()=>s.money<10000},
 {i:'🚌',t:'Budget road trip',d:'+Happiness · $400',fx:{happiness:6,money:-400},m:'You took a cheap road trip.',show:()=>s.money<8000},
 {i:'🏖️',t:'Beach resort vacation',d:'+Happiness · $1,500',fx:{happiness:10,money:-1500},m:'You enjoyed a resort vacation.',show:()=>s.money>=8000&&s.money<60000},
 {i:'🛥️',t:'Luxury cruise',d:'+Happiness, +Looks · $8,000',fx:{happiness:16,looks:3,money:-8000},m:'You cruised in style.',show:()=>s.money>=60000},
 {i:'💪',t:'Hire a personal trainer',d:'+Health, +Looks · $3,000',fx:{health:12,looks:3,money:-3000},m:'Your trainer pushed you hard.',show:()=>s.money>=20000},
 {i:'🎁',t:'Donate to charity',d:'+Happiness, +Social · $2,000',fx:{happiness:8,social:4,money:-2000},m:'You donated to charity.',show:()=>s.money>=20000},
 {i:'📈',t:'Invest $1,000',d:'70% gain, 30% loss',show:()=>s.money>=1000&&s.money<30000,run:()=>invest(1000)},
 {i:'💹',t:'Invest $10,000',d:'70% gain, 30% loss',show:()=>s.money>=30000,run:()=>invest(10000)},
 {i:'🏠',t:'Move out',d:'Own apartment · rent $12,000/yr · +Happiness',show:()=>s.housing==='family'&&s.job,run:()=>{s.housing='apartment';return `You moved out. (${fx({happiness:5})})`}},
 {i:'🔑',t:'Buy a home',d:'$45,000 · upkeep only $7,000/yr',need:45000,show:()=>s.housing!=='home'&&s.money>=45000,run:()=>{s.money-=45000;s.housing='home';return `You bought a home! (${fx({happiness:8})})`}},
 {i:'🚀',t:'Start a business',d:'$15,000 · risky, pays yearly',need:15000,show:()=>s.money>=15000&&!s.biz,run:()=>{s.money-=15000;if(chance(.4,1)){s.biz=18000;return 'Your business is a hit! It earns $18,000 a year.'}return 'The business failed. You lost $15,000.'}}];
const invest = n => {const w = chance(.7,1), d = w ? Math.round(n*.25) : -Math.round(n*.3); s.money += d; return `Your investment ${w ? 'grew' : 'shrank'}: ${w ? '+' : '−'}${money(Math.abs(d))}.`};
let s = null;
const clamp = v => Math.max(0, Math.min(100, v));
const money = n => (n < 0 ? '−' : '') + '$' + Math.abs(Math.round(n)).toLocaleString();
const has = t => s.traits.includes(t);
const chance = (p, good) => Math.random() < clamp(p * 100 + (has('Lucky') ? (good ? 10 : -10) : 0)) / 100;
const save = () => localStorage.setItem(KEY, JSON.stringify(s));
const log = (text, tone = '') => s.log.unshift({age: s.age, text, tone});
const eduLabel = () => s.school ? `College (${s.school} yr left)` : s.college ? 'College graduate' : 'High school graduate';
function fx(o) {
  const out = [];
  for (const k in o) {
    const v = o[k];
    if (k === 'money') { s.money += v; if (v) out.push((v > 0 ? '+' : '−') + money(Math.abs(v))); }
    else { const b = s[k]; s[k] = clamp(b + v); const d = s[k] - b; if (d) out.push((d > 0 ? '+' : '') + d + ' ' + k); }
  }
  return out.join(' · ');
}
function modal(html, buttons = []) {
  $('#box').innerHTML = html + buttons.map((b, i) => `<button data-i="${i}">${b.t}</button>`).join('');
  $('#modal').hidden = false;
  $('#box').querySelectorAll('button[data-i]').forEach(el => el.onclick = () => { $('#modal').hidden = true; buttons[el.dataset.i].cb?.(); });
}
const closeBtn = [{t:'Continue', cb: () => render()}];

function create() {
  const c = {name:'', av:AVATARS[0], color:COLORS[0], traits:[]};
  const draw = () => {
    $('#app').innerHTML = `<section class="card create"><h1>Design your life</h1><p class="mut">You turn 18 with $5,000, a family home and a lot of choices ahead.</p>
    <label for="nm">Your name</label><input id="nm" maxlength="24" placeholder="e.g. Arjun Mehta" value="${c.name}">
    <label>Appearance</label><div class="grid">${AVATARS.map(a => `<button data-av="${a}" class="${a === c.av ? 'sel' : ''}">${a}</button>`).join('')}</div>
    <div class="grid" style="margin-top:8px">${COLORS.map(x => `<button data-col="${x}" class="${x === c.color ? 'sel' : ''}" style="background:${x}" aria-label="Color ${x}">&nbsp;&nbsp;</button>`).join('')}</div>
    <label>Pick up to 2 traits</label><div class="grid">${Object.keys(TRAITS).map(t => `<button data-tr="${t}" class="${c.traits.includes(t) ? 'sel' : ''}" title="${TRAITS[t]}">${t} <small class="mut">· ${TRAITS[t]}</small></button>`).join('')}</div>
    <button class="primary age" id="go" ${c.name.trim() ? '' : 'disabled'}>Start my life</button>
    ${localStorage.getItem(KEY) ? '<button class="ghost age" id="cont">Continue saved life</button>' : ''}</section>`;
    $('#nm').oninput = e => { c.name = e.target.value; $('#go').disabled = !c.name.trim(); };
    document.querySelectorAll('[data-av]').forEach(b => b.onclick = () => { c.av = b.dataset.av; draw(); });
    document.querySelectorAll('[data-col]').forEach(b => b.onclick = () => { c.color = b.dataset.col; draw(); });
    document.querySelectorAll('[data-tr]').forEach(b => b.onclick = () => { const t = b.dataset.tr; c.traits = c.traits.includes(t) ? c.traits.filter(x => x !== t) : [...c.traits, t].slice(-2); draw(); });
    $('#go').onclick = () => start(c);
    $('#cont') && ($('#cont').onclick = () => { s = JSON.parse(localStorage.getItem(KEY)); render(); });
  };
  draw();
}
function start(c) {
  const r = (a, b) => a + Math.floor(Math.random() * (b - a));
  s = {name:c.name.trim(), av:c.av, color:c.color, traits:c.traits, age:18, money:5000, health:r(70,95), happiness:r(55,80), smarts:r(40,70), looks:r(40,75), social:r(35,65), job:null, housing:'family', biz:0, college:0, school:0, ap:3, seen:[], log:[], dead:false};
  log(`${s.name} turns 18. The story begins.`, 'good'); save(); render();
}
function render() {
  if (!s) return create();
  s.housing = s.housing || 'family';
  const stat = ([k, n, col]) => `<div class="stat"><div>${n}<b>${s[k]}</b></div><div class="bar"><i style="width:${s[k]}%;background:${col}"></i></div></div>`;
  const acts = ACTIONS.map((a, i) => [a, i]).filter(([a]) => !a.show || a.show()).map(([a, i]) => `<button data-a="${i}" ${s.ap < 1 || s.dead || s.money < (a.need ?? -(a.fx?.money || 0)) ? 'disabled' : ''}><span>${a.i}</span><span>${a.t}<small>${a.d}</small></span></button>`).join('');
  $('#app').innerHTML = `<div><section class="card"><div class="mut">AGE ${s.age}</div><h1>${s.dead ? 'A life well lived.' : 'What will you do this year?'}</h1>
    <div class="who"><div class="av" style="background:${s.color}">${s.av}</div><div><h2 style="margin:0">${s.name}</h2><div class="mut">${s.job ? s.job.t : 'Unemployed'} · ${eduLabel()}</div>${s.traits.map(t => `<span class="chip">${t}</span>`).join('')}</div></div>
    <div class="stats">${STATS.map(stat).join('')}</div>
    ${s.dead ? '<button class="primary age" id="again">Start a new life</button>' : '<button class="primary age" id="up">Age up to ' + (s.age + 1) + '</button>'}</section>
    <section class="card"><h2>Life story</h2><div class="log">${s.log.slice(0, 40).map(l => `<p class="${l.tone}"><span>${l.age}</span>${l.text}</p>`).join('')}</div></section></div>
    <div><section class="card"><h2>Your circumstances</h2>
    <div class="row"><span class="mut">Money</span><b class="${s.money < 0 ? 'bad' : 'good'}">${money(s.money)}</b></div>
    <div class="row"><span class="mut">Job</span><b>${s.job ? `${s.job.t} (${money(s.job.pay)}/yr)` : 'None'}</b></div>
    <div class="row"><span class="mut">Education</span><b>${eduLabel()}</b></div><div class="row"><span class="mut">Home</span><b>${{family:'Family home',apartment:'Apartment',home:'Your own home'}[s.housing]}</b></div>${s.biz ? `<div class="row"><span class="mut">Business</span><b>${money(s.biz)}/yr</b></div>` : ''}</section>
    <section class="card"><h2>Actions</h2><div class="ap">${[0,1,2].map(i => `<div class="pip ${i < s.ap ? '' : 'off'}"></div>`).join('')}<span class="mut">${s.ap} left this year</span></div>
    <div class="acts">${acts}
    <button data-a="job" ${s.ap < 1 || s.dead ? 'disabled' : ''}><span>💼</span><span>${s.job ? 'Quit your job' : 'Look for a job'}<small>${s.job ? 'Free action' : 'Costs 1 action'}</small></span></button>
    <button data-a="college" ${s.ap < 1 || s.dead || s.school || s.college ? 'disabled' : ''}><span>🎓</span><span>Enroll in college<small>4 years · $8,000/yr ($3,000 with Smarts 75+) · loans cover any gap</small></span></button></div></section></div>`;
  document.querySelectorAll('[data-a]').forEach(b => b.onclick = () => act(b.dataset.a));
  $('#up') && ($('#up').onclick = ageUp); $('#again') && ($('#again').onclick = () => { s = null; create(); });
  save();
}
function act(k) {
  if (k === 'job') return s.job ? (log(`You quit your job as ${s.job.t}.`), s.job = null, render()) : jobList();
  if (k === 'college') { s.ap--; s.school = 4; log('You enrolled in college.', 'good'); return render(); }
  const a = ACTIONS[k]; s.ap--;
  let txt;
  if (a.run) txt = a.run();
  else { const f = {...a.fx}; if (a.trait && has(a.trait[0])) f[a.trait[1]] += 3; txt = `${a.m} (${fx(f)})`; }
  log(txt); render();
}
function jobList() {
  const ok = j => (!j.req.health || s.health >= j.req.health) && (!j.req.smarts || s.smarts >= j.req.smarts) && (!j.req.social || s.social >= j.req.social) && (!j.req.college || s.college);
  const need = j => Object.entries(j.req).map(([k, v]) => k === 'college' ? 'college degree' : `${k} ${v}+`).join(', ') || 'no requirements';
  modal('<h2>Job openings</h2><p class="mut">Applying costs 1 action and is not guaranteed.</p>', JOBS.map(j => ({
    t: `${ok(j) ? '' : '🔒 '}${j.t} · ${money(j.pay)}/yr <small class="mut">(${need(j)})</small>`,
    cb: () => { if (!ok(j)) { modal('<h2>Not qualified yet</h2><p>You need: ' + need(j) + '.</p>', closeBtn); return; } s.ap--;
      if (chance(.55 + (s.smarts + s.social) / 500, 1)) { s.job = {t: j.t, pay: j.pay}; log(`You were hired as a ${j.t}!`, 'good'); } else log(`You applied to be a ${j.t} but were turned down.`, 'bad'); render(); }
  })).concat([{t: 'Cancel'}]));
}
function yearly() {
  const n = [], cost = {family: 3000, apartment: 12000, home: 7000}[s.housing || 'family'] - (has('Frugal') ? 1500 : 0); s.money -= cost; n.push(`living −${money(cost)}`);
  if (s.job) { s.money += s.job.pay; n.push(`salary +${money(s.job.pay)}`); if (chance(.2, 1)) { const r = Math.round(s.job.pay * .07); s.job.pay += r; log(`You got a raise of ${money(r)}!`, 'good'); } }
  if (s.school) { const tu = s.smarts >= 75 ? 3000 : 8000; s.school--; s.money -= tu; s.smarts = clamp(s.smarts + 3); n.push(`tuition −${money(tu)}`); if (!s.school) { s.college = 1; log('You graduated from college!', 'good'); } }
  if (s.biz) { s.money += s.biz; n.push(`business +${money(s.biz)}`); }
  if (s.age > 35) fx({health: -(has('Athletic') ? 1 : 2) - (s.age > 55 ? 1 : 0)});
  if (s.age > 40) fx({looks: -1});
  if (s.money < 0) { s.money = Math.round(s.money * 1.08); fx({happiness: -4}); n.push('debt interest 8%'); }
  log(`Year summary: ${n.join(', ')}.`);
}
function ageUp() {
  s.age++; s.ap = 3; yearly();
  const pool = EVENTS.filter(e => (!e.min || s.age >= e.min) && (!e.job || s.job) && !s.seen.includes(e.text) && (!e.rare || chance(.15)) && (!e.minM || s.money >= e.minM) && (!e.maxM || s.money <= e.maxM) && (!e.home || s.housing === e.home));
  if (s.health <= 0 || (s.age >= 65 && Math.random() < (s.age - 64) * .015 + (s.health < 30 ? .1 : 0)) || s.age >= 105) return die();
  if (pool.length && Math.random() < .85) event(pool[Math.floor(Math.random() * pool.length)]); else render();
}
function event(e) {
  s.seen = [...s.seen.slice(-6), e.text];
  modal(`<div class="mut">AGE ${s.age}</div><h2>${e.text}</h2>`, e.choices.filter(c => (!c.minM || s.money >= c.minM) && (!c.maxM || s.money <= c.maxM)).map(c => ({t: c.t, cb: () => {
    let o = c, alt = c.r && chance(c.r.p, c.r.good);
    if (alt) o = c.r; if (o.raise && s.job) s.job.pay = Math.round(s.job.pay * 1.1); const eff = fx(o.fx || {}); if (o.lose || (c.lose && !c.r)) s.job = null;
    const tone = alt ? (c.r.good ? 'good' : 'bad') : '';
    log(`${o.m}${eff ? ' (' + eff + ')' : ''}`, tone);
    modal(`<h2>${o.m}</h2><p class="${tone}">${eff || 'No change.'}</p>`, [{t: 'Continue', cb: () => s.health <= 0 ? die() : render()}]);
  }})));
}
function die() {
  s.dead = true; const nw = money(s.money);
  log(`${s.name} passed away at age ${s.age}.`, 'bad'); save();
  modal(`<h1>${s.name}, 18–${s.age}</h1><p>Final savings: <b>${nw}</b><br>Last job: ${s.job ? s.job.t : 'none'}<br>Education: ${eduLabel()}<br>Happiness at the end: ${s.happiness}</p>`, closeBtn);
}
$('#newBtn').onclick = () => modal('<h2>Start a new life?</h2><p class="mut">Your current life will be erased.</p>', [{t: 'Yes, start over', cb: () => { localStorage.removeItem(KEY); s = null; create(); }}, {t: 'Cancel'}]);
try { s = JSON.parse(localStorage.getItem(KEY)); } catch { s = null; }
s && s.dead ? (s = null, create()) : render();
})();
