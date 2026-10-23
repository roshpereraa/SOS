const { chromium } = require('playwright');
const BASE = process.env.QA_BASE || 'http://127.0.0.1:8777';
const PAGES = ['index','about','services','portfolio','contact'];
const VIEWPORTS = [
  [320,568,true],[360,780,true],[390,844,true],[414,896,true],[768,1024,true],
  [834,1112,true],[1024,768,false],[1280,800,false],[1440,900,false],[1920,1080,false],
];
const found = [];
const add = (kind, where, msg) => found.push({kind, where, msg});

async function settle(p){
  const h = await p.evaluate(()=>document.documentElement.scrollHeight);
  for(let y=0;y<h;y+=450){ await p.evaluate(v=>scrollTo({top:v,behavior:'instant'}),y); await p.waitForTimeout(35); }
  await p.waitForTimeout(900);
  await p.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
  await p.waitForTimeout(250);
}

(async () => {
  const b = await chromium.launch();

  /* ---------- 1. Layout + assets across every viewport ---------- */
  for (const [w,h,touch] of VIEWPORTS) {
    for (const name of PAGES) {
      const ctx = await b.newContext({viewport:{width:w,height:h}, isMobile:touch, hasTouch:touch,
                                      deviceScaleFactor: touch?2:1});
      const p = await ctx.newPage();
      const bad = [];
      p.on('response', r => { if (r.status()>=400) bad.push(`${r.status()} ${r.url().split('/').pop()}`); });
      p.on('pageerror', e => add('JS', `${w}px ${name}`, e.message));
      p.on('console', m => { if (m.type()==='error') add('CONSOLE', `${w}px ${name}`, m.text()); });
      await p.goto(`${BASE}/${name}.html`, {waitUntil:'networkidle'});
      await settle(p);
      bad.forEach(x => add('NET', `${w}px ${name}`, x));

      const r = await p.evaluate((isTouch) => {
        const out = {ovf:null, overlap:[], clipped:[], tiny:[], broken:[], offscreen:[]};
        if (document.documentElement.scrollWidth > innerWidth+1)
          out.ovf = `${document.documentElement.scrollWidth} > ${innerWidth}`;

        const vis = e => { const r=e.getBoundingClientRect(), cs=getComputedStyle(e);
          return r.width>0&&r.height>0&&cs.visibility!=='hidden'&&cs.display!=='none'&&cs.opacity!=='0'; };
        const inCollapsed = e => { const pn=e.closest('.acc__panel');
          return pn && !pn.closest('.acc__item')?.classList.contains('is-open'); };

        // broken or un-decoded images
        document.querySelectorAll('img').forEach(im=>{
          if (im.complete && im.naturalWidth===0) out.broken.push(im.getAttribute('src')||'(no src)');
        });

        // text overlap
        const txt=[...document.querySelectorAll('h1,h2,h3,p,.srow__t,.wk__client,.fig__k,.bignum')]
          .filter(e=>vis(e)&&!inCollapsed(e)&&!e.closest('.reel,.ticker,.cine__wall,.cta__stills,.hgal'));
        outer: for(let i=0;i<txt.length;i++) for(let j=i+1;j<txt.length;j++){
          const a=txt[i],c=txt[j]; if(a.contains(c)||c.contains(a)) continue;
          const ra=a.getBoundingClientRect(),rc=c.getBoundingClientRect();
          const ox=Math.min(ra.right,rc.right)-Math.max(ra.left,rc.left);
          const oy=Math.min(ra.bottom,rc.bottom)-Math.max(ra.top,rc.top);
          if(ox>20&&oy>12){ out.overlap.push(`"${(a.textContent||'').trim().slice(0,20)}" x "${(c.textContent||'').trim().slice(0,20)}"`); break outer; }
        }

        // content clipped by an overflow:hidden ancestor box
        document.querySelectorAll('.pin__stage,.cta,.wk__shot').forEach(e=>{
          const cs=getComputedStyle(e);
          if((cs.overflow==='hidden'||cs.overflowY==='hidden') && e.scrollHeight>e.clientHeight+3)
            out.clipped.push(`${e.className.split(' ')[0]} ${e.scrollHeight}>${e.clientHeight}`);
        });

        // tap targets on touch viewports
        if (isTouch) {
          document.querySelectorAll('a,button,input,select,textarea,[role="button"]').forEach(e=>{
            if(!vis(e)) return;
            if (e.closest('.drawer')) return;           // measured separately when open
            const r=e.getBoundingClientRect();
            if (r.width<24||r.height<24)
              out.tiny.push(`${e.tagName}.${(e.className||'').toString().split(' ')[0]} ${Math.round(r.width)}x${Math.round(r.height)}`);
          });
        }
        return out;
      }, touch);

      const where = `${w}px ${name}`;
      if (r.ovf) add('OVERFLOW', where, r.ovf);
      r.overlap.forEach(x=>add('OVERLAP', where, x));
      r.clipped.forEach(x=>add('CLIPPED', where, x));
      r.broken.forEach(x=>add('IMG', where, 'failed to load: '+x));
      [...new Set(r.tiny)].forEach(x=>add('TAPTARGET', where, x));
      await ctx.close();
    }
  }
  const groups = {};
  found.forEach(f => { (groups[f.kind] ||= []).push(f); });
  console.log(`LAYOUT / ASSET QA — ${found.length} finding(s) across ${VIEWPORTS.length * PAGES.length} page-viewport combos\n`);
  Object.keys(groups).sort().forEach(k => {
    console.log(`[${k}] ${groups[k].length}`);
    const seen = new Map();
    groups[k].forEach(f => { if (!seen.has(f.msg)) seen.set(f.msg, []); seen.get(f.msg).push(f.where); });
    [...seen].slice(0, 12).forEach(([m, ws]) => console.log(`   ${m.slice(0,60).padEnd(60)} ${ws.slice(0,4).join(', ')}`));
    console.log('');
  });
  if (!found.length) console.log('No findings.');
  await b.close();
  process.exit(found.length ? 1 : 0);
})();
