/* ═══════════════════════════════════════════════════════════
   AURA PIXELS STUDIO — interactions
   GSAP + ScrollTrigger + Lenis (all optional; site works without)
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof gsap !== 'undefined';
  const hasLenis = typeof Lenis !== 'undefined';

  /* ── Preloader ── */
  const preloader = document.getElementById('preloader');
  const counter = document.getElementById('preloaderCounter');

  function finishPreloader() {
    if (!preloader || preloader.classList.contains('is-done')) return;
    preloader.classList.add('is-done');
    document.body.classList.add('is-loaded');
    playHeroIntro();
  }

  if (preloader && counter && !prefersReducedMotion) {
    let n = 0;
    const tick = setInterval(() => {
      n = Math.min(n + Math.ceil(Math.random() * 14), 100);
      counter.textContent = String(n).padStart(2, '0');
      if (n >= 100) {
        clearInterval(tick);
        setTimeout(finishPreloader, 350);
      }
    }, 90);
    // Safety: never trap the user behind the loader
    setTimeout(finishPreloader, 4000);
  } else {
    finishPreloader();
  }

  /* ── Lenis smooth scroll ── */
  let lenis = null;
  if (hasLenis && !prefersReducedMotion) {
    lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1 });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    if (hasGsap && gsap.plugins && typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', () => ScrollTrigger.update());
    }
  }

  // Anchor navigation works with Lenis
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      closeMobileMenu();
      if (lenis) lenis.scrollTo(target, { offset: -70 });
      else target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });

  /* ── Hero intro ── */
  function playHeroIntro() {
    if (!hasGsap || prefersReducedMotion) return;
    gsap.timeline()
      .from('.hero-kicker', { y: 24, opacity: 0, duration: 0.7, ease: 'power3.out' })
      .from('.hero-title .line', {
        yPercent: 110, duration: 1.05, stagger: 0.12, ease: 'power4.out'
      }, '-=0.35')
      .from('.hero-sub', { y: 20, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.55')
      .from('.hero-ctas .btn', { y: 16, opacity: 0, duration: 0.55, stagger: 0.1, ease: 'power3.out' }, '-=0.4')
      .from('.hero-hud, .hero-scrollcue', { opacity: 0, duration: 0.9 }, '-=0.3');
  }

  /* ── Scroll-triggered reveals ── */
  if (hasGsap && typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion) {
    gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll('.reveal').forEach((el) => {
      gsap.from(el, {
        y: 36,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });

    // Stat counters
    document.querySelectorAll('.stat-num').forEach((el) => {
      const target = parseFloat(el.dataset.count || '0');
      const decimals = parseInt(el.dataset.decimal || '0', 10);
      const obj = { v: 0 };
      gsap.to(obj, {
        v: target,
        duration: 1.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        onUpdate() { el.textContent = obj.v.toFixed(decimals); }
      });
    });

    // Hero parallax on scroll-out
    gsap.to('.hero-media img', {
      yPercent: 12,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  } else {
    // No-JS/no-GSAP fallback: counters show final values
    document.querySelectorAll('.stat-num').forEach((el) => {
      const d = parseInt(el.dataset.decimal || '0', 10);
      el.textContent = parseFloat(el.dataset.count || '0').toFixed(d);
    });
  }

  /* ── Navbar: glass on scroll, hide on scroll-down ── */
  const nav = document.getElementById('nav');
  const progress = document.getElementById('scrollProgress');
  const backTop = document.getElementById('backTop');
  let lastY = 0;
  let mobileOpen = false;

  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 40);
    nav.classList.toggle('is-hidden', y > 500 && y > lastY && !mobileOpen);
    lastY = y;

    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    if (progress && max > 0) progress.style.transform = 'scaleX(' + (y / max) + ')';
    if (backTop) backTop.classList.toggle('is-visible', y > 900);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backTop) {
    backTop.addEventListener('click', () => {
      if (lenis) lenis.scrollTo(0);
      else window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* ── Mobile menu ── */
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  function closeMobileMenu() {
    if (!mobileOpen) return;
    mobileOpen = false;
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    if (lenis) lenis.start();
    document.body.style.overflow = '';
  }

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      mobileOpen = !mobileOpen;
      navToggle.classList.toggle('is-open', mobileOpen);
      navToggle.setAttribute('aria-expanded', String(mobileOpen));
      navToggle.setAttribute('aria-label', mobileOpen ? 'Close menu' : 'Open menu');
      mobileMenu.classList.toggle('is-open', mobileOpen);
      mobileMenu.setAttribute('aria-hidden', String(!mobileOpen));
      if (mobileOpen) { if (lenis) lenis.stop(); document.body.style.overflow = 'hidden'; }
      else { if (lenis) lenis.start(); document.body.style.overflow = ''; }
    });
  }

  /* ── Custom cursor ── */
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (dot && ring && window.matchMedia('(pointer: fine)').matches && !prefersReducedMotion) {
    let rx = 0, ry = 0, tx = 0, ty = 0;
    window.addEventListener('mousemove', (e) => {
      tx = e.clientX; ty = e.clientY;
      dot.style.transform = 'translate(' + (tx - 3) + 'px,' + (ty - 3) + 'px)';
    }, { passive: true });
    (function followRing() {
      rx += (tx - rx) * 0.16;
      ry += (ty - ry) * 0.16;
      ring.style.transform = 'translate(' + (rx - 18) + 'px,' + (ry - 18) + 'px)';
      requestAnimationFrame(followRing);
    })();
    document.querySelectorAll('a, button, .masonry-item, .service-row, summary').forEach((el) => {
      el.addEventListener('mouseenter', () => ring.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('is-hover'));
    });
  }

  /* ── Magnetic buttons ── */
  if (hasGsap && window.matchMedia('(pointer: fine)').matches && !prefersReducedMotion) {
    document.querySelectorAll('.magnetic').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        gsap.to(el, {
          x: (e.clientX - r.left - r.width / 2) * 0.22,
          y: (e.clientY - r.top - r.height / 2) * 0.28,
          duration: 0.4, ease: 'power2.out'
        });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
      });
    });
  }

  /* ── Services: floating hover preview ── */
  const preview = document.getElementById('servicePreview');
  if (preview && window.matchMedia('(pointer: fine)').matches && !prefersReducedMotion) {
    const previewImg = preview.querySelector('img');
    document.querySelectorAll('.service-row').forEach((row) => {
      row.addEventListener('mouseenter', () => {
        previewImg.src = row.dataset.img || '';
        preview.classList.add('is-visible');
      });
      row.addEventListener('mouseleave', () => preview.classList.remove('is-visible'));
      row.addEventListener('mousemove', (e) => {
        preview.style.left = Math.min(e.clientX + 28, window.innerWidth - 320) + 'px';
        preview.style.top = (e.clientY - 105) + 'px';
      }, { passive: true });
    });
  }
  // Clicking a service scrolls to booking with the type pre-selected
  const typeSelect = document.getElementById('fType');
  const serviceToType = {
    '01': 'Wedding — Full Coverage', '02': 'Pre-Wedding',
    '03': 'Maternity / Seemantham / Valaikappu', '04': 'Birthday / Cradle / Naming Ceremony',
    '05': 'Fashion / Portrait', '06': 'Automotive',
    '07': 'Product / Commercial', '08': 'Drone / Aerial'
  };
  document.querySelectorAll('.service-row').forEach((row) => {
    row.addEventListener('click', () => {
      const num = row.querySelector('.service-num');
      if (typeSelect && num && serviceToType[num.textContent.trim()]) {
        typeSelect.value = serviceToType[num.textContent.trim()];
      }
      const book = document.getElementById('book');
      if (lenis) lenis.scrollTo(book, { offset: -70 });
      else book.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });

  /* ── Portfolio filters ── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = Array.from(document.querySelectorAll('.masonry-item'));
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const f = btn.dataset.filter;
      items.forEach((item) => {
        item.classList.toggle('is-hidden', f !== 'all' && item.dataset.cat !== f);
      });
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    });
  });

  /* ── Lightbox ── */
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  const lbCaption = document.getElementById('lightboxCaption');
  let lbIndex = 0;
  let lastFocused = null;

  function visibleItems() {
    return items.filter((i) => !i.classList.contains('is-hidden'));
  }
  function openLightbox(item) {
    const vis = visibleItems();
    lbIndex = vis.indexOf(item);
    lastFocused = document.activeElement;
    renderLightbox();
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    if (lenis) lenis.stop();
    document.body.style.overflow = 'hidden';
    document.getElementById('lightboxClose').focus();
  }
  function renderLightbox() {
    const vis = visibleItems();
    if (!vis.length) return;
    lbIndex = (lbIndex + vis.length) % vis.length;
    const img = vis[lbIndex].querySelector('img');
    const cap = vis[lbIndex].querySelector('figcaption');
    lbImg.src = img.src.replace('w=900', 'w=1600');
    lbImg.alt = img.alt;
    lbCaption.textContent = cap ? cap.textContent : '';
    // Preload neighbours
    [lbIndex + 1, lbIndex - 1].forEach((n) => {
      const neighbour = vis[(n + vis.length) % vis.length];
      const pre = new Image();
      pre.src = neighbour.querySelector('img').src.replace('w=900', 'w=1600');
    });
  }
  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    if (lenis) lenis.start();
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  items.forEach((item) => {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', 'View image: ' + (item.querySelector('img').alt || 'portfolio image'));
    item.addEventListener('click', () => openLightbox(item));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(item); }
    });
  });
  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  document.getElementById('lightboxPrev').addEventListener('click', () => { lbIndex--; renderLightbox(); });
  document.getElementById('lightboxNext').addEventListener('click', () => { lbIndex++; renderLightbox(); });
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  window.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') { lbIndex--; renderLightbox(); }
    if (e.key === 'ArrowRight') { lbIndex++; renderLightbox(); }
  });
  // Touch swipe
  let touchX = null;
  lightbox.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 48) { lbIndex += dx < 0 ? 1 : -1; renderLightbox(); }
    touchX = null;
  }, { passive: true });

  /* ── Testimonial slider ── */
  const quotes = Array.from(document.querySelectorAll('.quote'));
  const dotsWrap = document.getElementById('quoteDots');
  let qIndex = 0;
  let qTimer = null;

  if (quotes.length) {
    quotes.forEach((_, i) => {
      const d = document.createElement('i');
      if (i === 0) d.classList.add('is-active');
      dotsWrap.appendChild(d);
    });
    const dots = Array.from(dotsWrap.children);

    function showQuote(i) {
      qIndex = (i + quotes.length) % quotes.length;
      quotes.forEach((q, n) => q.classList.toggle('is-active', n === qIndex));
      dots.forEach((d, n) => d.classList.toggle('is-active', n === qIndex));
    }
    function restartAuto() {
      if (qTimer) clearInterval(qTimer);
      if (!prefersReducedMotion) qTimer = setInterval(() => showQuote(qIndex + 1), 6000);
    }
    document.getElementById('quotePrev').addEventListener('click', () => { showQuote(qIndex - 1); restartAuto(); });
    document.getElementById('quoteNext').addEventListener('click', () => { showQuote(qIndex + 1); restartAuto(); });
    showQuote(0);
    restartAuto();
  }

  /* ── Booking form → WhatsApp ── */
  const form = document.getElementById('bookForm');
  if (form) {
    function setError(input, msg) {
      const field = input.closest('.field');
      const err = field ? field.querySelector('.field-error') : null;
      if (field) field.classList.toggle('has-error', Boolean(msg));
      if (err) err.textContent = msg || '';
    }
    function validate() {
      let firstBad = null;
      const name = form.name;
      const phone = form.phone;
      const email = form.email;
      const type = form.eventType;

      setError(name, ''); setError(phone, ''); setError(email, ''); setError(type, '');

      if (!name.value.trim()) { setError(name, 'Please tell us your name.'); firstBad = firstBad || name; }
      if (!/^[+\d][\d\s-]{7,15}$/.test(phone.value.trim())) {
        setError(phone, 'Enter a valid phone number.'); firstBad = firstBad || phone;
      }
      if (email.value.trim() && !/^\S+@\S+\.\S+$/.test(email.value.trim())) {
        setError(email, 'That email doesn’t look right.'); firstBad = firstBad || email;
      }
      if (!type.value) { setError(type, 'Choose an event type.'); firstBad = firstBad || type; }

      if (firstBad) { firstBad.focus(); return false; }
      return true;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validate()) return;

      const v = (n) => (form[n] && form[n].value ? form[n].value.trim() : '');
      const pref = form.querySelector('input[name="pref"]:checked');
      const lines = [
        'Hi Aura Pixels Studio! I’d like to make an enquiry.',
        '',
        'Name: ' + v('name'),
        'Phone: ' + v('phone'),
        v('email') && 'Email: ' + v('email'),
        'Event Type: ' + v('eventType'),
        v('date') && 'Date: ' + v('date'),
        v('location') && 'Location: ' + v('location'),
        v('budget') && 'Budget: ' + v('budget'),
        pref && 'Preferred contact: ' + pref.value,
        v('message') && '',
        v('message') && 'Vision: ' + v('message')
      ].filter(Boolean);

      const btn = document.getElementById('bookSubmit');
      btn.textContent = 'Opening WhatsApp…';
      window.open('https://wa.me/919019648309?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
      setTimeout(() => { btn.textContent = 'Send via WhatsApp'; }, 2500);
    });
  }
})();
