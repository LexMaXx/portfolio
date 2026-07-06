/* ============================================================
   LEXMAX PORTFOLIO — Interactions
   ============================================================ */

// ---------- Custom cursor ----------
(() => {
  const cursor = document.getElementById('cursor');
  const dot = document.getElementById('cursorDot');
  if (!cursor || !dot) return;

  let mx = window.innerWidth/2, my = window.innerHeight/2;
  let cx = mx, cy = my;

  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  });

  function loop(){
    cx += (mx - cx) * 0.18;
    cy += (my - cy) * 0.18;
    cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  }
  loop();

  const hoverables = 'a, button, .gallery-item, .contact-link, .btn, .hero-cta, .meta-block, [data-nav]';
  document.querySelectorAll(hoverables).forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
})();

// ---------- Typewriter subtitle ----------
(() => {
  const el = document.getElementById('typeLine');
  if (!el) return;
  const lines = [
    'UNITY GAME DEVELOPER',
    'GAME DESIGNER · CODER · SHIPPER',
    '2 PROJECTS LIVE · 3 IN THE FORGE',
    'FULL PIPELINE · IDEA TO STORE',
    'BUILDING WORLDS SINCE 2019',
  ];
  let li = 0, ci = 0, deleting = false;

  function tick(){
    const current = lines[li];
    if (!deleting){
      ci++;
      el.textContent = current.slice(0, ci);
      if (ci === current.length){
        deleting = true;
        setTimeout(tick, 2000);
        return;
      }
    } else {
      ci--;
      el.textContent = current.slice(0, ci);
      if (ci === 0){
        deleting = false;
        li = (li + 1) % lines.length;
      }
    }
    setTimeout(tick, deleting ? 30 : 70);
  }
  tick();
})();

// ---------- Count-up numbers ----------
(() => {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count, 10) || 0;
    let cur = 0;
    const step = Math.max(1, Math.ceil(target / 30));
    const iv = setInterval(() => {
      cur += step;
      if (cur >= target){ cur = target; clearInterval(iv); }
      el.textContent = cur.toString().padStart(2, '0');
    }, 50);
  });
})();

// ---------- Scroll reveal ----------
(() => {
  // Auto-mark: sections, projects, gallery items get reveal
  document.querySelectorAll('.section-head, .about-grid, .project, .stack-col, .contact-box, .vault-note, .foot').forEach(el => {
    el.setAttribute('data-reveal', '');
  });

  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting){
        en.target.classList.add('in');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
})();

// ---------- Nav active state on scroll ----------
(() => {
  const navLinks = [...document.querySelectorAll('[data-nav]')];
  const sections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

  function onScroll(){
    const pos = window.scrollY + window.innerHeight * 0.35;
    let idx = 0;
    sections.forEach((s, i) => { if (s.offsetTop <= pos) idx = i; });
    navLinks.forEach(a => a.classList.remove('active'));
    if (navLinks[idx]) navLinks[idx].classList.add('active');
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ---------- Clock ----------
(() => {
  const el = document.getElementById('clock');
  if (!el) return;
  function tick(){
    const d = new Date();
    const pad = n => n.toString().padStart(2,'0');
    el.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }
  tick();
  setInterval(tick, 1000);
})();

// ---------- Video hover play ----------
(() => {
  document.querySelectorAll('.gallery-item.video video').forEach(v => {
    const parent = v.closest('.gallery-item');
    parent.addEventListener('mouseenter', () => { v.play().catch(()=>{}); });
    parent.addEventListener('mouseleave', () => { v.pause(); v.currentTime = 0; });
    v.addEventListener('error', () => parent.classList.add('empty'));
    // If video has no source loaded, mark empty
    v.addEventListener('loadeddata', () => parent.classList.remove('empty'));
  });
  // Preflight — mark videos with unreachable src as empty
  document.querySelectorAll('.gallery-item.video video').forEach(v => {
    setTimeout(() => {
      if (v.readyState === 0 && !v.currentSrc){
        v.closest('.gallery-item').classList.add('empty');
      }
    }, 1200);
  });
})();

// ---------- Lightbox ----------
(() => {
  const lb = document.getElementById('lightbox');
  const lbContent = document.getElementById('lbContent');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  if (!lb) return;

  let currentGroup = [];
  let currentIndex = 0;

  function render(){
    const item = currentGroup[currentIndex];
    if (!item) return;
    lbContent.innerHTML = '';
    if (item.type === 'video'){
      const v = document.createElement('video');
      v.src = item.src;
      v.controls = true;
      v.autoplay = true;
      lbContent.appendChild(v);
    } else if (item.type === 'youtube'){
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${item.src}?autoplay=1&rel=0`;
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.setAttribute('frameborder', '0');
      iframe.style.width = 'min(90vw, 1280px)';
      iframe.style.height = 'min(50.625vw, 720px)';
      iframe.style.border = '1px solid var(--accent)';
      lbContent.appendChild(iframe);
    } else {
      const img = document.createElement('img');
      img.src = item.src;
      img.alt = '';
      lbContent.appendChild(img);
    }
  }

  function open(items, idx){
    currentGroup = items;
    currentIndex = idx;
    lb.classList.add('open');
    render();
  }
  function close(){
    lb.classList.remove('open');
    lbContent.innerHTML = '';
  }
  function next(){ currentIndex = (currentIndex + 1) % currentGroup.length; render(); }
  function prev(){ currentIndex = (currentIndex - 1 + currentGroup.length) % currentGroup.length; render(); }

  document.querySelectorAll('.gallery').forEach(gallery => {
    const items = [...gallery.querySelectorAll('.gallery-item')].map(it => {
      const isVideo = it.classList.contains('video');
      const isYT = it.classList.contains('youtube');
      if (isYT){
        return { type: 'youtube', src: it.dataset.yt || '', el: it };
      }
      const media = it.querySelector(isVideo ? 'video' : 'img');
      return { type: isVideo ? 'video' : 'image', src: media?.getAttribute('src') || '', el: it };
    });

    items.forEach((data, i) => {
      data.el.addEventListener('click', () => {
        if (data.el.classList.contains('empty')) return; // skip placeholders
        open(items.filter(x => !x.el.classList.contains('empty')), i);
      });
    });
  });

  lbClose.addEventListener('click', close);
  lbNext.addEventListener('click', next);
  lbPrev.addEventListener('click', prev);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });
})();

// ---------- Small parallax on hero ----------
(() => {
  const bg = document.querySelector('.hero-bg-video');
  if (!bg) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight){
      bg.style.transform = `translateY(${y * 0.3}px)`;
    }
  }, { passive: true });
})();

// ---------- Matrix rain with cursor interaction ----------
(() => {
  const canvas = document.getElementById('matrix');
  if (!canvas) return;

  // Skip on small screens for performance
  const smallScreen = () => window.innerWidth < 900 || window.matchMedia('(pointer: coarse)').matches;
  if (smallScreen()){
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d', { alpha: true });
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  const font = 18;
  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>[]{}#@$&/\\';
  const charArr = chars.split('');

  let W = 0, H = 0, cols = 0;
  let drops = [];
  let speeds = [];
  let mx = -9999, my = -9999;
  let sparks = [];  // trailing particles

  function resize(){
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    cols = Math.floor(W / font);
    drops = new Array(cols).fill(0).map(() => Math.random() * (H / font));
    speeds = new Array(cols).fill(0).map(() => 0.35 + Math.random() * 0.55);
  }
  resize();
  window.addEventListener('resize', resize);

  let lastMx = 0, lastMy = 0;
  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    // spawn spark on fast movement
    const dx = mx - lastMx, dy = my - lastMy;
    const spd = Math.sqrt(dx*dx + dy*dy);
    if (spd > 6 && sparks.length < 60){
      sparks.push({
        x: mx + (Math.random() - .5) * 12,
        y: my + (Math.random() - .5) * 12,
        vx: (Math.random() - .5) * 1.5,
        vy: (Math.random() - .5) * 1.5,
        life: 1,
        ch: charArr[Math.floor(Math.random() * charArr.length)]
      });
    }
    lastMx = mx; lastMy = my;
  });
  window.addEventListener('mouseleave', () => { mx = my = -9999; });

  const HOLE = 60;
  const RING = 150;

  ctx.textBaseline = 'top';

  function draw(){
    // Fade previous frame to create trail
    ctx.fillStyle = 'rgba(10, 9, 8, 0.09)';
    ctx.fillRect(0, 0, W, H);

    ctx.font = `${font}px "Share Tech Mono", monospace`;

    for (let i = 0; i < cols; i++){
      const x = i * font + font / 2;
      const y = drops[i] * font;

      const dx = x - mx;
      const dy = y - my;
      const dist = Math.sqrt(dx*dx + dy*dy);

      if (dist < HOLE){
        // skip — creates hole around cursor
      } else if (dist < RING){
        // hot glowing ring around cursor
        const t = (dist - HOLE) / (RING - HOLE);
        const alpha = 0.9 - t * 0.55;
        const c = charArr[Math.floor(Math.random() * charArr.length)];
        ctx.fillStyle = `rgba(255, 210, 110, ${alpha})`;
        ctx.shadowColor = 'rgba(255, 200, 90, 0.9)';
        ctx.shadowBlur = 10;
        ctx.fillText(c, x - font/2, y);
        ctx.shadowBlur = 0;
      } else {
        const c = charArr[Math.floor(Math.random() * charArr.length)];
        if (Math.random() > 0.985){
          ctx.fillStyle = 'rgba(255, 220, 150, 0.75)';
        } else {
          ctx.fillStyle = 'rgba(255, 149, 0, 0.32)';
        }
        ctx.fillText(c, x - font/2, y);
      }

      if (y > H + font && Math.random() > 0.97){
        drops[i] = 0;
      }
      drops[i] += speeds[i];
    }

    // Trailing sparks
    ctx.font = `${font - 4}px "Share Tech Mono", monospace`;
    for (let s of sparks){
      s.x += s.vx;
      s.y += s.vy;
      s.life -= 0.02;
      if (s.life > 0){
        ctx.fillStyle = `rgba(255, 220, 150, ${s.life})`;
        ctx.fillText(s.ch, s.x, s.y);
      }
    }
    sparks = sparks.filter(s => s.life > 0);

    requestAnimationFrame(draw);
  }
  draw();
})();
