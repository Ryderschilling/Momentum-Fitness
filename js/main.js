/* ============================================================
   MOMENTUM FITNESS | 30A CROSSFIT
   built by Ryder Schilling
   ============================================================ */

/* ------------------------------------------------------------
   PLANS: every PushPress link on the site lives here.
   A button with data-plan="<key>" opens that checkout in the side drawer.
   Change a price or a link here and every page follows.
   ------------------------------------------------------------ */
const PLANS = {
  trial: {
    name: 'Free trial class', price: 'Free', kicker: 'Try us out',
    note: 'Tell us a little about you. A coach will reach out to set up your first class, so we know you are coming.',
    url: 'https://momentumfitness.pushpress.com/open/interested',
  },
  dropin: {
    name: 'Single drop-in', price: '$25', kicker: 'Drop-in',
    note: 'One class. Checkout is handled by PushPress, our booking system.',
    url: 'https://momentumfitness.pushpress.com/landing/plans/plan_4416f437d7fc4e',
  },
  'dropin-week': {
    name: 'Unlimited week pass', price: '$85', kicker: 'Drop-in',
    note: 'Every class for 7 days. Checkout is handled by PushPress, our booking system.',
    url: 'https://momentumfitness.pushpress.com/landing/plans/plan_b5c8d1a3876345',
  },
  'dropin-month': {
    name: '1-month unlimited drop-in', price: '$189', kicker: 'Drop-in',
    note: 'Every class for a month. Does not auto-renew.',
    url: 'https://momentumfitness.pushpress.com/landing/plans/plan_f14a1055d6a743',
  },
  'membership-unlimited': {
    name: 'Unlimited membership', price: '$189/mo', kicker: 'Membership',
    note: 'Every class, every week. Checkout is handled by PushPress, our booking system.',
    url: 'https://momentumfitness.pushpress.com/landing/plans/plan_174cdbafcf914f',
  },
  'sessions-pack': {
    name: 'Sessions pack', price: '$530', kicker: 'Membership',
    note: '30 sessions to use within 4 months.',
    url: 'https://momentumfitness.pushpress.com/landing/plans/plan_c91c1ec21da043',
  },
  'family-member': {
    name: 'Family member add-on', price: '$150/mo', kicker: 'Membership',
    note: 'Unlimited for each additional family member: spouses, kids, and so on.',
    url: 'https://momentumfitness.pushpress.com/landing/plans/plan_dffea5af4a594d',
  },
  'military-first-responders': {
    name: 'Military & first responders', price: '$160/mo', kicker: 'Membership',
    note: 'Unlimited membership. Thank you for your service.',
    url: 'https://momentumfitness.pushpress.com/landing/plans/plan_245502517a7647',
  },
};

(() => {
  const doc = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const track = (e, p) => window.mfTrack && window.mfTrack(e, p);
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ------------------------------ Smooth scroll: desktop pointer only */
  let lenis = null;
  if (!reduce && fine && typeof Lenis !== 'undefined' && innerWidth > 900) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }

  /* ------------------------------ Nav: dock, hide on the way down, show on the way up */
  const nav = $('#nav');
  let lastY = scrollY;
  const navState = () => {
    const y = scrollY;
    if (!nav) return;
    nav.classList.toggle('is-scrolled', y > 40);
    const hide = y > 400 && y > lastY + 4 && !doc.classList.contains('drawer-open') && !nav.contains(document.activeElement);
    if (hide) nav.classList.add('is-hidden');
    else if (y < lastY - 4 || y < 400) nav.classList.remove('is-hidden');
    lastY = y;
  };
  addEventListener('scroll', navState, { passive: true });
  navState();

  /* ------------------------------ Mobile drawer */
  const burger = $('#burger'), drawer = $('#drawer');
  if (burger && drawer) {
    const setOpen = (open) => {
      drawer.classList.toggle('is-open', open);
      drawer.toggleAttribute('inert', !open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      doc.classList.toggle('drawer-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      if (lenis) open ? lenis.stop() : lenis.start();
      if (open) setTimeout(() => $('a', drawer)?.focus(), 250);
    };
    drawer.setAttribute('inert', '');
    burger.addEventListener('click', () => setOpen(burger.getAttribute('aria-expanded') !== 'true'));
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && drawer.classList.contains('is-open')) { setOpen(false); burger.focus(); } });
    // keep Tab inside the open menu (burger + drawer links)
    drawer.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const f = [burger, ...$$('a, button', drawer)];
      const i = f.indexOf(document.activeElement);
      if (e.shiftKey && i === 1) { e.preventDefault(); burger.focus(); }
      if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); burger.focus(); }
    });
    burger.addEventListener('keydown', (e) => {
      if (e.key === 'Tab' && !e.shiftKey && drawer.classList.contains('is-open')) { e.preventDefault(); $('a', drawer).focus(); }
    });
  }

  /* ------------------------------ Page transitions (brand curtain) */
  if (!reduce) {
    if (doc.classList.contains('is-entering')) {
      const clear = () => doc.classList.remove('is-entering');
      doc.addEventListener('animationend', clear, { once: true });
      setTimeout(clear, 1000);
    }
    let leaving = false;
    document.addEventListener('click', (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || leaving) return;
      const a = e.target.closest && e.target.closest('a[href]');
      if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || /^(tel:|sms:|mailto:|javascript:)/i.test(href)) return;
      let url; try { url = new URL(a.href, location.href); } catch (err) { return; }
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname) return;
      e.preventDefault(); leaving = true;
      try { sessionStorage.setItem('mf-nav', '1'); } catch (err) {}
      doc.classList.add('is-leaving');
      setTimeout(() => { location.href = url.href; }, 460);
    });
    addEventListener('pageshow', (e) => { if (e.persisted) { leaving = false; doc.classList.remove('is-leaving', 'is-entering'); } });
  }

  /* ------------------------------ Tracking on contact links */
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    const h = a.getAttribute('href') || '';
    if (h.startsWith('tel:')) track('phone_click', { method: 'call' });
    else if (h.startsWith('sms:')) track('phone_click', { method: 'text' });
    else if (h.startsWith('mailto:')) track('email_click');
  });

  /* ------------------------------ Headline word reveal */
  $$('[data-split]').forEach((el) => {
    if (reduce) return;
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    let i = 0;
    const walk = (node) => {
      Array.from(node.childNodes).forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span'); w.className = 'w'; w.setAttribute('aria-hidden', 'true');
            const s = document.createElement('span'); s.textContent = part; s.style.setProperty('--i', i++);
            w.appendChild(s); frag.appendChild(w);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName === 'EM') {
          // gradient text breaks if its letters get their own boxes, so the em moves as one word
          const w = document.createElement('span'); w.className = 'w'; w.setAttribute('aria-hidden', 'true');
          const s = document.createElement('span'); s.style.setProperty('--i', i++);
          n.parentNode.replaceChild(w, n); s.appendChild(n); w.appendChild(s);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
      });
    };
    walk(el);
    el.classList.add('split');
  });

  /* ------------------------------ Reveal on enter */
  const io = new IntersectionObserver((ents) => ents.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  }), { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });
  $$('.split, .rv, .phero__media').forEach((el) => io.observe(el));
  // the hero headline should not wait for a scroll
  $$('.hero .split, .phero .split').forEach((el) => requestAnimationFrame(() => el.classList.add('in')));

  /* ------------------------------ Scroll-linked effects (one rAF loop) */
  const hero = $('.hero');
  const crewCols = $$('.crew__col');
  const crew = $('.crew');
  const banners = $$('.banner');
  const hrail = $('.hrail');
  const hrailTrack = hrail && $('.hrail__track', hrail);
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

  const sizeHrail = () => {
    if (!hrail || reduce || innerWidth <= 900) { if (hrail) hrail.style.height = ''; return; }
    const extra = hrailTrack.scrollWidth - innerWidth;
    hrail.style.height = (innerHeight + Math.max(0, extra)) + 'px';
  };
  sizeHrail();
  addEventListener('resize', sizeHrail);
  addEventListener('load', sizeHrail);

  let ticking = false;
  const frame = () => {
    ticking = false;
    const vh = innerHeight;
    if (hero && !reduce) {
      const r = hero.getBoundingClientRect();
      const span = r.height - vh;
      const p = span > 40 ? clamp(-r.top / span) : 0;
      hero.style.setProperty('--p', p.toFixed(4));
    }
    if (crew && crewCols.length && !reduce) {
      const r = crew.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) {
        const p = (vh - r.top) / (vh + r.height);
        const speeds = [-260, 120, -380];
        crewCols.forEach((c, i) => { c.style.transform = `translate3d(0, ${(p - .3) * speeds[i % 3]}px, 0)`; });
      }
    }
    if (!reduce) banners.forEach((b) => {
      const r = b.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) {
        const p = (r.top + r.height / 2 - vh / 2) / vh;
        b.style.setProperty('--py', (p * -60).toFixed(1));
      }
    });
    if (hrail && hrailTrack && !reduce && innerWidth > 900) {
      const r = hrail.getBoundingClientRect();
      const dist = hrail.offsetHeight - vh;
      const p = clamp(-r.top / Math.max(1, dist));
      hrailTrack.style.transform = `translate3d(${-p * Math.max(0, hrailTrack.scrollWidth - innerWidth)}px, 0, 0)`;
    }
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  frame();

  /* ------------------------------ The Best Hour: copy walks past a card that holds */
  const steps = $$('.hour__step');
  if (steps.length) {
    const frames = $$('.hour__frame');
    const rail = $$('.hour__rail button');
    const clock = $('.hour__clock');
    let cur = -1;
    const set = (i) => {
      if (i === cur) return;
      frames.forEach((f, k) => { f.classList.toggle('was-on', k === cur); f.classList.toggle('is-on', k === i); });
      steps.forEach((s, k) => s.classList.toggle('is-on', k === i));
      rail.forEach((b, k) => { b.classList.toggle('is-on', k === i); b.classList.toggle('is-past', k < i); b.setAttribute('aria-current', k === i ? 'step' : 'false'); });
      if (clock) clock.textContent = steps[i].dataset.clock;
      cur = i;
    };
    set(0);
    const sio = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (en.isIntersecting) set(steps.indexOf(en.target));
    }), { rootMargin: '-45% 0px -45% 0px' });
    steps.forEach((s) => sio.observe(s));
    rail.forEach((b, k) => b.addEventListener('click', () => {
      const y = steps[k].getBoundingClientRect().top + scrollY - innerHeight * 0.3;
      lenis ? lenis.scrollTo(y) : scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
    }));
  }

  /* ------------------------------ Horizontal rails with prev / next */
  $$('[data-rail]').forEach((wrap) => {
    const rail = $('.coaches__rail', wrap) || wrap.querySelector('[data-rail-track]');
    const prev = $('[data-prev]', wrap), next = $('[data-next]', wrap);
    if (!rail) return;
    const step = () => (rail.firstElementChild?.getBoundingClientRect().width || 300) + 18;
    const upd = () => {
      if (prev) prev.disabled = rail.scrollLeft < 8;
      if (next) next.disabled = rail.scrollLeft + rail.clientWidth > rail.scrollWidth - 8;
    };
    prev && prev.addEventListener('click', () => rail.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' }));
    next && next.addEventListener('click', () => rail.scrollBy({ left: step(), behavior: reduce ? 'auto' : 'smooth' }));
    rail.addEventListener('scroll', upd, { passive: true });
    addEventListener('resize', upd); upd();
    // drag to scroll with a mouse
    if (fine) {
      let down = false, sx = 0, sl = 0, moved = false;
      rail.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft; rail.style.scrollSnapType = 'none'; });
      addEventListener('pointermove', (e) => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 4) moved = true; rail.scrollLeft = sl - dx; });
      addEventListener('pointerup', () => { if (!down) return; down = false; rail.style.scrollSnapType = ''; });
      rail.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
    }
  });

  /* ------------------------------ Marquee pause (WCAG 2.2.2) */
  $$('.marquee').forEach((m) => {
    const b = $('.marquee__pause', m);
    b && b.addEventListener('click', () => {
      const p = m.classList.toggle('is-paused');
      b.setAttribute('aria-label', p ? 'Play scrolling text' : 'Pause scrolling text');
      b.textContent = p ? '▶' : '❚❚';
    });
  });

  /* ------------------------------ Open now (gym is on US Central time) */
  const HOURS = { 0: [], 1: [[300, 690], [1020, 1110]], 2: [[300, 690], [1020, 1110]], 3: [[300, 690], [1020, 1110]], 4: [[300, 690], [1020, 1110]], 5: [[300, 690]], 6: [[360, 600]] };
  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const fmt = (m) => { const h = Math.floor(m / 60), mm = m % 60, ap = h >= 12 ? 'p' : 'a'; return `${((h + 11) % 12) + 1}${mm ? ':' + String(mm).padStart(2, '0') : ''}${ap}`; };
  $$('[data-status]').forEach((el) => {
    let now;
    try {
      const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
      const g = (t) => parts.find((p) => p.type === t).value;
      now = { d: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(g('weekday')), m: (+g('hour') % 24) * 60 + +g('minute') };
    } catch (e) { return; }
    const open = HOURS[now.d].find(([a, b]) => now.m >= a && now.m < b);
    const label = $('span', el);
    if (open) { el.classList.add('is-open'); label.textContent = `Open now. Doors close at ${fmt(open[1])}.`; }
    else {
      let d = now.d, first = true, next = null;
      for (let k = 0; k < 8 && !next; k++) {
        const w = HOURS[d].find(([a]) => !first || a > now.m);
        if (w) next = { d, m: w[0], k };
        d = (d + 1) % 7; first = false;
      }
      if (next) label.textContent = `Closed right now. Next up: ${next.k === 0 ? 'today' : next.k === 1 ? 'tomorrow' : DAYS[next.d]} at ${fmt(next.m)}.`;
    }
    const row = $(`[data-day="${now.d}"]`);
    row && row.classList.add('is-today');
  });

  /* ------------------------------ Mission line lights up word by word */
  const mission = $('[data-light]');
  if (mission && !reduce) {
    const parts = $$('.dim', mission);
    const lio = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (!en.isIntersecting) return;
      parts.forEach((p, i) => setTimeout(() => p.classList.add('lit'), i * 220));
      lio.disconnect();
    }), { threshold: 0.6 });
    lio.observe(mission);
  } else if (mission) $$('.dim', mission).forEach((p) => p.classList.add('lit'));

  /* ------------------------------ Plan cards tilt toward the pointer */
  if (fine && !reduce) $$('.plan').forEach((c) => {
    c.addEventListener('pointermove', (e) => {
      const r = c.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      c.style.setProperty('--tilt-y', (x * 7).toFixed(2) + 'deg');
      c.style.setProperty('--tilt-x', (-y * 7).toFixed(2) + 'deg');
    });
    c.addEventListener('pointerleave', () => { c.style.setProperty('--tilt-x', '0deg'); c.style.setProperty('--tilt-y', '0deg'); });
  });

  /* ------------------------------ Footer wordmark letters */
  $$('.footer__word').forEach((w) => {
    const t = w.textContent; w.textContent = '';
    w.setAttribute('aria-hidden', 'true');
    [...t].forEach((ch, i) => { const s = document.createElement('span'); s.textContent = ch; s.style.setProperty('--i', i); w.appendChild(s); });
    if (reduce || !('IntersectionObserver' in window)) return;
    // wave runs every time the footer comes into view, hover still works after it ends
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { w.classList.remove('is-wave'); void w.offsetWidth; w.classList.add('is-wave'); }
      else w.classList.remove('is-wave');
    }, { threshold: .6 }).observe(w);
  });

  /* ------------------------------ Price board: numbers count up when they come into view */
  const counts = $$('[data-count]');
  if (counts.length && !reduce && 'IntersectionObserver' in window) {
    const cio = new IntersectionObserver((ents) => ents.forEach((e) => {
      if (!e.isIntersecting) return;
      cio.unobserve(e.target);
      const el = e.target, to = +el.dataset.count, t0 = performance.now(), dur = 1100;
      const step = (t) => { const k = Math.min((t - t0) / dur, 1); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }), { threshold: .6 });
    counts.forEach((c) => cio.observe(c));
  }

  /* ------------------------------ Sunset cursor: blob that streaks with speed, becomes a labeled pill on buttons */
  if (fine) {
    const cur = document.createElement('div');
    cur.className = 'sun-cur'; cur.setAttribute('aria-hidden', 'true');
    cur.innerHTML = '<div class="sun-cur__blob"><span></span></div>';
    document.body.appendChild(cur);
    const blob = cur.firstChild, lab = blob.firstChild;
    doc.classList.add('cur-on');
    const PILL = '.btn, [data-plan], [data-cursor], summary, .nav__cta';
    const labelFor = (el) => {
      if (el.dataset.cursor) return el.dataset.cursor;
      if (el.matches('summary')) return el.parentElement.open ? 'Close' : 'Open';
      if (el.dataset.plan === 'trial') return 'Try free';
      if (el.dataset.plan) return 'Join';
      const h = el.getAttribute('href') || '';
      if (h.startsWith('tel:')) return 'Call';
      if (h.startsWith('sms:')) return 'Text';
      if (h.startsWith('mailto:')) return 'Email';
      if (/maps\./.test(h)) return 'Directions';
      if (el.target === '_blank') return 'Open';
      return 'Go';
    };
    const p = { x: -100, y: -100, lx: -100, ly: -100, sp: 0, ax: -100, ay: -100 };
    let seen = false, under = null, dirty = false;
    const read = (t) => {
      if (!t || !t.closest) return;
      const field = t.closest('input, textarea, select, iframe, [contenteditable]');
      const pill = !field && t.closest(PILL);
      const link = !field && !pill && t.closest('a, button, label, [role="button"]');
      cur.classList.toggle('is-field', !!field);
      cur.classList.toggle('is-link', !!link);
      cur.classList.toggle('is-pill', !!pill);
      if (pill && pill !== under) {
        lab.textContent = labelFor(pill);
        cur.style.setProperty('--pw', Math.max(78, lab.textContent.length * 9 + 44) + 'px');
      }
      under = pill || null;
    };
    addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      p.x = e.clientX; p.y = e.clientY;
      if (!seen) { seen = true; p.ax = p.lx = p.x; p.ay = p.ly = p.y; }
      cur.classList.add('is-on');
      read(e.target);
    }, { passive: true });
    // scrolling moves the page under a still mouse, so re-check what is under it
    addEventListener('scroll', () => { dirty = true; }, { passive: true });
    addEventListener('click', () => { dirty = true; });
    document.addEventListener('mouseout', (e) => { if (!e.relatedTarget) cur.classList.remove('is-on'); });
    const loop = () => {
      const modal = document.querySelector('dialog[open]');
      doc.classList.toggle('cur-on', !modal);
      if (modal) cur.classList.remove('is-on');
      if (dirty && seen) { dirty = false; under = null; read(document.elementFromPoint(p.x, p.y)); }
      const vx = p.x - p.lx, vy = p.y - p.ly; p.lx = p.x; p.ly = p.y;
      p.sp += (Math.hypot(vx, vy) - p.sp) * .2;
      p.ax += (p.x - p.ax) * .22; p.ay += (p.y - p.ay) * .22;
      cur.style.transform = `translate(${p.ax}px,${p.ay}px)`;
      const str = (reduce || under || cur.classList.contains('is-link')) ? 1 : 1 + Math.min(p.sp / 22, 1.6);
      blob.style.transform = str > 1.04 ? `rotate(${Math.atan2(vy, vx)}rad) scale(${str},${1 / Math.sqrt(str)})` : 'none';
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  /* ------------------------------ Checkout drawer (PushPress inside the site) */
  const dlg = $('#checkout');
  if (dlg) {
    const body = $('.checkout__body', dlg);
    const title = $('.checkout__title', dlg), kicker = $('.checkout__kicker', dlg), note = $('.checkout__note', dlg), ext = $('[data-ext]', dlg);
    let frameEl = null, opener = null, loadTimer = null;
    const close = () => {
      if (!dlg.open) return;
      dlg.classList.add('is-closing');
      setTimeout(() => {
        dlg.classList.remove('is-closing'); dlg.close();
        if (frameEl) { frameEl.remove(); frameEl = null; }
        body.classList.remove('is-loaded');
        document.body.style.overflow = ''; if (lenis) lenis.start();
        opener && opener.focus();
      }, reduce ? 0 : 330);
    };
    const open = (key, btn) => {
      const plan = PLANS[key];
      if (!plan) return;
      opener = btn;
      title.textContent = plan.name;
      kicker.textContent = `${plan.kicker} · ${plan.price}`;
      note.textContent = plan.note;
      ext.href = plan.url;
      frameEl = document.createElement('iframe');
      frameEl.title = `${plan.name} checkout, powered by PushPress`;
      frameEl.src = plan.url;
      frameEl.setAttribute('allow', 'payment');
      frameEl.addEventListener('load', () => { body.classList.add('is-loaded'); clearTimeout(loadTimer); });
      body.appendChild(frameEl);
      // if PushPress is slow or blocked, the "open in a new tab" link is already on screen
      loadTimer = setTimeout(() => body.classList.add('is-loaded'), 9000);
      document.body.style.overflow = 'hidden'; if (lenis) lenis.stop();
      dlg.showModal();
      $('.checkout__close', dlg).focus();
      track('checkout_open', { plan: key, price: plan.price });
      if (key === 'trial') track('trial_click', { location: btn?.dataset.loc || location.pathname });
    };
    document.addEventListener('click', (e) => {
      const b = e.target.closest && e.target.closest('[data-plan]');
      if (!b) return;
      // tiny screens and anything without dialog support just go to PushPress
      if (typeof dlg.showModal !== 'function') return;
      e.preventDefault();
      open(b.dataset.plan, b);
    });
    $('.checkout__close', dlg).addEventListener('click', close);
    dlg.addEventListener('cancel', (e) => { e.preventDefault(); close(); });
    dlg.addEventListener('click', (e) => { if (e.target === dlg) close(); });
  }
  // every [data-plan] is a real link to PushPress, so it still works with JS off
  $$('[data-plan]').forEach((b) => {
    const p = PLANS[b.dataset.plan];
    if (p && b.tagName === 'A') { b.href = p.url; b.target = '_blank'; b.rel = 'noopener'; }
  });

  /* ------------------------------ Contact form -> /api/contact (Resend) */
  const form = $('#contact-form');
  if (form) {
    const status = $('.form__status', form);
    const btn = $('button[type=submit]', form);
    const pre = new URLSearchParams(location.search).get('topic');
    if (pre) { const r = form.querySelector(`input[name=topic][value="${pre}"]`); if (r) r.checked = true; }
    const setErr = (input, msg) => {
      const id = input.id + '-err';
      let el = document.getElementById(id);
      if (!msg) { input.removeAttribute('aria-invalid'); el && el.remove(); return; }
      input.setAttribute('aria-invalid', 'true');
      if (!el) { el = document.createElement('p'); el.id = id; el.className = 'err'; input.after(el); input.setAttribute('aria-describedby', id); }
      el.textContent = msg;
    };
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.className = 'form__status'; status.textContent = '';
      const name = form.elements.name, email = form.elements.email, phone = form.elements.phone, msg = form.elements.message;
      let bad = null;
      setErr(name, name.value.trim() ? '' : 'Please add your name.'); if (!name.value.trim()) bad = bad || name;
      const hasEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value.trim());
      const hasPhone = phone.value.replace(/\D/g, '').length >= 10;
      setErr(email, hasEmail || hasPhone ? '' : 'Add an email or a phone number so we can get back to you.');
      if (!hasEmail && !hasPhone) bad = bad || email;
      setErr(msg, msg.value.trim() ? '' : 'Tell us what is on your mind.'); if (!msg.value.trim()) bad = bad || msg;
      if (bad) { bad.focus(); return; }
      const topic = (form.querySelector('input[name=topic]:checked') || {}).value || 'Something else';
      btn.setAttribute('aria-busy', 'true'); const label = btn.innerHTML; btn.textContent = 'Sending…';
      try {
        const r = await fetch('/api/contact', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name.value, email: email.value, phone: phone.value, topic, message: msg.value, company: form.elements.company.value, page: location.pathname }),
        });
        const j = await r.json().catch(() => ({}));
        if (!r.ok || !j.ok) throw new Error(j.error || 'send_failed');
        status.className = 'form__status is-ok';
        status.textContent = `Got it, ${name.value.trim().split(' ')[0]}. A real person will get back to you soon. If it is urgent, text 850-502-3454.`;
        form.reset();
        track('generate_lead', { topic });
      } catch (err) {
        status.className = 'form__status is-err';
        status.innerHTML = 'That did not send. Please text us at <a href="sms:+18505023454">850-502-3454</a> or email <a href="mailto:info@momentum.fit">info@momentum.fit</a> instead.';
      } finally {
        btn.removeAttribute('aria-busy'); btn.innerHTML = label;
        status.focus();
      }
    });
  }
})();
