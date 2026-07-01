// Navbar scroll effect
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// Mobile hamburger
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
  });
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileNav.classList.remove('open'));
  });
}

// Fade-in on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// FAQ accordion
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-icon').textContent = '+';
    });
    if (!isOpen) {
      item.classList.add('open');
      btn.querySelector('.faq-icon').textContent = '−';
    }
  });
});

// Contact form (index page)
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    const data = Object.fromEntries(new FormData(contactForm));
    data.source = 'website_contact_form';
    data.received_letter = contactForm.received_letter?.checked ?? false;

    try {
      await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (_) {}

    document.getElementById('form-inner').style.display = 'none';
    document.getElementById('form-success').style.display = 'block';
  });
}

// Cooling page — read ?ref= from URL
const refBanner = document.getElementById('ref-banner');
const refValue = document.getElementById('ref-value');
const refDisplay = document.getElementById('ref-display');
if (refBanner && refValue) {
  const ref = new URLSearchParams(window.location.search).get('ref') || '';
  if (ref) {
    refValue.textContent = ref;
    refBanner.style.display = 'block';
    if (refDisplay) refDisplay.textContent = 'Reference: ' + ref;
  }
}

// Cooling form
const coolingForm = document.getElementById('cooling-form');
if (coolingForm) {
  coolingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = coolingForm.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    const ref = new URLSearchParams(window.location.search).get('ref') || '';
    const data = Object.fromEntries(new FormData(coolingForm));
    data.campaign_reference = ref;
    data.source = 'cooling_letter';

    try {
      await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (_) {}

    document.getElementById('cooling-form-wrap').style.display = 'none';
    document.getElementById('cooling-success').style.display = 'block';
  });
}
