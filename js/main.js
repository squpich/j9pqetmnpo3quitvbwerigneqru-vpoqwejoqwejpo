document.documentElement.classList.add("js");

const qs = (selector, scope = document) => scope.querySelector(selector);
const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function setupHeader() {
  const header = qs("[data-header]");
  if (!header) return;

  const update = () => header.classList.toggle("is-scrolled", window.scrollY > 20);
  update();
  window.addEventListener("scroll", update, { passive: true });
}

function setupMobileMenu() {
  const button = qs("[data-menu-button]");
  const menu = qs("[data-mobile-menu]");
  if (!button || !menu) return;

  const close = () => {
    button.setAttribute("aria-expanded", "false");
    menu.hidden = true;
    document.body.classList.remove("menu-open");
  };

  const open = () => {
    button.setAttribute("aria-expanded", "true");
    menu.hidden = false;
    document.body.classList.add("menu-open");
    qs("a", menu)?.focus();
  };

  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    expanded ? close() : open();
  });

  qsa("a", menu).forEach(link => link.addEventListener("click", close));

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !menu.hidden) {
      close();
      button.focus();
    }
  });

  const desktop = window.matchMedia("(min-width: 1081px)");
  desktop.addEventListener("change", event => {
    if (event.matches) close();
  });
}

function setupRevealAnimations() {
  const elements = qsa(".reveal");
  if (!elements.length) return;

  if (
    !("IntersectionObserver" in window) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    elements.forEach(element => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      currentObserver.unobserve(entry.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -40px"
  });

  elements.forEach(element => observer.observe(element));
}

function setupActiveNavigation() {
  const links = qsa("[data-nav-link]");
  const sections = links
    .map(link => qs(link.getAttribute("href")))
    .filter(Boolean);

  if (!links.length || !sections.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(entries => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    links.forEach(link => {
      const active = link.getAttribute("href") === `#${visible.target.id}`;
      link.classList.toggle("nav-link-active", active);
      active
        ? link.setAttribute("aria-current", "location")
        : link.removeAttribute("aria-current");
    });
  }, {
    rootMargin: "-25% 0px -60% 0px",
    threshold: [0.1, 0.35, 0.6]
  });

  sections.forEach(section => observer.observe(section));
}

function setupAccordion() {
  const items = qsa(".faq-item");
  items.forEach(item => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      items.forEach(other => {
        if (other !== item) other.open = false;
      });
    });
  });
}

function setupSmoothAnchors() {
  qsa('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = qs(id);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start"
      });

      history.replaceState(null, "", id);
    });
  });
}

function setupContactLinks() {
  const config = window.GEA_CONFIG?.contact;
  if (!config) return;

  qsa('[href^="tel:"]').forEach(link => {
    link.href = `tel:${config.phoneHref}`;
    if (link.textContent.includes("+351")) link.textContent = config.phoneDisplay;
  });

  qsa('[href^="mailto:"]').forEach(link => {
    link.href = `mailto:${config.email}`;
    link.textContent = config.email;
  });

  qsa('[href*="wa.me"]').forEach(link => {
    link.href = config.whatsappHref;
  });
}

function setupAnalyticsHooks() {
  document.addEventListener("click", event => {
    const target = event.target.closest("a, button");
    if (!target) return;

    let eventName = null;
    if (target.matches('a[href^="tel:"]')) eventName = "phone_click";
    else if (target.matches('a[href*="wa.me"]')) eventName = "whatsapp_click";
    else if (target.matches('a[href="#request"], button[type="submit"]')) eventName = "audit_cta_click";

    if (!eventName) return;

    window.dispatchEvent(new CustomEvent("gea:analytics", {
      detail: {
        event: eventName,
        label: target.textContent.trim()
      }
    }));
  });
}

window.addEventListener("DOMContentLoaded", () => {
  setupHeader();
  setupMobileMenu();
  setupRevealAnimations();
  setupActiveNavigation();
  setupAccordion();
  setupSmoothAnchors();
  setupContactLinks();
  setupAnalyticsHooks();
});
