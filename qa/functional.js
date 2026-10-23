const { chromium } = require('playwright');
const BASE = process.env.QA_BASE || 'http://127.0.0.1:8777';
const out=[]; const ok=(n)=>out.push(['PASS',n,'']); const bad=(n,d)=>out.push(['FAIL',n,d]);
const chk=(c,n,d)=>c?ok(n):bad(n,d);

(async()=>{
 const b=await chromium.launch();

 /* ---- desktop interactions ---- */
 let ctx=await b.newContext({viewport:{width:1440,height:900}});
 let p=await ctx.newPage();
 const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto(`${BASE}/index.html`,{waitUntil:'networkidle'}); await p.waitForTimeout(800);

 // nav active state per page
 for(const [file,label] of [['index','Home'],['about','About'],['services','Services'],['portfolio','Portfolio']]){
   await p.goto(`${BASE}/${file}.html`,{waitUntil:'networkidle'});
   const a=await p.evaluate(()=>{const e=document.querySelector('.nav__links a.is-active');
     return e?{t:e.textContent.trim(),cur:e.getAttribute('aria-current')}:null;});
   chk(a&&a.t===label&&a.cur==='page',`nav active state on ${file}.html`,JSON.stringify(a));
 }

 // every nav + footer link resolves
 await p.goto(`${BASE}/index.html`,{waitUntil:'networkidle'});
 const hrefs=await p.evaluate(()=>[...new Set([...document.querySelectorAll('a[href]')].map(a=>a.getAttribute('href')))]);
 for(const h of hrefs){
   if(/^(https?:|mailto:|tel:|#)/.test(h)) continue;
   const r=await p.request.get(`${BASE}/${h}`);
   chk(r.status()<400,`link resolves: ${h}`,`status ${r.status()}`);
 }

 // skip link
 await p.goto(`${BASE}/index.html`,{waitUntil:'networkidle'});
 await p.keyboard.press('Tab');
 const skip=await p.evaluate(()=>{const e=document.activeElement;
   return {cls:e.className, vis:e.getBoundingClientRect().top>-50};});
 chk(skip.cls.includes('skip-link'),'first Tab reaches skip link',JSON.stringify(skip));

 // focus ring present
 const ring=await p.evaluate(()=>{const e=document.activeElement;const cs=getComputedStyle(e);
   return cs.outlineStyle!=='none'&&parseFloat(cs.outlineWidth)>0;});
 chk(ring,'focused element has a visible outline','no outline');

 // accordion
 await p.evaluate(()=>document.querySelector('.acc').scrollIntoView({block:'center',behavior:'instant'}));
 await p.waitForTimeout(400);
 await p.click('.acc__item:nth-child(3) .acc__btn'); await p.waitForTimeout(500);
 const acc=await p.evaluate(()=>{const its=[...document.querySelectorAll('.acc__item')];
   return {open:its.filter(i=>i.classList.contains('is-open')).length,
           idx:its.findIndex(i=>i.classList.contains('is-open')),
           aria:its[2].querySelector('.acc__btn').getAttribute('aria-expanded')};});
 chk(acc.open===1&&acc.idx===2&&acc.aria==='true','accordion opens one at a time with aria',JSON.stringify(acc));

 // accordion keyboard
 await p.focus('.acc__item:nth-child(2) .acc__btn');
 await p.keyboard.press('Enter'); await p.waitForTimeout(400);
 chk(await p.evaluate(()=>document.querySelectorAll('.acc__item')[1].classList.contains('is-open')),
     'accordion opens via keyboard Enter','did not open');

 // scrub pins and advances
 const scr=await p.evaluate(async()=>{
   const pin=document.querySelector('[data-scrub]'); if(!pin) return null;
   const top=pin.offsetTop, h=pin.offsetHeight, seen=[];
   for(const f of [0.05,0.35,0.65,0.95]){
     scrollTo({top:top+(h-innerHeight)*f,behavior:'instant'});
     await new Promise(r=>setTimeout(r,320));
     seen.push(document.querySelector('.scrub__idx').textContent);
   }
   return {h, seen, stuck:getComputedStyle(pin.querySelector('.pin__stage')).position};});
 chk(scr && new Set(scr.seen).size>=3 && scr.stuck==='sticky','scrub pins and advances frames',JSON.stringify(scr));

 // horizontal rail scrolls natively
 const rail=await p.evaluate(()=>{const r=document.querySelector('.hgal');
   if(!r) return null; const before=r.scrollLeft; r.scrollLeft=400;
   const after=r.scrollLeft; r.scrollLeft=before;
   return {scrollable:r.scrollWidth>r.clientWidth, moved:after>0};});
 chk(rail&&rail.scrollable&&rail.moved,'work rail scrolls horizontally',JSON.stringify(rail));

 // portfolio filters
 await p.goto(`${BASE}/portfolio.html`,{waitUntil:'networkidle'}); await p.waitForTimeout(500);
 const all=await p.evaluate(()=>document.querySelectorAll('[data-cat]:not(.is-filtered)').length);
 for(const f of ['growth','post','full']){
   await p.click(`button[data-filter="${f}"]`); await p.waitForTimeout(400);
   const n=await p.evaluate(()=>document.querySelectorAll('[data-cat]:not(.is-filtered)').length);
   const pressed=await p.evaluate(s=>document.querySelector(s).getAttribute('aria-pressed'),`button[data-filter="${f}"]`);
   chk(n>0&&n<all&&pressed==='true',`filter "${f}" narrows set (${n}/${all})`,`n=${n} pressed=${pressed}`);
 }
 await p.click('button[data-filter="all"]'); await p.waitForTimeout(400);
 chk(await p.evaluate(()=>document.querySelectorAll('[data-cat]:not(.is-filtered)').length)===all,'filter "all" restores set','');

 // contact form
 await p.goto(`${BASE}/contact.html`,{waitUntil:'networkidle'}); await p.waitForTimeout(500);
 await p.evaluate(()=>document.querySelector('form').scrollIntoView({block:'center',behavior:'instant'}));
 await p.click('button[type="submit"]'); await p.waitForTimeout(400);
 const inv=await p.evaluate(()=>({bad:document.querySelectorAll('.field.is-invalid').length,
   status:document.querySelector('.form-status').className,
   focused:document.activeElement.id}));
 chk(inv.bad>=3&&inv.status.includes('is-shown')&&inv.focused==='f-name',
     'empty submit blocks, flags fields, focuses first',JSON.stringify(inv));

 await p.fill('#f-name','QA Tester'); await p.fill('#f-email','not-an-email');
 await p.click('#f-msg'); await p.waitForTimeout(300);
 chk(await p.evaluate(()=>document.querySelector('#f-email').closest('.field').classList.contains('is-invalid')),
     'invalid email is rejected','accepted');
 await p.fill('#f-email','qa@example.com'); await p.fill('#f-msg','Checking the form.');
 await p.check('#f-terms'); await p.waitForTimeout(300);
 const valid=await p.evaluate(()=>{const f=document.querySelector('form');
   return [...f.querySelectorAll('input,textarea,select')].every(i=>i.checkValidity());});
 chk(valid,'form becomes valid once filled','still invalid');
 chk(errs.length===0,'no uncaught JS errors on desktop',errs.join(' | '));
 await ctx.close();

 /* ---- mobile ---- */
 ctx=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 p=await ctx.newPage();
 const merrs=[]; p.on('pageerror',e=>merrs.push(e.message));
 await p.goto(`${BASE}/index.html`,{waitUntil:'networkidle'}); await p.waitForTimeout(700);

 chk(await p.evaluate(()=>!!document.querySelector('.pin.no-pin'))||
     await p.evaluate(()=>getComputedStyle(document.querySelector('.pin__stage')).position!=='sticky'),
     'pinning disabled on touch','still pinned');

 await p.click('.nav__burger'); await p.waitForTimeout(600);
 const dr=await p.evaluate(()=>({open:document.querySelector('.drawer').classList.contains('is-open'),
   locked:document.body.classList.contains('no-scroll'),
   aria:document.querySelector('.nav__burger').getAttribute('aria-expanded'),
   hidden:document.querySelector('.drawer').getAttribute('aria-hidden')}));
 chk(dr.open&&dr.locked&&dr.aria==='true'&&dr.hidden==='false','drawer opens, locks scroll, sets aria',JSON.stringify(dr));

 const tap=await p.evaluate(()=>[...document.querySelectorAll('.drawer a')]
   .map(a=>{const r=a.getBoundingClientRect();return Math.round(Math.min(r.width,r.height));})
   .filter(v=>v<40));
 chk(tap.length===0,'drawer links meet 40px touch height',`${tap.length} under 40px`);

 await p.keyboard.press('Escape'); await p.waitForTimeout(500);
 chk(await p.evaluate(()=>!document.querySelector('.drawer').classList.contains('is-open')
   && !document.body.classList.contains('no-scroll')),'Escape closes drawer and unlocks scroll','');

 chk(merrs.length===0,'no uncaught JS errors on mobile',merrs.join(' | '));
 await ctx.close();

 /* ---- reduced motion ---- */
 ctx=await b.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});
 p=await ctx.newPage();
 await p.goto(`${BASE}/index.html`,{waitUntil:'networkidle'}); await p.waitForTimeout(1200);
 const rm=await p.evaluate(()=>({
   hidden:[...document.querySelectorAll('[data-reveal]')].filter(e=>getComputedStyle(e).opacity==='0').length,
   cursor:!!document.querySelector('.cursor'),
   pinned:getComputedStyle(document.querySelector('.pin__stage')).position}));
 chk(rm.hidden===0,'reduced motion: nothing stays hidden',`${rm.hidden} hidden`);
 chk(!rm.cursor,'reduced motion: custom cursor not attached','attached');
 await ctx.close();

 /* ---- JS disabled ---- */
 ctx=await b.newContext({viewport:{width:1440,height:900},javaScriptEnabled:false});
 p=await ctx.newPage();
 await p.goto(`${BASE}/index.html`,{waitUntil:'load'}); await p.waitForTimeout(600);
 const nojs=await p.evaluate?0:0;
 const r2=await p.evaluate(()=>0).catch(()=>null);
 const vis=await p.locator('.cine__title').isVisible();
 const linksOk=await p.locator('.nav__links a').count();
 chk(vis,'JS disabled: hero headline visible','hidden');
 chk(linksOk===4,'JS disabled: navigation present',`${linksOk} links`);
 await ctx.close();

 const fails=out.filter(o=>o[0]==='FAIL');
 console.log(`FUNCTIONAL QA — ${out.length} checks, ${fails.length} failing\n`);
 out.forEach(([s,n,d])=>console.log(`${s==='PASS'?' ok ':'FAIL'}  ${n}${d?'  -> '+d:''}`));
 await b.close();
 process.exit(0);
})();
