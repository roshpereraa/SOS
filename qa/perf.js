const { chromium } = require('playwright');
(async()=>{
 const b=await chromium.launch();
 for (const name of ['index','about','services','portfolio','contact']) {
  const ctx=await b.newContext({viewport:{width:1440,height:900}});
  const p=await ctx.newPage();
  const res=[];
  p.on('response', async r=>{
    try{ const h=r.headers(); res.push({u:r.url(), t:(h['content-type']||'').split(';')[0],
      len:Number(h['content-length']||0), st:r.status()}); }catch(e){}
  });
  const t0=Date.now();
  await p.goto(`http://127.0.0.1:8777/${name}.html`,{waitUntil:'load'});
  const load=Date.now()-t0;
  await p.waitForTimeout(1500);
  const by={};
  let total=0;
  for(const r of res){ const k=r.t||'other'; by[k]=(by[k]||0)+r.len; total+=r.len; }
  const imgs=await p.evaluate(()=>{
    const out=[];
    document.querySelectorAll('img').forEach(i=>{
      const r=i.getBoundingClientRect();
      if(r.width>4 && i.naturalWidth && i.naturalWidth > r.width*2.6)
        out.push(`${i.src.split('/').pop()} natural=${i.naturalWidth} shown=${Math.round(r.width)}`);
    });
    return [...new Set(out)].slice(0,4);
  });
  const lazy=await p.evaluate(()=>({total:document.querySelectorAll('img').length,
    lazy:document.querySelectorAll('img[loading="lazy"]').length}));
  console.log(`${name.padEnd(10)} load=${String(load).padEnd(5)}ms  total=${(total/1024).toFixed(0).padStart(5)}KB  reqs=${String(res.length).padStart(3)}  imgs=${lazy.lazy}/${lazy.total} lazy`);
  Object.entries(by).sort((a,c)=>c[1]-a[1]).slice(0,4).forEach(([k,v])=>console.log(`           ${k.padEnd(26)} ${(v/1024).toFixed(0).padStart(5)}KB`));
  if(imgs.length) console.log(`           oversized: ${imgs.join('; ')}`);
  await ctx.close();
 }
 await b.close();
})();
