const assert = require('node:assert/strict');
const {chromium} = require('playwright');
const base = process.env.SPLASH_TEST_URL || 'http://localhost:3100';
(async()=>{
 const browser=await chromium.launch();
 try {
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  await page.addInitScript(()=>{localStorage.setItem('sg-splash-seen','1');localStorage.setItem('sg-lang-choice','en');});
  await page.goto(base+'/contact');
  const toggle=page.locator('button[aria-controls="mobile-nav"]');
  await toggle.click();
  assert.equal(await page.evaluate(()=>document.body.style.overflow),'hidden');
  await page.locator('#mobile-nav a').last().focus();await page.keyboard.press('Tab');
  assert.equal(await toggle.evaluate(e=>e===document.activeElement),true);
  await page.keyboard.press('Shift+Tab');assert.equal(await page.locator('#mobile-nav a').last().evaluate(e=>e===document.activeElement),true);
  await page.keyboard.press('Escape');await page.locator('#mobile-nav').waitFor({state:'detached'});
  assert.equal(await toggle.evaluate(e=>e===document.activeElement),true);
  await toggle.click();await page.locator('#mobile-nav a[href="/contact"]').click();
  await page.locator('#mobile-nav').waitFor({state:'detached'});
  await toggle.click();await page.setViewportSize({width:1280,height:900});
  await page.locator('#mobile-nav').waitFor({state:'detached'});
  assert.equal(await page.evaluate(()=>document.body.style.overflow),'');
  console.log('PASS menu keyboard loop, Escape focus, same-page closure and desktop scroll unlock');
  const email=page.locator('[name="email"]');await email.fill('invalid');await email.blur();
  assert.equal(await email.getAttribute('aria-invalid'),'true');await email.fill('test@example.invalid');
  await page.waitForFunction(()=>document.querySelector('[name="email"]').getAttribute('aria-invalid')==='false');
  await page.locator('[name="name"]').fill('UX test');await page.locator('[name="message"]').fill('Mocked polish check');
  await page.route('https://api.web3forms.com/submit',r=>r.fulfill({status:200,contentType:'application/json',body:'{"success":true}'}));
  await page.locator('form button[type="submit"]').click();await page.locator('form').waitFor({state:'detached'});
  await page.locator('[data-contact-form] button').first().click();
  await page.waitForFunction(()=>document.activeElement?.getAttribute('name')==='name');
  console.log('PASS corrected validation clears immediately; success/restart restores name focus; no enquiry delivered');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
