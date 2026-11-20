/* ============================================================
   DEXANGEL — main.js
   Vanilla JS, no dependencies. Everything degrades gracefully:
   if this file fails to load, the <noscript> rules keep the page
   readable and the mobile menu usable.

   EASTER EGGS
   - Click the "FL. 13" floor badge in the nav 5 times  -> dev room
   - Click the faint handprint in the hero               -> one-shot visual flicker
   - Sound toggle in the hero is a placeholder (no audio file bundled)

   NEWSLETTER / PLAYTEST FORMS (front-end only)
   Two forms carry the [data-signup] attribute (roadmap + final CTA).
   Search this file for "BACKEND HOOK-UP" to see the two places to
   swap the fake success state for a real fetch() to your provider.
   ============================================================ */

(function () {
  'use strict';

  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  function reduced() { return motionQuery.matches; }

  /* ---------------------------------------------------------
     1. NAV — scroll state, mobile toggle, active section
     --------------------------------------------------------- */
  var nav = document.getElementById('site-nav');
  var navToggle = document.getElementById('nav-toggle');
  var navMenu = document.getElementById('nav-menu');

  function onScroll() {
    if (window.scrollY > 8) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  }

  navToggle.addEventListener('click', function () {
    setMenu(!nav.classList.contains('is-open'));
  });

  navMenu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setMenu(false);
      navToggle.focus();
    }
  });

  document.addEventListener('click', function (e) {
    if (nav.classList.contains('is-open') && !nav.contains(e.target)) setMenu(false);
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth >= 900) setMenu(false);
  });

  /* Active section highlight */
  if ('IntersectionObserver' in window) {
    var links = {};
    Array.prototype.forEach.call(navMenu.querySelectorAll('a[href^="#"]'), function (a) {
      links[a.getAttribute('href').slice(1)] = a;
    });

    var activeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        Object.keys(links).forEach(function (id) {
          links[id].classList.toggle('is-active', id === entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    Object.keys(links).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) activeObserver.observe(section);
    });
  }

  /* ---------------------------------------------------------
     2. SCROLL REVEALS (staggered)
     --------------------------------------------------------- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  var staggerGroups = ['.panic__cols', '.steps', '.timeline', '.features', '.shots', '.roadmap'];
  staggerGroups.forEach(function (selector) {
    Array.prototype.forEach.call(document.querySelectorAll(selector), function (group) {
      var kids = group.querySelectorAll(':scope > .reveal, :scope > * > .reveal');
      Array.prototype.forEach.call(kids, function (kid, i) {
        kid.style.setProperty('--d', Math.min(i, 6) * 0.08 + 's');
      });
    });
  });

  if ('IntersectionObserver' in window && !reduced()) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------------------------------------------------------
     3. HERO PARALLAX (scroll-linked, disabled for reduced motion)
     --------------------------------------------------------- */
  var heroBg = document.querySelector('.hero__bg');
  if (heroBg && !reduced()) {
    var ticking = false;
    var parallax = function () {
      ticking = false;
      var y = window.scrollY;
      if (y < window.innerHeight * 1.3) {
        heroBg.style.setProperty('--py', (y * 0.22).toFixed(1) + 'px');
      }
    };
    window.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(parallax);
      }
    }, { passive: true });
    parallax();
  }

  /* ---------------------------------------------------------
     4. THE PANIC METER — centerpiece interaction
     --------------------------------------------------------- */
  var panicSection = document.getElementById('panic');
  var meter = document.getElementById('meter');
  var range = document.getElementById('meter-range');
  var ghost = document.getElementById('zone-ghost');
  var outZone = document.getElementById('readout-zone');
  var outMsg = document.getElementById('readout-msg');
  var outHint = document.getElementById('readout-hint');
  var readout = document.getElementById('readout');

  var ZONES = [
    {
      max: 23, id: 'calm', label: 'Calm', range: '0–23',
      msg: 'Bored humans with flashlights. They stay in groups of four and complain about the smell. <strong>Nobody is alone. Nobody is yours.</strong>',
      hint: 'Plant more evidence. You are invisible down here — and right now, irrelevant.'
    },
    {
      max: 45, id: 'jittery', label: 'Jittery', range: '24–45',
      msg: 'They\'ve seen enough. Short voices, quick glances, doors checked twice. But they still hold formation. <strong>Push a little more.</strong>',
      hint: 'Almost there. One well-placed trace splits the group without scaring them off the floor.'
    },
    {
      max: 71, id: 'sweet', label: 'Sweet spot', range: '46–71',
      msg: 'Jittery. Paranoid. Split from the group. <strong>YOU MAY HUNT.</strong>',
      hint: 'Noise lures work best right here. This is the win zone — the only place you\'re meant to feed.'
    },
    {
      max: 87, id: 'fleeing', label: 'Fleeing', range: '72–87',
      msg: 'Doors, stairs, car keys. They\'re running — and every one of them leaves with a story. <strong>Fail pressure rising.</strong>',
      hint: 'Stop planting. It\'s too late: escapes at critical panic are what arms the strike team.'
    },
    {
      max: 100, id: 'police', label: 'Police', range: '88–100',
      msg: 'They came back with warrants and rifles. <strong>Every trace you left is now an exhibit.</strong>',
      hint: 'Professionals photograph your aesthetics before they enter. And everyone you let go is in the room.'
    }
  ];

  function zoneFor(value) {
    for (var i = 0; i < ZONES.length; i++) {
      if (value <= ZONES[i].max) return ZONES[i];
    }
    return ZONES[ZONES.length - 1];
  }

  function renderMeter(value) {
    value = Math.max(0, Math.min(100, Math.round(value)));
    var zone = zoneFor(value);

    meter.style.setProperty('--p', value + '%');
    panicSection.setAttribute('data-zone', zone.id);
    readout.setAttribute('data-zone', zone.id);

    ghost.textContent = zone.label.toUpperCase();
    outZone.textContent = zone.label + ' · ' + zone.range;
    outMsg.innerHTML = zone.msg;
    outHint.textContent = zone.hint;
    range.setAttribute('aria-valuetext', zone.label + ' — ' + value + ' percent');
  }

  var userTouched = false;
  function touchMeter() { userTouched = true; }

  range.addEventListener('input', function () {
    touchMeter();
    renderMeter(parseInt(range.value, 10));
  });
  ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(function (evt) {
    range.addEventListener(evt, touchMeter, { passive: true });
  });

  renderMeter(parseInt(range.value, 10));

  /* Auto-sweep demo: one pass, only until the user takes over. */
  if ('IntersectionObserver' in window && !reduced()) {
    var sweepObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        sweepObserver.disconnect();
        runSweep();
      });
    }, { threshold: 0.45 });
    sweepObserver.observe(meter);
  }

  function runSweep() {
    if (userTouched) return;
    var start = null;
    var from = 0;
    var to = 58;            /* lands inside the sweet spot */
    var duration = 1900;

    function frame(ts) {
      if (userTouched) return;
      if (start === null) start = ts;
      var t = Math.min(1, (ts - start) / duration);
      var eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      var value = from + (to - from) * eased;
      range.value = String(Math.round(value));
      renderMeter(value);
      if (t < 1) window.requestAnimationFrame(frame);
    }
    window.requestAnimationFrame(frame);
  }

  /* ---------------------------------------------------------
     5. SIGN-UP FORMS (front-end validation only)
     --------------------------------------------------------- */
  Array.prototype.forEach.call(document.querySelectorAll('form[data-signup]'), function (form) {
    var input = form.querySelector('input[type="email"]');
    var status = form.querySelector('[data-signup-status]');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var value = (input.value || '').trim();
      var valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

      if (!valid) {
        input.setAttribute('aria-invalid', 'true');
        status.classList.add('is-error');
        status.textContent = 'That address won\'t survive inspection. Try again.';
        input.focus();
        return;
      }

      input.removeAttribute('aria-invalid');
      status.classList.remove('is-error');

      /* ---------------------------------------------------------
         BACKEND HOOK-UP #1 of 2 — replace this block with a real
         request, e.g.:

           fetch('https://formspree.io/f/XXXXXXX', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ email: value })
           }).then(...)

         Netlify: add data-netlify="true" + name="email" to the
         <form> in the HTML and POST as application/x-www-form-urlencoded.
         --------------------------------------------------------- */
      status.textContent = 'You\'re on the list. Watch your inbox from inside the building.';
      form.reset();
    });

    input.addEventListener('input', function () {
      if (input.getAttribute('aria-invalid') === 'true') {
        input.removeAttribute('aria-invalid');
        status.classList.remove('is-error');
        status.textContent = '';
      }
    });
  });

  /* ---------------------------------------------------------
     6. DIALOG HELPERS + LIGHTBOX
     --------------------------------------------------------- */
  function openDialog(dlg) {
    if (!dlg) return;
    if (typeof dlg.showModal === 'function') {
      if (!dlg.open) dlg.showModal();
    } else {
      dlg.setAttribute('open', '');
    }
  }
  function closeDialog(dlg) {
    if (!dlg) return;
    if (typeof dlg.close === 'function') dlg.close();
    else dlg.removeAttribute('open');
  }
  Array.prototype.forEach.call(document.querySelectorAll('[data-close-dialog]'), function (btn) {
    btn.addEventListener('click', function () { closeDialog(btn.closest('dialog')); });
  });
  Array.prototype.forEach.call(document.querySelectorAll('dialog'), function (dlg) {
    dlg.addEventListener('click', function (e) {
      if (e.target !== dlg) return;
      var r = dlg.getBoundingClientRect();
      var outside = e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
      if (outside) closeDialog(dlg);
    });
  });

  var lightbox = document.getElementById('lightbox');
  var lbImg = document.getElementById('lightbox-img');
  var lbCaption = document.getElementById('lightbox-caption');
  var shotButtons = Array.prototype.slice.call(document.querySelectorAll('.shot__btn'));
  var shotIndex = 0;
  var lastShotFocus = null;

  function showShot(i) {
    shotIndex = (i + shotButtons.length) % shotButtons.length;
    var btn = shotButtons[shotIndex];
    var thumb = btn.querySelector('img');
    lbImg.src = btn.getAttribute('data-full');
    lbImg.alt = thumb ? thumb.alt : '';
    lbCaption.textContent = btn.getAttribute('data-caption') || '';
  }

  shotButtons.forEach(function (btn, i) {
    btn.addEventListener('click', function () {
      lastShotFocus = btn;
      showShot(i);
      openDialog(lightbox);
      document.getElementById('lightbox-close').focus();
    });
  });

  document.getElementById('lightbox-prev').addEventListener('click', function () { showShot(shotIndex - 1); });
  document.getElementById('lightbox-next').addEventListener('click', function () { showShot(shotIndex + 1); });
  document.getElementById('lightbox-close').addEventListener('click', function () { closeDialog(lightbox); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var openDlg = document.querySelector('dialog[open]');
      if (openDlg) closeDialog(openDlg);
      return;
    }
    if (!lightbox || !lightbox.open) return;
    if (e.key === 'ArrowLeft') showShot(shotIndex - 1);
    if (e.key === 'ArrowRight') showShot(shotIndex + 1);
  });

  lightbox.addEventListener('close', function () {
    if (lastShotFocus) lastShotFocus.focus();
  });

  /* ---------------------------------------------------------
     7. DEV ROOM EASTER EGG (click the floor badge 5 times)
     --------------------------------------------------------- */
  var floorBtn = document.getElementById('floor-btn');
  var floorNum = document.getElementById('floor-num');
  var devroom = document.getElementById('devroom');
  var floorClicks = 0;

  floorBtn.addEventListener('click', function () {
    floorClicks += 1;
    var floor = 12 + floorClicks;      /* 13 -> 17 across four clicks */
    floorNum.textContent = String(floor);
    floorBtn.setAttribute('aria-label', 'FL. ' + floor + ' — building floor indicator. Activate to move up a floor.');

    if (floorClicks >= 5) {
      floorNum.textContent = '18';
      floorBtn.setAttribute('aria-label', 'FL. 18 — building floor indicator. Something is wrong with this floor.');
      openDialog(devroom);
    }
  });

  devroom.addEventListener('close', function () {
    floorClicks = 0;
    floorNum.textContent = '13';
    floorBtn.setAttribute('aria-label', 'Building floor indicator: floor 13. Activate to move up a floor.');
  });

  /* ---------------------------------------------------------
     8. JUMP-SCARE FLICKER EASTER EGG (visual only, one shot)
     --------------------------------------------------------- */
  var scare = document.getElementById('scare');
  var scareTrigger = document.getElementById('scare-trigger');
  var lastScare = 0;

  scareTrigger.addEventListener('click', function () {
    var now = Date.now();
    if (now - lastScare < 30000) return;   /* 30s cooldown, never spams */
    lastScare = now;

    scare.hidden = false;

    if (reduced()) {
      scare.classList.add('is-static');
      window.setTimeout(function () {
        scare.classList.remove('is-static');
        scare.hidden = true;
      }, 900);
      return;
    }

    scare.classList.add('is-firing');
    var done = function () {
      scare.classList.remove('is-firing');
      scare.hidden = true;
      scare.removeEventListener('animationend', done);
    };
    scare.addEventListener('animationend', done);
    window.setTimeout(done, 900);   /* fallback if animationend never fires */
  });

  /* ---------------------------------------------------------
     9. SOUND TOGGLE (placeholder — no audio file bundled)
     --------------------------------------------------------- */
  var soundBtn = document.getElementById('sound-toggle');
  var soundLabel = document.getElementById('sound-label');
  var soundIcon = document.getElementById('sound-icon-use');

  soundBtn.addEventListener('click', function () {
    var on = soundBtn.getAttribute('aria-pressed') !== 'true';
    soundBtn.setAttribute('aria-pressed', String(on));
    soundLabel.textContent = 'Sound: ' + (on ? 'on' : 'off');
    soundIcon.setAttribute('href', on ? '#i-sound-on' : '#i-sound-off');
    /* AUDIO HOOK-UP: create an <audio loop muted> here, set
       audio.muted = !on, audio.play().catch(function(){}) — keep it
       muted-by-default so no autoplay policy is violated. */
  });

  /* ---------------------------------------------------------
     10. MISC
     --------------------------------------------------------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
