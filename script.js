// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav toggle
const burger = document.getElementById('nav-burger');
const navLinks = document.getElementById('nav-links');
if (burger && navLinks) {
  burger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', false);
    });
  });
}

// Scroll-spy: highlight the nav link for the section in view
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');
if ('IntersectionObserver' in window && sections.length && navAnchors.length) {
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(sec => spy.observe(sec));
}

// Back-to-top button
const backToTop = document.getElementById('back-to-top');
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 600);
  });
}

// Starfield background: twinkling stars, drifting nebula, occasional shooting star
const starCanvas = document.getElementById('starfield');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (starCanvas) {
  const ctx = starCanvas.getContext('2d');
  let width, height, stars = [];
  let targetParX = 0, targetParY = 0, parX = 0, parY = 0;
  let shootingStars = [];
  let tick = 0;

  function resize() {
    width = starCanvas.width = window.innerWidth;
    height = starCanvas.height = window.innerHeight;
    const count = Math.round((width * height) / 9000);
    stars = Array.from({ length: count }, () => ({
      xFrac: Math.random(),
      yFrac: Math.random(),
      r: Math.random() * 1.3 + 0.3,
      baseAlpha: Math.random() * 0.5 + 0.3,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.02 + 0.006
    }));
  }
  resize();
  window.addEventListener('resize', resize);

  if (canHover && !prefersReducedMotion) {
    window.addEventListener('mousemove', (e) => {
      targetParX = (e.clientX / width - 0.5) * -16;
      targetParY = (e.clientY / height - 0.5) * -16;
    });
  }

  function drawStars() {
    stars.forEach(s => {
      const alpha = prefersReducedMotion
        ? s.baseAlpha
        : s.baseAlpha + Math.sin(tick * s.speed + s.phase) * 0.3;
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.beginPath();
      ctx.fillStyle = '#E7ECF4';
      ctx.arc(s.xFrac * width + parX, s.yFrac * height + parY, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  if (prefersReducedMotion) {
    drawStars();
  } else {
    function maybeSpawnShootingStar() {
      if (Math.random() < 0.006 && shootingStars.length < 2) {
        shootingStars.push({
          x: Math.random() * width * 0.6 + width * 0.2,
          y: Math.random() * height * 0.3,
          vx: Math.cos(Math.PI / 4) * (9 + Math.random() * 6),
          vy: Math.sin(Math.PI / 4) * (9 + Math.random() * 6),
          life: 0,
          maxLife: 40 + Math.random() * 20
        });
      }
    }

    function drawShootingStars() {
      maybeSpawnShootingStar();
      shootingStars = shootingStars.filter(st => st.life < st.maxLife);
      shootingStars.forEach(st => {
        st.x += st.vx;
        st.y += st.vy;
        st.life += 1;
        const fade = 1 - st.life / st.maxLife;
        const grad = ctx.createLinearGradient(st.x, st.y, st.x - st.vx * 4, st.y - st.vy * 4);
        grad.addColorStop(0, `rgba(231,236,244,${fade})`);
        grad.addColorStop(1, 'rgba(231,236,244,0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(st.x, st.y);
        ctx.lineTo(st.x - st.vx * 4, st.y - st.vy * 4);
        ctx.stroke();
      });
    }

    function loop() {
      tick += 1;
      parX += (targetParX - parX) * 0.05;
      parY += (targetParY - parY) * 0.05;
      ctx.clearRect(0, 0, width, height);
      drawStars();
      drawShootingStars();
      requestAnimationFrame(loop);
    }
    loop();
  }
}

// Custom cursor: dot tracks instantly, ring eases behind, both shift color on hover
if (canHover && !prefersReducedMotion) {
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');

  if (cursorDot && cursorRing) {
    let mouseX = -100, mouseY = -100, ringX = -100, ringY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateRing);
    }
    animateRing();

    const amberSelector = 'a[href^="tel:"], a[href^="mailto:"], .job-tag';
    document.querySelectorAll('a, button, .tag, .layer, .job, .metric, .contact-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorRing.classList.add('hover');
        cursorDot.classList.add('hover');
        if (el.matches(amberSelector)) {
          cursorRing.classList.add('hover-amber');
          cursorDot.classList.add('hover-amber');
        }
      });
      el.addEventListener('mouseleave', () => {
        cursorRing.classList.remove('hover', 'hover-amber');
        cursorDot.classList.remove('hover', 'hover-amber');
      });
    });

    document.addEventListener('mouseleave', () => {
      cursorRing.style.opacity = '0';
      cursorDot.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursorRing.style.opacity = '1';
      cursorDot.style.opacity = '1';
    });
  }

  // Spotlight glow that follows the cursor across cards and chips
  document.querySelectorAll('.layer, .job, .metric, .contact-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
  });
}

// Scroll-reveal for the stack diagram layers
const layers = document.querySelectorAll('.layer');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('in-view'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  layers.forEach(layer => observer.observe(layer));
} else {
  layers.forEach(layer => layer.classList.add('in-view'));
}
