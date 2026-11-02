// Landing page: solid nav after scrolling, reveal-on-scroll, counting numbers.
(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('solid', scrollY > 40);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const els = [...document.querySelectorAll('.reveal')];
  if (calm || !('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
  const io = new IntersectionObserver((list) => list.forEach((en) => {
    if (!en.isIntersecting) return;
    en.target.classList.add('in');
    io.unobserve(en.target);
  }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach((e, i) => { e.style.transitionDelay = `${(i % 3) * 80}ms`; io.observe(e); });

  // Count the hero numbers up once.
  document.querySelectorAll('[data-count]').forEach((b) => {
    const to = +b.dataset.count, t0 = performance.now();
    const tick = (now) => { const t = Math.min(1, (now - t0) / 1400); b.textContent = Math.round(to * (1 - Math.pow(1 - t, 3))); if (t < 1) requestAnimationFrame(tick); };
    b.textContent = '0';
    requestAnimationFrame(tick);
  });
})();
