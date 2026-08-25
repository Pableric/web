const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const revealItems = [...document.querySelectorAll("[data-reveal]")];

if (!reduceMotion.matches && "IntersectionObserver" in window) {
  document.documentElement.classList.add("motion-ready");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
