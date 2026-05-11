/* ============================================================
   WHERE IS MY MILK — Shared JS Nav Component
   ============================================================ */

// Navigation scroll effect
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  });
}

// Mobile hamburger menu
const hamburger = document.querySelector('.nav-hamburger');
const mobileMenu = document.querySelector('.nav-mobile');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    spans.forEach(s => s.style.transition = 'all 0.3s ease');
    if (mobileMenu.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
    }
  });
}

// Scroll animations — Intersection Observer
const animateOnScroll = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('[data-animate]').forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
  });
};

document.addEventListener('DOMContentLoaded', animateOnScroll);

// Counter animation
const animateCounters = () => {
  document.querySelectorAll('[data-counter]').forEach((el) => {
    const target = parseFloat(el.dataset.counter);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();

    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      el.textContent = prefix + current.toLocaleString('en-IN') + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        requestAnimationFrame(update);
        observer.disconnect();
      }
    }, { threshold: 0.3 });

    observer.observe(el);
  });
};

document.addEventListener('DOMContentLoaded', animateCounters);

// Active nav link highlighting
const markActiveNav = () => {
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .sidebar-link').forEach((link) => {
    const href = link.getAttribute('href') || '';
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
};

document.addEventListener('DOMContentLoaded', markActiveNav);

// Tab switching utility
const initTabs = (containerSelector) => {
  const containers = document.querySelectorAll(containerSelector);
  containers.forEach((container) => {
    const tabs = container.querySelectorAll('[data-tab]');
    const panels = container.querySelectorAll('[data-panel]');

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.style.display = 'none');
        tab.classList.add('active');
        const panel = container.querySelector(`[data-panel="${target}"]`);
        if (panel) panel.style.display = '';
      });
    });
  });
};

document.addEventListener('DOMContentLoaded', () => initTabs('.tabs-container'));

// Smooth progress bar fills
const fillProgressBars = () => {
  document.querySelectorAll('.progress-fill[data-width]').forEach((bar) => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        bar.style.width = bar.dataset.width + '%';
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    observer.observe(bar);
  });
};

document.addEventListener('DOMContentLoaded', fillProgressBars);

// Toast notification utility
const showToast = (message, type = 'success') => {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed; bottom: 24px; right: 24px; z-index: 9999;
    background: ${type === 'success' ? '#28a745' : type === 'error' ? '#ba1a1a' : '#0056d2'};
    color: #fff; padding: 14px 20px; border-radius: 12px;
    font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 600;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    transform: translateX(120%); transition: transform 0.3s ease-out;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(0)';
  });
  setTimeout(() => {
    toast.style.transform = 'translateX(120%)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

window.showToast = showToast;
