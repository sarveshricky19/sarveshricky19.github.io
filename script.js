async function loadSubstack() {
  const grid = document.getElementById('substack-grid');
  if (!grid) return;
  try {
    const feed = 'https://isarvesh19.substack.com/feed';
    // Substack's RSS feed doesn't permit cross-origin browser requests. Fetch
    // the public XML through a CORS-enabled proxy, then render text-only fields.
    const response = await fetch(`https://proxy.cors.dev/${feed}`, { headers: { Accept: 'application/rss+xml, application/xml, text/xml' } });
    if (!response.ok) throw new Error('Feed unavailable');
    const xml = new DOMParser().parseFromString(await response.text(), 'application/xml');
    if (xml.querySelector('parsererror')) throw new Error('Invalid feed');
    const items = [...xml.querySelectorAll('channel > item')];
    if (!items.length) {
      const empty = document.createElement('p'); empty.className = 'section-intro';
      empty.textContent = 'No public posts on the feed just yet. When I publish, they’ll show up here.';
      grid.replaceChildren(empty); return;
    }
    grid.replaceChildren(...items.slice(0, 4).map(item => {
      const link = document.createElement('a');
      const url = item.querySelector('link')?.textContent?.trim() || 'https://open.substack.com/pub/isarvesh19';
      link.className = 'feed-card'; link.href = url; link.target = '_blank'; link.rel = 'noreferrer';
      const title = document.createElement('strong'); title.textContent = item.querySelector('title')?.textContent?.trim() || 'Read on Substack';
      const date = document.createElement('small');
      const parsed = new Date(item.querySelector('pubDate')?.textContent || ''); date.textContent = Number.isNaN(parsed.valueOf()) ? 'Read on Substack ↗' : `${parsed.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} · Read on Substack ↗`;
      link.append(title, date); return link;
    }));
  } catch {
    const message = document.createElement('p'); message.className = 'section-intro'; message.textContent = 'I’m working on the next one. Browse my notes on Substack ↗';
    grid.replaceChildren(message);
  }
}
document.addEventListener('DOMContentLoaded', loadSubstack);
