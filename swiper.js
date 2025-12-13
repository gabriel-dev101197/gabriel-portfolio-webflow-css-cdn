(function () {
  const SWIPER_URL = "https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.js";

  function loadSwiper() {
    return new Promise((resolve) => {
      if (window.Swiper) return resolve();

      const s = document.createElement("script");
      s.src = SWIPER_URL;
      s.onload = resolve;
      document.head.appendChild(s);
    });
  }

  function collectImages(gallery) {
    const container = gallery.querySelector(".js-gallery-images");
    if (!container) return [];

    return Array.from(container.querySelectorAll("img"))
      .map((img) => img.currentSrc || img.src)
      .filter(Boolean);
  }

  function buildHTML(images) {
    const slides = images
      .map(
        (src) =>
          `<div class="swiper-slide">
             <img src="${src}" loading="lazy">
           </div>`
      )
      .join("");

    return `
      <div class="swiper gallery-top">
        <div class="swiper-wrapper">${slides}</div>
        <div class="swiper-button-next"></div>
        <div class="swiper-button-prev"></div>
      </div>

      <div class="swiper gallery-thumbs">
        <div class="swiper-wrapper">${slides}</div>
      </div>
    `;
  }

  function initGallery(gallery) {
    const images = collectImages(gallery);
    if (!images.length) return;

    gallery.insertAdjacentHTML("beforeend", buildHTML(images));

    const thumbs = new Swiper(
      gallery.querySelector(".gallery-thumbs"),
      {
        spaceBetween: 10,
        slidesPerView: "auto",
        freeMode: true,
        watchSlidesProgress: true,
        watchSlidesVisibility: true
      }
    );

    new Swiper(
      gallery.querySelector(".gallery-top"),
      {
        spaceBetween: 10,
        navigation: {
          nextEl: gallery.querySelector(".swiper-button-next"),
          prevEl: gallery.querySelector(".swiper-button-prev")
        },
        thumbs: { swiper: thumbs }
      }
    );
  }

  function initAll() {
    document
      .querySelectorAll(".js-thumbs-gallery")
      .forEach(initGallery);
  }

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(() => loadSwiper().then(initAll));
})();

