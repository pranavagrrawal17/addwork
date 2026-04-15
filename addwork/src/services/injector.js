export function injectChanges(rawHTML, pageChanges, pageUrl) {
  try {
    const origin = new URL(pageUrl).origin;
    const baseTag = `<base href="${origin}/">`;
    let html = rawHTML.replace(/<head>/i, `<head>${baseTag}`);
    html = html.replace(/<meta[^>]*Content-Security-Policy[^>]*>/gi, '');

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    try {
      const el = doc.querySelector('h1, [class*="headline"], [class*="hero-title"]');
      if (el && pageChanges.headline) el.textContent = pageChanges.headline;
    } catch(e) {}

    try {
      const el = doc.querySelector('h2, [class*="subheadline"], [class*="subtitle"]');
      if (el && pageChanges.subheadline) el.textContent = pageChanges.subheadline;
    } catch(e) {}

    try {
      const heroSection = doc.querySelector('main, article, section, .hero, .banner, [class*="hero"]');
      const el = heroSection ? heroSection.querySelector('p') : doc.querySelector('p');
      if (el && pageChanges.hero_copy) el.textContent = pageChanges.hero_copy;
    } catch(e) {}

    try {
      const el = doc.querySelector('button, a[class*="cta"], a[class*="btn"], [class*="button"]');
      if (el && pageChanges.cta_text) el.textContent = pageChanges.cta_text;
    } catch(e) {}

    try {
      if (pageChanges.headline) {
        const h1El = doc.querySelector('h1');
        const block = doc.createElement('div');
        block.style.cssText = 'background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:1.5rem 2rem;margin:1rem 0;font-family:inherit;';
        block.innerHTML = `
          <p style="font-size:0.7rem;font-weight:600;color:#94a3b8;letter-spacing:0.1em;margin:0 0 0.5rem;">FEATURED</p>
          <h2 style="font-size:1.5rem;font-weight:700;color:#0f172a;margin:0 0 0.75rem;">${pageChanges.headline}</h2>
          <p style="font-size:0.95rem;color:#475569;margin:0 0 1rem;line-height:1.6;">${pageChanges.hero_copy}</p>
          <a href="#" style="display:inline-block;padding:0.6rem 1.5rem;background:#4f46e5;color:white;border-radius:6px;text-decoration:none;font-weight:600;font-size:0.9rem;">${pageChanges.cta_text}</a>
          ${pageChanges.urgency_element ? `<p style="font-size:0.8rem;color:#dc2626;margin:0.75rem 0 0;font-weight:500;">${pageChanges.urgency_element}</p>` : ''}
        `;
        if (h1El) h1El.parentNode.insertBefore(block, h1El.nextSibling);
        else doc.body.prepend(block);
      }
    } catch(e) {}

    return new XMLSerializer().serializeToString(doc);
  } catch(e) {
    return null;
  }
}
