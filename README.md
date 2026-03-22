# 🌐 Sarvesh S — Portfolio

A modern, responsive developer portfolio showcasing my work as a **Backend Software Engineer**. Built with vanilla HTML, CSS, and JavaScript — no frameworks, no build tools.

🔗 **Live:** [sarveshricky19.github.io](https://sarveshricky19.github.io)

---

## ✨ Features

| Feature | Details |
|---|---|
| **Typing Animation** | Rotating roles (Backend Engineer, API Gateway Specialist, etc.) |
| **Scroll Reveal** | Elements animate into view using Intersection Observer |
| **Counter Animation** | Stats (3+ years, 10K+ invoices, 30% perf boost) count up on scroll |
| **Dynamic Blog Feed** | Pulls latest articles from Medium via `rss2json` API |
| **Responsive Navbar** | Sticky header with mobile hamburger menu & active section highlighting |
| **Smooth Scrolling** | Anchor links smoothly scroll to target sections |
| **Glassmorphism UI** | Modern frosted-glass cards with gradient accents |
| **Floating Badges** | Animated stat badges orbiting the hero avatar |

---

## 📂 Project Structure

```
portfolio/
├── index.html    # Single-page markup (Hero → About → Skills → Experience → Education → Blog → Contact)
├── style.css     # Full design system — grid layout, animations, responsive breakpoints
├── script.js     # Typing effect, nav logic, scroll reveal, counters, Medium feed
├── avatar.png    # Profile photo
└── README.md
```

---

## 🧩 Sections

- **Hero** — Intro with typing animation, CTA buttons, social links, and avatar with floating badges
- **About** — Bio + animated stat counters
- **Skills** — Categorised tech stack (Languages, Backend, Frontend, Databases, Infrastructure, Tools)
- **Experience** — Timeline cards for Yappes (SDE-2) and Byju's (SDE Full Stack)
- **Education** — MS in Software Dev (Scaler) & BE in CS (KCT)
- **Blog** — Auto-fetched Medium articles with thumbnails, read time, tags, and error fallback
- **Contact** — Email, phone, location + social cards (LinkedIn, GitHub, Instagram, Spotify, Fiverr, Medium)

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Markup** | HTML5 (Semantic) |
| **Styling** | Vanilla CSS (Custom Properties, Grid, Flexbox, Animations, `@media` queries) |
| **Logic** | Vanilla JavaScript (ES6+, Intersection Observer, Fetch API) |
| **Icons** | [Font Awesome 6](https://fontawesome.com/) |
| **Blog API** | [rss2json](https://rss2json.com/) (Medium RSS → JSON) |
| **Hosting** | GitHub Pages |

---

## 🚀 Run Locally

```bash
# Clone the repo
git clone https://github.com/sarveshricky19/sarveshricky19.github.io.git
cd sarveshricky19.github.io

# Open in browser (macOS)
open index.html

# Or use any static file server
npx serve .
```

No dependencies. No build step. Just open `index.html`.

---

## 📬 Contact

- **Email:** isarvesh19@outlook.com
- **LinkedIn:** [sarvesh1999](https://www.linkedin.com/in/sarvesh1999)
- **GitHub:** [sarveshricky19](https://github.com/sarveshricky19)
- **Medium:** [@sarvesh19ricky](https://medium.com/@sarvesh19ricky)
- **Instagram:** [@sarvesh.19](https://www.instagram.com/sarvesh.19)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
