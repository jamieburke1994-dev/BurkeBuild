/* BurkeBuild - interactions */
(function () {
  'use strict';

  /* ----- sticky nav shadow ----- */
  const nav = document.querySelector('.nav');
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ----- mobile menu ----- */
  const burger = document.querySelector('.nav__burger');
  const menu = document.getElementById('mobileMenu');
  burger.addEventListener('click', () => {
    const open = menu.hidden;
    menu.hidden = !open;
    burger.setAttribute('aria-expanded', String(open));
    burger.classList.toggle('is-open', open);
  });
  menu.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      menu.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
    })
  );

  /* ----- scroll reveal ----- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ----- project filters ----- */
  const chips = document.querySelectorAll('.chip');
  const projects = document.querySelectorAll('.project');
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      const f = chip.dataset.filter;
      projects.forEach((p) => {
        p.classList.toggle('is-hidden', f !== 'all' && p.dataset.cat !== f);
      });
    });
  });

  /* ----- lightbox ----- */
  const lightbox = document.getElementById('lightbox');
  const lbImg = lightbox.querySelector('img');
  const lbCap = lightbox.querySelector('figcaption');
  let current = 0;

  const visibleProjects = () =>
    Array.from(projects).filter((p) => !p.classList.contains('is-hidden'));

  function openLightbox(index) {
    const items = visibleProjects();
    current = (index + items.length) % items.length;
    const item = items[current];
    lbImg.src = item.getAttribute('href');
    lbImg.alt = item.querySelector('img').alt;
    lbCap.textContent = item.querySelector('strong').textContent;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lightbox.querySelector('.lightbox__close').focus();
  }
  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
  }

  projects.forEach((p) => {
    p.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(visibleProjects().indexOf(p));
    });
  });
  lightbox.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox__prev').addEventListener('click', () => openLightbox(current - 1));
  lightbox.querySelector('.lightbox__next').addEventListener('click', () => openLightbox(current + 1));
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') openLightbox(current - 1);
    if (e.key === 'ArrowRight') openLightbox(current + 1);
  });

  /* ----- contact form (mailto handoff) ----- */
  const form = document.getElementById('quoteForm');
  const note = document.getElementById('formNote');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const d = new FormData(form);
    const subject = encodeURIComponent('Quote request - ' + d.get('type'));
    const body = encodeURIComponent(
      'Name: ' + d.get('name') + '\n' +
      'Phone: ' + (d.get('phone') || '-') + '\n' +
      'Email: ' + d.get('email') + '\n' +
      'Project type: ' + d.get('type') + '\n\n' +
      d.get('message')
    );
    window.location.href = 'mailto:info@burkebuild.com?subject=' + subject + '&body=' + body;
    note.textContent = 'Your email app should now open with your enquiry - just press send.';
  });

  /* ----- footer year ----- */
  document.getElementById('year').textContent = new Date().getFullYear();
})();
