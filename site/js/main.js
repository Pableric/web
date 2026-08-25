const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const revealItems = [
  ...new Set(document.querySelectorAll("[data-reveal], [data-accuracy-chart]")),
];

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

const heroComparison = document.querySelector("[data-hero-comparison]");

if (
  heroComparison &&
  !reduceMotion.matches &&
  window.gsap
) {
  const { gsap } = window;
  const heroNumber = heroComparison.querySelector(".hero-number");
  const visualLabels = heroComparison.querySelectorAll(".hero-visual-label span");
  const grid = heroComparison.querySelector(".ratio-grid");
  const watermark = heroComparison.querySelector(".ratio-watermark");
  const ratioCut = heroComparison.querySelector(".ratio-cut");
  const ratioLines = heroComparison.querySelectorAll(".ratio-cut path");
  const ratioNode = heroComparison.querySelector(".ratio-cut-node");
  const trackLabels = heroComparison.querySelectorAll(".track-label");
  const trackLines = heroComparison.querySelectorAll(".track-line i");
  const trackDots = heroComparison.querySelectorAll(".track-line b");
  const caption = heroComparison.querySelector(".comparison-caption");

  document.documentElement.classList.add("gsap-ready");

  gsap.set(visualLabels, { autoAlpha: 0, y: -5 });
  gsap.set(grid, { autoAlpha: 0 });
  gsap.set(watermark, { autoAlpha: 0, x: 100 });
  gsap.set(ratioCut, { y: -235 });
  gsap.set(ratioLines, { strokeDasharray: 1, strokeDashoffset: 1 });
  gsap.set(ratioNode, {
    autoAlpha: 0,
    scale: 0,
    transformOrigin: "center center",
  });
  gsap.set(heroNumber, {
    autoAlpha: 0,
    clipPath: "inset(0 0 100% 0)",
  });
  gsap.set(trackLabels, { autoAlpha: 0, y: 6 });
  gsap.set(trackLines, { scaleX: 0, transformOrigin: "left center" });
  gsap.set(trackDots, { autoAlpha: 0, scale: 0 });
  gsap.set(caption, { autoAlpha: 0, y: 5 });

  const heroTimeline = gsap.timeline({
    defaults: { ease: "power3.out" },
  });

  heroTimeline
    .to(visualLabels, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.06 })
    .to(grid, { autoAlpha: 0.28, duration: 0.42 }, 0.04)
    .to(watermark, { autoAlpha: 1, x: 0, duration: 0.72 }, 0.08)
    .to(
      ratioLines,
      { strokeDashoffset: 0, duration: 0.72, stagger: 0.08, ease: "power2.inOut" },
      0.18,
    )
    .to(ratioCut, { y: 0, duration: 0.92, ease: "expo.inOut" }, 0.26)
    .to(
      heroNumber,
      {
        autoAlpha: 1,
        clipPath: "inset(0% 0 0 0)",
        duration: 0.92,
        ease: "expo.inOut",
      },
      0.26,
    )
    .to(ratioNode, { autoAlpha: 0.78, scale: 1, duration: 0.22 }, 1.04)
    .to(watermark, { x: -24, opacity: 0.62, duration: 0.5 }, 1.05)
    .to(trackLabels, { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.08 }, 1.2)
    .to(trackLines[0], { scaleX: 1, duration: 0.68, ease: "power3.out" }, 1.32)
    .to(trackDots[0], { autoAlpha: 1, scale: 1, duration: 0.24 }, 1.86)
    .to(trackLines[1], { scaleX: 1, duration: 0.24, ease: "power3.out" }, 1.7)
    .to(trackDots[1], { autoAlpha: 1, scale: 1, duration: 0.2 }, 1.88)
    .to(caption, { autoAlpha: 1, y: 0, duration: 0.35 }, 1.78)
    .to(grid, { autoAlpha: 0.06, duration: 0.55 }, 1.82);
}

const header = document.querySelector("[data-header]");

if (header) {
  let scrollFrame = 0;

  const updateHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 18);
    scrollFrame = 0;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(updateHeader);
    },
    { passive: true },
  );
}

const mobileMenu = document.querySelector("[data-mobile-menu]");

if (mobileMenu) {
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => mobileMenu.removeAttribute("open"));
  });
}
