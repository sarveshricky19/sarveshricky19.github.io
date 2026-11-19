// ========================
// NAVIGATION
// ========================
function initNavigation() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const navLinksItems = document.querySelectorAll('.nav-links a:not(.nav-cta)');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Hamburger menu
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close menu on link click
  navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');

  function highlightNav() {
    const scrollPos = window.scrollY + 150;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinksItems.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNav);
}

// ========================
// SCROLL REVEAL
// ========================
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

// ========================
// SMOOTH SCROLL
// ========================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ========================
// COUNTER ANIMATION
// ========================
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const end = target.getAttribute('data-count');
        const suffix = target.getAttribute('data-suffix') || '';
        const prefix = target.getAttribute('data-prefix') || '';
        let current = 0;
        const increment = Math.ceil(parseInt(end) / 60);

        const timer = setInterval(() => {
          current += increment;
          if (current >= parseInt(end)) {
            current = parseInt(end);
            clearInterval(timer);
          }
          target.textContent = prefix + current + suffix;
        }, 25);

        observer.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

// ========================
// SKILL FILTERS
// ========================
function initSkillFilters() {
  const buttons = document.querySelectorAll('[data-skill-filter]');
  const cards = document.querySelectorAll('[data-skill-group]');
  const status = document.getElementById('skill-filter-status');
  if (!buttons.length || !cards.length) return;

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.skillFilter;
      let shown = 0;
      cards.forEach(card => {
        const visible = filter === 'all' || card.dataset.skillGroup === filter;
        card.hidden = !visible;
        if (visible) {
          shown += 1;
          card.classList.add('visible');
        }
      });

      buttons.forEach(item => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });

      if (status) {
        const label = button.textContent.trim();
        status.textContent = filter === 'all'
          ? `Showing all ${shown} skill cards`
          : `Showing ${shown} group${shown === 1 ? '' : 's'} for ${label}`;
      }
    });
  });
}

// ========================
// GATEWAY WALKTHROUGH
// ========================
function initGatewayWalkthrough() {
  const buttons = document.querySelectorAll('[data-gateway-choice]');
  const detail = document.getElementById('gateway-choice-detail');
  const explanations = {
    limits: "Set a ceiling per client so a traffic spike—or one noisy tenant—doesn't consume all the gateway's capacity.",
    balance: "Distribute requests across available instances so work is shared and traffic can keep moving as capacity changes.",
    breakers: "Stop repeating calls to a dependency that is already failing; give it room to recover before trying again.",
    cache: "Keep frequently requested data close to the API so the same read does not have to travel back to the database every time.",
    sharding: "Partition a growing dataset across databases when one database can no longer comfortably serve the workload."
  };
  if (!buttons.length || !detail) return;

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      buttons.forEach(item => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      detail.textContent = explanations[button.dataset.gatewayChoice];
    });
  });
}

// ========================
// SUBSTACK AND MEDIUM FEEDS
// ========================
async function fetchArticles({ gridId, loadingId, feedUrl, profileUrl, platform }) {
  const grid = document.getElementById(gridId);
  const loading = document.getElementById(loadingId);
  if (!grid || !loading) return;

  const rssUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
  try {
    const response = await fetch(rssUrl);
    if (!response.ok) throw new Error(`Feed request failed: ${response.status}`);
    const data = await response.json();
    if (data.status !== 'ok' || !data.items?.length) throw new Error('No posts found');

    loading.remove();
    const articles = data.items.slice(0, 3);
    articles.forEach((article, index) => {
      const card = createBlogCard(article, index, platform);
      grid.appendChild(card);
    });
  } catch (error) {
    console.error(`Failed to fetch ${platform} posts:`, error);
    loading.innerHTML = '';
    const errorMessage = document.createElement('div');
    errorMessage.className = 'blog-error';
    const message = document.createElement('p');
    message.textContent = `Couldn't load ${platform} posts right now.`;
    const link = document.createElement('a');
    link.href = profileUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = 'btn-primary';
    link.style.marginTop = '16px';
    link.textContent = `Visit ${platform}`;
    errorMessage.append(message, link);
    loading.appendChild(errorMessage);
  }
}

function createBlogCard(article, index, platform) {
  const card = document.createElement('a');
  card.href = article.link;
  card.target = '_blank';
  card.rel = 'noopener noreferrer';
  card.className = `blog-card reveal reveal-delay-${(index % 3) + 1}`;

  const parser = new DOMParser();
  const articleHtml = parser.parseFromString(article.description || '', 'text/html');
  const textContent = (articleHtml.body.textContent || '').replace(/\s+/g, ' ').trim();
  const thumbnail = article.thumbnail || articleHtml.querySelector('img')?.src || '';
  const wordCount = textContent.split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));
  const pubDate = new Date(article.pubDate);
  const dateStr = Number.isNaN(pubDate.getTime()) ? '' : pubDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  const tags = (article.categories || []).slice(0, 3);
  let excerpt = textContent.substring(0, 140);
  const lastSpace = excerpt.lastIndexOf(' ');
  if (lastSpace > 100) excerpt = excerpt.substring(0, lastSpace);
  if (textContent.length > excerpt.length) excerpt += '…';

  if (thumbnail) {
    const imageWrap = document.createElement('div');
    imageWrap.className = 'blog-card-image';
    const image = document.createElement('img');
    image.src = thumbnail;
    image.alt = '';
    image.loading = 'lazy';
    imageWrap.appendChild(image);
    const overlay = document.createElement('div');
    overlay.className = 'blog-card-overlay';
    imageWrap.appendChild(overlay);
    card.appendChild(imageWrap);
  } else {
    const placeholder = document.createElement('div');
    placeholder.className = 'blog-card-image blog-card-image-placeholder';
    const icon = document.createElement('i');
    icon.className = 'fas fa-pen-nib';
    placeholder.appendChild(icon);
    card.appendChild(placeholder);
  }

  const body = document.createElement('div');
  body.className = 'blog-card-body';
  const meta = document.createElement('div');
  meta.className = 'blog-card-meta';
  if (dateStr) {
    const date = document.createElement('span');
    date.className = 'blog-card-date';
    date.textContent = dateStr;
    meta.appendChild(date);
  }
  const time = document.createElement('span');
  time.className = 'blog-card-readtime';
  time.textContent = `${readTime} min read`;
  meta.appendChild(time);
  body.appendChild(meta);

  const title = document.createElement('h3');
  title.className = 'blog-card-title';
  title.textContent = article.title || 'Untitled post';
  body.appendChild(title);
  const excerptEl = document.createElement('p');
  excerptEl.className = 'blog-card-excerpt';
  excerptEl.textContent = excerpt;
  body.appendChild(excerptEl);

  if (tags.length) {
    const tagWrap = document.createElement('div');
    tagWrap.className = 'blog-card-tags';
    tags.forEach(tag => {
      const tagEl = document.createElement('span');
      tagEl.className = 'blog-tag';
      tagEl.textContent = tag;
      tagWrap.appendChild(tagEl);
    });
    body.appendChild(tagWrap);
  }
  const footer = document.createElement('div');
  footer.className = 'blog-card-footer';
  const readMore = document.createElement('span');
  readMore.className = 'blog-read-more';
  readMore.textContent = `Read on ${platform} →`;
  footer.appendChild(readMore);
  body.appendChild(footer);
  card.appendChild(body);

  // Trigger reveal after a small delay
  setTimeout(() => {
    card.classList.add('visible');
  }, 100 + index * 150);

  return card;
}

// ========================
// INITIALIZE
// ========================
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollReveal();
  initSmoothScroll();
  animateCounters();
  initSkillFilters();
  initGatewayWalkthrough();
  fetchArticles({
    gridId: 'substack-grid',
    loadingId: 'substack-loading',
    feedUrl: 'https://isarvesh19.substack.com/feed',
    profileUrl: 'https://open.substack.com/pub/isarvesh19',
    platform: 'Substack'
  });
  fetchArticles({
    gridId: 'medium-grid',
    loadingId: 'medium-loading',
    feedUrl: 'https://medium.com/feed/@sarvesh19ricky',
    profileUrl: 'https://medium.com/@sarvesh19ricky',
    platform: 'Medium'
  });
});
