/* ============================================================
   MOMENTUM FITNESS | 30A CROSSFIT
   built by Ryder Schilling
   ============================================================ */

/* ------------------------------------------------------------
   INTEGRATIONS: every third-party hookup lives here.
   Flip each one on by pasting the real URL. One line per service.
   While a value is null, the UI shows an honest "preview" notice
   instead of faking a booking or a sent message.
   ------------------------------------------------------------ */
const INTEGRATIONS = {
  pushpress: {
    // Free trial registration URL from PushPress (Landing > Plans > share link):
    trial: null,
    // Drop-in purchase URL from PushPress:
    dropin: null,
    // Unlimited membership checkout URL from PushPress:
    'membership-unlimited': null,
    // 3x/week membership checkout URL from PushPress:
    'membership-3x': null,
    // Punch card checkout URL from PushPress:
    punchcard: null,
  },
  // Contact form endpoint (e.g. Formspree: 'https://formspree.io/f/xxxx').
  // POSTs { name, contact, message } as form data.
  form: null,
};

(() => {
  const doc = document.documentElement;
  const hasGsap = typeof gsap !== 'undefined';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktop = () => window.matchMedia('(min-width: 900px)').matches;
  const fineePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (!hasGsap || reduceMotion) doc.classList.add('motion-off');

  /* ------------------------------ Lenis: desktop only */
  let lenis = null;
  if (hasGsap && !reduceMotion && isDesktop() && fineePointer && typeof Lenis !== 'undefined') {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    gsap.registerPlugin(ScrollTrigger);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  } else if (hasGsap) {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ------------------------------ Nav state */
  const nav = document.getElementById('nav');
  const onScroll = () => nav && nav.classList.toggle('is-scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ------------------------------ Mobile drawer */
  const burger = document.getElementById('burger');
  const drawer = document.getElementById('drawer');
  if (burger && drawer) {
    burger.addEventListener('click', () => {
      const open = drawer.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    drawer.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
      drawer.classList.remove('is-open');
      burger.classList.remove('is-open');
      document.body.style.overflow = '';
    }));
  }

  /* ------------------------------ Hero entrance */
  if (hasGsap && !reduceMotion) {
    const heroEls = document.querySelectorAll('[data-hero]');
    if (heroEls.length) {
      gsap.to(heroEls, {
        opacity: 1, y: 0,
        duration: 1.15, stagger: 0.13, delay: 0.25,
        ease: 'power3.out',
        overwrite: true,
      });
    }
  }

  /* ------------------------------ Keep ScrollTrigger honest
     Positions are measured before webfonts and images settle, so every
     trigger drifts. Re-measure once the page is genuinely done. */
  if (hasGsap && typeof ScrollTrigger !== 'undefined') {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
    let rt;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(refresh, 220); });
  }

  /* ------------------------------ Parallax (desktop only) */
  if (hasGsap && !reduceMotion && isDesktop()) {
    gsap.utils.toArray('[data-parallax]').forEach((el) => {
      gsap.fromTo(el, { yPercent: -4 }, {
        yPercent: -8.5,
        ease: 'none',
        scrollTrigger: {
          trigger: el.closest('section') || el.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
  }

  /* ------------------------------ The Best Hour: pinned scrub (desktop) */
  const stage = document.getElementById('hourStage');
  if (stage && hasGsap && !reduceMotion && isDesktop()) {
    const clock = document.getElementById('hourClock');
    const frames = [...document.querySelectorAll('#hourFrames .hour__frame')];
    const railBtns = [...document.querySelectorAll('#hourRail button')];
    const marks = [0, 10, 25, 40, 55]; // minute each phase starts
    let current = 0;

    const setPhase = (i) => {
      if (i === current) return;
      current = i;
      frames.forEach((f, k) => f.classList.toggle('is-on', k === i));
      railBtns.forEach((b, k) => b.classList.toggle('is-on', k === i));
    };

    const st = ScrollTrigger.create({
      trigger: stage,
      // This one pins, so it must be measured before anything below it,
      // or every later trigger lands 2600px too high. See BUILD-NOTES.
      refreshPriority: 10,
      start: 'top top',
      end: '+=2600',
      pin: true,
      scrub: 0.4,
      onUpdate: (self) => {
        const minute = Math.min(60, Math.round(self.progress * 60));
        if (clock) clock.textContent = ':' + String(minute).padStart(2, '0');
        let phase = 0;
        for (let i = 0; i < marks.length; i++) if (minute >= marks[i]) phase = i;
        setPhase(phase);
      },
    });

    // Rail buttons jump the scroll to that minute
    railBtns.forEach((b, i) => {
      b.addEventListener('click', () => {
        const target = st.start + ((marks[i] + 1.5) / 60) * (st.end - st.start);
        if (lenis) lenis.scrollTo(target, { duration: 1 });
        else window.scrollTo({ top: target, behavior: 'smooth' });
      });
    });
  }

  /* ------------------------------ Reveal system (auto-tagged)
     Tags elements at runtime so every page gets the same motion
     vocabulary with zero markup churn. Never gates <main>. */
  const RV_SKIP_SECTION = /\b(hero|hour__stage)\b/;
  const RV_MOVING = '[class*="__rail"],[class*="__track"],[class*="__frames"],.hour__stage,.fsplit__media,.hero__media';
  const tagged = [];

  const tag = (el, delay) => {
    if (el.dataset.rvSeen || el.hasAttribute('data-hero')) return;
    el.dataset.rvSeen = '1';
    el.setAttribute('data-rv', '');
    if (delay) el.style.setProperty('--rv-d', delay.toFixed(2) + 's');
    tagged.push(el);
  };

  document.querySelectorAll('main section').forEach((section) => {
    if (RV_SKIP_SECTION.test(section.className)) return;
    const roots = section.querySelectorAll(':scope > .wrap');
    (roots.length ? roots : [section]).forEach((root) => {
      [...root.children].forEach((child) => {
        if (child.matches(RV_MOVING) || child.closest(RV_MOVING)) return;
        const kids = [...child.children].filter((k) => k.tagName !== 'SCRIPT');
        const groupy = /grid|__list|checks|offers|roster|doors__|tiers__|reviews__|contact__cards|hour__steps|btn-row/.test(child.className);
        if (groupy && kids.length >= 2 && kids.length <= 10) {
          kids.forEach((k, i) => tag(k, 0.09 * i));
        } else {
          tag(child, 0);
        }
      });
    });
  });

  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    tagged.forEach((el) => io.observe(el));
  } else {
    tagged.forEach((el) => el.classList.add('is-in'));
  }

  // Backstop: anything near the viewport gets revealed even if IO never fired
  const sweep = () => {
    tagged.forEach((el) => {
      if (!el.classList.contains('is-in') && el.getBoundingClientRect().top < window.innerHeight * 1.2) {
        el.classList.add('is-in');
      }
    });
  };
  setTimeout(sweep, 2500);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) sweep(); });
  window.addEventListener('load', () => setTimeout(sweep, 700));

  /* ------------------------------ FAQ accordion (state in the hash) */
  const faqItems = [...document.querySelectorAll('.faq__item')];
  faqItems.forEach((item, i) => {
    item.id = item.id || 'faq-' + (i + 1);
    const q = item.querySelector('.faq__q');
    q.addEventListener('click', () => {
      const open = item.classList.toggle('is-open');
      q.setAttribute('aria-expanded', String(open));
      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('is-open');
          other.querySelector('.faq__q').setAttribute('aria-expanded', 'false');
        }
      });
      history.replaceState(null, '', open ? '#' + item.id : location.pathname);
    });
  });
  if (location.hash && /^#faq-\d+$/.test(location.hash)) {
    const item = document.querySelector(location.hash);
    if (item && item.classList.contains('faq__item')) {
      item.classList.add('is-open');
      item.querySelector('.faq__q').setAttribute('aria-expanded', 'true');
    }
  }

  /* ------------------------------ Preview notices (honest, inline, never alert()) */
  const NOTE_BOOKING = 'Booking isn’t connected yet. This is a design preview, nothing was booked or charged.';
  const NOTE_FORM = 'This form isn’t connected yet. This is a design preview, your message was not sent. Text or call 850-502-3454 instead.';

  const showNote = (afterEl, text, inNav) => {
    if (inNav) {
      let toast = document.getElementById('ppToast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'ppToast';
        toast.className = 'pp-note pp-note--toast';
        document.body.appendChild(toast);
      }
      toast.textContent = text;
      toast.classList.add('is-on');
      clearTimeout(toast._t);
      toast._t = setTimeout(() => toast.classList.remove('is-on'), 4500);
      return;
    }
    let note = afterEl.nextElementSibling;
    if (!note || !note.classList.contains('pp-note')) {
      note = document.createElement('div');
      note.className = 'pp-note';
      note.setAttribute('role', 'status');
      afterEl.insertAdjacentElement('afterend', note);
    }
    note.textContent = text;
    note.classList.add('is-on');
    clearTimeout(note._t);
    note._t = setTimeout(() => note.classList.remove('is-on'), 6000);
  };

  document.querySelectorAll('.pp-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.pp;
      const url = INTEGRATIONS.pushpress ? INTEGRATIONS.pushpress[key] : null;
      if (url) {
        window.open(url, '_blank', 'noopener');
      } else {
        showNote(btn, NOTE_BOOKING, !!btn.closest('.nav, .nav-drawer'));
      }
    });
  });

  /* ------------------------------ Contact form */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      let ok = true;
      form.querySelectorAll('.fld').forEach((fld) => {
        const input = fld.querySelector('input, textarea');
        const bad = !input.value.trim();
        fld.classList.toggle('is-bad', bad);
        if (bad) ok = false;
      });
      if (!ok) return;

      const submitBtn = form.querySelector('[type="submit"]');
      if (!INTEGRATIONS.form) {
        showNote(submitBtn, NOTE_FORM, false);
        return;
      }
      // Live endpoint path: POST and only claim success when it actually succeeded.
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
      try {
        const res = await fetch(INTEGRATIONS.form, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: new FormData(form),
        });
        if (!res.ok) throw new Error('bad status');
        submitBtn.textContent = 'Sent. Talk soon.';
        form.reset();
      } catch (err) {
        showNote(submitBtn, 'That didn’t go through. Text us instead: 850-502-3454.', false);
        submitBtn.textContent = 'Send it';
      } finally {
        submitBtn.disabled = false;
      }
    });
  }
})();
