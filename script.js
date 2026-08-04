/* ==========================================================================
   GlossEmotion — Moving Company Landing Page
   Script for index.html: mobile menu, scroll reveal, sticky header state,
   animated stat counters, smooth in-page scrolling, subtle hero parallax.
   ========================================================================== */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile menu ---------- */
  var menuToggle = document.getElementById('menuToggle');
  var siteNav = document.getElementById('siteNav');

  if (menuToggle && siteNav) {
    var closeMenu = function () {
      siteNav.classList.remove('is-open');
      menuToggle.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open menu');
      document.body.classList.remove('nav-open');
    };

    menuToggle.addEventListener('click', function () {
      var open = siteNav.classList.toggle('is-open');
      menuToggle.classList.toggle('is-open', open);
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.classList.toggle('nav-open', open);
    });

    siteNav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 940) closeMenu();
    });
  }

  /* ---------- Sticky header shadow on scroll ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScrollHeader = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    onScrollHeader();
    window.addEventListener('scroll', onScrollHeader, { passive: true });
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    if (reduceMotion) {
      reveals.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var group = entry.target.closest('[data-reveal-group]');
          var index = group
            ? Array.prototype.indexOf.call(group.querySelectorAll('.reveal'), entry.target)
            : 0;
          entry.target.style.transitionDelay = Math.min(index * 70, 350) + 'ms';
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
      reveals.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- Animated stat counters ---------- */
  var counters = document.querySelectorAll('[data-count-to]');

  function animateCount(el) {
    var to = parseFloat(el.getAttribute('data-count-to'));
    var suffix = el.getAttribute('data-count-suffix') || '';
    var decimals = (el.getAttribute('data-count-to') || '').indexOf('.') > -1 ? 1 : 0;
    var duration = 1400;
    var start = null;

    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (to * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = to.toFixed(decimals) + suffix;
    }
    requestAnimationFrame(step);
  }

  if (counters.length) {
    if (reduceMotion) {
      counters.forEach(function (el) {
        el.textContent = el.getAttribute('data-count-to') + (el.getAttribute('data-count-suffix') || '');
      });
    } else {
      var counterIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          counterIO.unobserve(entry.target);
          animateCount(entry.target);
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { counterIO.observe(el); });
    }
  }

  /* ---------- Smooth in-page anchor scrolling ---------- */
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var id = link.getAttribute('href').slice(1);
    if (!id) return;
    var target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    var headerH = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10
    ) || 78;
    var top = target.getBoundingClientRect().top + window.scrollY - headerH - 12;
    window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });
    history.replaceState(null, '', '#' + id);
  });

  /* ---------- Hero photo tilt on mouse move (fine-pointer desktop only) ---------- */
  var heroVisual = document.getElementById('heroVisual');
  var canTilt = heroVisual
    && !reduceMotion
    && window.matchMedia('(min-width: 941px)').matches
    && window.matchMedia('(pointer: fine)').matches;

  if (canTilt) {
    var tiltTicking = false;
    var tiltX = 0, tiltY = 0;

    heroVisual.addEventListener('mousemove', function (e) {
      var rect = heroVisual.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width - 0.5;
      var py = (e.clientY - rect.top) / rect.height - 0.5;
      tiltY = px * 5;
      tiltX = py * -5;
      if (tiltTicking) return;
      tiltTicking = true;
      requestAnimationFrame(function () {
        heroVisual.style.transform =
          'perspective(1000px) rotateX(' + tiltX.toFixed(2) + 'deg) rotateY(' + tiltY.toFixed(2) + 'deg)';
        tiltTicking = false;
      });
    });

    heroVisual.addEventListener('mouseleave', function () {
      heroVisual.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
