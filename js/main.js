/* Esports Trading: interactions (no dependencies) */
(function () {
  'use strict';
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- page ready / hero reveal ---------- */
  requestAnimationFrame(() => document.body.classList.add('is-ready'));

  /* ---------- nav ---------- */
  const nav = $('#nav');
  const burger = $('#burger');
  const progress = $('#progress');
  const links = $$('.nav__links a');
  const pill = $('.nav__pill');
  let lastY = window.scrollY;
  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 40);
    if (!nav.classList.contains('is-open')) nav.classList.toggle('is-hidden', y > lastY && y > 500);
    lastY = y;
    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (burger) burger.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
    nav.classList.remove('is-hidden');
  });
  $$('.nav__mobile a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); }));

  /* sliding pill + active section (scroll based, font-safe) */
  function movePill(a) {
    if (!pill || !a) return;
    pill.style.left = a.offsetLeft + 'px';
    pill.style.width = a.offsetWidth + 'px';
    pill.classList.add('is-on');
  }
  let active = null, hovering = false;
  const sections = links.map(a => { const h = a.getAttribute('href') || ''; return { a, el: h.startsWith('#') && h.length > 1 ? $(h) : null }; }).filter(x => x.el);
  function updateActive() {
    const mid = window.innerHeight * 0.45;
    let cur = null;
    for (const s of sections) {
      const r = s.el.getBoundingClientRect();
      if (r.top <= mid && r.bottom > mid) { cur = s.a; break; }
    }
    if (cur === active) return;
    active = cur;
    links.forEach(a => a.classList.toggle('is-active', a === active));
    if (!hovering) { active ? movePill(active) : pill && pill.classList.remove('is-on'); }
  }
  links.forEach(a => {
    a.addEventListener('pointerenter', () => { hovering = true; movePill(a); });
    a.addEventListener('pointerleave', () => { hovering = false; active ? movePill(active) : pill.classList.remove('is-on'); });
  });
  window.addEventListener('scroll', updateActive, { passive: true });
  window.addEventListener('resize', () => active && movePill(active));
  const navInner = $('.nav__inner');
  if (navInner) navInner.addEventListener('transitionend', (e) => { if (e.propertyName === 'width' && !hovering) active ? movePill(active) : null; });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { active && movePill(active); });
  updateActive();


  /* ---------- footer bars ---------- */
  const bars = $('.footer__bars');
  if (bars) {
    const n = Math.min(72, Math.max(28, Math.floor(window.innerWidth / 22)));
    const frag = document.createDocumentFragment();
    for (let i = 0; i < n; i++) {
      const b = document.createElement('span');
      b.style.setProperty('--h', (0.25 + Math.random() * 0.75).toFixed(2));
      b.style.setProperty('--dl', (-Math.random() * 3.6).toFixed(2) + 's');
      if (Math.random() < 0.22) b.className = 'dn';
      frag.appendChild(b);
    }
    bars.appendChild(frag);
  }

  /* ---------- scroll reveal ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      el.style.setProperty('--d', (el.dataset.delay || 0) + 'ms');
      el.classList.add('is-in');
      io.unobserve(el);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  $$('.reveal, .post, .becomes li').forEach(el => io.observe(el));

  /* ---------- card spotlight ---------- */
  $$('.card').forEach(card => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* ---------- ecosystem hive ---------- */
  const hive = $('#hive');
  if (hive) {
    const cells = $$('.hex[data-img]', hive);
    const detail = $('#ecoDetail'), eImg = $('#ecoImg'), eTitle = $('#ecoTitle'), eText = $('#ecoText');
    let idx = 0, auto = null;
    function show(i) {
      idx = i; const n = cells[i];
      cells.forEach((x, k) => x.classList.toggle('is-active', k === i));
      if (eImg.getAttribute('src').indexOf(n.dataset.img) === -1) {
        detail.classList.remove('is-swap'); void detail.offsetWidth; detail.classList.add('is-swap');
        eImg.src = 'assets/img/' + n.dataset.img + '.webp'; eTitle.textContent = n.dataset.title; eText.textContent = n.dataset.text;
      }
    }
    function start() { clearInterval(auto); if (!reduced) auto = setInterval(() => show((idx + 1) % cells.length), 2600); }
    cells.forEach((n, i) => { n.addEventListener('pointerenter', () => { show(i); clearInterval(auto); }); n.addEventListener('click', () => show(i)); n.addEventListener('focus', () => show(i)); });
    hive.addEventListener('pointerleave', start);
    start();
  }

  /* ---------- leaderboard shuffle + live viewers ---------- */
  const board = $('#board');
  if (board && !reduced) {
    setInterval(() => {
      const rows = $$('li', board); const i = 1 + Math.floor(Math.random() * (rows.length - 1));
      const a = rows[i], b = rows[i - 1];
      a.classList.add('is-up'); b.classList.add('is-down');
      setTimeout(() => { a.classList.remove('is-up'); b.classList.remove('is-down'); board.insertBefore(a, b); rows.forEach(r => {}); $$('li span', board).forEach((s, k) => s.textContent = k + 1); }, 800);
    }, 3200);
  }

  /* ---------- staged brackets ---------- */
  $$('.bracket').forEach(svg => {
    const rounds = svg.querySelectorAll('.bracket__r').length;
    const legend = svg.previousElementSibling && svg.previousElementSibling.classList.contains('bracket__legend') ? svg.previousElementSibling : null;
    let stage = 1, timer = null;
    function paint() {
      svg.dataset.stage = stage;
      if (legend) $$('span', legend).forEach(sp => { const n = +sp.dataset.legend; sp.classList.toggle('is-on', n === stage); sp.classList.toggle('is-done', n < stage); });
    }
    function run() { clearInterval(timer); if (reduced) { stage = rounds; paint(); return; } timer = setInterval(() => { stage = stage % rounds + 1; paint(); }, 1800); }
    paint();
    new IntersectionObserver(([e]) => { e.isIntersecting ? run() : clearInterval(timer); }, { threshold: .3 }).observe(svg);
  });

  /* ---------- closing band parallax ---------- */
  const closingPhoto = $('#closingPhoto');
  if (closingPhoto && !reduced) {
    const sec = closingPhoto.parentElement;
    window.addEventListener('scroll', () => {
      const r = sec.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      const p = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
      closingPhoto.style.translate = '0 ' + (p * -60).toFixed(1) + 'px';
    }, { passive: true });
  }

  /* ---------- generic counters ---------- */
  $$('.league__stats b[data-count]').forEach(el => {
    new IntersectionObserver(([e], o) => {
      if (!e.isIntersecting) return; o.disconnect();
      const end = +el.dataset.count, t0 = performance.now();
      (function step(now) { const p = Math.min(1, (now - t0) / 1600); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); })(t0);
    }, { threshold: .5 }).observe(el);
  });

  /* ---------- custom cursor ---------- */
  const cursor = $('.cursor');
  if (cursor && matchMedia('(hover: hover)').matches && !reduced) {
    let cx = 0, cy = 0, tx = 0, ty = 0;
    window.addEventListener('pointermove', (e) => { tx = e.clientX; ty = e.clientY; cursor.classList.add('is-on'); }, { passive: true });
    document.addEventListener('mouseleave', () => cursor.classList.remove('is-on'));
    $$('a, button, .bento__card, .xp__slide, .steps li, .hex').forEach(el => {
      el.addEventListener('pointerenter', () => cursor.classList.add('is-hover'));
      el.addEventListener('pointerleave', () => cursor.classList.remove('is-hover'));
    });
    (function loop() {
      cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- hero: parallax photo + counter ---------- */
  const heroPhoto = $('#heroPhoto');
  if (heroPhoto && !reduced && matchMedia('(hover:hover)').matches) {
    let px = 0, py = 0, tx = 0, ty = 0;
    window.addEventListener('pointermove', (e) => { tx = (e.clientX / window.innerWidth - .5) * 2; ty = (e.clientY / window.innerHeight - .5) * 2; }, { passive: true });
    (function loop() { px += (tx - px) * .04; py += (ty - py) * .04; heroPhoto.style.transform = `translate(${px * -14}px, ${py * -10}px)`; requestAnimationFrame(loop); })();
  }
  const heroCount = $('#heroCount');
  if (heroCount) {
    const end = +heroCount.dataset.count;
    const fmtN = (v) => '$' + (v >= 1e9 ? (v / 1e9).toFixed(1) + 'B' : v >= 1e6 ? Math.round(v / 1e6) + 'M' : v.toLocaleString());
    if (reduced) heroCount.textContent = fmtN(end);
    else setTimeout(() => { const t0 = performance.now(); (function step(now) { const p = Math.min(1, (now - t0) / 2600); heroCount.textContent = fmtN(Math.round(end * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(step); })(t0); }, 900);
  }

  /* ---------- expanding formats carousel ---------- */
  const xp = $('#xp');
  if (xp) {
    const slides = $$('.xp__slide', xp);
    const dots = $('#xpDots');
    const DUR = 5000;
    let cur = 0, timer = null, paused = false;
    xp.style.setProperty('--xp-dur', DUR + 'ms');
    slides.forEach((s, i) => {
      const d = document.createElement('button');
      d.type = 'button'; d.setAttribute('role', 'tab'); d.setAttribute('aria-label', 'Show format ' + (i + 1));
      d.addEventListener('click', () => go(i, true));
      dots.appendChild(d);
    });
    const dotEls = $$('button', dots);
    function go(i, user) {
      cur = (i + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle('is-active', k === cur));
      dotEls.forEach((d, k) => d.classList.toggle('is-active', k === cur));
      if (user) restart();
    }
    function restart() { clearInterval(timer); if (!reduced) timer = setInterval(() => { if (!paused) go(cur + 1); }, DUR); }
    slides.forEach((s, i) => {
      s.addEventListener('click', (e) => { if (i !== cur) { e.preventDefault(); go(i, true); } });
      s.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse' && i !== cur) go(i, true); });
    });
    xp.addEventListener('pointerenter', () => { paused = true; xp.classList.add('is-paused'); });
    xp.addEventListener('pointerleave', () => { paused = false; xp.classList.remove('is-paused'); });
    $('#xpPrev').addEventListener('click', () => go(cur - 1, true));
    $('#xpNext').addEventListener('click', () => go(cur + 1, true));
    xp.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') go(cur + 1, true); if (e.key === 'ArrowLeft') go(cur - 1, true); });
    new IntersectionObserver(([e]) => { e.isIntersecting ? restart() : clearInterval(timer); }, { threshold: .3 }).observe(xp);
    go(0);
  }

  /* ---------- updates form ----------
     Set the form's action attribute to your list endpoint (Mailchimp, ConvertKit,
     Formspree, or your own API). Without an action it confirms locally only. */
  const form = $('#updatesForm');
  if (form) {
    const note = $('#updatesNote'), input = $('#email');
    const say = (msg, cls) => { note.textContent = msg; note.className = 'updates__note' + (cls ? ' ' + cls : ''); form.classList.toggle('is-error', cls === 'is-error'); };
    input.addEventListener('input', () => { if (form.classList.contains('is-error')) say('No spam. Unsubscribe anytime.'); });
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = input.value.trim();
      if (!email) { say('Enter your email address to subscribe.', 'is-error'); input.focus(); return; }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(email)) { say('That email address does not look right. Please check it.', 'is-error'); input.focus(); return; }
      const action = form.getAttribute('action');
      if (action) {
        try {
          const res = await fetch(action, { method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
          if (!res.ok) throw new Error('bad status');
        } catch (err) { say('Something went wrong. Please try again in a moment.', 'is-error'); return; }
      }
      form.classList.add('is-done');
      say('You are in. Welcome to the movement.', 'is-ok');
    });
  }

  /* ---------- contact form ---------- */
  const cform = $('#contactForm');
  if (cform) {
    const note = $('#contactNote'), btn = $('button[type="submit"]', cform);
    const fields = { name: $('#cName'), email: $('#cEmail'), message: $('#cMessage') };
    const defaultNote = note.textContent;
    const say = (msg, err) => { note.textContent = msg; note.classList.toggle('is-error', !!err); };
    Object.values(fields).forEach(f => f.addEventListener('input', () => { f.classList.remove('is-invalid'); if (note.classList.contains('is-error')) say(defaultNote); }));
    cform.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = { name: fields.name.value.trim(), email: fields.email.value.trim(), company: $('#cCompany').value.trim(), topic: $('#cTopic').value, message: fields.message.value.trim() };
      const bad = !data.name ? fields.name : !/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(data.email) ? fields.email : !data.message ? fields.message : null;
      if (bad) { bad.classList.add('is-invalid'); bad.focus(); say(bad === fields.email ? 'That email address does not look right. Please check it.' : 'Please fill in your name, email and message.', true); return; }
      if ($('#cHp').value) return;
      const action = cform.getAttribute('action');
      if (!action) { say('The contact form is not connected yet. Please try again soon.', true); return; }
      btn.disabled = true; say('Sending...');
      try {
        const res = await fetch(action, { method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, _subject: 'Esports Trading contact: ' + data.topic, _replyto: data.email, _template: 'table', _captcha: 'false' }) });
        if (!res.ok) throw new Error('bad status');
      } catch (err) { btn.disabled = false; say('Something went wrong. Please try again in a moment.', true); return; }
      cform.classList.add('is-done');
      $('.cform__done', cform).focus();
    });
  }
})();
