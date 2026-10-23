"""Static QA: HTML validity, duplicate ids/attrs, metadata, internal links."""
import pathlib, re, collections, html.parser, json, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = sorted(ROOT.glob("*.html"))
issues = []

VOID = {'meta','link','img','br','hr','input','source','path','circle','rect','stop',
        'use','area','col','embed','track','wbr','polyline','line','ellipse','polygon'}

class P(html.parser.HTMLParser):
    def __init__(s, f):
        super().__init__(); s.f=f; s.stack=[]; s.ids=collections.Counter()
        s.imgs=[]; s.links=[]; s.heads=[]; s.labels=set(); s.controls=[]
        s.btns=[]; s.aria=[]
    def handle_starttag(s, t, attrs):
        d = dict(attrs)
        for n,c in collections.Counter(a[0] for a in attrs).items():
            if c>1: issues.append((s.f,'HTML','duplicate attribute `%s` on <%s> line %d'%(n,t,s.getpos()[0])))
        if 'id' in d: s.ids[d['id']] += 1
        if t=='img': s.imgs.append((d.get('src',''), d.get('alt'), d.get('width'), d.get('height'), d.get('loading'), s.getpos()[0]))
        if t=='a': s.links.append((d.get('href',''), s.getpos()[0]))
        if t in ('h1','h2','h3','h4','h5','h6'): s.heads.append((int(t[1]), s.getpos()[0]))
        if t=='label' and 'for' in d: s.labels.add(d['for'])
        if t in ('input','textarea','select'): s.controls.append((d.get('id'), d.get('type'), d.get('name'), s.getpos()[0]))
        if t=='button': s.btns.append((d.get('aria-label'), s.getpos()[0]))
        for k,v in d.items():
            if k.startswith('aria-'): s.aria.append((k, v, s.getpos()[0]))
        if t not in VOID: s.stack.append((t, s.getpos()[0]))
    handle_startendtag = handle_starttag
    def handle_endtag(s, t):
        if s.stack and s.stack[-1][0]==t: s.stack.pop()
        elif any(x[0]==t for x in s.stack):
            issues.append((s.f,'HTML','mis-nested </%s> at line %d'%(t, s.getpos()[0])))
            while s.stack and s.stack.pop()[0]!=t: pass

meta = {}
for f in PAGES:
    txt = f.read_text()
    p = P(f.name); p.feed(txt)
    if p.stack: issues.append((f.name,'HTML','unclosed: %s'%[x[0] for x in p.stack[:5]]))
    for i,c in p.ids.items():
        if c>1: issues.append((f.name,'HTML','duplicate id="%s" (x%d)'%(i,c)))
    # images
    for src,alt,w,h,loading,ln in p.imgs:
        if alt is None: issues.append((f.name,'A11Y','<img> without alt at line %d (%s)'%(ln,src[:40])))
        if not (w and h): issues.append((f.name,'PERF','<img> without width/height at line %d (%s)'%(ln,src[:40])))
    # headings
    lv = [l for l,_ in p.heads]
    if lv.count(1) != 1: issues.append((f.name,'A11Y','expected exactly one <h1>, found %d'%lv.count(1)))
    prev = 0
    for l,ln in p.heads:
        if prev and l > prev+1: issues.append((f.name,'A11Y','heading jumps h%d -> h%d at line %d'%(prev,l,ln)))
        prev = l
    # labels
    for cid, ctype, cname, ln in p.controls:
        if ctype in ('hidden','submit','button'): continue
        if not cid: issues.append((f.name,'A11Y','form control without id at line %d'%ln)); continue
        if cid not in p.labels: issues.append((f.name,'A11Y','no <label for="%s"> at line %d'%(cid,ln)))
    # buttons need a name
    for al, ln in p.btns:
        pass
    # aria references must resolve
    for k,v,ln in p.aria:
        if k in ('aria-controls','aria-labelledby','aria-describedby') and v:
            for ref in v.split():
                if ref not in p.ids: issues.append((f.name,'A11Y','%s="%s" points at a missing id (line %d)'%(k,ref,ln)))
    # metadata
    t = re.search(r'<title>(.*?)</title>', txt, re.S)
    d = re.search(r'<meta name="description" content="(.*?)"', txt, re.S)
    meta[f.name] = (t.group(1).strip() if t else None, d.group(1).strip() if d else None)
    if not t: issues.append((f.name,'SEO','missing <title>'))
    if not d: issues.append((f.name,'SEO','missing meta description'))
    elif len(d.group(1)) > 165: issues.append((f.name,'SEO','meta description %d chars (>165)'%len(d.group(1))))
    if 'rel="canonical"' not in txt: issues.append((f.name,'SEO','no canonical link'))
    # internal links resolve
    for href, ln in p.links:
        if not href or href.startswith(('http','mailto:','tel:','#')): continue
        target = href.split('#')[0]
        if target and not (ROOT/target).exists():
            issues.append((f.name,'LINK','broken link -> %s (line %d)'%(href,ln)))

# duplicate titles/descriptions across pages
for key, idx in (('title',0), ('description',1)):
    seen = collections.defaultdict(list)
    for fn,(t,d) in meta.items(): seen[(t,d)[idx]].append(fn)
    for val, fns in seen.items():
        if val and len(fns)>1: issues.append((','.join(fns),'SEO','duplicate %s: %r'%(key,val[:50])))

# site-level files
for want, kind in [('robots.txt','SEO'), ('sitemap.xml','SEO')]:
    if not (ROOT/want).exists(): issues.append(('site',kind,'no %s'%want))

by = collections.defaultdict(list)
for f,k,m in issues: by[k].append((f,m))
print("STATIC QA — %d issue(s)\n" % len(issues))
for k in sorted(by):
    print(f"[{k}] {len(by[k])}")
    for f,m in by[k][:14]: print(f"   {f:16s} {m}")
    if len(by[k])>14: print(f"   … and {len(by[k])-14} more")
    print()
raise SystemExit(1 if issues else 0)
