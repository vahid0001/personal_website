/* Vahid Reza Khazaie — portfolio behaviour
   Theme toggle · scroll reveal · nav highlighting · publication expansion */

(function () {
  'use strict';

  /* ---------- theme ---------- */

  var STORAGE_KEY = 'vk-theme';
  var root = document.documentElement;

  function stored() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function apply(theme) {
    root.setAttribute('data-theme', theme);
  }

  var saved = stored();
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  apply(saved || (prefersDark ? 'dark' : 'light'));

  var toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      apply(next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) { /* private mode */ }
    });
  }

  // Follow the OS until the visitor makes an explicit choice.
  if (!saved && window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var onChange = function (e) { if (!stored()) apply(e.matches ? 'dark' : 'light'); };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  /* ---------- scroll reveal ---------- */

  var revealables = document.querySelectorAll('.reveal');
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!('IntersectionObserver' in window) || reduced) {
    Array.prototype.forEach.call(revealables, function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

    Array.prototype.forEach.call(revealables, function (el, i) {
      // Stagger siblings that appear together so a grid animates in as a wave.
      el.style.transitionDelay = (Math.min(i % 6, 5) * 55) + 'ms';
      revealObserver.observe(el);
    });
  }

  /* ---------- sticky header shadow ---------- */

  var header = document.getElementById('siteHeader');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- active nav link ---------- */

  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a'));
  var sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (section) { navObserver.observe(section); });
  }

  /* ---------- earlier publications ---------- */

  var moreBtn = document.getElementById('morePubs');
  if (moreBtn) {
    var hiddenPubs = document.querySelectorAll('.pub.is-more');
    moreBtn.addEventListener('click', function () {
      var expanded = moreBtn.getAttribute('aria-expanded') === 'true';
      Array.prototype.forEach.call(hiddenPubs, function (pub) {
        pub.hidden = expanded;
        if (!expanded) pub.classList.add('is-visible');
      });
      moreBtn.setAttribute('aria-expanded', String(!expanded));
      moreBtn.textContent = expanded ? 'Show earlier publications' : 'Show fewer publications';
    });
  }


  /* ---------- contact form ----------
     Submissions go through Formspree, so no email address appears anywhere in
     this page's source. Replace FORM_ENDPOINT with your own form URL — see the
     README for the two-minute setup. */

  var FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

  var form = document.getElementById('contactForm');
  if (form) {
    var submitBtn = document.getElementById('cf-submit');
    var status = document.getElementById('cf-status');

    var setStatus = function (message, kind) {
      status.textContent = message;
      status.className = 'form-status' + (kind ? ' is-' + kind : '');
    };

    var clearErrors = function () {
      Array.prototype.forEach.call(form.querySelectorAll('.field-error'), function (el) {
        el.remove();
      });
      Array.prototype.forEach.call(form.querySelectorAll('[aria-invalid]'), function (el) {
        el.removeAttribute('aria-invalid');
      });
    };

    var showError = function (field, message) {
      field.setAttribute('aria-invalid', 'true');
      var note = document.createElement('p');
      note.className = 'field-error';
      note.textContent = message;
      field.parentNode.appendChild(note);
    };

    // Deliberately permissive: catches typos like a missing @ without rejecting
    // the many valid addresses a stricter pattern would refuse.
    var looksLikeEmail = function (value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    };

    var validate = function () {
      clearErrors();
      var name = form.elements.name;
      var email = form.elements.email;
      var message = form.elements.message;
      var firstBad = null;

      if (!name.value.trim()) { showError(name, 'Please tell me your name.'); firstBad = firstBad || name; }
      if (!email.value.trim()) {
        showError(email, 'An email address lets me reply.');
        firstBad = firstBad || email;
      } else if (!looksLikeEmail(email.value.trim())) {
        showError(email, 'That address looks incomplete.');
        firstBad = firstBad || email;
      }
      if (!message.value.trim()) { showError(message, 'Your message is empty.'); firstBad = firstBad || message; }

      if (firstBad) firstBad.focus();
      return !firstBad;
    };

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      setStatus('', null);

      if (!validate()) return;

      if (FORM_ENDPOINT.indexOf('YOUR_FORM_ID') !== -1) {
        setStatus('This form isn\u2019t connected to a backend yet. Please reach out on LinkedIn in the meantime.', 'error');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form)
      }).then(function (response) {
        if (response.ok) {
          form.reset();
          setStatus('Thanks — your message is on its way. I\u2019ll reply by email.', 'ok');
        } else {
          return response.json().then(function (data) {
            var detail = data && data.errors && data.errors.length
              ? data.errors.map(function (e) { return e.message; }).join(', ')
              : 'Something went wrong sending that.';
            setStatus(detail + ' Please try again, or reach me on LinkedIn.', 'error');
          });
        }
      }).catch(function () {
        setStatus('That didn\u2019t send — check your connection and try again, or reach me on LinkedIn.', 'error');
      }).then(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send message';
      });
    });
  }

  /* ---------- footer year ---------- */

  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
