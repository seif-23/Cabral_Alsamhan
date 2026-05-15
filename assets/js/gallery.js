const GalleryManager = {
  swiperInstance: null,

  init() {
    this.loadDynamicGallery();
    this.waitForSwiper(() => this.initSwiper());
  },

  loadDynamicGallery() {
    const wrapper = document.querySelector(".swiper-wrapper");
    if (!wrapper || typeof GALLERY_IMAGES === "undefined" || !GALLERY_IMAGES.length) return;

    wrapper.innerHTML = "";
    GALLERY_IMAGES.forEach((imageName, index) => {
      const imagePath = `public/imgs/gallery/${encodeURIComponent(imageName)}`;
      const slide = document.createElement("div");
      slide.className = "swiper-slide";
      slide.innerHTML = `
        <div class="gallery-slide">
          <img
            src="${imagePath}"
            alt="Cabral Alsamhan PLLC office gallery image ${index + 1}"
            loading="lazy"
          >
        </div>
      `;
      wrapper.appendChild(slide);
    });

    this.addNavigationDots();
  },

  addNavigationDots() {
    const container = document.querySelector(".gallery-slider-container");
    if (!container) return;

    let dotsContainer = container.querySelector(".gallery-dots");
    if (!dotsContainer) {
      dotsContainer = document.createElement("div");
      dotsContainer.className = "gallery-dots";
      container.appendChild(dotsContainer);
    }

    dotsContainer.innerHTML = "";
    GALLERY_IMAGES.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.className = `gallery-dot ${index === 0 ? "active" : ""}`;
      dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
      dot.setAttribute("data-slide", index);
      dot.addEventListener("click", () => {
        if (this.swiperInstance) {
          this.swiperInstance.slideTo(index);
        }
      });
      dotsContainer.appendChild(dot);
    });
  },

  initSwiper() {
    if (typeof Swiper === "undefined") return;

    const sliderEl = document.querySelector(".gallery-swiper");
    if (!sliderEl) return;

    if (this.swiperInstance && typeof this.swiperInstance.destroy === "function") {
      this.swiperInstance.destroy(true, true);
    }

    const isRTL = document.body.classList.contains("rtl");
    sliderEl.setAttribute("dir", isRTL ? "rtl" : "ltr");

    this.swiperInstance = new Swiper(".gallery-swiper", {
      slidesPerView: 1,
      loop: true,
      speed: 800,
      effect: "fade",
      fadeEffect: {
        crossFade: true,
      },
      autoplay: {
        delay: 3500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
        stopOnLastSlide: false,
      },
      navigation: {
        nextEl: ".gallery-section .swiper-button-next",
        prevEl: ".gallery-section .swiper-button-prev",
      },
      on: {
        slideChange: () => this.updateDots(),
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
    });

    this.addSwipeGestures();
  },

  addSwipeGestures() {
    const container = document.querySelector(".gallery-swiper");
    if (!container) return;

    let touchStartX = 0;
    let touchEndX = 0;

    container.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      false
    );

    container.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe(touchStartX, touchEndX);
      },
      false
    );
  },

  handleSwipe(startX, endX) {
    const threshold = 50;
    const diff = startX - endX;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        this.swiperInstance?.slideNext();
      } else {
        this.swiperInstance?.slidePrev();
      }
    }
  },

  updateDots() {
    if (!this.swiperInstance) return;

    const dots = document.querySelectorAll(".gallery-dot");
    const activeIndex = this.swiperInstance.realIndex;

    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === activeIndex);
    });
  },

  waitForSwiper(callback, timeout = 5000) {
    const startTime = Date.now();
    const checkSwiper = () => {
      if (typeof Swiper !== "undefined") {
        callback();
      } else if (Date.now() - startTime < timeout) {
        requestAnimationFrame(checkSwiper);
      }
    };
    checkSwiper();
  },
};

document.addEventListener("DOMContentLoaded", () => {
  GalleryManager.init();
});
