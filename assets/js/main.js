const toggleBtn = document.getElementById("menu-toggle");
const navList = document.querySelector(".nav ul");

toggleBtn.addEventListener("click", () => {
  navList.classList.toggle("open");
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    navList?.classList.remove("open");
    toggleBtn?.classList.remove("open");
  }
});

// Init AOS Animations
AOS.init({
  duration: 1000,
  once: true
});

// Back to Top Button
let btn = document.getElementById("scrollToTopBtn");
window.onscroll = function () { scrollFunction(); };

function scrollFunction() {
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
    btn.style.display = "flex";
  } else {
    btn.style.display = "none";
  }
}

btn.addEventListener('click', function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

let refreshExpertisePopupContent = () => { };

(() => {
  const expertiseItems = Array.from(document.querySelectorAll('#practice-focus .expertise-item'));
  const popup = document.getElementById('expertise-popup');
  const popupName = document.getElementById('expertise-popup-name');
  const popupDesc = document.getElementById('expertise-popup-desc');
  const popupClose = popup?.querySelector('.expertise-close');
  let activeExpertiseItem = null;

  if (!expertiseItems.length || !popup || !popupName || !popupDesc || !popupClose) {
    return;
  }

  const resolveExpertiseCopy = (item, keyAttr, fallbackAttr) => {
    const i18nKey = item.getAttribute(keyAttr);
    if (i18nKey && typeof i18next !== 'undefined' && i18next.isInitialized) {
      const translated = i18next.t(i18nKey);
      if (translated && translated !== i18nKey) {
        return translated;
      }
    }

    return item.getAttribute(fallbackAttr) || '';
  };

  const renderPopup = (item) => {
    popupName.textContent = resolveExpertiseCopy(item, 'data-i18n-title', 'data-name');
    popupDesc.textContent = resolveExpertiseCopy(item, 'data-i18n-desc', 'data-desc');
  };

  const closePopup = () => {
    popup.style.display = 'none';
    document.body.style.overflow = '';
    if (activeExpertiseItem) {
      activeExpertiseItem.classList.remove('active');
      activeExpertiseItem = null;
    }
  };

  const openPopup = (item) => {
    if (activeExpertiseItem) {
      activeExpertiseItem.classList.remove('active');
    }

    activeExpertiseItem = item;
    activeExpertiseItem.classList.add('active');
    renderPopup(item);
    popup.style.display = 'block';
    document.body.style.overflow = 'hidden';
  };

  expertiseItems.forEach((item) => {
    item.addEventListener('click', () => openPopup(item));
  });

  popupClose.addEventListener('click', closePopup);

  popup.addEventListener('click', (event) => {
    if (event.target === popup) {
      closePopup();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && popup.style.display === 'block') {
      closePopup();
    }
  });

  refreshExpertisePopupContent = () => {
    if (activeExpertiseItem) {
      renderPopup(activeExpertiseItem);
    }
  };
})();

// Contact Form
document.getElementById("contact-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  let formData = new FormData(this);

  try {
    let response = await fetch("https://script.google.com/macros/s/AKfycby_aBIZ13Kpdpm1v-jwdHl5f8a68Jq7HfPV3YtTJKP6zalu4OBrBJZWU0N0AAtlNU6FxQ/exec", {
      method: "POST",
      body: formData
    });

    let result = await response.json();
    console.log(result);

    document.getElementById("response-msg").textContent = "Thank you. Your consultation request has been submitted.";
  } catch (error) {
    console.error(error);
    document.getElementById("response-msg").textContent = "Sorry, your consultation request could not be sent. Please contact the firm directly.";
  }
});

// Navbar Scroll + Active Links
const navbar = document.querySelector("section.navbar");
const navLinks = document.querySelectorAll(".nav-links li a");
const sections = document.querySelectorAll("section[id]");
const banner = document.querySelector(".bnr");

const setLayoutOffsets = () => {
  if (!navbar) return;
  const navHeight = navbar.offsetHeight;
  document.documentElement.style.setProperty('--navbar-height', `${navHeight}px`);
  const bannerHeight = banner ? banner.offsetHeight : 0;
  document.documentElement.style.setProperty('--banner-height', `${bannerHeight}px`);
  const navPosition = window.getComputedStyle(navbar).position;
  const mainOffset = navPosition === 'fixed' ? navHeight : 0;
  document.documentElement.style.setProperty('--main-offset', `${mainOffset}px`);
};

const updateNavbarScrollState = () => {
  if (!navbar) return;
  if (window.scrollY > 20) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
};

const syncActiveNavLinks = () => {
  if (!sections.length) return;
  let currentId = "";
  sections.forEach(sec => {
    const rect = sec.getBoundingClientRect();
    const offsetTop = rect.top + window.scrollY;
    if (window.scrollY >= offsetTop - 120) {
      currentId = sec.id;
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    const href = link.getAttribute("href");
    if (href && href === `#${currentId}`) {
      link.classList.add("active");
    }
  });
};

const handleScroll = () => {
  updateNavbarScrollState();
  syncActiveNavLinks();
};

setLayoutOffsets();
updateNavbarScrollState();
syncActiveNavLinks();

window.addEventListener("scroll", handleScroll);
window.addEventListener("resize", setLayoutOffsets);
window.addEventListener("load", setLayoutOffsets);
const isRTL = () => document.body.classList.contains('rtl');
let gallerySwiperInstance = null;

function initGallerySwiper() {
  if (typeof Swiper === 'undefined') return;
  const sliderEl = document.querySelector('.gallery-swiper');
  if (!sliderEl) return;

  if (gallerySwiperInstance && typeof gallerySwiperInstance.destroy === 'function') {
    gallerySwiperInstance.destroy(true, true);
  }

  const dir = isRTL() ? 'rtl' : 'ltr';
  sliderEl.setAttribute('dir', dir);

  gallerySwiperInstance = new Swiper('.gallery-swiper', {
    slidesPerView: 1,
    loop: true,
    speed: 900,
    effect: 'fade',
    fadeEffect: {
      crossFade: true,
    },
    autoplay: {
      delay: 3500,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: '.gallery-section .swiper-button-next',
      prevEl: '.gallery-section .swiper-button-prev',
    }
  });
}

function refreshLocaleAwareSliders() {
  initGallerySwiper();
}

// Initialize swipers when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  refreshLocaleAwareSliders();

  // Accreditation slider init
  if (document.querySelector('.accreditation-swiper')) {
    new Swiper('.accreditation-swiper', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 }
      }
    });
  }

  // Credentials slider init
  if (document.querySelector('.credentials-swiper')) {
    new Swiper('.credentials-swiper', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: false,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      }
    });
  }

});
// Google Translate removed: function googleTranslateElementInit() deleted to avoid duplicate translation widgets.

// Language direction is handled by applyI18n (document.documentElement.dir and body.rtl class).
// Removed the periodic check that existed to detect external changes (e.g., Google Translate).

function updateNavbarLayout(lng) {
  document.body.classList.toggle('rtl', lng === 'ar');
}

async function loadLocale(lng) {
  // تأكد أن الملفات موجودة في هذا المسار:
  // public/locales/en.json و public/locales/ar.json
  const res = await fetch('public/locales/' + lng + '.json', { cache: 'no-cache' });
  if (!res.ok) {
    console.error('Failed to load locale', lng, res.status);
    return null;
  }
  return res.json();
}

// =======================
// Navbar RTL / LTR helper
// =======================
function updateNavbarDirection(lng) {
  const html = document.documentElement;
  const isArabic = lng === 'ar';
  html.setAttribute('dir', isArabic ? 'rtl' : 'ltr');
  document.body.classList.toggle('rtl', isArabic);
}


async function applyI18n(lng) {
  const resources = await loadLocale(lng);
  if (!resources) return;

  // init i18next
  await i18next.init({
    lng,
    resources: {
      [lng]: { translation: resources }
    }
  });

  // النصوص العادية
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = i18next.t(key);
    if (val && val !== key) el.textContent = val;
  });

  // placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const val = i18next.t(key);
    if (val && val !== key) el.setAttribute('placeholder', val);
  });

  // value attributes
  document.querySelectorAll('[data-i18n-value]').forEach(el => {
    const key = el.getAttribute('data-i18n-value');
    const val = i18next.t(key);
    if (val && val !== key) el.setAttribute('value', val);
  });

  // لغة واتجاه الصفحة
  const isArabic = lng === 'ar';
  document.documentElement.lang = lng;
  document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('lang', lng);
  document.documentElement.setAttribute('dir', document.documentElement.dir);
  document.body.classList.toggle('rtl', isArabic);

  const langSwitch = document.getElementById('lang-switch');
  if (langSwitch && langSwitch.value !== lng) {
    langSwitch.value = lng;
  }

  updateNavbarLayout(lng);

  // Rebuild sliders so Swiper direction matches the active locale
  refreshLocaleAwareSliders();

  updateNavbarDirection(lng); 

  // خزن اللغة في localStorage
  localStorage.setItem('lang', lng);

  // Update layout spacing if text sizing changed the navbar height
  setLayoutOffsets();

  refreshExpertisePopupContent();
}

document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('lang-switch');

  // اللغة المبدئية
  const initial = localStorage.getItem('lang') || 'en';
  applyI18n(initial).catch(console.error);


  if (select) {
    select.value = initial;
    select.addEventListener('change', (e) => {
      const lng = e.target.value;
      applyI18n(lng).catch(console.error);
    });
  }
});
