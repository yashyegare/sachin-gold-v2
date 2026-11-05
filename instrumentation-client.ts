import { classifyConversion } from './lib/conversion-events';
import { trackConversion } from './lib/conversions';

// Queue early events until the existing Analytics component loads its script.
if (!window.va) {
  window.va = (event, properties) => {
    window.vaq ||= [];
    window.vaq.push([event, properties]);
  };
}

// Next.js loads client instrumentation once before hydration. Delegation also
// covers links introduced by client-side navigation without changing any UI.
document.addEventListener('click', event => {
  if (!(event.target instanceof Element)) return;
  const link = event.target.closest<HTMLAnchorElement>('a[href]');
  if (!link) return;
  const name = classifyConversion(link.href, window.location.origin);
  if (!name) return;
  const source = link.closest('header') ? 'header' : link.closest('footer') ? 'footer' : link.classList.contains('fixed') ? 'floating' : 'content';
  trackConversion(name, source);
}, { capture: true });
