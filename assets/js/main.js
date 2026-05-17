document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("menu-toggle");
  const navList = document.querySelector(".nav-links");
  const navbar = document.querySelector("section.navbar");
  const header = document.querySelector(".headnav");
  const navLinks = Array.from(document.querySelectorAll(".nav-links li a"));
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const topBtn = document.getElementById("scrollToTopBtn");
  const contactForm = document.getElementById("contact-form");
  const langSwitch = document.getElementById("lang-switch");
  const supportedLanguages = new Set(["en", "pt", "es"]);
  const rtlLanguages = new Set(["ar", "he", "fa", "ur"]);
  const mobileNavQuery = window.matchMedia("(max-width: 1100px)");
  let scrollLockY = 0;
  let isScrollLocked = false;

  if (navList && !navList.id) {
    navList.id = "primary-menu";
  }

  if (toggleBtn && navList) {
    toggleBtn.setAttribute("aria-controls", navList.id);
    toggleBtn.setAttribute("aria-expanded", "false");
  }

  let menuOverlay = document.querySelector(".mobile-menu-overlay");
  if (header && !menuOverlay) {
    menuOverlay = document.createElement("div");
    menuOverlay.className = "mobile-menu-overlay";
    menuOverlay.setAttribute("aria-hidden", "true");
    header.appendChild(menuOverlay);
  }

  const normalizeLanguage = (lng) => (supportedLanguages.has(lng) ? lng : "en");

  const translate = (key, fallback) => {
    if (typeof i18next === "undefined" || !i18next.isInitialized) return fallback;
    const value = i18next.t(key);
    return value && value !== key ? value : fallback;
  };

  const preventBackgroundTouchScroll = (event) => {
    if (!navList?.contains(event.target)) {
      event.preventDefault();
    }
  };

  const lockPageScroll = () => {
    if (isScrollLocked) return;
    scrollLockY = window.scrollY;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.addEventListener("touchmove", preventBackgroundTouchScroll, { passive: false });
    isScrollLocked = true;
  };

  const unlockPageScroll = () => {
    if (!isScrollLocked) return;
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    document.removeEventListener("touchmove", preventBackgroundTouchScroll);
    isScrollLocked = false;
    window.scrollTo(0, scrollLockY);
  };

  const setMobileMenuState = (isOpen) => {
    if (!navList || !toggleBtn) return;

    const shouldOpen = Boolean(isOpen) && mobileNavQuery.matches;
    navList.classList.toggle("open", shouldOpen);
    toggleBtn.classList.toggle("open", shouldOpen);
    header?.classList.toggle("menu-open", shouldOpen);
    document.documentElement.classList.toggle("nav-open", shouldOpen);
    document.body.classList.toggle("nav-open", shouldOpen);
    toggleBtn.setAttribute("aria-expanded", String(shouldOpen));

    if (shouldOpen) {
      lockPageScroll();
    } else {
      unlockPageScroll();
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuState(false);
  };

  toggleBtn?.addEventListener("click", () => {
    setMobileMenuState(!navList?.classList.contains("open"));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (mobileNavQuery.matches) {
        closeMobileMenu();
      }
    });
  });

  menuOverlay?.addEventListener("click", closeMobileMenu);

  document.addEventListener("click", (event) => {
    if (!navList?.classList.contains("open")) return;
    if (header?.contains(event.target)) return;
    closeMobileMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileMenu();
    }
  });

  const setLayoutOffsets = () => {
    if (!navbar) return;
    const navHeight = navbar.offsetHeight;
    document.documentElement.style.setProperty("--navbar-offset", `${navHeight}px`);
  };

  const updateNavbarScrollState = () => {
    navbar?.classList.toggle("scrolled", window.scrollY > 20);
  };

  const syncActiveNavLinks = () => {
    if (!sections.length) return;

    let currentId = "";
    sections.forEach((section) => {
      const offsetTop = section.getBoundingClientRect().top + window.scrollY;
      if (window.scrollY >= offsetTop - 130) {
        currentId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute("href") || "";
      link.classList.toggle("active", href === `#${currentId}`);
    });
  };

  const updateBackToTop = () => {
    if (!topBtn) return;
    topBtn.style.display = window.scrollY > 100 ? "flex" : "none";
  };

  const handleScroll = () => {
    updateNavbarScrollState();
    syncActiveNavLinks();
    updateBackToTop();
  };

  topBtn?.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1100) {
      closeMobileMenu();
    }
    setLayoutOffsets();
  });

  window.addEventListener("scroll", handleScroll);
  window.addEventListener("load", setLayoutOffsets);

  if (window.AOS) {
    window.AOS.init({ once: true, duration: 600 });
  }

  let gallerySwiperInstance = null;

  const isRTL = () => document.body.classList.contains("rtl");

  const initGallerySwiper = () => {
    // Gallery initialization is now handled by gallery.js
    // This function is kept for compatibility with language switching
  };

  const loadLocale = async (lng) => {
    const paths = [`public/locales/${lng}.json`, `locales/${lng}.json`];

    for (const path of paths) {
      const response = await fetch(path, { cache: "no-cache" });
      if (response.ok) {
        return response.json();
      }
    }

    throw new Error(`Failed to load locale ${lng}`);
  };

  const applyI18n = async (lng) => {
    if (typeof i18next === "undefined") return;

    const activeLang = normalizeLanguage(lng);
    const resources = await loadLocale(activeLang);
    await i18next.init({
      lng: activeLang,
      resources: {
        [activeLang]: { translation: resources },
      },
    });

    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.getAttribute("data-i18n");
      const value = i18next.t(key);
      if (value && value !== key) {
        element.textContent = value;
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
      const key = element.getAttribute("data-i18n-placeholder");
      const value = i18next.t(key);
      if (value && value !== key) {
        element.setAttribute("placeholder", value);
      }
    });

    const isRTLActive = rtlLanguages.has(activeLang);
    document.documentElement.lang = activeLang;
    document.documentElement.dir = isRTLActive ? "rtl" : "ltr";
    document.body.classList.toggle("rtl", isRTLActive);

    if (langSwitch && langSwitch.value !== activeLang) {
      langSwitch.value = activeLang;
    }

    localStorage.setItem("lang", activeLang);
    setLayoutOffsets();
    initGallerySwiper();
    syncActiveNavLinks();
  };

  if (langSwitch) {
    const initialLang = normalizeLanguage(localStorage.getItem("lang") || "en");
    langSwitch.value = initialLang;
    applyI18n(initialLang).catch(console.error);

    langSwitch.addEventListener("change", (event) => {
      applyI18n(event.target.value).catch(console.error);
    });
  }

  contactForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const responseMessage = document.getElementById("response-msg");
    const formData = new FormData(contactForm);

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycby_aBIZ13Kpdpm1v-jwdHl5f8a68Jq7HfPV3YtTJKP6zalu4OBrBJZWU0N0AAtlNU6FxQ/exec", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Form submission failed: ${response.status}`);
      }

      responseMessage.textContent = translate("contact.form.success", "Thank you. Your consultation request has been submitted.");
      contactForm.reset();
    } catch (error) {
      console.error(error);
      responseMessage.textContent = translate("contact.form.error", "Sorry, your consultation request could not be sent. Please contact the firm directly.");
    }
  });

  setLayoutOffsets();
  handleScroll();
  initGallerySwiper();
});
