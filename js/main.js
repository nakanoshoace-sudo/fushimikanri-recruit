/* ==========================================================
   伏見管理サービス 採用サイト  —  JS v8 (giftee-exact animation)
   ========================================================== */

document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {

  /* ══════════════════════════════════════════════════════════
     1. SCROLL HEADER
     ══════════════════════════════════════════════════════════ */
  const scrollHeader = document.getElementById('scrollHeader');
  const scrollInd = document.querySelector('.scroll-indicator');
  const heroEl = document.querySelector('.hero');
  const onScroll = () => {
    const y = window.scrollY;
    const heroH = heroEl ? heroEl.offsetHeight : 600;
    if (scrollHeader) scrollHeader.classList.toggle('visible', y > heroH * 0.7);
    if (scrollInd) scrollInd.classList.toggle('hidden', y > 300);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ══════════════════════════════════════════════════════════
     2. HERO — logo, nav, tagline, body animations
     ══════════════════════════════════════════════════════════ */

  // 2a. Logo fade-in (giftee: fadeinOpacity 1.2s, delay 0.1s)
  const heroLogo = document.querySelector('.hero-logo');
  if (heroLogo) {
    heroLogo.style.opacity = '0';
    heroLogo.style.animation = 'fadeinOpacity 1.2s cubic-bezier(.39,.575,.565,1) .1s forwards';
  }

  // 2b. Hero side-nav items — stagger slide-in (giftee: fadeinNavItem 1.7s, stagger 0.1s)
  document.querySelectorAll('.hero-sidenav a').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(15px)';
    el.style.animation = `fadeinNavItem 1.7s cubic-bezier(.19,1,.22,1) ${0.2 + i * 0.1}s forwards`;
  });

  // 2c. Hero CTA buttons — fade in
  document.querySelectorAll('.hero-right-col .hero-cta').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.animation = `fadeinOpacity 1s cubic-bezier(.39,.575,.565,1) ${0.3 + i * 0.15}s forwards`;
  });

  // 2d. Tagline character animation (giftee-exact: transition-based)
  const vchars = document.querySelectorAll('.vchar');
  vchars.forEach((el, i) => {
    const delay = 0.5 + i * 0.09;
    el.style.transitionDelay = `${delay}s, ${delay}s, ${delay}s`;
  });
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      vchars.forEach(el => el.classList.add('vchar--in'));
    });
  });
  // Accent color delayed transition
  document.querySelectorAll('.hero-tagline__col--accent .vchar:nth-child(1), .hero-tagline__col--accent .vchar:nth-child(2)').forEach(el => {
    const baseDelay = parseFloat(el.style.transitionDelay) || 0.5;
    el.style.transitionDelay = `${baseDelay}s, ${baseDelay}s, ${baseDelay}s, ${baseDelay + 1.3}s`;
  });

  // 2e. Hero body text — slideUp with blur (giftee-style)
  const heroBody = document.querySelector('.hero-body');
  const heroLeftCol = document.querySelector('.hero-left-col');
  const heroRightCol = document.querySelector('.hero-right-col');
  [heroBody].forEach(el => {
    if (!el) return;
    el.style.opacity = '0';
    el.style.filter = 'blur(6px)';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 1.8s ease .8s, filter 1.8s ease .8s, transform 1.8s cubic-bezier(.19,1,.22,1) .8s';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.filter = 'blur(0)';
        el.style.transform = 'translateY(0)';
      });
    });
  });

  // 2f. Scroll indicator — fade in late
  if (scrollInd) {
    scrollInd.style.opacity = '0';
    scrollInd.style.animation = 'fadeinOpacity .8s ease 1.8s forwards';
  }

  /* ══════════════════════════════════════════════════════════
     3. SCROLL REVEAL — giftee-style per-element types
        .anim-up        → translateY + opacity (default)
        .anim-up--blur  → + blur
        .anim-up--mask  → clip-path mask top-to-bottom
        .anim-up--scale → scale(0.95) + opacity
     ══════════════════════════════════════════════════════════ */
  const allAnimUp = document.querySelectorAll('.anim-up');

  // Set staggered delays per parent section
  const sections = document.querySelectorAll('.sec, .ws-child');
  sections.forEach(sec => {
    const children = sec.querySelectorAll('.anim-up');
    children.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 0.08, 0.48)}s`;
    });
  });

  const revealEl = (el) => {
    if (!el.classList.contains('visible')) el.classList.add('visible');
  };

  // IntersectionObserver
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          revealEl(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px 80px 0px', threshold: 0.05 });
    allAnimUp.forEach(el => io.observe(el));
  }

  // Fallback scroll check
  const revealCheck = () => {
    const vh = window.innerHeight;
    allAnimUp.forEach(el => {
      if (el.classList.contains('visible')) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < vh + 120 && rect.bottom > -120) revealEl(el);
    });
  };
  window.addEventListener('scroll', revealCheck, { passive: true });
  window.addEventListener('resize', revealCheck, { passive: true });
  revealCheck();
  setTimeout(revealCheck, 600);
  setTimeout(revealCheck, 1500);
  setTimeout(() => {
    if (!document.querySelectorAll('.anim-up.visible').length) {
      allAnimUp.forEach(el => revealEl(el));
    }
  }, 3000);

  /* ══════════════════════════════════════════════════════════
     4. IMAGE LAZY LOAD — fade-in on complete
     ══════════════════════════════════════════════════════════ */
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    // Don't re-apply if already handled
    if (img.classList.contains('img-loaded')) return;
    const markLoaded = () => {
      img.classList.add('img-loaded');
      // For photos inside clip-mask containers
      const parent = img.closest('.anim-up--mask');
      if (parent) parent.classList.add('mask-ready');
    };
    if (img.complete && img.naturalWidth > 0) {
      markLoaded();
    } else {
      img.addEventListener('load', markLoaded, { once: true });
      img.addEventListener('error', markLoaded, { once: true });
    }
  });

  /* ══════════════════════════════════════════════════════════
     5. MOBILE MENU
     ══════════════════════════════════════════════════════════ */
  const mm = document.getElementById('mobileMenu');
  const openBtn = document.getElementById('hamburger');
  const closeBtn = document.getElementById('mobileClose');
  const toggle = (show) => {
    mm.classList.toggle('open', show);
    document.body.style.overflow = show ? 'hidden' : '';
  };
  openBtn?.addEventListener('click', () => toggle(true));
  closeBtn?.addEventListener('click', () => toggle(false));
  mm?.querySelector('.mobile-menu__overlay')?.addEventListener('click', () => toggle(false));
  mm?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggle(false)));

  /* ══════════════════════════════════════════════════════════
     6. FAQ ACCORDION
     ══════════════════════════════════════════════════════════ */
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ══════════════════════════════════════════════════════════
     7. SMOOTH SCROLL
     ══════════════════════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
      }
    });
  });

  /* ══════════════════════════════════════════════════════════
     8. HERO CANVAS
     ══════════════════════════════════════════════════════════ */
  const canvas = document.getElementById('heroCanvas');
  if (canvas) heroCanvas(canvas);

  /* ══════════════════════════════════════════════════════════
     9. ABOUT PAGE — card scroll reveal + image load
     ══════════════════════════════════════════════════════════ */
  const aboutCards = document.querySelectorAll('.anim--card');
  if (aboutCards.length) {
    const cardIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          cardIO.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });
    aboutCards.forEach(el => cardIO.observe(el));
  }
  document.querySelectorAll('.about-card__circle img').forEach(img => {
    const markLoaded = () => img.classList.add('loaded');
    if (img.complete && img.naturalWidth > 0) markLoaded();
    else {
      img.addEventListener('load', markLoaded, { once: true });
      img.addEventListener('error', markLoaded, { once: true });
    }
  });

  /* ══════════════════════════════════════════════════════════
     10. SECTION TITLE — slideUp + blur on scroll
     ══════════════════════════════════════════════════════════ */
  document.querySelectorAll('.anim-up--title').forEach(el => {
    el.style.opacity = '0';
    el.style.filter = 'blur(8px)';
    el.style.transform = 'translateY(15%)';
  });

  /* ══════════════════════════════════════════════════════════
     11. PARALLAX PHOTO SECTIONS — subtle scroll parallax
     ══════════════════════════════════════════════════════════ */
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (parallaxEls.length) {
    const onParallax = () => {
      const scrollY = window.scrollY;
      parallaxEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        const speed = parseFloat(el.dataset.parallax) || 0.08;
        const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
        el.style.transform = `translateY(${offset}px)`;
      });
    };
    window.addEventListener('scroll', onParallax, { passive: true });
  }
});

/* ══════════════════════════════════════════════════════════
   HERO CANVAS — animated gradient blobs
   ══════════════════════════════════════════════════════════ */
function heroCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const w = rect.width, h = rect.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
  }
  resize();
  window.addEventListener('resize', resize);

  const palette = [
    [212,237,231],[168,216,206],[237,247,244],[220,240,234],[250,252,251]
  ];
  const blobs = Array.from({ length: 5 }, (_, i) => ({
    x: Math.random(), y: Math.random(),
    vx: (Math.random() - 0.5) * 0.00015,
    vy: (Math.random() - 0.5) * 0.00015,
    r: 0.2 + Math.random() * 0.25,
    c: palette[i % palette.length]
  }));

  function draw() {
    const W = canvas.width, H = canvas.height;
    ctx.fillStyle = '#EDF7F4';
    ctx.fillRect(0, 0, W, H);
    blobs.forEach(b => {
      b.x += b.vx; b.y += b.vy;
      if (b.x < -0.3) b.x = 1.3;
      if (b.x > 1.3) b.x = -0.3;
      if (b.y < -0.3) b.y = 1.3;
      if (b.y > 1.3) b.y = -0.3;
      const cx = b.x * W, cy = b.y * H, r = b.r * Math.max(W, H);
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, `rgba(${b.c[0]},${b.c[1]},${b.c[2]},.5)`);
      g.addColorStop(1, `rgba(${b.c[0]},${b.c[1]},${b.c[2]},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    });
    requestAnimationFrame(draw);
  }
  draw();
}
