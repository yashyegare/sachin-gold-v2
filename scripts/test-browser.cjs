const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const base = process.env.SPLASH_TEST_URL || 'http://localhost:3100';
(async () => {
 const browser = await chromium.launch({headless: true});
 const errors = [];
 const context = await browser.newContext({viewport: {width: 1280, height: 900}});
 await context.addInitScript(() => { localStorage.setItem('sg-splash-seen','1'); localStorage.setItem('sg-lang-choice','en'); });
 const page = await context.newPage();
 page.on('pageerror', e => errors.push(e.message));
 page.on('console', m => { if(m.type()==='error' && /hydration|Minified React|server rendered/i.test(m.text())) errors.push(m.text()); });
 try {
  for (const path of ['/', '/hi', '/mr', '/kn', '/te', '/ta', '/about', '/rates', '/services/oil-extraction', '/contact']) {
   const response = await page.goto(base+path);
   assert.equal(response.status(),200,path);
   await page.waitForTimeout(150);
   assert.equal(await page.locator('h1').count(),1,path+' heading');
   if (['/','/hi','/mr','/kn','/te','/ta'].includes(path)) {
    assert.equal(await page.locator('nav[aria-label] a[aria-current="page"]').first().getAttribute('href'), path, path+' active home');
   }
  }
  console.log('PASS key routes, all locales, active navigation');
  const fontContext = await browser.newContext();
  await fontContext.addInitScript(() => { localStorage.setItem('sg-splash-seen','1'); localStorage.setItem('sg-lang-choice','en'); });
  const fontPage = await fontContext.newPage();
  await fontPage.goto(base);await fontPage.waitForTimeout(500);
  const fonts = await fontPage.evaluate(() => performance.getEntriesByType('resource').filter(e=>e.name.includes('.woff')).map(e=>e.transferSize));
  assert.ok(fonts.length <= 3, 'English font count: '+fonts.length);
  assert.ok(fonts.reduce((a,b)=>a+b,0)<250000,'English fonts stay under 250 KB');
  assert.ok(fonts.length>0,'font budget checked on a fresh context');
  await fontContext.close();
  console.log('PASS English font budget: '+fonts.length+' files / '+fonts.reduce((a,b)=>a+b,0)+' bytes');
  await context.clearCookies();
  await page.goto(base);
  const hero=page.locator('section[aria-roledescription="carousel"]');
  const slide=()=>hero.locator('[data-slide-index][aria-pressed="true"]').getAttribute('data-slide-index');
  await hero.locator('[data-slide-index="0"]').click();
  await page.waitForTimeout(3800);
  assert.equal(await slide(),'0','manual selection remains paused while focused');
  await hero.getByRole('button',{name:'Pause carousel',exact:true}).click();
  await page.mouse.move(1250,890);
  await page.evaluate(()=>document.activeElement.blur());
  await page.waitForTimeout(3800);
  assert.equal(await slide(),'0','explicit pause survives mouse leave and blur');
  await hero.getByRole('button',{name:'Play carousel',exact:true}).click();
  await page.mouse.move(1250,890);await page.evaluate(()=>document.activeElement.blur());
  await page.waitForTimeout(3800);
  assert.equal(await slide(),'1','explicit resume allows autoplay');
  await page.emulateMedia({reducedMotion:'reduce'});
  await hero.locator('[data-slide-index="3"]').click();await page.waitForTimeout(3800);
  assert.equal(await slide(),'3','reduced motion permits manual navigation without autoplay');
  console.log('PASS carousel hover/focus, explicit pause/resume, reduced motion');
  await page.goto(base+'/contact');
  await page.locator('[name="name"]').fill('Automated test');
  await page.locator('[name="email"]').fill('test@example.invalid');
  await page.locator('[name="message"]').fill('Mocked enquiry. Never delivered.');
  let count=0;
  await page.route('https://api.web3forms.com/submit',r=>{ count++; return r.fulfill({status:503,contentType:'application/json',body:'{"success":false}'}); });
  const submit=page.locator('form button[type="submit"]');
  await submit.click();await page.locator('form [role="alert"]').waitFor();
  assert.equal(count,1,'configured test access key must exercise Web3Forms');
  assert.equal(await page.locator('[name="message"]').inputValue(),'Mocked enquiry. Never delivered.');
  await page.unroute('https://api.web3forms.com/submit');
  await page.route('https://api.web3forms.com/submit',r=>r.fulfill({status:200,contentType:'application/json',body:'{"success":true}'}));
  await submit.click();await page.locator('form').waitFor({state:'detached'});
  await page.reload();
  await page.locator('[name="name"]').fill('Automated timeout');
  await page.locator('[name="email"]').fill('test@example.invalid');
  await page.locator('[name="message"]').fill('Preserve this message');
  await page.unroute('https://api.web3forms.com/submit');
  await page.route('https://api.web3forms.com/submit',async r=>{ await new Promise(resolve=>setTimeout(resolve,13500)); await r.abort().catch(()=>{}); });
  await page.locator('form button[type="submit"]').click();
  await page.locator('form [role="alert"]').waitFor({timeout:16000});
  assert.equal(await page.locator('[name="message"]').inputValue(),'Preserve this message');
  assert.equal(await page.locator('form button[type="submit"]').isEnabled(),true);
  console.log('PASS mocked enquiry failure/retry/success/timeout; nothing sent');
  for(const path of ['/rates.pdf','/hi/rates.pdf','/profile.pdf','/mr/services/oil-extraction/spec.pdf','/en/opengraph-image']) {
   const res=await context.request.get(base+path);assert.equal(res.status(),200,path);
   assert.match(res.headers()['content-type'], path.includes('.pdf')?/application\/pdf/:/image\/png/);
  }
  assert.equal((await context.request.post(base+'/api/revalidate-rates')).status(),401);
  assert.equal((await context.request.get(base+'/api/revalidate-rates')).status(),405);
  if (process.env.TEST_WEBHOOK_SECRET) {
   const headers = {'x-webhook-secret': process.env.TEST_WEBHOOK_SECRET};
   const accepted = await context.request.post(base+'/api/revalidate-rates',{headers});
   assert.equal(accepted.status(),200);
   const throttled = await context.request.post(base+'/api/revalidate-rates',{headers});
   assert.equal(throttled.status(),429);assert.ok(Number(throttled.headers()['retry-after'])>0);
  }
  console.log('PASS PDFs, social image, webhook authentication and retry behavior');
  const fresh=await browser.newContext();const q=await fresh.newPage();
  q.on('pageerror',e=>errors.push(e.message));
  await q.goto(base+'/mr/about');await q.locator('[aria-labelledby="lang-gate-title"]').waitFor();
  await q.waitForTimeout(8500);
  assert.equal(await q.locator('a.fixed[aria-hidden="true"][tabindex="-1"]').count(),2);
  await q.locator('[aria-labelledby="lang-gate-title"] button').first().click();
  assert.equal(await q.evaluate(()=>localStorage.getItem('sg-lang-choice')),'mr');
  assert.match(q.url(),/\/mr\/about$/);
  await fresh.close();console.log('PASS language card does not collide with floats; dismiss keeps locale');
  const nojs=await browser.newContext({javaScriptEnabled:false});const n=await nojs.newPage();await n.goto(base+'/about');
  const hidden=await n.locator('.reveal').evaluateAll(elements=>elements.filter(e=>getComputedStyle(e).opacity==='0').length);
  assert.equal(hidden,0,'content must stay visible without JS');await nojs.close();
  assert.deepEqual(errors,[],'no runtime/hydration errors');console.log('PASS no-JS content and no hydration errors');
 } finally { await browser.close(); }
})().catch(error=>{ console.error(error);process.exitCode=1; });
