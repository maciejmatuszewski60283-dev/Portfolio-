const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (targets.length > 0 && 'IntersectionObserver' in window && !reducedMotion) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );

  for (const target of targets) {
    const { top } = target.getBoundingClientRect();
    if (top < window.innerHeight) target.classList.add('is-visible');
    else observer.observe(target);
  }

  document.documentElement.classList.add('reveal-ready');
}
