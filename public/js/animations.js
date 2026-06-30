const fadeIn = (el, duration = 300) => {
  el.style.opacity = '0';
  el.style.animation = `fadeIn ${duration}ms ease-out`;
  setTimeout(() => el.style.animation = 'none', duration);
};

const fadeOut = (el, duration = 300) => {
  el.style.animation = `fadeOut ${duration}ms ease-out`;
  setTimeout(() => el.style.opacity = '0', duration);
};

const slideUp = (el, duration = 300) => {
  el.style.animation = `slideUp ${duration}ms ease-out`;
  setTimeout(() => el.style.animation = 'none', duration);
};

const slideDown = (el, duration = 300) => {
  el.style.animation = `slideDown ${duration}ms ease-out`;
  setTimeout(() => el.style.animation = 'none', duration);
};

const pulse = (el, duration = 600) => {
  el.style.animation = `pulse ${duration}ms infinite`;
};

const shake = (el, duration = 400) => {
  el.style.animation = `shake ${duration}ms ease-out`;
  setTimeout(() => el.style.animation = 'none', duration);
};

const scale = (el, duration = 300) => {
  el.style.animation = `scale ${duration}ms var(--ease)`;
  setTimeout(() => el.style.animation = 'none', duration);
};

const rotateIn = (el, duration = 400) => {
  el.style.animation = `rotateIn ${duration}ms ease-out`;
  setTimeout(() => el.style.animation = 'none', duration);
};
