import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getSeoSettings, seoHeaders, seoRedirects } from '../config/seo.mjs';
import { pageMetadata, absoluteUrl } from '../i18n/seo';
import { routing } from '../i18n/routing';
import sitemap from '../app/sitemap';
import { services } from '../data/services';
import { classifyConversion, routeContext } from '../lib/conversion-events';

test('canonical configuration rejects unsafe URLs and uses a fixed HTTPS origin', () => {
 assert.equal(getSeoSettings({}).origin,'https://sachingold.com');
 for(const url of ['http://sachingold.com','https://u:p@sachingold.com','https://sachingold.com/path','https://sachingold.com?x=1','https://sachingold.com/#x','javascript:alert(1)']) assert.throws(()=>getSeoSettings({NEXT_PUBLIC_SITE_URL:url}));
 assert.equal(getSeoSettings({NEXT_PUBLIC_SITE_URL:'http://localhost:3100'}).origin,'http://localhost:3100');
});
test('alias controls block indexing without blocking production or matching fake domains', () => {
 const headers=seoHeaders({});const alias=headers.find(rule=>rule.has)?.has?.[0]?.value;
 assert.ok(alias);
 assert.equal(new RegExp('^'+alias+'$').test('sachin-gold-v2.vercel.app'),true);
 assert.equal(new RegExp('^'+alias+'$').test('sachingold.com'),false);
 assert.equal(new RegExp('^'+alias+'$').test('fakeXvercelXapp'),false);
 assert.equal(seoHeaders({VERCEL_ENV:'preview'}).filter(rule=>rule.source==='/:path*'&&!rule.has).length,1);
 const redirects=seoRedirects({});assert.equal(redirects[0]?.destination,'https://sachingold.com/:path*');
 assert.equal(seoRedirects({VERCEL_ENV:'preview'}).length,0);
});
test('each localized page has reciprocal absolute canonicals and hreflang', () => {
 const long='A complete meaningful description. '.repeat(8).trim();
 for(const locale of routing.locales){
  const metadata=pageMetadata({locale,path:'/services/logistics',title:'Logistics',description:long});
  assert.equal(metadata.alternates?.canonical,absoluteUrl(locale,'/services/logistics'));
  assert.equal(Object.keys(metadata.alternates?.languages || {}).length,7);
  assert.equal(metadata.description,long);
  assert.equal((metadata.openGraph as {alternateLocale?: string[]}).alternateLocale?.length,5);
 }
 const home=pageMetadata({locale:'en',path:'/',description:'Home'});
 assert.equal('title' in home,false,'preserve the root default title');
});
test('verification tokens are optional and preview metadata is noindex', () => {
 const previous={google:process.env.GOOGLE_SITE_VERIFICATION,bing:process.env.BING_SITE_VERIFICATION,vercel:process.env.VERCEL_ENV};
 try{
  process.env.GOOGLE_SITE_VERIFICATION='test-public-google';process.env.BING_SITE_VERIFICATION='test-public-bing';process.env.VERCEL_ENV='preview';
  const meta=pageMetadata({locale:'en',path:'/',description:'Home'});
  assert.equal(meta.verification?.google,'test-public-google');
  assert.equal(meta.verification?.other?.['msvalidate.01'],'test-public-bing');
  assert.equal((meta.robots as {index?:boolean}).index,false);
 }finally{for(const [key,value] of Object.entries({GOOGLE_SITE_VERIFICATION:previous.google,BING_SITE_VERIFICATION:previous.bing,VERCEL_ENV:previous.vercel})){if(value===undefined)delete process.env[key];else process.env[key]=value}}
});
test('sitemap lists every real localized route once, with no invented modification date', () => {
 const entries=sitemap();assert.equal(entries.length,(6+services.length)*routing.locales.length);
 assert.equal(new Set(entries.map(e=>e.url)).size,entries.length);
 for(const entry of entries){
  assert.equal(Object.keys(entry.alternates?.languages || {}).length,7);
  assert.equal(entry.lastModified,undefined);
  assert.ok(!entry.url.includes('#')&&!entry.url.includes('?'));
  assert.ok(!entry.url.includes('/en/'));
 }
});
test('conversion classification never collects contact details, query strings or arbitrary paths', () => {
 const origin='https://sachingold.com';
 assert.equal(classifyConversion('https://wa.me/919422952233?text=PRIVATE',origin),'whatsapp_click');
 assert.equal(classifyConversion('tel:+919422952233',origin),'phone_click');
 assert.equal(classifyConversion('mailto:private@example.com?body=PRIVATE',origin),'email_click');
 assert.equal(classifyConversion('/mr/contact?message=PRIVATE',origin),'enquiry_click');
 assert.equal(classifyConversion('/hi/rates.pdf',origin),'pdf_download');
 for(const href of ['https://example.com/contact','https://wa.me.evil.test/','javascript:alert(1)','/about'])assert.equal(classifyConversion(href,origin),null);
 assert.deepEqual(routeContext('/mr/services/logistics'),{locale:'mr',page:'/services/logistics'});
 assert.deepEqual(routeContext('/people/private@example.com'),{locale:'en',page:'other'});
});
