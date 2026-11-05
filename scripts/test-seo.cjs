const assert = require('node:assert/strict');
const {chromium} = require('playwright');
const base = process.env.SPLASH_TEST_URL || 'http://localhost:3100';
function requestWithHost(path,host){
 const url=new URL(base+path);const transport=require(url.protocol==='https:'?'node:https':'node:http');
 return new Promise((resolve,reject)=>{transport.get(url,{headers:{Host:host}},response=>{response.resume();response.on('end',()=>resolve({status:response.statusCode,headers:response.headers}));}).on('error',reject)});
}
const origin = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://sachingold.com').origin;
(async()=>{
 const browser=await chromium.launch();const page=await browser.newPage();
 try {
  const xml=await(await fetch(base+'/sitemap.xml')).text();
  const entries=await page.evaluate(xml=>{
   const doc=new DOMParser().parseFromString(xml,'application/xml');
   return Array.from(doc.getElementsByTagName('url')).map(node=>({url:node.getElementsByTagName('loc')[0]?.textContent,alternates:Array.from(node.getElementsByTagNameNS('http://www.w3.org/1999/xhtml','link')).map(link=>({locale:link.getAttribute('hreflang'),url:link.getAttribute('href')}))}));
  },xml);
  assert.equal(entries.length,66,'only the existing eleven routes × six locales');
  assert.equal(new Set(entries.map(e=>e.url)).size,entries.length);
  for(const entry of entries){
   assert.ok(entry.url.startsWith(origin+'/'));assert.equal(entry.alternates.length,7);
   const target=new URL(entry.url);const response=await fetch(base+target.pathname);
   assert.equal(response.status,200,entry.url);
   assert.ok(!response.headers.get('x-robots-tag')?.includes('noindex'),entry.url+' is indexable on the canonical host');
   const html=await response.text();const meta=await page.evaluate(html=>{
    const doc=new DOMParser().parseFromString(html,'text/html');const graphs=[];
    for(const script of doc.querySelectorAll('script[type="application/ld+json"]')){const data=JSON.parse(script.textContent);graphs.push(...(data['@graph']||[data]));}
    return {title:doc.title,description:doc.querySelector('meta[name="description"]')?.content,canonical:doc.querySelector('link[rel="canonical"]')?.href,hreflang:Array.from(doc.querySelectorAll('link[hreflang]')).map(l=>({locale:l.hreflang,url:l.href})),robots:doc.querySelector('meta[name="robots"]')?.content,graphs,h1:doc.querySelectorAll('h1').length};
   },html);
   assert.ok(meta.title&&meta.description,entry.url+' title/description');assert.equal(meta.h1,1);
   assert.equal(meta.canonical,entry.url);assert.ok(meta.robots.includes('index')&&!meta.robots.includes('noindex'));
   assert.deepEqual(meta.hreflang.sort((a,b)=>a.locale.localeCompare(b.locale)),entry.alternates.sort((a,b)=>a.locale.localeCompare(b.locale)));
   assert.ok(meta.graphs.some(g=>g['@type']==='Organization'));
   assert.ok(meta.graphs.some(g=>g['@type']==='LocalBusiness'));
   if(/\/services\/[^/]+$/.test(target.pathname)){
    const service=meta.graphs.find(g=>g['@type']==='Service');assert.equal(service.url,entry.url);
    const crumbs=meta.graphs.find(g=>g['@type']==='BreadcrumbList');assert.equal(crumbs.itemListElement.at(-1).item,entry.url);
   }
  }
  console.log('PASS 66 existing routes: canonicals, reciprocal hreflang, metadata, JSON-LD and headings');
  const robots=await(await fetch(base+'/robots.txt')).text();assert.ok(robots.includes('Sitemap: '+origin+'/sitemap.xml'));
  const alias=await requestWithHost('/','seo-check.vercel.app');assert.match(alias.headers['x-robots-tag']||'',/noindex/);
  const canonical=await requestWithHost('/',new URL(origin).host);assert.ok(!canonical.headers['x-robots-tag']?.includes('noindex'));
  const redirect=await requestWithHost('/about?utm_source=test','www.'+new URL(origin).hostname);
  assert.equal(redirect.status,308);assert.ok(redirect.headers.location.startsWith(origin+'/about'));
  const pdf=await fetch(base+'/en/rates.pdf');assert.equal(pdf.status,200);assert.equal(pdf.headers.get('link'),'<'+origin+'/rates.pdf>; rel="canonical"');
  console.log('PASS robots, alias noindex, canonical-host indexing, www redirect and PDF canonical header');
  await page.addInitScript(()=>{localStorage.setItem('sg-splash-seen','1');localStorage.setItem('sg-lang-choice','en')});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/contact');
  await page.evaluate(()=>{window.__conversionEvents=[];window.va=(type,payload)=>{if(type==='event')window.__conversionEvents.push(payload)}});
  await page.locator('form button[type="submit"]').click();
  assert.equal(await page.evaluate(()=>window.__conversionEvents.length),0,'invalid form is not a conversion');
  await page.evaluate(()=>{
   for(const href of ['https://wa.me/919422952233?text=PRIVATE','tel:+919422952233','mailto:private@example.invalid?body=PRIVATE','/profile.pdf']){
    const a=document.createElement('a');a.href=href;a.addEventListener('click',e=>e.preventDefault());document.body.append(a);a.click();a.remove();
   }
  });
  await page.route('https://api.web3forms.com/submit',r=>r.fulfill({status:200,contentType:'application/json',body:'{"success":true}'}));
  await page.locator('[name="name"]').fill('PRIVATE_BUYER');await page.locator('[name="email"]').fill('private@example.invalid');await page.locator('[name="message"]').fill('PRIVATE_MESSAGE');
  await page.locator('form button[type="submit"]').click();await page.locator('form').waitFor({state:'detached'});
  const events=await page.evaluate(()=>window.__conversionEvents);
  for(const name of ['whatsapp_click','phone_click','email_click','pdf_download','enquiry_form_submit','enquiry_form_success'])assert.equal(events.filter(e=>e.name===name).length,1,name);
  assert.ok(!/PRIVATE|private@|94229/.test(JSON.stringify(events)),'no PII or message contents in analytics');
  await page.evaluate(()=>{Object.defineProperty(navigator,'globalPrivacyControl',{value:true,configurable:true});const a=document.createElement('a');a.href='tel:123';a.addEventListener('click',e=>e.preventDefault());document.body.append(a);a.click();a.remove()});
  assert.equal(await page.evaluate(()=>window.__conversionEvents.length),events.length,'respect privacy opt-out');
  assert.deepEqual(errors,[]);console.log('PASS conversion tracking, validated form-success event, PII exclusion and privacy opt-out; no enquiries sent');
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
