/* ============================================
   DOORMAT STUDIO — Main JavaScript
   Warm • Personalized • Cozy • Modern • Premium
============================================ */

'use strict';

/* ─── Preloader ─── */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => preloader.classList.add('hidden'), 600);
  }
});

/* ─── Dark / Light Mode Toggle ─── */
const themeKey = 'doormat-theme';

function initTheme() {
  const saved = localStorage.getItem(themeKey) || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem(themeKey, next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    const icon = btn.querySelector('i');
    if (icon) {
      icon.className = theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill';
    }
    btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  });
}

document.querySelectorAll('.theme-toggle').forEach(btn => {
  btn.addEventListener('click', toggleTheme);
});

initTheme();

/* ─── RTL (Right-to-Left) Toggle — "RTL" text icon, works on all pages ─── */
const rtlKey = 'doormat-rtl';

function isRTL() {
  return document.documentElement.getAttribute('dir') === 'rtl';
}

function updateRtlButtons() {
  const on = isRTL();
  document.querySelectorAll('.rtl-toggle').forEach(btn => {
    btn.classList.toggle('active', on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.title = on ? 'Switch to left-to-right layout' : 'Switch to right-to-left layout';
  });
}

function setRTL(on) {
  if (on) document.documentElement.setAttribute('dir', 'rtl');
  else document.documentElement.removeAttribute('dir');
  try { localStorage.setItem(rtlKey, on ? '1' : '0'); } catch (e) {}
  updateRtlButtons();
}

function toggleRTL() { setRTL(!isRTL()); }

function initRTL() {
  let saved = null;
  try { saved = localStorage.getItem(rtlKey); } catch (e) {}
  if (saved === '1') document.documentElement.setAttribute('dir', 'rtl');
  // Auto-inject an "RTL" toggle right after every theme toggle (covers all pages)
  document.querySelectorAll('.theme-toggle').forEach(themeBtn => {
    if (themeBtn.parentElement && !themeBtn.parentElement.querySelector('.rtl-toggle')) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'rtl-toggle';
      btn.setAttribute('aria-label', 'Toggle right-to-left layout');
      btn.setAttribute('aria-pressed', 'false');
      btn.textContent = 'RTL';
      btn.addEventListener('click', toggleRTL);
      themeBtn.insertAdjacentElement('afterend', btn);
    }
  });
  updateRtlButtons();
}

initRTL();

/* ─── Sticky Navbar ─── */
const navbar = document.querySelector('.navbar-warm');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });
}

/* ─── Back to Top ─── */
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ─── Scroll Animations ─── */
const animateElements = document.querySelectorAll('.animate-on-scroll');
if (animateElements.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  animateElements.forEach(el => observer.observe(el));
}

/* ─── Counter Animation ─── */
function animateCounter(el, end, duration = 2000) {
  const start = 0;
  const range = end - start;
  const startTime = performance.now();
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.floor(start + range * eased);
    el.textContent = prefix + current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

const counters = document.querySelectorAll('[data-count]');
if (counters.length) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        animateCounter(el, parseInt(el.dataset.count));
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => counterObserver.observe(el));
}

/* ─── Product Filter ─── */
function initProductFilter() {
  const filterBtns = document.querySelectorAll('.filter-tab[data-filter]');
  const filterItems = document.querySelectorAll('[data-category]');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      const filter = btn.dataset.filter;

      filterItems.forEach(item => {
        const show = filter === 'all' || item.dataset.category === filter;
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        if (show) {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => { item.style.display = 'none'; }, 300);
        }
      });
    });
  });
}

initProductFilter();

/* ─── Quantity Input ─── */
document.querySelectorAll('.qty-input').forEach(wrap => {
  const minus = wrap.querySelector('[data-minus]');
  const plus = wrap.querySelector('[data-plus]');
  const input = wrap.querySelector('input');

  if (minus && plus && input) {
    minus.addEventListener('click', () => {
      const val = parseInt(input.value) || 1;
      if (val > 1) input.value = val - 1;
    });
    plus.addEventListener('click', () => {
      const val = parseInt(input.value) || 1;
      const max = parseInt(input.max) || 9999;
      if (val < max) input.value = val + 1;
    });
  }
});

/* ─── Custom Design Studio ─── */
function initDesignStudio() {
  const preview = document.getElementById('matPreview');
  if (!preview) return;

  const textInput = document.getElementById('matText');
  const fontSelect = document.getElementById('matFont');
  const sizeSelect = document.getElementById('matSize');
  const colorBtns = document.querySelectorAll('.color-swatch');
  const bgColorBtns = document.querySelectorAll('.bg-color-swatch');

  let currentColor = '#FFFFFF';
  let currentBg = '#8B6040';

  function updatePreview() {
    if (textInput) {
      preview.querySelector('.preview-text').textContent = textInput.value || 'WELCOME HOME';
    }
    if (fontSelect) {
      preview.querySelector('.preview-text').style.fontFamily = fontSelect.value;
    }
  }

  if (textInput) textInput.addEventListener('input', updatePreview);
  if (fontSelect) fontSelect.addEventListener('change', updatePreview);

  colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      colorBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentColor = btn.dataset.color;
      if (preview.querySelector('.preview-text')) {
        preview.querySelector('.preview-text').style.color = currentColor;
      }
    });
  });

  bgColorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      bgColorBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentBg = btn.dataset.color;
      const matEl = preview.querySelector('.mat-preview');
      if (matEl) matEl.style.background = currentBg;
    });
  });
}

initDesignStudio();

/* ─── Size Tag Selection ─── */
document.querySelectorAll('.tag-chip[data-select]').forEach(chip => {
  const group = chip.dataset.select;
  chip.addEventListener('click', () => {
    document.querySelectorAll(`.tag-chip[data-select="${group}"]`).forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
  });
});

document.querySelectorAll('.size-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const group = btn.closest('.size-group');
    if (group) group.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

/* ─── Password Strength ─── */
function initPasswordStrength() {
  const pwInput = document.getElementById('registerPassword');
  const strengthBar = document.querySelector('.strength-bar');
  const strengthText = document.querySelector('.strength-text');
  if (!pwInput || !strengthBar) return;

  const levels = [
    { label: 'Very Weak', color: '#e53e3e', width: '20%' },
    { label: 'Weak',      color: '#ed8936', width: '40%' },
    { label: 'Fair',      color: '#ecc94b', width: '60%' },
    { label: 'Strong',    color: '#48bb78', width: '80%' },
    { label: 'Very Strong', color: '#38a169', width: '100%' },
  ];

  pwInput.addEventListener('input', () => {
    const pw = pwInput.value;
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const lv = levels[Math.min(score, levels.length - 1)];
    strengthBar.style.width = lv.width;
    strengthBar.style.background = lv.color;
    if (strengthText) strengthText.textContent = lv.label;
  });
}

initPasswordStrength();

/* ─── Countdown Timer ─── */
function initCountdown() {
  const target = document.getElementById('countdownTarget');
  if (!target) return;

  const end = new Date(target.dataset.end).getTime();

  function tick() {
    const now = Date.now();
    const diff = end - now;
    if (diff <= 0) {
      document.querySelectorAll('.cd-days,.cd-hours,.cd-mins,.cd-secs').forEach(el => el.textContent = '00');
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    const pad = n => String(n).padStart(2, '0');
    document.querySelectorAll('.cd-days').forEach(el => el.textContent = pad(d));
    document.querySelectorAll('.cd-hours').forEach(el => el.textContent = pad(h));
    document.querySelectorAll('.cd-mins').forEach(el => el.textContent = pad(m));
    document.querySelectorAll('.cd-secs').forEach(el => el.textContent = pad(s));
  }

  tick();
  setInterval(tick, 1000);
}

initCountdown();

/* ─── Form Validation ─── */
function initFormValidation() {
  document.querySelectorAll('form[data-validate]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      form.querySelectorAll('[required]').forEach(field => {
        const val = field.value.trim();
        if (!val) {
          showFieldError(field, 'This field is required');
          valid = false;
        } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          showFieldError(field, 'Please enter a valid email');
          valid = false;
        } else {
          clearFieldError(field);
        }
      });

      if (valid) {
        const btn = form.querySelector('[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i> Sent Successfully!';
        btn.disabled = true;
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.disabled = false;
          form.reset();
        }, 3000);
      }
    });

    form.querySelectorAll('[required]').forEach(field => {
      field.addEventListener('input', () => {
        if (field.value.trim()) clearFieldError(field);
      });
    });
  });
}

function showFieldError(field, msg) {
  field.classList.add('is-invalid');
  let err = field.nextElementSibling;
  if (!err || !err.classList.contains('invalid-feedback')) {
    err = document.createElement('div');
    err.className = 'invalid-feedback';
    field.after(err);
  }
  err.textContent = msg;
}

function clearFieldError(field) {
  field.classList.remove('is-invalid');
  field.classList.add('is-valid');
  const err = field.nextElementSibling;
  if (err && err.classList.contains('invalid-feedback')) {
    err.textContent = '';
  }
}

initFormValidation();

/* ─── RTL Toggle ─── */
const rtlToggle = document.getElementById('rtlToggle');
if (rtlToggle) {
  rtlToggle.addEventListener('click', () => {
    const isRtl = document.documentElement.dir === 'rtl';
    document.documentElement.dir = isRtl ? 'ltr' : 'rtl';
    rtlToggle.textContent = isRtl ? 'RTL' : 'LTR';
  });
}

/* ─── Image Zoom Modal ─── */
document.querySelectorAll('.img-zoom-container').forEach(container => {
  container.addEventListener('click', () => {
    const src = container.querySelector('img').src;
    const modal = new bootstrap.Modal(document.getElementById('zoomModal') || createZoomModal());
    document.querySelector('#zoomModal .zoom-img').src = src;
    modal.show();
  });
});

function createZoomModal() {
  const div = document.createElement('div');
  div.innerHTML = `
    <div class="modal fade" id="zoomModal" tabindex="-1">
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content bg-transparent border-0">
          <button class="btn-close btn-close-white ms-auto me-0 mb-2" data-bs-dismiss="modal"></button>
          <img class="zoom-img w-100 rounded" src="" alt="Zoomed" style="max-height:85vh;object-fit:contain;">
        </div>
      </div>
    </div>`;
  document.body.appendChild(div.firstElementChild);
  return document.getElementById('zoomModal');
}

/* ─── Cookie Banner ─── */
function initCookieBanner() {
  const banner = document.querySelector('.cookie-banner');
  if (!banner) return;
  if (!localStorage.getItem('cookiesAccepted')) {
    setTimeout(() => banner.classList.add('show'), 1500);
  }
  const acceptBtn = banner.querySelector('[data-accept-cookies]');
  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookiesAccepted', '1');
      banner.classList.remove('show');
    });
  }
}

initCookieBanner();

/* ─── Mobile Nav Active Link ─── */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.navbar-warm .nav-link').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

/* ─── Mobile Nav: auto-close hamburger after navigation ─── */
document.querySelectorAll('.navbar-warm .navbar-collapse').forEach(menu => {
  // Drop any legacy injected close button — the toggler itself morphs to X
  menu.querySelectorAll('.nav-close-btn').forEach(btn => btn.remove());
  menu.querySelectorAll('.nav-link, .btn-warm, .btn-warm-outline').forEach(item => {
    item.addEventListener('click', () => {
      if (!menu.classList.contains('show')) return;
      if (window.bootstrap && window.bootstrap.Collapse) {
        const inst = window.bootstrap.Collapse.getInstance(menu)
          || new window.bootstrap.Collapse(menu, { toggle: false });
        inst.hide();
      } else {
        menu.classList.remove('show');
      }
    });
  });
});

/* ─── Smooth Section Reveal ─── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = navbar ? navbar.offsetHeight : 80;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth'
      });
    }
  });
});

/* ─── Textarea Auto-Resize ─── */
document.querySelectorAll('textarea[data-auto-resize]').forEach(ta => {
  ta.addEventListener('input', () => {
    ta.style.height = 'auto';
    ta.style.height = ta.scrollHeight + 'px';
  });
});

/* ─── Image Lazy Load ─── */
const lazyImages = document.querySelectorAll('img[data-src]');
if (lazyImages.length && 'IntersectionObserver' in window) {
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imgObserver.unobserve(img);
      }
    });
  });
  lazyImages.forEach(img => imgObserver.observe(img));
}

/* ─── Pricing Toggle (Monthly/Yearly) ─── */
function initPricingToggle() {
  const toggle = document.getElementById('pricingToggle');
  if (!toggle) return;

  toggle.addEventListener('change', () => {
    const isYearly = toggle.checked;
    document.querySelectorAll('.price-amount[data-monthly]').forEach(el => {
      el.textContent = isYearly
        ? el.dataset.yearly
        : el.dataset.monthly;
    });
    document.querySelectorAll('.price-period').forEach(el => {
      el.textContent = isYearly ? '/year' : '/mat';
    });
  });
}

initPricingToggle();

/* ─── Tab System ─── */
document.querySelectorAll('[data-tab-target]').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tabTarget;
    const parent = btn.closest('[data-tabs]');
    if (!parent) return;

    parent.querySelectorAll('[data-tab-target]').forEach(b => b.classList.remove('active'));
    parent.querySelectorAll('[data-tab-content]').forEach(c => {
      c.style.display = c.dataset.tabContent === target ? 'block' : 'none';
    });
    btn.classList.add('active');
  });
});

/* ─── Accordion Open First ─── */
document.querySelectorAll('.faq-accordion').forEach(acc => {
  const first = acc.querySelector('.accordion-button');
  if (first && first.classList.contains('collapsed')) {
    // keep default state from HTML
  }
});

/* ─── Progress Bars Animation ─── */
const progressBars = document.querySelectorAll('.progress-warm .bar[data-width]');
if (progressBars.length) {
  const barObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.dataset.width;
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  progressBars.forEach(bar => {
    bar.style.width = '0';
    barObserver.observe(bar);
  });
}

/* ─── Toast Notification Helper ─── */
window.showToast = function(message, type = 'success') {
  const colors = {
    success: '#3E8B4A',
    error: '#C95B4B',
    info: '#4B7BC9',
    warning: '#C9A34B',
  };
  const icons = {
    success: 'bi-check-circle-fill',
    error: 'bi-exclamation-circle-fill',
    info: 'bi-info-circle-fill',
    warning: 'bi-exclamation-triangle-fill',
  };
  const toast = document.createElement('div');
  toast.style.cssText = `
    position:fixed; bottom:80px; right:24px; z-index:9999;
    background:${colors[type] || colors.info}; color:#fff;
    padding:14px 20px; border-radius:10px; font-weight:600;
    font-size:0.92rem; box-shadow:0 8px 24px rgba(0,0,0,0.25);
    transform:translateX(120%); transition:transform 0.4s ease;
    max-width:280px; display:flex; align-items:center;
  `;
  const icon = document.createElement('i');
  icon.className = 'bi ' + (icons[type] || icons.info);
  icon.style.marginRight = '8px';
  toast.appendChild(icon);
  toast.appendChild(document.createTextNode(message));
  document.body.appendChild(toast);
  setTimeout(() => toast.style.transform = 'translateX(0)', 50);
  setTimeout(() => {
    toast.style.transform = 'translateX(120%)';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
};

console.log('%cDoormat Studio', 'color:#C97B4B;font-size:1.5rem;font-weight:bold;font-family:Georgia,serif;');
console.log('%cWelcome to our premium custom mat studio website!', 'color:#9B7E6A;font-size:0.9rem;');
