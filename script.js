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

const chapters = [
  { year:'2026', hint:'CHAPTER 1 · NOW', company:'DELIGHTREE', title:'Search that knows the product', copy:'MongoDB pipelines, BigQuery analytics, and RAG search.', target:'delightree' },
  { year:'2024', hint:'CHAPTER 2 · THE GATEWAY YEARS', company:'YAPPES', title:'Keeping traffic moving', copy:'Rate limits, load balancing, circuit breakers, caching, and sharding.', target:'yappes' },
  { year:'2021', hint:'CHAPTER 3 · WHERE IT STARTED', company:'BYJU’S', title:'Making the money add up', copy:'Invoices, credit notes, payments, and the integrations behind them.', target:'byjus' }
];
document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('story-year');
  const company = document.getElementById('screen-company');
  const title = document.getElementById('screen-title');
  const copy = document.getElementById('screen-copy');
  const hint = document.getElementById('story-hint');
  const dots = [...document.querySelectorAll('[data-chapter]')];
  const rewind = document.getElementById('rewind');
  if (!year || !company || !title || !copy || !hint || !rewind) return;
  let active = 0;
  const showChapter = index => {
    active = (index + chapters.length) % chapters.length;
    const chapter = chapters[active];
    year.textContent = chapter.year;
    company.textContent = chapter.company;
    title.textContent = chapter.title;
    copy.textContent = chapter.copy;
    hint.textContent = chapter.hint;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === active));
    const section = document.getElementById(chapter.target);
    if (section) section.open = true;
  };
  rewind.addEventListener('click', () => showChapter(active + 1));
  dots.forEach(dot => dot.addEventListener('click', () => showChapter(Number(dot.dataset.chapter))));
});
