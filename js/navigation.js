window.Portfolio = window.Portfolio || {};

window.Portfolio.initNavigation = function () {
  const header = document.querySelector("[data-header]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const menu = document.querySelector("[data-nav-menu]");
  const backToTop = document.querySelector("[data-back-to-top]");
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const sections = navLinks.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);

  const closeMenu = (returnFocus = false) => {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation menu");
    menu.classList.remove("open");
    if (returnFocus) toggle.focus();
  };

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const willOpen = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(willOpen));
      toggle.setAttribute("aria-label", willOpen ? "Close navigation menu" : "Open navigation menu");
      menu.classList.toggle("open", willOpen);
    });
    menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => closeMenu()));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menu.classList.contains("open")) closeMenu(true);
    });
    document.addEventListener("click", (event) => {
      if (menu.classList.contains("open") && !header.contains(event.target)) closeMenu();
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 860) closeMenu();
    });
  }

  const updateScrollState = () => {
    const scrolled = window.scrollY > 20;
    header?.classList.toggle("scrolled", scrolled);
    backToTop?.classList.toggle("visible", window.scrollY > 700);
  };
  updateScrollState();
  window.addEventListener("scroll", updateScrollState, { passive: true });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) => {
        const active = link.getAttribute("href") === `#${visible.target.id}`;
        link.classList.toggle("active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }, { rootMargin: "-22% 0px -62% 0px", threshold: [0, 0.1, 0.5] });
    sections.forEach((section) => observer.observe(section));
  }
};
