/* ============================================================
   Yazan Hamdan — Portfolio interactions
   Vanilla JS · no dependencies
   ============================================================ */
(() => {
  'use strict';
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarse = window.matchMedia('(pointer: coarse)').matches;

  /* ---------- Year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Loader ---------- */
  window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('loader').classList.add('done'), 1500);
  });

  /* ============================================================
     Particle network background
     ============================================================ */
  (function particles() {
    if (prefersReduced) return;
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let w, h, dpr, particles = [], raf;
    const mouse = { x: -9999, y: -9999 };

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = innerWidth * dpr;
      h = canvas.height = innerHeight * dpr;
      canvas.style.width = innerWidth + 'px';
      canvas.style.height = innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildParticles();
    }

    function buildParticles() {
      const area = innerWidth * innerHeight;
      const count = Math.min(110, Math.max(34, Math.floor(area / 16000)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * innerWidth,
        y: Math.random() * innerHeight,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.6,
      }));
    }

    const colors = ['34,211,238', '99,102,241', '168,85,247'];

    function draw() {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      const linkDist = 130;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;

        // gentle mouse repulsion
        const mdx = p.x - mouse.x, mdy = p.y - mouse.y;
        const md = Math.hypot(mdx, mdy);
        if (md < 120) {
          p.x += (mdx / md) * 0.8;
          p.y += (mdy / md) * 0.8;
        }

        if (p.x < 0 || p.x > innerWidth) p.vx *= -1;
        if (p.y < 0 || p.y > innerHeight) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(34,211,238,0.55)';
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.hypot(dx, dy);
          if (dist < linkDist) {
            const alpha = (1 - dist / linkDist) * 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(${colors[(i + j) % 3]},${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    }

    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('mouseout', () => { mouse.x = -9999; mouse.y = -9999; });
    addEventListener('resize', resize);
    // pause when tab hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else raf = requestAnimationFrame(draw);
    });
    resize();
    draw();
  })();

  /* ============================================================
     Custom cursor
     ============================================================ */
  (function cursor() {
    if (prefersReduced || isCoarse) return;
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    let rx = 0, ry = 0, mx = 0, my = 0;

    addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    });
    (function loop() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    })();

    const interactive = 'a, button, .proj-card, .feat-card, .skill-cat, .stat, .chips span';
    document.querySelectorAll(interactive).forEach(el => {
      el.addEventListener('mouseenter', () => { ring.classList.add('hover'); dot.classList.add('hover'); });
      el.addEventListener('mouseleave', () => { ring.classList.remove('hover'); dot.classList.remove('hover'); });
    });
  })();

  /* ============================================================
     Nav: scrolled state, burger, scroll progress, active link
     ============================================================ */
  const nav = document.getElementById('nav');
  const progress = document.getElementById('scrollProgress');
  const burger = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');

  function onScroll() {
    const sc = window.scrollY;
    nav.classList.toggle('scrolled', sc > 30);
    const docH = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = (docH > 0 ? (sc / docH) * 100 : 0) + '%';
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => { burger.classList.remove('open'); navLinks.classList.remove('open'); })
  );

  /* ---------- Active section highlight ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const linkMap = {};
  navLinks.querySelectorAll('a').forEach(a => { linkMap[a.getAttribute('href').slice(1)] = a; });
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.querySelectorAll('a').forEach(a => a.classList.remove('active'));
        const link = linkMap[e.target.id];
        if (link) link.classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => navObserver.observe(s));

  /* ============================================================
     Reveal on scroll
     ============================================================ */
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        if (e.target.classList.contains('timeline-item')) e.target.classList.add('in');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll('.reveal').forEach((el, i) => {
    // light stagger for siblings
    el.style.transitionDelay = Math.min((i % 6) * 60, 300) + 'ms';
    revealObserver.observe(el);
  });
  document.querySelectorAll('.timeline-item').forEach(el => {
    const io = new IntersectionObserver((ents, o) => {
      ents.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); o.unobserve(en.target); } });
    }, { threshold: 0.3 });
    io.observe(el);
  });

  /* ============================================================
     Animated counters
     ============================================================ */
  const counters = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.target;
      const suffix = el.dataset.suffix || '';
      const dur = 1400;
      const start = performance.now();
      function tick(now) {
        const t = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  /* ============================================================
     Typing effect (hero role)
     ============================================================ */
  (function typed() {
    const el = document.getElementById('typed');
    if (!el) return;
    const roles = [
      'Technical Lead',
      'AI / ML Engineer',
      'ERP Specialist',
      'Full-Stack Developer',
      'Agentic AI Architect',
    ];
    if (prefersReduced) { el.textContent = roles[0]; return; }
    let r = 0, c = 0, deleting = false;
    function step() {
      const word = roles[r];
      el.textContent = word.slice(0, c);
      if (!deleting) {
        if (c < word.length) { c++; setTimeout(step, 75); }
        else { deleting = true; setTimeout(step, 1600); }
      } else {
        if (c > 0) { c--; setTimeout(step, 38); }
        else { deleting = false; r = (r + 1) % roles.length; setTimeout(step, 280); }
      }
    }
    step();
  })();

  /* ============================================================
     Project filters
     ============================================================ */
  (function filters() {
    const btns = document.querySelectorAll('.filter');
    const cards = document.querySelectorAll('.proj-card, .feat-card');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        cards.forEach(card => {
          const cats = card.dataset.cat || '';
          const show = f === 'all' || cats.includes(f);
          card.classList.toggle('hide', !show);
        });
      });
    });
  })();

  /* ============================================================
     Card tilt on hover (subtle 3D)
     ============================================================ */
  (function tilt() {
    if (prefersReduced || isCoarse) return;
    const cards = document.querySelectorAll('.feat-card, .proj-card, .stat');
    cards.forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translateY(-6px) perspective(900px) rotateX(${-py * 4}deg) rotateY(${px * 5}deg)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  })();
})();
