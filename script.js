(() => {
  const header = document.querySelector('[data-header]');
  const setHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 12);
  setHeader();
  window.addEventListener('scroll', setHeader, { passive: true });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach((element) => {
    const delay = element.dataset.delay;
    if (delay) element.style.setProperty('--delay', `${delay}ms`);
  });

  if (reducedMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((element) => element.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.13, rootMargin: '0px 0px -7% 0px' });
    reveals.forEach((element) => observer.observe(element));
  }

  const shots = {
    off: {
      src: 'assets/app-off.png',
      alt: 'Actual ONScreen app in its OFF state with Infinite selected'
    },
    active: {
      src: 'assets/app-active.png',
      alt: 'Actual ONScreen app during a 30-minute timed session'
    },
    countdown: {
      src: 'assets/app-active.png',
      alt: 'Actual ONScreen countdown showing the remaining time before automatic shutoff'
    }
  };

  const tabs = document.querySelectorAll('[data-shot]');
  const shot = document.querySelector('[data-product-shot]');
  const shotWindow = shot?.closest('.app-window');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const next = shots[tab.dataset.shot];
      if (!next || !shot) return;

      tabs.forEach((item) => {
        const selected = item === tab;
        item.classList.toggle('is-active', selected);
        item.setAttribute('aria-pressed', String(selected));
      });

      shotWindow?.classList.add('is-changing');
      window.setTimeout(() => {
        shot.src = next.src;
        shot.alt = next.alt;
        shotWindow?.classList.remove('is-changing');
      }, reducedMotion ? 0 : 170);
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
      history.replaceState(null, '', link.getAttribute('href'));
    });
  });
})();
