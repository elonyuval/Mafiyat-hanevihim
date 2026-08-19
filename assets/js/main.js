document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");

  toggle?.addEventListener("click", () => {
    header.classList.toggle("open");
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => header.classList.remove("open"));
  });

  const revealEls = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => observer.observe(el));

  document.getElementById("year").textContent = new Date().getFullYear();

  const MIN_SCALE = 1;
  const MAX_SCALE = 1.16;

  const carousels = [...document.querySelectorAll(".marquee-track")].map((track) => ({
    track,
    cards: [...track.querySelectorAll(".marquee-card")],
    lastScrollLeft: null,
  }));

  if (carousels.length) {
    // A scroll-event-driven update lags behind the real scroll position during
    // iOS momentum scrolling (-webkit-overflow-scrolling: touch fires "scroll"
    // at a lower, uneven rate than the actual visual position), which reads as
    // stutter/jitter. Polling every animation frame instead keeps the scale in
    // sync with what's actually on screen regardless of how scroll events fire.
    const tick = () => {
      carousels.forEach(({ track, cards, lastScrollLeft }, i) => {
        const sl = track.scrollLeft;
        if (sl === lastScrollLeft) return;
        carousels[i].lastScrollLeft = sl;

        const trackRect = track.getBoundingClientRect();
        const centerX = trackRect.left + trackRect.width / 2;
        const maxDist = trackRect.width / 2 || 1;
        let closest = null;
        let closestDist = Infinity;
        const positions = cards.map((card) => {
          const r = card.getBoundingClientRect();
          const cardCenter = r.left + r.width / 2;
          const dist = Math.abs(cardCenter - centerX);
          if (dist < closestDist) {
            closestDist = dist;
            closest = card;
          }
          return dist;
        });
        cards.forEach((card, idx) => {
          const t = Math.min(positions[idx] / maxDist, 1);
          const scale = MAX_SCALE - t * (MAX_SCALE - MIN_SCALE);
          card.style.transform = `scale(${scale.toFixed(3)})`;
          card.classList.toggle("is-active", card === closest);
        });
      });
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    window.addEventListener("resize", () => carousels.forEach((c) => (c.lastScrollLeft = null)));
  }
});
