export async function scrapePage(url) {
  const isProd = import.meta.env.PROD;
  let rawHTML = '';

  // Step 1: Try Puppeteer backend (local dev only)
  if (!isProd) {
    try {
      const res = await fetch(`http://localhost:3001/scrape?url=${encodeURIComponent(url)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.html && data.html.length > 100) rawHTML = data.html;
      }
    } catch (e) {
      console.warn('Local Puppeteer failed:', e.message);
    }
  }

  // Step 2: Fallback to allorigins
  if (!rawHTML) {
    try {
      const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.contents && data.contents.length > 100) rawHTML = data.contents;
      }
    } catch (e) {
      console.warn('allorigins failed:', e.message);
    }
  }

  // Step 3: Always get Jina markdown
  let markdown = '';
  try {
    const jinaRes = await fetch(`https://r.jina.ai/${encodeURIComponent(url)}`, {
      headers: { 'Accept': 'text/markdown', 'X-Return-Format': 'markdown' }
    });
    if (jinaRes.ok) markdown = await jinaRes.text();
  } catch (e) {
    console.warn('Jina failed:', e.message);
  }

  return { rawHTML, markdown: markdown.slice(0, 8000) };
}
