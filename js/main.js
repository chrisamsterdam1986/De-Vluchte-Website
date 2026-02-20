/* ============================================
   De Vluchte - Main JavaScript
   ============================================ */

(function () {
  'use strict';

  // ---------- DOM Elements ----------
  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav__link');
  const reveals = document.querySelectorAll('.reveal');
  const sections = document.querySelectorAll('section[id]');

  // ---------- Header Scroll Effect ----------
  let lastScrollY = 0;
  let ticking = false;

  function updateHeader() {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }

    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });

  // ---------- Mobile Navigation ----------
  function toggleMenu() {
    const isOpen = navMenu.classList.contains('nav__menu--open');

    navToggle.classList.toggle('nav__toggle--active');
    navMenu.classList.toggle('nav__menu--open');
    navToggle.setAttribute('aria-expanded', !isOpen);

    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? '' : 'hidden';
  }

  function closeMenu() {
    navToggle.classList.remove('nav__toggle--active');
    navMenu.classList.remove('nav__menu--open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', toggleMenu);

  navLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navMenu.classList.contains('nav__menu--open')) {
      closeMenu();
    }
  });

  // ---------- Scroll Reveal (Intersection Observer) ----------
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show all elements immediately
    reveals.forEach(function (el) {
      el.classList.add('reveal--visible');
    });
  }

  // ---------- Active Navigation Link ----------
  if ('IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          navLinks.forEach(function (link) {
            link.classList.remove('nav__link--active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('nav__link--active');
            }
          });
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '-20% 0px -60% 0px'
    });

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  // ---------- Smooth Scroll for Safari ----------
  // Safari <15.4 doesn't support CSS scroll-behavior
  if (!CSS.supports('scroll-behavior', 'smooth')) {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;

        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          var headerOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 72;
          var elementPosition = target.getBoundingClientRect().top;
          var offsetPosition = elementPosition + window.scrollY - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ---------- Initial State ----------
  updateHeader();

})();
