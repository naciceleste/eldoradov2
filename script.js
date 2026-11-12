/* =========================================================================
   Distribuidora El Dorado — script.js
   Header shadow · mobile nav · back-to-top · WhatsApp form · active section
   No dependencies.
   ========================================================================= */
(function () {
  'use strict';

  var WHATSAPP = 'https://wa.me/50685660110';
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --------------------------- Header shadow ---------------------------- */
  var header = document.getElementById('site-header');
  var backToTop = document.getElementById('back-to-top');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('scrolled', y > 8);
    if (backToTop) {
      if (y > 600) {
        backToTop.hidden = false;
        // next frame so the transition runs
        requestAnimationFrame(function () { backToTop.classList.add('show'); });
      } else {
        backToTop.classList.remove('show');
      }
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
    // Hide element fully once the fade-out transition ends
    backToTop.addEventListener('transitionend', function () {
      if (!backToTop.classList.contains('show')) backToTop.hidden = true;
    });
  }

  /* --------------------------- Mobile nav ------------------------------- */
  var hamburger = document.getElementById('hamburger');
  var panel = document.getElementById('mobile-panel');
  var overlay = document.getElementById('mobile-overlay');

  function openMenu() {
    if (!panel) return;
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    overlay.hidden = false;
    requestAnimationFrame(function () { overlay.classList.add('open'); });
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Cerrar menú');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('menu-open');
    // focus first link for keyboard users
    var firstLink = panel.querySelector('a');
    if (firstLink) firstLink.focus();
  }

  function closeMenu(returnFocus) {
    if (!panel) return;
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Abrir menú');
    document.body.style.overflow = '';
    document.body.classList.remove('menu-open');
    if (returnFocus) hamburger.focus();
  }

  if (overlay) {
    overlay.addEventListener('transitionend', function () {
      if (!overlay.classList.contains('open')) overlay.hidden = true;
    });
  }

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      if (hamburger.getAttribute('aria-expanded') === 'true') closeMenu(true);
      else openMenu();
    });
  }
  if (overlay) overlay.addEventListener('click', function () { closeMenu(false); });

  // Close on link click
  if (panel) {
    panel.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { closeMenu(false); });
    });
  }

  // Escape closes the menu
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel && panel.classList.contains('open')) closeMenu(true);
  });

  // Reset menu if resized up to desktop
  window.addEventListener('resize', function () {
    if (window.innerWidth > 900 && panel && panel.classList.contains('open')) closeMenu(false);
  });

  /* --------------------------- WhatsApp form ---------------------------- */
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nombre = (form.nombre.value || '').trim();
      var mensaje = (form.mensaje.value || '').trim();

      if (!nombre || !mensaje) {
        if (!nombre) form.nombre.focus();
        else form.mensaje.focus();
        return;
      }

      var texto = 'Hola, soy ' + nombre + '. ' + mensaje;
      var url = WHATSAPP + '?text=' + encodeURIComponent(texto);
      window.open(url, '_blank', 'noopener');
    });
  }

  /* --------------------------- Active section --------------------------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.main-nav a'));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          navLinks.forEach(function (a) {
            a.classList.toggle('active', a.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { observer.observe(s); });
  }

  /* -------------------- Plataformas marquee (mobile tap) ---------------- */
  document.querySelectorAll("[data-plataformas-marquee]").forEach(function (marquee) {
    marquee.querySelectorAll(".plataforma").forEach(function (el) {
      el.addEventListener("pointerup", function (e) {
        if (e.pointerType !== "touch" && e.pointerType !== "pen") return;
        var wasOn = el.classList.contains("is-color");
        marquee.querySelectorAll(".plataforma.is-color").forEach(function (x) {
          x.classList.remove("is-color");
        });
        if (!wasOn) el.classList.add("is-color");
      });
    });
  });

})();
