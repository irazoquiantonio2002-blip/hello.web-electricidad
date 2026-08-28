/* ============================================================
   FERREIRO'S — interactions
============================================================ */
(function () {
  'use strict';

  var WHATSAPP_NUMBER = '526641887784';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', function () {
    initLoader();
    initYear();
    initNavbar();
    initMobileMenu();
    initMarquee();
    initReveal();
    initStats();
    initContactForm();
    if (!reduceMotion) initHeroCanvas();
  });

  /* ---------- Loader ---------- */
  function initLoader() {
    var loader = document.getElementById('loader');
    var fill = loader ? loader.querySelector('.loader-bar-fill') : null;
    if (!loader) return;

    var progress = 0;
    var tick = setInterval(function () {
      progress += Math.random() * 22;
      if (progress >= 100) progress = 100;
      if (fill) fill.style.width = progress + '%';
      if (progress >= 100) clearInterval(tick);
    }, 120);

    window.addEventListener('load', function () {
      setTimeout(function () {
        if (fill) fill.style.width = '100%';
        setTimeout(function () { loader.classList.add('loaded'); }, 250);
      }, 300);
    });
  }

  /* ---------- Footer year ---------- */
  function initYear() {
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  }

  /* ---------- Navbar scroll state ---------- */
  function initNavbar() {
    var nav = document.getElementById('navbar');
    if (!nav) return;
    var onScroll = function () {
      nav.classList.toggle('scrolled', window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Mobile menu ---------- */
  function initMobileMenu() {
    var btn = document.getElementById('hamburger');
    var menu = document.getElementById('mob-menu');
    if (!btn || !menu) return;

    function close() {
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
    function toggle() {
      var open = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    btn.addEventListener('click', toggle);
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', close);
    });
  }

  /* ---------- Marquee content ---------- */
  function initMarquee() {
    var el = document.getElementById('marquee');
    if (!el) return;

    var items = [
      'Instalaciones Eléctricas',
      'Mantenimiento Preventivo',
      'Reparaciones de Emergencia',
      'Residencial',
      'Comercial',
      'Diagnóstico Certero',
      'Garantía por Escrito',
      'Tijuana, B.C.'
    ];

    var frag = document.createDocumentFragment();
    // duplicate the loop twice for a seamless -50% scroll
    for (var r = 0; r < 2; r++) {
      items.forEach(function (text) {
        var span = document.createElement('span');
        span.innerHTML = '<i class="fa-solid fa-bolt" aria-hidden="true"></i>' + text;
        frag.appendChild(span);
      });
    }
    el.appendChild(frag);
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('in-view'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Stat counters ---------- */
  function initStats() {
    var section = document.getElementById('stats');
    var nums = document.querySelectorAll('.stat-num');
    if (!section || !nums.length) return;

    var animated = false;

    function animate() {
      if (animated) return;
      animated = true;
      nums.forEach(function (el) {
        var target = parseInt(el.getAttribute('data-count'), 10) || 0;
        var suffix = el.getAttribute('data-suffix') || '';
        var duration = 1400;
        var start = null;

        function step(ts) {
          if (start === null) start = ts;
          var progress = Math.min((ts - start) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          var value = Math.round(eased * target);
          el.textContent = value.toLocaleString('es-MX') + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }
        if (reduceMotion) {
          el.textContent = target.toLocaleString('es-MX') + suffix;
        } else {
          requestAnimationFrame(step);
        }
      });
    }

    if (!('IntersectionObserver' in window)) { animate(); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animate(); io.disconnect(); }
      });
    }, { threshold: 0.4 });
    io.observe(section);
  }

  /* ---------- Contact form -> WhatsApp ---------- */
  function initContactForm() {
    var form = document.getElementById('wa-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = (document.getElementById('f-name') || {}).value || '';
      var interest = (document.getElementById('f-interest') || {}).value || '';
      var msg = (document.getElementById('f-msg') || {}).value || '';

      var lines = [
        'Hola, soy ' + name.trim() + '.',
        'Me interesa: ' + interest,
        'Detalle: ' + msg.trim()
      ];
      var text = encodeURIComponent(lines.join('\n'));
      var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + text;

      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }

  /* ---------- Hero canvas — subtle floating spark particles ---------- */
  function initHeroCanvas() {
    var canvas = document.getElementById('hero-canvas');
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var hero = document.getElementById('hero');
    var particles = [];
    var w, h, dpr;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = hero.offsetWidth;
      h = hero.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function makeParticles() {
      var count = Math.round((w * h) / 26000);
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.6 + 0.6,
          vy: Math.random() * 0.25 + 0.06,
          vx: (Math.random() - 0.5) * 0.12,
          a: Math.random() * 0.5 + 0.15
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(function (p) {
        p.y -= p.vy;
        p.x += p.vx;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(246,181,61,' + p.a + ')';
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }

    resize();
    makeParticles();
    draw();
    window.addEventListener('resize', function () {
      resize();
      makeParticles();
    });
  }
})();
