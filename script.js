// ========================
// TYPING ANIMATION
// ========================
class TypeWriter {
  constructor(element, words, wait = 2000) {
    this.element = element;
    this.words = words;
    this.wait = parseInt(wait, 10);
    this.wordIndex = 0;
    this.txt = '';
    this.isDeleting = false;
    this.type();
  }

  type() {
    const current = this.wordIndex % this.words.length;
    const fullTxt = this.words[current];

    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.element.textContent = this.txt;

    let typeSpeed = 80;

    if (this.isDeleting) {
      typeSpeed /= 2;
    }

    if (!this.isDeleting && this.txt === fullTxt) {
      typeSpeed = this.wait;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      this.wordIndex++;
      typeSpeed = 400;
    }

    setTimeout(() => this.type(), typeSpeed);
  }
}

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
// MEDIUM BLOG FEED
// ========================
async function fetchMediumArticles() {
  const grid = document.getElementById('blog-grid');
  const loading = document.getElementById('blog-loading');
  const MEDIUM_USER = '@sarvesh19ricky';
  const RSS_URL = `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/${MEDIUM_USER}`;

  try {
    const response = await fetch(RSS_URL);
    const data = await response.json();

    if (data.status !== 'ok' || !data.items || data.items.length === 0) {
      throw new Error('No articles found');
    }

    // Remove loading state
    if (loading) loading.remove();

    // Render articles (max 6)
    const articles = data.items.slice(0, 6);
    articles.forEach((article, index) => {
      const card = createBlogCard(article, index);
      grid.appendChild(card);
    });

  } catch (error) {
    console.error('Failed to fetch Medium articles:', error);
    if (loading) {
      loading.innerHTML = `
        <div class="blog-error">
          <i class="fas fa-exclamation-circle"></i>
          <p>Couldn't load articles right now.</p>
          <a href="https://medium.com/${MEDIUM_USER}" target="_blank" class="btn-primary" style="margin-top:16px;">
            <i class="fab fa-medium-m"></i> Visit Medium Profile
          </a>
        </div>
      `;
    }
  }
}

function createBlogCard(article, index) {
  const card = document.createElement('a');
  card.href = article.link;
  card.target = '_blank';
  card.rel = 'noopener noreferrer';
  card.className = `blog-card reveal reveal-delay-${(index % 3) + 1}`;

  // Extract thumbnail from content or use a fallback
  let thumbnail = article.thumbnail;
  if (!thumbnail || thumbnail === '') {
    const imgMatch = article.description?.match(/<img[^>]+src="([^">]+)"/);
    thumbnail = imgMatch ? imgMatch[1] : '';
  }

  // Calculate read time (~200 words/min)
  const textContent = article.description?.replace(/<[^>]+>/g, '') || '';
  const wordCount = textContent.split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  // Format date
  const pubDate = new Date(article.pubDate);
  const dateStr = pubDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Get categories/tags
  const tags = (article.categories || []).slice(0, 3);

  // Create excerpt (strip HTML, limit to ~120 chars)
  let excerpt = textContent.substring(0, 140);
  const lastSpace = excerpt.lastIndexOf(' ');
  if (lastSpace > 100) excerpt = excerpt.substring(0, lastSpace);
  excerpt += '…';

  card.innerHTML = `
    ${thumbnail ? `
      <div class="blog-card-image">
        <img src="${thumbnail}" alt="${article.title}" loading="lazy">
        <div class="blog-card-overlay"></div>
      </div>
    ` : `
      <div class="blog-card-image blog-card-image-placeholder">
        <i class="fas fa-code"></i>
        <div class="blog-card-overlay"></div>
      </div>
    `}
    <div class="blog-card-body">
      <div class="blog-card-meta">
        <span class="blog-card-date"><i class="far fa-calendar-alt"></i> ${dateStr}</span>
        <span class="blog-card-readtime"><i class="far fa-clock"></i> ${readTime} min read</span>
      </div>
      <h3 class="blog-card-title">${article.title}</h3>
      <p class="blog-card-excerpt">${excerpt}</p>
      ${tags.length > 0 ? `
        <div class="blog-card-tags">
          ${tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
        </div>
      ` : ''}
      <div class="blog-card-footer">
        <span class="blog-read-more">Read Article <i class="fas fa-arrow-right"></i></span>
      </div>
    </div>
  `;

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
  // Typing animation
  const typedEl = document.querySelector('.typed-text');
  if (typedEl) {
    new TypeWriter(typedEl, [
      'Backend Engineer',
      'API Gateway Specialist',
      'Microservices Architect',
      'Node.js Developer',
      'System Designer'
    ], 2000);
  }

  initNavigation();
  initScrollReveal();
  initSmoothScroll();
  animateCounters();
  fetchMediumArticles();
});
