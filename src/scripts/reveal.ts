const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');

if (targets.length > 0 && 'IntersectionObserver' in window && !reducedMotion) {
  const groups = new Map<Element, HTMLElement[]>();
  for (const target of targets) {
    const trigger = target.dataset.reveal === 'clip' ? (target.parentElement ?? target) : target;
    groups.set(trigger, [...(groups.get(trigger) ?? []), target]);
  }

  const show = (trigger: Element) => {
    groups.get(trigger)?.forEach((target) => target.classList.add('is-visible'));
  };

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        show(entry.target);
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );

  for (const trigger of groups.keys()) {
    if (trigger.getBoundingClientRect().top < window.innerHeight) show(trigger);
    else observer.observe(trigger);
  }

  document.documentElement.classList.add('reveal-ready');
}

const progress = document.querySelector<HTMLElement>('[data-scroll-progress]');

if (progress) {
  let frame = 0;
  const update = () => {
    frame = 0;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
  };
  window.addEventListener(
    'scroll',
    () => {
      if (!frame) frame = requestAnimationFrame(update);
    },
    { passive: true },
  );
  update();
}

const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (finePointer && !reducedMotion) {
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((element) => {
    element.addEventListener('pointermove', (event) => {
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * 0.25;
      const y = (event.clientY - rect.top - rect.height / 2) * 0.35;
      element.style.transform = `translate(${x}px, ${y}px)`;
    });
    element.addEventListener('pointerleave', () => {
      element.style.transform = '';
    });
  });
}
