
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

  function parseImages(el) {
    try {
      const data = el.dataset.images;
      const images = JSON.parse(data);
      return Array.isArray(images) ? images : [];
    } catch {
      return [];
    }
  }

  function buildHTML(images) {
    const slides = images
      .map(
        (src) =>
          `<div class="swiper-slide"><img src="${src}" loading="lazy"></div>`
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

  function initGallery(el) {
    const images = parseImages(el);
    if (!images.length) return;

    el.innerHTML = buildHTML(images);

    const thumbs = new Swiper(el.querySelector(".gallery-thumbs"), {
      spaceBetween: 10,
      slidesPerView: "auto",
      watchSlidesProgress: true
    });

    new Swiper(el.querySelector(".gallery-top"), {
      spaceBetween: 10,
      navigation: {
        nextEl: el.querySelector(".swiper-button-next"),
        prevEl: el.querySelector(".swiper-button-prev")
      },
      thumbs: { swiper: thumbs }
    });
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
