/* ── GLOBAL JS ── */

// ── CUSTOM CURSOR ──────────────────────────────────
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mx = 0, my = 0, fx = 0, fy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

function animateFollower() {
  fx += (mx - fx) * 0.12;
  fy += (my - fy) * 0.12;
  follower.style.left = fx + 'px';
  follower.style.top  = fy + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

document.querySelectorAll('a, button, .skill-card, .project-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2)';
    follower.style.transform = 'translate(-50%,-50%) scale(1.4)';
    follower.style.borderColor = 'rgba(124,92,252,0.6)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    follower.style.transform = 'translate(-50%,-50%) scale(1)';
    follower.style.borderColor = 'rgba(124,92,252,0.4)';
  });
});


// ── LOADER ────────────────────────────────────────
const loader = document.getElementById('loader');
const loaderFill = document.getElementById('loaderFill');
let progress = 0;

const fillInterval = setInterval(() => {
  progress += Math.random() * 18;
  if (progress >= 100) { progress = 100; clearInterval(fillInterval); }
  loaderFill.style.width = progress + '%';
}, 100);

window.addEventListener('load', () => {
  setTimeout(() => {
    loaderFill.style.width = '100%';
    setTimeout(() => {
      loader.classList.add('hidden');
      startAnimations();
    }, 400);
  }, 600);
});


// ── NAV SCROLL ─────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});


// ── HAMBURGER / MOBILE MENU ────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
  });
});


// ── TYPEWRITER ─────────────────────────────────────
const words = ['beautiful UIs.', 'web apps.', 'digital experiences.', 'APIs & backends.', 'your ideas.'];
let wordIdx = 0, charIdx = 0, isDeleting = false;
const tw = document.getElementById('typewriter');

function type() {
  const word = words[wordIdx];
  if (!isDeleting) {
    tw.textContent = word.substring(0, charIdx + 1);
    charIdx++;
    if (charIdx === word.length) { isDeleting = true; setTimeout(type, 1800); return; }
  } else {
    tw.textContent = word.substring(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      isDeleting = false;
      wordIdx = (wordIdx + 1) % words.length;
    }
  }
  setTimeout(type, isDeleting ? 60 : 100);
}

function startAnimations() {
  type();
  animateCounters();
  initReveal();
}

// Immediate fallback (in case 'load' already fired)
if (document.readyState === 'complete') {
  setTimeout(() => {
    loader.classList.add('hidden');
    startAnimations();
  }, 1200);
}


// ── COUNTER ANIMATION ─────────────────────────────
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = +el.dataset.target;
    let current = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current);
    }, 25);
  });
}


// ── SCROLL REVEAL ─────────────────────────────────
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Animate skill bars when skills section is visible
        if (entry.target.closest('#skills') || entry.target.id === 'skills') {
          animateSkillBars();
        }
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 5) * 0.08}s`;
    observer.observe(el);
  });

  // Also observe skill cards for bar animation
  const skillsSection = document.getElementById('skills');
  if (skillsSection) observer.observe(skillsSection);
}


// ── SKILL BARS ────────────────────────────────────
let skillsAnimated = false;
function animateSkillBars() {
  if (skillsAnimated) return;
  skillsAnimated = true;
  document.querySelectorAll('.skill-bar').forEach(bar => {
    const width = bar.dataset.w;
    setTimeout(() => { bar.style.width = width + '%'; }, 200);
  });
}

// Separate observer just for skills section
const skillsObs = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) animateSkillBars();
}, { threshold: 0.2 });
const skillsSec = document.getElementById('skills');
if (skillsSec) skillsObs.observe(skillsSec);


// ── CONTACT FORM ──────────────────────────────────
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const submitText = document.getElementById('submitText');
const formSuccess = document.getElementById('formSuccess');

form.addEventListener('submit', e => {
  e.preventDefault();
  submitBtn.disabled = true;
  submitText.textContent = 'Sending...';
  submitBtn.style.opacity = '0.7';

  setTimeout(() => {
    submitBtn.disabled = false;
    submitText.textContent = 'Send Message';
    submitBtn.style.opacity = '1';
    formSuccess.classList.add('show');
    form.reset();
    setTimeout(() => formSuccess.classList.remove('show'), 4000);
  }, 1800);
});


// ── SMOOTH ACTIVE NAV ─────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.style.color = '');
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.style.color = 'var(--text)';
    }
  });
}, { threshold: 0.5 });
sections.forEach(s => sectionObserver.observe(s));


// ── TILT CARDS ────────────────────────────────────
document.querySelectorAll('.project-card, .skill-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -8;
    const rotY = ((x - cx) / cx) * 8;
    card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});


// ── PARTICLE BACKGROUND ───────────────────────────
(function createParticles() {
  const hero = document.querySelector('.hero-bg');
  if (!hero) return;
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 3 + 1;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const dur = Math.random() * 15 + 10;
    const delay = Math.random() * 10;
    p.style.cssText = `
      position:absolute;
      width:${size}px; height:${size}px;
      background:rgba(124,92,252,${Math.random() * 0.6 + 0.1});
      border-radius:50%;
      left:${x}%; top:${y}%;
      animation: particleDrift ${dur}s ${delay}s ease-in-out infinite alternate;
      pointer-events:none;
    `;
    hero.appendChild(p);
  }

  const style = document.createElement('style');
  style.textContent = `
    @keyframes particleDrift {
      0% { transform: translateY(0) translateX(0) scale(1); opacity: 0.3; }
      50% { opacity: 0.8; }
      100% { transform: translateY(-${Math.random()*60+20}px) translateX(${(Math.random()-0.5)*60}px) scale(1.5); opacity: 0.1; }
    }
  `;
  document.head.appendChild(style);
})();
