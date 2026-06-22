// ── Navbar: transparent → opaque on scroll ────────────────────────────────────
(function () {
  const navbar = document.querySelector('.navbar');
  const update = () => navbar.classList.toggle('scrolled', window.scrollY > 60);
  update();
  window.addEventListener('scroll', update, { passive: true });
})();

// ── Footer year ───────────────────────────────────────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();

// ── Navbar mobile menu ────────────────────────────────────────────────────────
(function () {
  const toggle  = document.getElementById('menuToggle');
  const menu    = document.getElementById('mobileMenu');
  const iconOpen  = document.getElementById('iconOpen');
  const iconClose = document.getElementById('iconClose');

  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    iconOpen.style.display  = open ? 'none'  : '';
    iconClose.style.display = open ? ''      : 'none';
  });
})();

// ── Smooth-scroll anchor links ────────────────────────────────────────────────
document.querySelectorAll('.nav-anchor').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const id = link.getAttribute('href').replace('#', '');
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
    // Close mobile menu if open
    document.getElementById('mobileMenu').classList.remove('open');
    document.getElementById('iconOpen').style.display  = '';
    document.getElementById('iconClose').style.display = 'none';
  });
});

// Handle hash-based scroll on page load
window.addEventListener('load', () => {
  if (location.hash) {
    const target = document.querySelector(location.hash);
    if (target) setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 100);
  }
});

// ── Scroll animations (IntersectionObserver) ──────────────────────────────────
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .fade-scale').forEach(el => observer.observe(el));

// Map wrapper: trigger connection line animation
const mapObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); mapObserver.unobserve(e.target); } });
}, { threshold: 0.3 });
const mapWrapper = document.getElementById('mapWrapper');
if (mapWrapper) mapObserver.observe(mapWrapper);


// ── Testimonials: 3-card auto-sliding carousel ───────────────────────────────
(function () {
  const reviews = [
    { name: "Lorenzo Ricci",    initials: "LR", role: "Purchasing Manager",             rating: 5, text: "We initially placed a small trial order to evaluate quality and consistency. After receiving the shipment, we expanded our volumes because the material matched what was promised. That kind of predictability is important when you’re supplying your own customers." },
    { name: "Marco Bianchi",    initials: "MB", role: "Procurement Manager",            rating: 5, text: "We sourced finished belt leather from Florishine for our production line and were impressed by the consistency of thickness, finish, and packing standards. Communication was clear throughout the process and deliveries arrived as committed." },
    { name: "David Thompson",   initials: "DT", role: "Import & Supply Chain Manager",  rating: 5, text: "Finding a supplier that can handle both quality requirements and shipment schedules is difficult. Florishine has proven dependable across multiple orders and has become a trusted sourcing partner for our business." },
    { name: "Adewale Ogunleye", initials: "AO", role: "Operations Director",            rating: 5, text: "The upholstery leather materials supplied met our specifications and helped us maintain quality standards across our furniture production. We appreciate their responsiveness and attention to detail." },
    { name: "Priya Nair",       initials: "PN", role: "Sourcing Head",                  rating: 5, text: "The industrial glove leather supplied was consistent in quality and competitively priced. The team was proactive in addressing requirements and documentation." },
    { name: "Sarah Mitchell",   initials: "SM", role: "Senior Procurement Manager",     rating: 5, text: "What stood out most was the consistency. Whether sourcing finished leather or leather components, every shipment matched the agreed specifications. That level of reliability is essential for maintaining our production schedules." }
  ];

  const track = document.getElementById("tqTrack");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  if (!track) return;

  const stars = r => Array.from({length: 5}, function(_, i) {
    return "<span class=\"" + (i < r ? "star-filled" : "star-empty") + "\">&#9733;</span>";
  }).join("");

  track.innerHTML = reviews.map(function(rv) {
    return "<div class=\"tq-card\"><div class=\"tq-card-top\"><span class=\"tq-qmark\" aria-hidden=\"true\">&#x201C;</span><p class=\"tq-quote\">" + rv.text + "</p></div><div class=\"tq-card-footer\"><div class=\"tq-author\"><div class=\"tq-avatar\">" + rv.initials + "</div><div><p class=\"tq-name\">" + rv.name + "</p><p class=\"tq-role\">" + rv.role + "</p></div></div><div class=\"tq-stars\">" + stars(rv.rating) + "</div></div></div>";
  }).join("");

  let current = 0;
  let autoTimer;

  const getVisible = function() { return window.innerWidth >= 992 ? 3 : window.innerWidth >= 576 ? 2 : 1; };

  const slideTo = function(idx) {
    const max = reviews.length - getVisible();
    current = Math.max(0, Math.min(idx, max));
    const card = track.querySelector(".tq-card");
    if (!card) return;
    const gap = parseFloat(getComputedStyle(track).gap) || 22;
    track.style.transform = "translateX(-" + (current * (card.offsetWidth + gap)) + "px)";
  };

  const advance = function() {
    const max = reviews.length - getVisible();
    slideTo(current >= max ? 0 : current + 1);
  };

  const resetAuto = function() { clearInterval(autoTimer); autoTimer = setInterval(advance, 5000); };

  if (prevBtn) prevBtn.addEventListener("click", function() { slideTo(current > 0 ? current - 1 : reviews.length - getVisible()); resetAuto(); });
  if (nextBtn) nextBtn.addEventListener("click", function() { advance(); resetAuto(); });

  autoTimer = setInterval(advance, 5000);
  window.addEventListener("resize", function() { slideTo(current); });
})();
// ── Home page: product carousel ──────────────────────────────────────────────
(function () {
  const track = document.querySelector('.supply-track');
  const prev  = document.querySelector('.supply-prev');
  const next  = document.querySelector('.supply-next');
  if (!track) return;

  const scroll = dir => {
    const card = track.querySelector('.supply-card');
    const gap  = parseFloat(getComputedStyle(track).gap) || 22;
    track.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: 'smooth' });
  };

  prev?.addEventListener('click', () => scroll(-1));
  next?.addEventListener('click', () => scroll(1));
})();

// ── Products page: scrollspy for nav strip ────────────────────────────────────
(function () {
  const navLinks = document.querySelectorAll('.prod-nav-link');
  if (!navLinks.length) return;

  const sections = Array.from(navLinks)
    .map(l => document.querySelector(l.getAttribute('href')))
    .filter(Boolean);

  const spy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = '#' + entry.target.id;
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === id));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => spy.observe(s));
})();

// ── Product image carousel ────────────────────────────────────────────────────
document.querySelectorAll('[data-carousel]').forEach(carousel => {
  const slides   = carousel.querySelectorAll('.prod-slide');
  const dots     = carousel.querySelectorAll('.prod-carousel-dot');
  const dotsWrap = carousel.querySelector('.prod-carousel-dots');
  const prevBtn  = carousel.querySelector('.prev');
  const nextBtn  = carousel.querySelector('.next');
  if (!slides.length) return;
  let cur = 0;

  const go = n => {
    slides[cur].classList.remove('active');
    if (dots[cur]) dots[cur].classList.remove('active');
    cur = (n + slides.length) % slides.length;
    slides[cur].classList.add('active');
    if (dots[cur]) dots[cur].classList.add('active');
  };

  prevBtn && prevBtn.addEventListener('click', () => go(cur - 1));
  nextBtn && nextBtn.addEventListener('click', () => go(cur + 1));
  dots.forEach((d, i) => d.addEventListener('click', () => go(i)));

  if (slides.length <= 1) {
    prevBtn  && (prevBtn.style.display  = 'none');
    nextBtn  && (nextBtn.style.display  = 'none');
    dotsWrap && (dotsWrap.style.display = 'none');
  }
});

// ── Contact form ──────────────────────────────────────────────────────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) contactForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const name    = document.getElementById('name').value.trim();
  const company = document.getElementById('company') ? document.getElementById('company').value.trim() : '';
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  if (!name || !email || !message) { alert('Please fill out all fields.'); return; }

  const btn = document.getElementById('submitBtn');
  btn.textContent = 'Sending…';
  btn.disabled = true;

  const subject = encodeURIComponent('Enquiry from ' + name + ' — Florishine Website');
  const companyLine = company ? '\nCompany: ' + company : '';
  const body    = encodeURIComponent('Name: ' + name + companyLine + '\nEmail: ' + email + '\n\nMessage:\n' + message);
  window.location.href = 'mailto:info@florishine.com?subject=' + subject + '&body=' + body;

  setTimeout(() => {
    document.getElementById('formView').style.display  = 'none';
    document.getElementById('successView').classList.add('show');
  }, 800);
});

function resetForm() {
  document.getElementById('contactForm').reset();
  document.getElementById('submitBtn').textContent = 'Send Message';
  document.getElementById('submitBtn').disabled = false;
  document.getElementById('successView').classList.remove('show');
  document.getElementById('formView').style.display = 'block';
}
