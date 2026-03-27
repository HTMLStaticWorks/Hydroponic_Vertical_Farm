/* ============================================================
   HYDROPONIC FARM — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initRTL();
  initHamburger();
  initActiveLink();
  initScrollReveal();
  initCounters();
  initScrollNav();
  initAccordions();
  initCarousel();
  initBackToTop();
  initTabs();
});

/* ── Theme Toggle ──────────────────────────────── */
function initTheme() {
  const html = document.documentElement;
  const saved = localStorage.getItem('farm-theme') || 'light';
  html.setAttribute('data-theme', saved);
  updateThemeBtn(saved);

  document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('farm-theme', next);
      updateThemeBtn(next);
      document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: next } }));
    });
  });
}

function updateThemeBtn(theme) {
  document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
    btn.textContent = theme === 'dark' ? '☀️' : '🌙';
    btn.title = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    btn.classList.toggle('active', theme === 'dark');
  });
}

/* ── RTL Toggle ──────────────────────────────── */
function initRTL() {
  const html = document.documentElement;
  const saved = localStorage.getItem('farm-rtl') || 'ltr';
  html.setAttribute('dir', saved);
  updateRTLBtn(saved);

  document.querySelectorAll('[data-rtl-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = html.getAttribute('dir');
      const next = current === 'rtl' ? 'ltr' : 'rtl';
      html.setAttribute('dir', next);
      localStorage.setItem('farm-rtl', next);
      updateRTLBtn(next);
    });
  });
}

function updateRTLBtn(dir) {
  document.querySelectorAll('[data-rtl-toggle]').forEach(btn => {
    btn.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
    btn.title = dir === 'rtl' ? 'Switch to Left-to-Right' : 'Switch to Right-to-Left';
    btn.classList.toggle('active', dir === 'rtl');
  });
}

/* ── Hamburger Menu ──────────────────────────── */
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('nav-overlay');
  const closeBtn = document.getElementById('mobile-close');

  if (!hamburger || !mobileMenu) return;

  function openMenu() {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (overlay) overlay.addEventListener('click', closeMenu);

  // Close on nav link click
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
}

/* ── Active Nav Link ─────────────────────────── */
function initActiveLink() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('a.nav-link, .mobile-nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

/* ── Scroll-detect Nav shadow ────────────────── */
function initScrollNav() {
  const nav = document.querySelector('.site-nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ── Scroll Reveal ───────────────────────────── */
function initScrollReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ── Animated Counters ───────────────────────── */
function initCounters() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-counter]').forEach(el => obs.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-counter'), 10);
  const duration = 2000;
  const start = performance.now();
  const prefix = el.getAttribute('data-prefix') || '';
  const suffix = el.getAttribute('data-suffix') || '';

  const tick = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(ease * target);
    el.textContent = prefix + current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ── Accordion ───────────────────────────────── */
function initAccordions() {
  document.querySelectorAll('.accordion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.accordion-item');
      const isOpen = item.classList.contains('open');
      // Close siblings
      btn.closest('.accordion')?.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* ── Carousel ────────────────────────────────── */
function initCarousel() {
  document.querySelectorAll('.carousel').forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    const dots = carousel.querySelectorAll('.dot');
    if (!track || slides.length === 0) return;

    let current = 0;
    const total = slides.length;
    let timer;

    function goTo(idx) {
      current = (idx + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    prevBtn?.addEventListener('click', () => goTo(current - 1));
    nextBtn?.addEventListener('click', () => goTo(current + 1));
    dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));

    // Auto-advance
    timer = setInterval(() => goTo(current + 1), 5000);
    carousel.addEventListener('mouseenter', () => clearInterval(timer));
    carousel.addEventListener('mouseleave', () => { timer = setInterval(() => goTo(current + 1), 5000); });

    goTo(0);
  });
}

/* ── Back To Top ─────────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 400), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── Tab Switcher ────────────────────────────── */
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('[data-tabs]') || btn.closest('.tabs-wrapper');
      if (!group) return;
      group.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.getAttribute('data-tab');
      group.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id === target));
    });
  });
}

/* ── Form Validation ─────────────────────────── */
function validateField(input) {
  const val = input.value.trim();
  let isValid = true;
  if (input.required && !val) isValid = false;
  if (input.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) isValid = false;
  input.style.borderColor = isValid ? '' : '#ef4444';
  return isValid;
}

function initForms() {
  document.querySelectorAll('form[data-validate]').forEach(form => {
    form.addEventListener('submit', e => {
      let valid = true;
      form.querySelectorAll('[required]').forEach(input => { if (!validateField(input)) valid = false; });
      if (!valid) {
        e.preventDefault();
        const first = form.querySelector('[required]');
        first?.focus();
      } else {
        e.preventDefault();
        // Show success state
        form.innerHTML = `
          <div class="flex-center" style="padding:3rem;flex-direction:column;gap:1rem;text-align:center;">
            <div style="font-size:3rem">✅</div>
            <h3 style="color:var(--primary)">Thank You!</h3>
            <p>Your message has been received. Our team will contact you within 24 hours.</p>
          </div>`;
      }
    });
    form.querySelectorAll('[required]').forEach(input => input.addEventListener('blur', () => validateField(input)));
  });
}

document.addEventListener('DOMContentLoaded', initForms);
