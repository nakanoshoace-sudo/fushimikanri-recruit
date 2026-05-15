/* ==========================================================
   伏見管理サービス 採用サイト  —  JS v6 (giftee-exact animation)
   ========================================================== */

// Mark html as JS-enabled for progressive enhancement
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {

  /* ── Scroll header + scroll indicator ── */
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

  /* ── Tagline character animation (giftee-exact) ──
   * giftee uses transition-based animation with staggered delays:
   * - opacity 2.6s ease-out
   * - filter 2.6s ease-out (blur 12px → 0)
   * - transform 2.6s ease-out-quint (translateY 30px → 0)
   * - 0.09s delay between each character
   * - Initial delay: ~0.5s after page load
   */
  const vchars = document.querySelectorAll('.vchar');
  vchars.forEach((el, i) => {
    // Set per-character transition delay
    const delay = 0.5 + i * 0.09; // 0.5s base + 0.09s per char (giftee = 0.09s)
    el.style.transitionDelay = `${delay}s, ${delay}s, ${delay}s`;
  });

  // Trigger animation after a brief paint delay
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      vchars.forEach(el => el.classList.add('vchar--in'));
    });
  });

  // Also add color transition delay for accent chars (longer)
  document.querySelectorAll('.hero-tagline__col--accent .vchar:nth-child(1), .hero-tagline__col--accent .vchar:nth-child(2)').forEach((el, i) => {
    const baseDelay = parseFloat(el.style.transitionDelay) || 0.5;
    // 4 transitions: opacity, filter, transform, color
    // color delay should be longer (1.8s + base)
    el.style.transitionDelay = `${baseDelay}s, ${baseDelay}s, ${baseDelay}s, ${baseDelay + 1.3}s`;
  });

  /* ── Hero body text fade-in (giftee-style delayed) ── */
  const heroBody = document.querySelector('.hero-body');
  const heroLeftCol = document.querySelector('.hero-left-col');
  const heroRightCol = document.querySelector('.hero-right-col');
  [heroLeftCol, heroRightCol, heroBody].forEach((el, i) => {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    const delay = [0.8, 1.0, 1.6][i];
    const dur = [1.2, 1.2, 1.8][i];
    el.style.transition = `opacity ${dur}s var(--ease) ${delay}s, transform ${dur}s var(--ease-out-quint) ${delay}s`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    });
  });

  /* ── Mobile menu ── */
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

  /* ── FAQ ── */
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

  /* ── Scroll reveal (dual: IO + scroll fallback) ── */
  const allAnimUp = document.querySelectorAll('.anim-up');
  allAnimUp.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min((i % 6) * 0.07, 0.42)}s`;
  });

  const reveal = (el) => {
    if (!el.classList.contains('visible')) el.classList.add('visible');
  };

  // Primary: IntersectionObserver (works even without user scroll)
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          reveal(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px 120px 0px', threshold: 0 });
    allAnimUp.forEach(el => io.observe(el));
  }

  // Fallback: scroll-based check
  const revealCheck = () => {
    const vh = window.innerHeight;
    allAnimUp.forEach(el => {
      if (el.classList.contains('visible')) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < vh + 120 && rect.bottom > -120) {
        reveal(el);
      }
    });
  };
  window.addEventListener('scroll', revealCheck, { passive: true });
  window.addEventListener('resize', revealCheck, { passive: true });
  revealCheck();
  setTimeout(revealCheck, 600);
  setTimeout(revealCheck, 1500);

  // Emergency fallback: if after 3s nothing revealed, show everything
  setTimeout(() => {
    const visible = document.querySelectorAll('.anim-up.visible').length;
    if (visible === 0) {
      allAnimUp.forEach(el => reveal(el));
    }
  }, 3000);

  /* ── Smooth scroll ── */
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

  /* ── Hero canvas ── */
  const canvas = document.getElementById('heroCanvas');
  if (canvas) heroCanvas(canvas);

  /* ── About page: card scroll reveal + image load ── */
  const aboutCards = document.querySelectorAll('.anim--card');
  if (aboutCards.length) {
    // IntersectionObserver for card reveal
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

  // Image load → add .loaded class for fade-in
  document.querySelectorAll('.about-card__circle img').forEach(img => {
    const markLoaded = () => img.classList.add('loaded');
    if (img.complete && img.naturalWidth > 0) {
      markLoaded();
    } else {
      img.addEventListener('load', markLoaded, { once: true });
      img.addEventListener('error', markLoaded, { once: true });
    }
  });
});

/* ── Hero animated background ── */
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
