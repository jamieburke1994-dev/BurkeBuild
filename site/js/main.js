/* ==========================================================================
   BurkeBuild - interaction system (vanilla, shared across all pages)
   Reveal-on-scroll · tactile cards (glow + tilt) · magnetic buttons ·
   drag/flick tracks · parallax · project filters · custom dropdown · nav.
   ========================================================================== */
(function () {
  'use strict';
  var fine = window.matchMedia('(pointer:fine)').matches;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- reveal on scroll (staggered) ---------- */
  function initReveals() {
    var els = document.querySelectorAll('.reveal');
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.filter(function (e) { return e.isIntersecting; }).forEach(function (e, i) {
        var el = e.target;
        el.style.transitionDelay = (i * 80) + 'ms';
        el.classList.add('is-visible');
        el.addEventListener('transitionend', function () { el.style.transitionDelay = '0ms'; }, { once: true });
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- tactile cards: cursor glow + eased lift (+tilt) ---------- */
  function initTactile() {
    if (!fine) return;
    document.querySelectorAll('[data-tilt]').forEach(function (card) {
      var glow = card.querySelector('.tglow');
      var num = card.querySelector('.tcard__num');
      var light = card.getAttribute('data-theme') === 'light';
      var c = light
        ? { border: 'rgba(200,36,46,0.55)', bg: '#fff', rb: '', rbg: '', gi: 'rgba(200,36,46,0.10)', go: 'rgba(200,36,46,0)' }
        : { border: 'rgba(232,64,75,0.65)', bg: '#16255C', rb: 'rgba(255,255,255,0.12)', rbg: '#132152', gi: 'rgba(232,64,75,0.22)', go: 'rgba(232,64,75,0)' };
      var restBorder = c.rb || getComputedStyle(card).borderColor;
      var restBg = c.rbg || getComputedStyle(card).backgroundColor;
      var raf = null, tx = 0, ty = 0, cx = 0, cy = 0, gx = 0.5, gy = 0.5, cgx = 0.5, cgy = 0.5, over = false, lv = 0;
      var noTilt = card.hasAttribute('data-no-tilt');
      function tick() {
        cx += (tx - cx) * 0.12; cy += (ty - cy) * 0.12;
        cgx += (gx - cgx) * 0.18; cgy += (gy - cgy) * 0.18;
        lv += ((over ? -5 : 0) - lv) * 0.15;
        card.style.transform = noTilt
          ? 'translateY(' + lv.toFixed(2) + 'px)'
          : 'perspective(900px) rotateX(' + (-cy * 4.5).toFixed(2) + 'deg) rotateY(' + (cx * 6.5).toFixed(2) + 'deg) translateY(' + lv.toFixed(2) + 'px)';
        if (glow) glow.style.backgroundImage = 'radial-gradient(300px circle at ' + (cgx * 100).toFixed(1) + '% ' + (cgy * 100).toFixed(1) + '%, ' + c.gi + ', ' + c.go + ' 70%)';
        if (over || Math.abs(cx) > 0.002 || Math.abs(cy) > 0.002 || Math.abs(lv) > 0.05) raf = requestAnimationFrame(tick);
        else { raf = null; card.style.transform = ''; }
      }
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        gx = (e.clientX - r.left) / r.width; gy = (e.clientY - r.top) / r.height;
        tx = gx - 0.5; ty = gy - 0.5;
        if (!raf) raf = requestAnimationFrame(tick);
      });
      card.addEventListener('mouseenter', function () {
        over = true;
        card.style.borderColor = c.border; card.style.background = c.bg;
        if (glow) glow.style.opacity = '1';
        if (num) num.style.color = '#C8242E';
        if (!raf) raf = requestAnimationFrame(tick);
      });
      card.addEventListener('mouseleave', function () {
        over = false; tx = 0; ty = 0;
        card.style.borderColor = restBorder; card.style.background = restBg;
        if (glow) glow.style.opacity = '0';
        if (num) num.style.color = 'transparent';
      });
    });
  }

  /* ---------- magnetic + shimmer buttons ---------- */
  function initMagnetic() {
    if (!fine) return;
    document.querySelectorAll('[data-magnetic]').forEach(function (btn) {
      var base = btn.getAttribute('data-base') || '#C8242E';
      var hi = btn.getAttribute('data-hi') || '#E8404B';
      var strength = parseFloat(btn.getAttribute('data-strength') || '0.32');
      var shimmer = btn.hasAttribute('data-shimmer');
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var rx = e.clientX - r.left, ry = e.clientY - r.top;
        btn.style.transition = 'transform .12s ease-out';
        btn.style.transform = 'translate(' + ((rx - r.width / 2) * strength).toFixed(1) + 'px,' + ((ry - r.height / 2) * strength).toFixed(1) + 'px)';
        if (shimmer) btn.style.backgroundImage = 'radial-gradient(circle 130px at ' + rx + 'px ' + ry + 'px, ' + hi + ', ' + base + ' 72%)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transition = 'transform .55s cubic-bezier(.22,1.6,.36,1), background-image .3s ease';
        btn.style.transform = 'translate(0,0)';
        btn.style.backgroundImage = '';
      });
    });
  }

  /* ---------- drag / flick tracks (auto-scroll, pause on hover) ---------- */
  function initTracks() {
    document.querySelectorAll('[data-track]').forEach(function (track) {
      var x = 0, vel = 0, hover = false, dragging = false, lastX = 0, moved = 0;
      function wrap() {
        var half = track.scrollWidth / 2;
        if (!half) return;
        while (x <= -half) x += half;
        while (x > 0) x -= half;
      }
      function loop() {
        if (!document.body.contains(track)) return;
        if (!dragging) {
          if (!hover && !reduce) x -= 0.65;
          x += vel; vel *= 0.94;
          if (Math.abs(vel) < 0.05) vel = 0;
        }
        wrap();
        track.style.transform = 'translateX(' + x.toFixed(2) + 'px)';
        requestAnimationFrame(loop);
      }
      track.addEventListener('mouseenter', function () { hover = true; });
      track.addEventListener('mouseleave', function () { hover = false; });
      track.addEventListener('pointerdown', function (e) {
        dragging = true; moved = 0; lastX = e.clientX; vel = 0;
        track.style.cursor = 'grabbing';
        track.setPointerCapture(e.pointerId);
      });
      track.addEventListener('pointermove', function (e) {
        if (!dragging) return;
        var dx = e.clientX - lastX; lastX = e.clientX;
        x += dx; vel = dx; moved += Math.abs(dx);
        wrap();
        track.style.transform = 'translateX(' + x.toFixed(2) + 'px)';
      });
      function end(e) {
        if (!dragging) return;
        dragging = false; track.style.cursor = 'grab';
        if (track.hasPointerCapture && track.hasPointerCapture(e.pointerId)) track.releasePointerCapture(e.pointerId);
      }
      track.addEventListener('pointerup', end);
      track.addEventListener('pointercancel', end);
      track.addEventListener('click', function (e) { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } }, true);
      requestAnimationFrame(loop);
    });
  }

  /* ---------- parallax ---------- */
  function initParallax() {
    var par = document.querySelector('[data-parallax]');
    if (!par || reduce) return;
    function onScroll() {
      var r = par.parentElement.getBoundingClientRect();
      var p = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
      par.style.transform = 'translateY(' + (p * -44).toFixed(1) + 'px)';
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- project filters ---------- */
  function initFilters() {
    var chips = document.querySelectorAll('[data-filter]');
    if (!chips.length) return;
    var cards = document.querySelectorAll('.project[data-cat]');
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.remove('is-active'); });
        chip.classList.add('is-active');
        var f = chip.getAttribute('data-filter');
        cards.forEach(function (card) {
          card.classList.toggle('is-hidden', f !== 'all' && card.getAttribute('data-cat') !== f);
        });
      });
    });
  }

  /* ---------- custom dropdown ---------- */
  function initDropdown() {
    var dd = document.querySelector('[data-dropdown]');
    if (!dd) return;
    var btn = dd.querySelector('.dd__btn');
    var panel = dd.querySelector('.dd__panel');
    var label = dd.querySelector('[data-dd-label]');
    var hidden = dd.querySelector('input[type="hidden"]');
    btn.addEventListener('click', function (e) { e.stopPropagation(); panel.hidden = !panel.hidden; });
    dd.querySelectorAll('.dd__opt').forEach(function (opt) {
      opt.addEventListener('click', function () {
        label.textContent = opt.textContent;
        label.style.color = '#fff';
        if (hidden) hidden.value = opt.textContent;
        panel.hidden = true;
      });
    });
    document.addEventListener('click', function (e) { if (!dd.contains(e.target)) panel.hidden = true; });
  }

  /* ---------- form (mailto handoff) ---------- */
  function initForm() {
    var form = document.querySelector('[data-quote-form]');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      function get(n) {
        var el = form.querySelector('[name="' + n + '"]');
        return el ? el.value : '';
      }
      var subject = encodeURIComponent('Quote request - ' + (get('project_type') || 'General enquiry'));
      var body = encodeURIComponent(
        'Name: ' + get('name') + '\n' +
        'Phone: ' + (get('phone') || '-') + '\n' +
        'Email: ' + get('email') + '\n' +
        'Project type: ' + (get('project_type') || '-') + '\n\n' +
        get('message')
      );
      window.location.href = 'mailto:info@burkebuild.com?subject=' + subject + '&body=' + body;
      var note = form.querySelector('.form-note');
      if (note) note.textContent = 'Your email app should now open with your enquiry - just press send.';
    });
  }

  /* ---------- lightbox (photo-linked project cards) ---------- */
  function initLightbox() {
    var lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    var cards = Array.prototype.filter.call(document.querySelectorAll('.project'), function (p) {
      return /\.jpg$/.test(p.getAttribute('href') || '');
    });
    if (!cards.length) return;
    var lbImg = lightbox.querySelector('img');
    var lbCap = lightbox.querySelector('figcaption');
    var lbButtons = lightbox.querySelectorAll('button');
    var current = 0, lastFocused = null;
    function visible() {
      return cards.filter(function (p) { return !p.classList.contains('is-hidden'); });
    }
    function open(index) {
      var items = visible();
      if (!items.length) return;
      current = (index + items.length) % items.length;
      var item = items[current];
      lbImg.src = item.getAttribute('href');
      lbImg.alt = item.querySelector('img').alt;
      lbCap.textContent = item.querySelector('strong').textContent;
      if (lightbox.hidden) lastFocused = document.activeElement;
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      lightbox.querySelector('.lightbox__close').focus();
    }
    function close() {
      lightbox.hidden = true;
      document.body.style.overflow = '';
      if (lastFocused) lastFocused.focus();
    }
    cards.forEach(function (p) {
      p.addEventListener('click', function (e) {
        e.preventDefault();
        open(visible().indexOf(p));
      });
    });
    lightbox.querySelector('.lightbox__close').addEventListener('click', close);
    lightbox.querySelector('.lightbox__prev').addEventListener('click', function () { open(current - 1); });
    lightbox.querySelector('.lightbox__next').addEventListener('click', function () { open(current + 1); });
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', function (e) {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') open(current - 1);
      if (e.key === 'ArrowRight') open(current + 1);
      if (e.key === 'Tab') {
        var first = lbButtons[0], last = lbButtons[lbButtons.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---------- mobile nav ---------- */
  function initNav() {
    var burger = document.querySelector('.nav__burger');
    var menu = document.querySelector('.mobile-menu');
    if (!burger || !menu) return;
    burger.setAttribute('aria-expanded', 'false');
    function setMenu(open) {
      menu.hidden = !open;
      burger.setAttribute('aria-expanded', String(open));
    }
    burger.addEventListener('click', function () { setMenu(menu.hidden); });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) {
        setMenu(false);
        burger.focus();
      }
    });
  }

  function init() {
    initReveals(); initTactile(); initMagnetic(); initTracks();
    initParallax(); initFilters(); initDropdown(); initForm(); initLightbox(); initNav();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
