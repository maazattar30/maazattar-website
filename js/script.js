/* ════════════════════════════════════════════════════
   maazattar.com — script.js
   ════════════════════════════════════════════════════ */

'use strict';

/* ── DOM READY ── */
document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────
     1. FADE-IN ON SCROLL
  ────────────────────────────── */
  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('vis');
          // Unobserve once animated — perf win
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.07, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.fi').forEach((el) => fadeObserver.observe(el));


  /* ──────────────────────────────
     2. MOBILE NAV BURGER
  ────────────────────────────── */
  const burger   = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');

  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      burger.classList.toggle('active', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        burger.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!burger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        burger.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }


  /* ──────────────────────────────
     3. ACTIVE NAV HIGHLIGHT ON SCROLL
  ────────────────────────────── */
  const sections   = document.querySelectorAll('section[id], footer[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navAnchors.forEach((a) => {
            a.classList.toggle('active-nav', a.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach((s) => sectionObserver.observe(s));


  /* ──────────────────────────────
     4. NAVBAR SCROLL SHADOW
  ────────────────────────────── */
  const navbar = document.getElementById('navbar');

  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run once on load


  /* ──────────────────────────────
     5. SMOOTH ANCHOR SCROLL
        (fallback for older browsers)
  ────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href   = anchor.getAttribute('href');
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 70; // nav height
        const top    = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ──────────────────────────────
     6. AUTO YEAR IN FOOTER
  ────────────────────────────── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ──────────────────────────────
     7. CONTACT FORM (UI only)
        — swap body for a real
          service like Formspree
  ────────────────────────────── */
  const form = document.getElementById('contactForm');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = form.querySelector('.form-submit');
      const name    = form.querySelector('#name').value.trim();
      const email   = form.querySelector('#email').value.trim();
      const message = form.querySelector('#message').value.trim();

      // Basic validation
      if (!name || !email || !message) {
        showFormFeedback(form, 'Please fill in all fields.', 'error');
        return;
      }

      if (!isValidEmail(email)) {
        showFormFeedback(form, 'Please enter a valid email address.', 'error');
        return;
      }

      // Simulate send (replace with real fetch to Formspree/EmailJS)
      btn.textContent = 'Sending…';
      btn.disabled = true;

      setTimeout(() => {
        form.reset();
        btn.textContent = 'Send Message →';
        btn.disabled = false;
        showFormFeedback(form, 'Message noted! Reach out via email or LinkedIn for fastest response.', 'success');
      }, 1000);
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showFormFeedback(form, message, type) {
    // Remove any existing feedback
    const existing = form.querySelector('.form-feedback');
    if (existing) existing.remove();

    const p = document.createElement('p');
    p.className = 'form-feedback';
    p.textContent = message;
    p.style.cssText = `
      font-family: var(--mono);
      font-size: 11px;
      padding: 10px 14px;
      border-radius: 6px;
      border: 1px solid ${type === 'success' ? 'rgba(57,224,155,0.35)' : 'rgba(255,107,53,0.35)'};
      background: ${type === 'success' ? 'rgba(57,224,155,0.08)' : 'rgba(255,107,53,0.08)'};
      color: ${type === 'success' ? 'var(--green)' : 'var(--orange)'};
      margin-top: 0.5rem;
    `;
    form.appendChild(p);

    // Auto-remove after 5s
    setTimeout(() => p.remove(), 5000);
  }


  /* ──────────────────────────────
     8. LAZY LOAD IMAGES
        (if you add images later)
  ────────────────────────────── */
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading is supported
    document.querySelectorAll('img[data-src]').forEach((img) => {
      img.src = img.dataset.src;
    });
  } else {
    // Fallback: IntersectionObserver
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          imgObserver.unobserve(img);
        }
      });
    });
    document.querySelectorAll('img[data-src]').forEach((img) => imgObserver.observe(img));
  }


  /* ──────────────────────────────
     9. KEYBOARD NAVIGATION
        — Escape closes mobile nav
  ────────────────────────────── */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      burger.classList.remove('active');
      burger.setAttribute('aria-expanded', 'false');
      burger.focus();
    }
  });

});
