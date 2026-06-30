// Utility functions
const get = (selector) => document.querySelector(selector);
const getAll = (selector) => document.querySelectorAll(selector);

const createElement = (tag, className = '', innerHTML = '') => {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (innerHTML) el.innerHTML = innerHTML;
  return el;
};

const addClass = (el, cls) => el.classList.add(cls);
const removeClass = (el, cls) => el.classList.remove(cls);
const toggleClass = (el, cls) => el.classList.toggle(cls);
const hasClass = (el, cls) => el.classList.contains(cls);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const clamp = (num, min, max) => Math.max(min, Math.min(max, num));
const lerp = (a, b, t) => a + (b - a) * t;

const logger = {
  log: (msg) => console.log(`[Prisddle] ${msg}`),
  error: (msg) => console.error(`[Prisddle ERROR] ${msg}`),
  warn: (msg) => console.warn(`[Prisddle WARN] ${msg}`),
};
