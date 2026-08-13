// ---------- nav scroll state + mobile toggle ----------
const nav = document.querySelector('.site-nav');
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.site-nav .links');

window.addEventListener('scroll', () => {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

if (toggle && links) {
  toggle.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
}

const currentPage = (location.pathname.split('/').pop() || 'index.html');
document.querySelectorAll('.site-nav .links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    a.classList.add('active');
  }
});

// ---------- scroll-triggered reveals ----------
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('is-visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const palette = ['#4fa9d6', '#e1789f', '#d8a85c', '#bfe6f5', '#f7c6d9'];

// ---------- ambient particles ----------
if (!reduceMotion) {
  const field = document.getElementById('particles');
  if (field) {
    const count = 24;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = 3 + Math.random() * 4;
      p.style.setProperty('--size', size.toFixed(1) + 'px');
      p.style.setProperty('--pcolor', palette[i % palette.length]);
      p.style.setProperty('--dur', (7 + Math.random() * 6).toFixed(1) + 's');
      p.style.setProperty('--delay', (Math.random() * 9).toFixed(1) + 's');
      p.style.setProperty('--drift', (Math.random() * 40 - 20).toFixed(0) + 'px');
      p.style.left = (Math.random() * 100).toFixed(1) + '%';
      field.appendChild(p);
    }
  }

  // gentle 3D tilt on gallery frames
  document.querySelectorAll('.frame').forEach(frame => {
    frame.style.transformStyle = 'preserve-3d';
    frame.style.willChange = 'transform';
    frame.addEventListener('mousemove', (e) => {
      const r = frame.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      frame.style.transform = `perspective(600px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-6px)`;
    });
    frame.addEventListener('mouseleave', () => { frame.style.transform = ''; });
  });

  // parallax on hero ornaments
  const seal = document.querySelector('.seal-ring');
  const corners = document.querySelectorAll('.corner');
  if (seal || corners.length) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        if (seal) seal.style.transform = `translateY(${y * 0.15}px) scale(1)`;
        corners.forEach(c => { c.style.opacity = Math.max(0, 0.75 - y / 400); });
      }
    }, { passive: true });
  }
}

// ============ SURPRISE BUTTON, CONFETTI & BALLOONS ============
(function setupSurprise() {
  const btn = document.createElement('button');
  btn.className = 'surprise-btn';
  btn.setAttribute('aria-label', 'Press for a surprise');
  btn.innerHTML = '&#127873;';

  const label = document.createElement('div');
  label.className = 'surprise-btn-label';
  label.textContent = 'Press for a surprise';

  const overlay = document.createElement('div');
  overlay.className = 'surprise-overlay';
  overlay.innerHTML = `
    <canvas id="confettiCanvas"></canvas>
    <div class="balloons" id="balloonField"></div>
    <div class="surprise-content">
      <span class="spark">&#10024;</span>
      <h2>Happy Birthday, Uncle Luqman!</h2>
      <p>Light blue and pink for you today, because they've always been your colors. Every bridge you've built and every quiet sacrifice you've made has not gone unnoticed &mdash; you are loved more than words can hold. Here's to you, today and always.</p>
      <button class="close-surprise">Close</button>
    </div>
  `;

  document.body.appendChild(btn);
  document.body.appendChild(label);
  document.body.appendChild(overlay);

  let confettiRAF = null;

  function startConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const colors = ['#4fa9d6', '#e1789f', '#d8a85c', '#bfe6f5', '#f7c6d9', '#ffffff'];
    const pieces = Array.from({ length: 140 }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height,
      w: 6 + Math.random() * 6,
      h: 8 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: 1.5 + Math.random() * 2.5,
      drift: Math.random() * 2 - 1,
      rotation: Math.random() * 360,
      rotSpeed: Math.random() * 6 - 3
    }));

    function frame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        p.y += p.speed;
        p.x += p.drift;
        p.rotation += p.rotSpeed;
        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      confettiRAF = requestAnimationFrame(frame);
    }
    frame();
  }

  function stopConfetti() {
    if (confettiRAF) cancelAnimationFrame(confettiRAF);
    confettiRAF = null;
  }

  function launchBalloons() {
    const field = document.getElementById('balloonField');
    if (!field) return;
    field.innerHTML = '';
    const colors = ['#4fa9d6', '#e1789f', '#bfe6f5', '#f7c6d9', '#d8a85c'];
    for (let i = 0; i < 14; i++) {
      const b = document.createElement('div');
      b.className = 'balloon';
      b.style.left = (Math.random() * 92).toFixed(1) + '%';
      b.style.background = colors[i % colors.length];
      b.style.animationDuration = (5 + Math.random() * 3).toFixed(1) + 's';
      b.style.animationDelay = (Math.random() * 2).toFixed(1) + 's';
      field.appendChild(b);
    }
  }

  function openSurprise() {
    overlay.classList.add('active');
    if (!reduceMotion) {
      startConfetti();
      launchBalloons();
    }
  }

  function closeSurprise() {
    overlay.classList.remove('active');
    stopConfetti();
  }

  btn.addEventListener('click', openSurprise);
  btn.addEventListener('mouseenter', () => label.classList.add('show'));
  btn.addEventListener('mouseleave', () => label.classList.remove('show'));
  overlay.querySelector('.close-surprise').addEventListener('click', closeSurprise);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeSurprise(); });
})();