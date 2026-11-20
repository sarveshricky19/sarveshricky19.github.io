async function loadSubstack() {
  const grid = document.getElementById('substack-grid');
  if (!grid) return;
  try {
    const feed = 'https://isarvesh19.substack.com/feed';
    const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed)}`);
    if (!response.ok) throw new Error('Feed unavailable');
    const data = await response.json();
    if (!data.items?.length) throw new Error('No posts yet');
    grid.replaceChildren(...data.items.slice(0, 3).map(item => {
      const link = document.createElement('a');
      link.className = 'feed-card'; link.href = item.link; link.target = '_blank'; link.rel = 'noreferrer';
      const title = document.createElement('strong'); title.textContent = item.title;
      const date = document.createElement('small');
      const parsed = new Date(item.pubDate); date.textContent = Number.isNaN(parsed.valueOf()) ? 'Read on Substack ↗' : `${parsed.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} · Read on Substack ↗`;
      link.append(title, date); return link;
    }));
  } catch {
    const message = document.createElement('p'); message.className = 'section-intro'; message.textContent = 'I’m working on the next one. Browse my notes on Substack ↗';
    grid.replaceChildren(message);
  }
}
document.addEventListener('DOMContentLoaded', loadSubstack);
