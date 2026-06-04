// ===== PART 1 START: SHARED SITE INTERACTIONS =====

document.addEventListener("DOMContentLoaded", () => {
  initializeMobileHomepageMenu();
  initializeHomepagePaneTransition();
  initializeSharedComponents();
});

function initializeMobileHomepageMenu() {
  const button = document.querySelector(".mobile-menu-button");
  const menu = document.querySelector(".mobile-home-menu");

  if (!button || !menu) return;

  button.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
    button.textContent = isOpen ? "Close Menu" : "Explore the Glasshouse";
  });
}

function initializeHomepagePaneTransition() {
  const stage = document.querySelector(".home-stage");
  const aboutPane = document.querySelector(".pane-link--about");

  if (!stage || !aboutPane) return;

  aboutPane.addEventListener("click", (event) => {
    const destination = aboutPane.getAttribute("href");

    if (!destination || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    event.preventDefault();

    stage.style.setProperty("--zoom-x", "35.4%");
    stage.style.setProperty("--zoom-y", "59.2%");

    const reveal = document.createElement("div");
    reveal.className = "home-pane-reveal home-pane-reveal--about";
    reveal.innerHTML = `
      <img
        class="home-pane-reveal__image"
        src="/petalsandpanes/gallery/about-hero.png"
        alt=""
        aria-hidden="true"
      />
      <div class="home-pane-reveal__veil"></div>
    `;

    stage.appendChild(reveal);
    stage.classList.add("is-zooming-through-pane", "is-zooming-to-about");
    document.body.classList.add("is-home-transitioning");

    requestAnimationFrame(() => {
      reveal.classList.add("is-visible");
    });

    window.setTimeout(() => {
      window.location.href = destination;
    }, 1220);
  });
}

async function initializeSharedComponents() {
  const navTarget = document.querySelector("[data-shared-nav]");
  const footerTarget = document.querySelector("[data-shared-footer]");

  if (navTarget) {
    await injectSharedComponent(navTarget, "/petalsandpanes/components/nav.html");
    initializeInteriorNavigation();
    setActiveNavigationItem();
  }

  if (footerTarget) {
    await injectSharedComponent(footerTarget, "/petalsandpanes/components/footer.html");
  }
}

async function injectSharedComponent(target, path) {
  try {
    const response = await fetch(path);

    if (!response.ok) {
      throw new Error(`Unable to load ${path}`);
    }

    target.innerHTML = await response.text();
  } catch (error) {
    console.error(error);
  }
}

function initializeInteriorNavigation() {
  const toggle = document.querySelector(".site-nav-toggle");
  const nav = document.querySelector(".site-nav");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

function setActiveNavigationItem() {
  const currentPath = window.location.pathname;
  const links = document.querySelectorAll(".site-nav a");

  links.forEach((link) => {
    const linkPath = new URL(link.href).pathname;

    if (
      currentPath === linkPath ||
      (linkPath !== "/petalsandpanes/" && currentPath.startsWith(linkPath))
    ) {
      link.setAttribute("aria-current", "page");
    }
  });
}

function sendInquiry(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const data = new FormData(form);

  const name = data.get("name") || "";
  const email = data.get("email") || "";
  const sessionType = data.get("sessionType") || "";
  const preferredDate = data.get("preferredDate") || "";
  const message = data.get("message") || "";

  const subject = encodeURIComponent("Petals & Panes Session Inquiry");

  const body = encodeURIComponent(
    `Hello Petals & Panes,\n\n` +
    `I would like to ask about booking the glasshouse.\n\n` +
    `Name: ${name}\n` +
    `Email: ${email}\n` +
    `Session type: ${sessionType}\n` +
    `Preferred date: ${preferredDate}\n\n` +
    `Message:\n${message}\n`
  );

  window.location.href = `mailto:hello@petalsandpanes.com?subject=${subject}&body=${body}`;
}

// ===== PART 1 END =====