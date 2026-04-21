/**
 * Elevate Edge Interiors – Enhancements JS
 * Handles: sticky navbar, scroll animations, stat counter, back-to-top.
 */

(function () {
  'use strict';

  /* =============================================
     1. STICKY NAVBAR ON SCROLL
  ============================================= */
  var header = document.querySelector('.header');
  if (header && !header.classList.contains('header-normal')) {
    var scrolled = false;
    window.addEventListener('scroll', function () {
      if (window.scrollY > 60) {
        if (!scrolled) { header.classList.add('scrolled'); scrolled = true; }
      } else {
        if (scrolled) { header.classList.remove('scrolled'); scrolled = false; }
      }
    }, { passive: true });
  }

  /* =============================================
     2. SCROLL-TRIGGER ANIMATION (IntersectionObserver)
  ============================================= */
  var animateEls = document.querySelectorAll('.ee-animate');
  if (animateEls.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    animateEls.forEach(function (el) { observer.observe(el); });
  } else {
    // Fallback: show all
    animateEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* =============================================
     3. STAT COUNTER ANIMATION
  ============================================= */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-target') || el.textContent);
    var isFloat = el.getAttribute('data-float') === 'true';
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1800;
    var step = 16;
    var steps = Math.floor(duration / step);
    var increment = target / steps;
    var current = 0;
    var timer = setInterval(function () {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = (isFloat ? current.toFixed(1) : Math.floor(current)) + suffix;
    }, step);
  }

  var statNumbers = document.querySelectorAll('.ee-stat-number');
  if (statNumbers.length && 'IntersectionObserver' in window) {
    var statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statNumbers.forEach(function (el) { statObserver.observe(el); });
  }

  /* =============================================
     4. BACK TO TOP BUTTON
  ============================================= */
  var backBtn = document.getElementById('ee-back-top');
  if (backBtn) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        backBtn.classList.add('visible');
      } else {
        backBtn.classList.remove('visible');
      }
    }, { passive: true });

    backBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* =============================================
     5. PROJECT ITEM OVERLAY SETUP
  ============================================= */
  document.querySelectorAll('.project__item').forEach(function (item) {
    if (!item.querySelector('.project__item-overlay')) {
      var overlay = document.createElement('div');
      overlay.className = 'project__item-overlay';
      item.appendChild(overlay);
    }
  });

  /* =============================================
     6. HERO SCROLL INDICATOR
  ============================================= */
  var heroSection = document.querySelector('.hero');
  if (heroSection) {
    var scrollIndicator = heroSection.querySelector('.hero__scroll-indicator');
    if (!scrollIndicator) {
      scrollIndicator = document.createElement('div');
      scrollIndicator.className = 'hero__scroll-indicator';
      scrollIndicator.innerHTML = '<span>Scroll</span><div class="scroll-line"></div>';
      heroSection.appendChild(scrollIndicator);
    }
    // Hide scroll indicator after user scrolls
    window.addEventListener('scroll', function () {
      if (scrollIndicator) {
        scrollIndicator.style.opacity = window.scrollY > 80 ? '0' : '1';
      }
    }, { passive: true });
  }

  /* =============================================
     7. SMOOTH HOVER PARALLAX ON HERO SLIDES
  ============================================= */
  document.querySelectorAll('.hero__items').forEach(function (slide) {
    slide.addEventListener('mousemove', function (e) {
      var rect = slide.getBoundingClientRect();
      var xRel = (e.clientX - rect.left) / rect.width - 0.5;
      var yRel = (e.clientY - rect.top) / rect.height - 0.5;
      slide.style.backgroundPositionX = (50 + xRel * 3).toFixed(2) + '%';
      slide.style.backgroundPositionY = (50 + yRel * 3).toFixed(2) + '%';
    });
    slide.addEventListener('mouseleave', function () {
      slide.style.backgroundPositionX = '50%';
      slide.style.backgroundPositionY = '50%';
    });
  });

  /* =============================================
     8. SERVICE CARD TILT EFFECT
  ============================================= */
  document.querySelectorAll('.services__item, .single-feature').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
      var y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
      card.style.transform = 'translateY(-8px) rotateX(' + (-y).toFixed(1) + 'deg) rotateY(' + x.toFixed(1) + 'deg)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });

  /* =============================================
     9. MOBILE MENU CANVAS – PREVENT BODY SCROLL
  ============================================= */
  var canvasOpen = document.querySelector('.canvas__open');
  var canvasOverlay = document.querySelector('.offcanvas-menu-overlay');
  if (canvasOpen) {
    canvasOpen.addEventListener('click', function () {
      document.body.style.overflow = 'hidden';
    });
  }
  if (canvasOverlay) {
    canvasOverlay.addEventListener('click', function () {
      document.body.style.overflow = '';
    });
  }

  /* =============================================
     10. ADD ee-animate CLASS TO SECTIONS ON LOAD
  ============================================= */
  var sectionsToAnimate = document.querySelectorAll(
    '.about.spad > .container > .row, ' +
    '.services__item, ' +
    '.single-feature, ' +
    '.ee-stat-item, ' +
    '.ee-process-step, ' +
    '.contact__widget__item, ' +
    '.footer__about, .footer__widget, .footer__address'
  );
  sectionsToAnimate.forEach(function (el, i) {
    if (!el.classList.contains('ee-animate')) {
      el.classList.add('ee-animate');
      el.style.transitionDelay = Math.min(i * 0.08, 0.5) + 's';
    }
  });

  // Re-observe newly added
  if ('IntersectionObserver' in window) {
    sectionsToAnimate.forEach(function (el) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
      obs.observe(el);
    });
  } else {
    sectionsToAnimate.forEach(function(el) { el.classList.add('visible'); });
  }

  /* =============================================
     11. PAGE TRANSITIONS
  ============================================= */
  var pageTransition = document.createElement('div');
  pageTransition.className = 'ee-page-transition';
  document.body.appendChild(pageTransition);

  document.querySelectorAll('a[href]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      if (this.hostname === window.location.hostname && !this.hash && this.target !== '_blank' && !this.href.includes('mailto') && !this.href.includes('tel')) {
        e.preventDefault();
        var target = this.href;
        pageTransition.classList.add('active');
        setTimeout(function() {
          window.location.href = target;
          setTimeout(function() {
            pageTransition.classList.remove('active');
          }, 800); // Failsafe to remove overlay if navigation fails locally
        }, 300);
      }
    });
  });

  /* End of enhancements.js */
})();
