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

  document.querySelectorAll(".marquee-track").forEach((track) => {
    const cards = [...track.querySelectorAll(".marquee-card")];
    let ticking = false;

    const update = () => {
      ticking = false;
      const trackRect = track.getBoundingClientRect();
      const centerX = trackRect.left + trackRect.width / 2;
      const maxDist = trackRect.width / 2 || 1;
      let closest = null;
      let closestDist = Infinity;

      cards.forEach((card) => {
        const r = card.getBoundingClientRect();
        const cardCenter = r.left + r.width / 2;
        const dist = Math.abs(cardCenter - centerX);
        const t = Math.min(dist / maxDist, 1);
        const scale = MAX_SCALE - t * (MAX_SCALE - MIN_SCALE);
        card.style.transform = `scale(${scale.toFixed(3)})`;
        if (dist < closestDist) {
          closestDist = dist;
          closest = card;
        }
      });

      cards.forEach((card) => card.classList.toggle("is-active", card === closest));
    };

    track.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true }
    );

    window.addEventListener("resize", update);
    requestAnimationFrame(update);
  });
});
