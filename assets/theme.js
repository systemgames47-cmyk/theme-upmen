/* ============================================================
   Up Men — Shopify Theme JS
   Vanilla JS. Sem dependências.
   ============================================================ */

(function () {
  'use strict';

  // -------- Reveal on scroll --------
  function initReveal(root) {
    var scope = root || document;
    var elements = scope.querySelectorAll('.reveal:not(.is-visible)');
    if (!elements.length) return;
    var inDesignMode = window.Shopify && window.Shopify.designMode;
    if (inDesignMode || !('IntersectionObserver' in window)) {
      elements.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    elements.forEach(function (el) { io.observe(el); });
  }

  // -------- Countdown timers --------
  // <span data-countdown-to="2026-05-12T23:59:59" data-countdown-format="hms"></span>
  // <div data-countdown-block data-target="2026-05-31T23:59:59">
  //   <span data-unit="days"></span> dias
  //   <span data-unit="hours"></span>h <span data-unit="minutes"></span>m <span data-unit="seconds"></span>s
  // </div>
  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  var countdownTimerStarted = false;
  function initCountdowns() {
    if (countdownTimerStarted) return;
    if (!document.querySelector('[data-countdown-to]') && !document.querySelector('[data-countdown-block]')) return;
    countdownTimerStarted = true;

    function tick() {
      var now = Date.now();
      var inlines = document.querySelectorAll('[data-countdown-to]');
      var blocks = document.querySelectorAll('[data-countdown-block]');

      inlines.forEach(function (el) {
        var target = new Date(el.getAttribute('data-countdown-to')).getTime();
        var diff = Math.max(0, target - now);
        var totalSeconds = Math.floor(diff / 1000);
        var days = Math.floor(totalSeconds / 86400);
        var hours = Math.floor((totalSeconds % 86400) / 3600);
        var minutes = Math.floor((totalSeconds % 3600) / 60);
        var seconds = totalSeconds % 60;
        var format = el.getAttribute('data-countdown-format') || 'dhms';
        var parts = [];
        if (format.indexOf('d') > -1 && days > 0) parts.push(days + 'd');
        if (format.indexOf('h') > -1) parts.push(pad(hours) + 'h');
        if (format.indexOf('m') > -1) parts.push(pad(minutes) + 'm');
        if (format.indexOf('s') > -1) parts.push(pad(seconds) + 's');
        el.textContent = parts.join(' ');
      });

      blocks.forEach(function (block) {
        var target = new Date(block.getAttribute('data-target')).getTime();
        var diff = Math.max(0, target - now);
        var totalSeconds = Math.floor(diff / 1000);
        var values = {
          days:    Math.floor(totalSeconds / 86400),
          hours:   Math.floor((totalSeconds % 86400) / 3600),
          minutes: Math.floor((totalSeconds % 3600) / 60),
          seconds: totalSeconds % 60
        };
        ['days','hours','minutes','seconds'].forEach(function (unit) {
          var el = block.querySelector('[data-unit="'+unit+'"]');
          if (el) el.textContent = pad(values[unit]);
        });
      });
    }

    tick();
    setInterval(tick, 1000);
  }

  // -------- Mobile menu toggle --------
  function initMobileMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var nav = document.querySelector('[data-site-nav]');
    if (!toggle || !nav || toggle.dataset.mmInit) return;
    toggle.dataset.mmInit = '1';
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  // -------- Smooth scroll for in-page anchors --------
  var smoothScrollBound = false;
  function initSmoothScroll() {
    if (smoothScrollBound) return;
    smoothScrollBound = true;
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var href = a.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // -------- Pricing card image gallery --------
  function initGalleries() {
    document.querySelectorAll('[data-gallery]').forEach(function (gallery) {
      if (gallery.dataset.mmInit) return;
      gallery.dataset.mmInit = '1';
      var images = gallery.querySelectorAll('.main img');
      var thumbs = gallery.querySelectorAll('.thumbs button');
      if (!images.length || !thumbs.length) return;

      thumbs.forEach(function (btn, i) {
        btn.addEventListener('click', function () {
          images.forEach(function (img) { img.classList.remove('is-active'); });
          thumbs.forEach(function (t) { t.classList.remove('is-active'); });
          if (images[i]) images[i].classList.add('is-active');
          btn.classList.add('is-active');
        });
      });
    });
  }

  // -------- Pricing card quantity stepper --------
  function initSteppers() {
    document.querySelectorAll('[data-stepper]').forEach(function (stepper) {
      if (stepper.dataset.mmInit) return;
      stepper.dataset.mmInit = '1';
      var input = stepper.querySelector('input[type="number"]');
      var display = stepper.querySelector('.num');
      var dec = stepper.querySelector('[data-step-dec]');
      var inc = stepper.querySelector('[data-step-inc]');
      if (!input) return;

      function setValue(v) {
        v = Math.max(1, parseInt(v, 10) || 1);
        input.value = v;
        if (display) display.textContent = v;
        // recompute price total if there's a price-display in the same card
        var card = stepper.closest('[data-pkg-card]');
        if (card) {
          var unitPrice = parseFloat(card.getAttribute('data-unit-price'));
          var priceEl = card.querySelector('[data-price-now]');
          if (priceEl && !isNaN(unitPrice)) {
            var currency = card.getAttribute('data-currency') || '$';
            priceEl.textContent = currency + (unitPrice * v).toFixed(2);
          }
        }
      }

      if (dec) dec.addEventListener('click', function () { setValue(parseInt(input.value || '1', 10) - 1); });
      if (inc) inc.addEventListener('click', function () { setValue(parseInt(input.value || '1', 10) + 1); });
      setValue(input.value || 1);
    });
  }

  // -------- FAQ accordion (already native via <details>) --------
  // Optional: close others when one opens (single-collapsible behavior)
  function initFaq() {
    var items = document.querySelectorAll('[data-faq] details');
    items.forEach(function (item) {
      if (item.dataset.mmInit) return;
      item.dataset.mmInit = '1';
      item.addEventListener('toggle', function () {
        if (item.open) {
          items.forEach(function (other) {
            if (other !== item) other.open = false;
          });
        }
      });
    });
  }

  // -------- Hero mini testimonials carousel --------
  function initHeroCarousel() {
    document.querySelectorAll('[data-hero-carousel]').forEach(function (carousel) {
      if (carousel.dataset.mmInit) return;
      carousel.dataset.mmInit = '1';
      var slides = carousel.querySelectorAll('.hero-mini-slide');
      var dots = carousel.querySelectorAll('[data-hero-dot]');
      if (slides.length < 2) return;
      var current = 0;
      var timer = null;
      var paused = false;

      function go(idx) {
        current = (idx + slides.length) % slides.length;
        slides.forEach(function (s, i) { s.classList.toggle('is-active', i === current); });
        dots.forEach(function (d, i) { d.classList.toggle('is-active', i === current); });
      }

      function tick() { if (!paused) go(current + 1); }

      function start() {
        if (timer) clearInterval(timer);
        timer = setInterval(tick, 4500);
      }

      dots.forEach(function (d, i) {
        d.addEventListener('click', function () { go(i); start(); });
      });

      carousel.addEventListener('mouseenter', function () { paused = true; });
      carousel.addEventListener('mouseleave', function () { paused = false; });

      go(0);
      start();
    });
  }

  // -------- Autoplay videos: muted until the visitor taps them --------
  function initAutoplayVideos() {
    document.querySelectorAll('[data-mm-video]').forEach(function (wrap) {
      if (wrap.dataset.mmInit) return;
      wrap.dataset.mmInit = '1';
      var video = wrap.querySelector('video');
      if (!video) return;
      if (wrap.hasAttribute('data-autoplay')) {
        video.muted = true;
        video.setAttribute('muted', '');
        wrap.addEventListener('click', function () {
          if (video.muted) {
            video.muted = false;
            video.controls = true;
            wrap.classList.add('mm-sound-on');
            var p = video.play();
            if (p && typeof p.catch === 'function') {
              p.catch(function () { /* playback blocked: keep controls visible so the visitor can press play */ });
            }
          }
        });
      }
    });
  }

  // -------- Product variant picker (page de produto) --------
  function initProductVariantPicker() {
    document.querySelectorAll('.js-product-form').forEach(function (form) {
      if (form.dataset.mmInit) return;
      form.dataset.mmInit = '1';
      var dataEl = form.querySelector('[data-product-variants-json]');
      if (!dataEl) return;
      var variants;
      try { variants = JSON.parse(dataEl.textContent); } catch (e) { return; }
      var idInput = form.querySelector('[data-variant-id-input]');
      var container = form.closest('.product-page');
      var priceEl = container && container.querySelector('.price');
      var btn = form.querySelector('[data-submit-btn]');
      var selectors = form.querySelectorAll('[data-option-selector]');
      if (!selectors.length) return;

      function updateVariant() {
        var selected = Array.prototype.map.call(selectors, function (s) { return s.value; });
        var match = variants.find(function (v) {
          return v.options.every(function (opt, i) { return opt === selected[i]; });
        });
        if (!match) return;
        if (idInput) idInput.value = match.id;
        if (priceEl && match.price != null) {
          priceEl.textContent = (match.price / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        }
        if (btn) {
          btn.disabled = !match.available;
          btn.textContent = match.available ? 'Add to Cart' : 'Sold Out';
        }
      }
      selectors.forEach(function (s) { s.addEventListener('change', updateVariant); });
    });
  }

  // -------- Init all --------
  function init() {
    initReveal();
    initCountdowns();
    initMobileMenu();
    initSmoothScroll();
    initGalleries();
    initSteppers();
    initFaq();
    initHeroCarousel();
    initAutoplayVideos();
    initProductVariantPicker();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // -------- Shopify theme editor support --------
  // When a setting changes in "Customize", Shopify re-renders the section's
  // HTML and swaps it into the page. Re-run all initializers on the new DOM
  // so reveal animations, carousels, steppers, FAQ, countdowns etc. keep
  // working instead of leaving the section invisible (.reveal opacity 0).
  document.addEventListener('shopify:section:load', function (e) {
    initReveal(e.target);
    init();
  });
  document.addEventListener('shopify:section:select', function (e) {
    initReveal(e.target);
  });
})();
