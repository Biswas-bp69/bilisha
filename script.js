/* ============================================
   PORTFOLIO — script.js
   All interactive features
   ============================================ */

/* ── 1. Theme System ── */
const THEME_KEY = 'portfolio-theme';

function getTheme() {
  return localStorage.getItem(THEME_KEY) ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
}

function applyTheme(theme, animate = true) {
  if (!animate) document.body.classList.add('no-transition');
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    btn.setAttribute('title', theme === 'dark' ? 'Switch to light' : 'Switch to dark');
  });
  if (!animate) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => document.body.classList.remove('no-transition'));
    });
  }
}

function toggleTheme() {
  const current = getTheme();
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

// Init theme without flicker
applyTheme(getTheme(), false);

document.addEventListener('DOMContentLoaded', () => {
  applyTheme(getTheme(), false);
  document.querySelectorAll('.theme-toggle').forEach(btn =>
    btn.addEventListener('click', toggleTheme)
  );
});

/* ── 2. Page Loader ── */
window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 400);
  }
});

/* ── 3. Scroll Reveal (Intersection Observer) ── */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));
}

/* ── 4. Typing Animation ── */
function initTyping() {
  const typedEl = document.querySelector('.typed-text');
  if (!typedEl) return;

  const roles = [
    'Full-Stack Developer',
    'UI/UX Enthusiast',
    'React & Node.js Dev',
    'Open Source Contributor',
    'Problem Solver',
  ];
  let roleIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const current = roles[roleIdx];
    if (!deleting) {
      typedEl.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
    } else {
      typedEl.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
      }
    }
    setTimeout(type, deleting ? 55 : 90);
  }

  type();
}

/* ── 5. Animated Counter ── */
function animateCounter(el, target, duration = 1800) {
  let start = null;
  const step = (ts) => {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.count);
        animateCounter(entry.target, target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ── 6. Skill Bar Animation ── */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const pct = entry.target.dataset.pct || '0';
        entry.target.style.width = pct + '%';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
}

/* ── 7. Project Filter ── */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card-wrap');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        const cats = card.dataset.category || '';
        if (filter === 'all' || cats.includes(filter)) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeInUp 0.4s ease both';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ── 8. Contact Form Validation ── */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const toast = document.getElementById('success-toast');

  function showError(inputId, msg) {
    const input = document.getElementById(inputId);
    const err   = document.getElementById(inputId + '-error');
    if (!input || !err) return;
    input.classList.add('error');
    err.textContent = msg;
    err.classList.add('show');
  }

  function clearError(inputId) {
    const input = document.getElementById(inputId);
    const err   = document.getElementById(inputId + '-error');
    if (!input || !err) return;
    input.classList.remove('error');
    err.classList.remove('show');
  }

  // Live clear on input
  ['name','email','message'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => clearError(id));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const name    = document.getElementById('name');
    const email   = document.getElementById('email');
    const message = document.getElementById('message');

    clearError('name'); clearError('email'); clearError('message');

    if (!name.value.trim()) {
      showError('name', 'Please enter your name.'); valid = false;
    } else if (name.value.trim().length < 2) {
      showError('name', 'Name must be at least 2 characters.'); valid = false;
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
      showError('email', 'Please enter your email.'); valid = false;
    } else if (!emailRe.test(email.value.trim())) {
      showError('email', 'Please enter a valid email address.'); valid = false;
    }

    if (!message.value.trim()) {
      showError('message', 'Please enter your message.'); valid = false;
    } else if (message.value.trim().length < 10) {
      showError('message', 'Message must be at least 10 characters.'); valid = false;
    }

    if (valid) {
      form.reset();
      if (toast) {
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 4000);
      }
    }
  });
}

/* ── 9. Navbar Scroll Style ── */
function initNavScroll() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.style.boxShadow = window.scrollY > 20 ? '0 2px 20px rgba(0,0,0,0.10)' : 'none';
  }, { passive: true });
}

/* ── 10. Smooth Scroll for anchor links ── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ── 11. Active nav link ── */
function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    const linkFile = href.split('/').pop();
    if (linkFile === path || (path === '' && linkFile === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ── Init all ── */
document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  initScrollReveal();
  initTyping();
  initCounters();
  initSkillBars();
  initProjectFilter();
  initContactForm();
  initNavScroll();
  initSmoothScroll();
});

/* fadeInUp keyframe via JS in case CSS not parsed */
if (!document.getElementById('portfolio-keyframes')) {
  const s = document.createElement('style');
  s.id = 'portfolio-keyframes';
  s.textContent = `
    @keyframes fadeInUp {
      from { opacity:0; transform:translateY(20px); }
      to   { opacity:1; transform:translateY(0); }
    }
  `;
  document.head.appendChild(s);
}
