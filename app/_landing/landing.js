import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import Lenis from 'lenis'

/* ==========================================================================
   CONFIG + CONTENT (copy is verbatim from "Esports Trading Website Content")
   ========================================================================== */
const CONFIG = {
  // POST endpoint for newsletter signups (JSON body: { email }). Empty = not connected yet.
  newsletterEndpoint: '',
}


const DATA = {
  explorer: [
    { title: 'Head-to-Head', desc: 'Trader vs. Trader competitions put individual strategies against each other.' },
    { title: 'Team Competition', desc: 'Trading teams can compete against other organizations.' },
    { title: 'Tournaments', desc: 'Structured brackets and events bring multiple competitors together to determine champions.' },
    { title: 'Live Spectating', desc: 'Audiences can follow competitions, watch strategies unfold, and experience markets from a new perspective.' },
    { title: 'Rankings', desc: 'Competition results can create measurable records, rankings, streaks, and player histories.' },
    { title: 'Championships', desc: 'The strongest competitors can advance through organized competition toward major events and championship titles.' },
  ],
  // `rel` links are drawn only from relationships stated in the source copy.
  ecosystem: [
    { key: 'traders', name: 'Traders', desc: 'Individual competitors developing their skills and building competitive records.', rel: ['teams', 'fans'] },
    { key: 'teams', name: 'Trading Teams', desc: 'Organizations bring traders together under a shared identity.', rel: ['traders', 'fans'] },
    { key: 'platforms', name: 'Platforms', desc: 'Technology enabling structured trading competitions to occur around the world.', rel: ['tournaments'] },
    { key: 'leagues', name: 'Leagues', desc: 'Organizations creating seasons, competition structures, and championships.', rel: ['tournaments'] },
    { key: 'tournaments', name: 'Tournaments', desc: 'Independent and league-sanctioned events bringing competitors together.', rel: ['leagues', 'fans'] },
    { key: 'fans', name: 'Fans', desc: 'Spectators follow traders, teams, rivalries, tournaments, and championship events.', rel: ['traders', 'teams', 'tournaments'] },
  ],
  formats: [
    { title: '1v1 / PvP Trading', desc: 'Two traders. One competition. One winner.' },
    { title: 'Team vs. Team', desc: 'Organizations compete for team standings and championships.' },
    { title: 'Tournament Play', desc: 'Structured brackets. Bigger opportunities.' },
    { title: 'Creator & Exhibition Events', desc: 'Recognized traders, creators, and personalities compete in featured events.' },
    { title: 'Open Competition', desc: 'New competitors can enter events, establish records, and begin climbing the rankings.' },
  ],
  // Footer detail. Values are illustrative placeholders, labelled as such in the UI.
  data: [['MATCHES', '042'], ['MARKETS', '018'], ['TEAMS', '096'], ['PLAYERS', '428']],
}

/* ==========================================================================
   UTILS
   ========================================================================== */
gsap.registerPlugin(ScrollTrigger, SplitText)
ScrollTrigger.config({ ignoreMobileResize: true })
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

const $ = (s, c = document) => c.querySelector(s)
const $$ = (s, c = document) => [...c.querySelectorAll(s)]
const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches
const FINE = matchMedia('(hover: hover) and (pointer: fine)').matches
const BP = { desktop: '(min-width: 900px)', mobile: '(max-width: 899px)' }
const isMobile = () => innerWidth < 900
const pad = (n, l = 2) => String(n).padStart(l, '0')
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')

/** Scale an element's font-size so its `.fit-target` spans `ratio` of its parent width. */
const fitters = []
function fitText(el, { ratio = 1, maxVh = 100 } = {}) {
  const target = $('.fit-target', el) || el.firstElementChild || el
  const run = () => {
    el.style.fontSize = '100px'
    const w = target.getBoundingClientRect().width
    const p = el.parentElement, cs = getComputedStyle(p)
    const avail = (p.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)) * ratio
    const px = Math.min((100 * avail) / w, (innerHeight * maxVh) / 100)
    el.style.fontSize = `${px}px`
  }
  run()
  fitters.push(run)
  return run
}
ScrollTrigger.addEventListener('refreshInit', () => fitters.forEach((f) => f()))

/** Offset of `el` relative to `ancestor`, ignoring transforms. */
function offsetWithin(el, ancestor) {
  let x = 0, y = 0, n = el
  while (n && n !== ancestor) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight }
}

/* ==========================================================================
   SMOOTH SCROLL
   ========================================================================== */
const Scroll = {
  lenis: null,
  init() {
    window.scrollTo(0, 0)
    if (REDUCE || typeof Lenis === 'undefined') return
    this.lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, touchMultiplier: 1.2 })
    this.lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((t) => this.lenis.raf(t * 1000))
    gsap.ticker.lagSmoothing(0)
  },
  stop() { this.lenis?.stop(); document.documentElement.classList.add('is-locked') },
  start() { this.lenis?.start(); document.documentElement.classList.remove('is-locked') },
  to(target, offset = 0) {
    const el = typeof target === 'string' ? $(target) : target
    if (!el) return
    if (this.lenis) this.lenis.scrollTo(el, { offset, duration: 1.9, easing: (t) => 1 - Math.pow(1 - t, 4) })
    else el.scrollIntoView({ behavior: REDUCE ? 'auto' : 'smooth' })
  },
  bindAnchors() {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]')
      if (!a || a.getAttribute('href').startsWith('#/')) return
      const id = a.getAttribute('href')
      if (id === '#') return e.preventDefault()
      const target = $(id)
      if (!target) return
      e.preventDefault()
      Menu.close()
      Scroll.to(target)
    })
  },
}

/* ==========================================================================
   CUSTOM CURSOR
   ========================================================================== */
const Cursor = {
  init() {
    if (!FINE) return
    const el = $('.cursor'), label = $('.cursor__label')
    document.documentElement.classList.add('has-cursor')
    const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3' })
    let current = null
    this.pt = { x: -100, y: -100 }
    addEventListener('pointermove', (e) => { xTo(e.clientX); yTo(e.clientY); this.pt.x = e.clientX; this.pt.y = e.clientY }, { passive: true })
    this.update = (node) => {
      const t = node?.closest?.('[data-cursor], a, button, input') || null
      if (t === current) return
      current = t
      const text = t?.dataset.cursor
      el.classList.toggle('is-label', !!text)
      el.classList.toggle('is-link', !!t && !text && t.tagName !== 'INPUT')
      el.classList.toggle('is-hidden', t?.tagName === 'INPUT')
      if (text) label.textContent = text
    }
    document.addEventListener('pointerover', (e) => this.update(e.target))
    document.addEventListener('pointerleave', () => el.classList.add('is-hidden'))
    document.addEventListener('pointerenter', () => el.classList.remove('is-hidden'))
  },
  refresh() {
    // re-evaluate the element under the pointer after DOM state changes (open/close overlays)
    this.update?.(document.elementFromPoint(this.pt.x, this.pt.y))
  },
}

/* ==========================================================================
   NAVIGATION + MOBILE MENU
   ========================================================================== */
const Nav = {
  // pin the red E exactly over the wordmark's first-letter slot
  placeMark() {
    const nav = $('.nav'), mark = $('.nav__mark'), box = $('.brand-e'), svg = $('svg', box)
    box.style.height = `${nav.offsetHeight}px`
    box.style.width = `${mark.offsetLeft + mark.offsetWidth + 4}px`
    Object.assign(svg.style, { left: `${mark.offsetLeft}px`, top: `${mark.offsetTop}px`, width: `${mark.offsetWidth}px` })
  },
  init() {
    const nav = $('.nav')
    this.placeMark()
    ScrollTrigger.addEventListener('refreshInit', () => this.placeMark())
    gsap.set([nav, '.brand-e'], { yPercent: REDUCE ? 0 : -120 })
    let shown = true
    ScrollTrigger.create({
      start: () => innerHeight,
      end: 'max',
      onUpdate: (self) => {
        const show = self.direction < 0
        if (show === shown) return
        shown = show
        gsap.to([nav, '.brand-e'], { yPercent: show ? 0 : -120, duration: 0.8, ease: 'expo.out' })
      },
      onLeaveBack: () => { shown = true; gsap.to([nav, '.brand-e'], { yPercent: 0, duration: 0.8, ease: 'expo.out' }) },
    })
  },
  reveal() {
    gsap.to(['.nav', '.brand-e'], { yPercent: 0, duration: 1.2, ease: 'expo.out' })
    // the three bars of the E slide in from the left, one after another
    if (!REDUCE) gsap.from('.brand-e path', { xPercent: -60, opacity: 0, duration: 1.1, stagger: 0.09, ease: 'expo.out', delay: 0.2 })
  },
}

const Menu = {
  open: false,
  init() {
    this.btn = $('.nav__menu'); this.el = $('.menu')
    this.btn.addEventListener('click', () => (this.open ? this.close() : this.show()))
  },
  label(t) { const s = $('.roll > span', this.btn); s.textContent = t; s.dataset.text = t },
  show() {
    this.open = true
    this.label('Close')
    this.btn.setAttribute('aria-expanded', 'true'); this.el.setAttribute('aria-hidden', 'false')
    Scroll.stop()
    gsap.timeline()
      .set(this.el, { visibility: 'visible' })
      .to(this.el, { clipPath: 'inset(0 0 0% 0)', duration: 0.9, ease: 'expo.inOut' })
      .fromTo($$('.menu__links span'), { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.06, ease: 'expo.out' }, 0.4)
  },
  close() {
    if (!this.open) return
    this.open = false
    this.label('Menu')
    this.btn.setAttribute('aria-expanded', 'false'); this.el.setAttribute('aria-hidden', 'true')
    Scroll.start()
    gsap.to(this.el, { clipPath: 'inset(0 0 100% 0)', duration: 0.8, ease: 'expo.inOut', onComplete: () => gsap.set(this.el, { visibility: 'hidden' }) })
  },
}

/* ==========================================================================
   GENERIC REVEALS  — data-reveal="lines" | "rule", data-words (scrub light-up)
   ========================================================================== */
const Reveals = {
  init() {
    if (REDUCE) return
    $$('[data-reveal="lines"]').forEach((el) => {
      SplitText.create(el, {
        type: 'lines', mask: 'lines', linesClass: 'l', autoSplit: true,
        onSplit: (self) => gsap.from(self.lines, {
          yPercent: 110, duration: 1.35, ease: 'expo.out', stagger: 0.09,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        }),
      })
    })
    $$('[data-reveal="img"]').forEach((el) => {
      gsap.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: 'top 88%', once: true } })
      gsap.fromTo(el.firstElementChild, { scale: 1.3 }, { scale: 1, duration: 2.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } })
      gsap.fromTo(el.firstElementChild, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } })
    })
    $$('[data-reveal="rule"]').forEach((el) => {
      gsap.from(el, { scaleX: 0, duration: 1.8, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: 'top 90%', once: true } })
    })
    $$('[data-words]').forEach((el) => {
      const split = SplitText.create(el, { type: 'words' })
      gsap.fromTo(split.words, { opacity: 0.12 }, {
        opacity: 1, ease: 'none', stagger: 0.1,
        scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 45%', scrub: true },
      })
    })
    // Paper panels round-off as they reach the top: a small "sheet arriving" gesture.
    $$('.welcome, .league, .latest').forEach((el) => {
      gsap.fromTo(el, { borderTopLeftRadius: '3vw', borderTopRightRadius: '3vw' }, {
        borderTopLeftRadius: '0vw', borderTopRightRadius: '0vw', ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 60%', end: 'top top', scrub: true },
      })
    })
  },
}

/* ==========================================================================
   HERO — title sequence + scroll transformation
   ========================================================================== */
const Hero = {
  init() {
    const video = $('.hero__video')
    this.video = video
    // 4K for screens with the pixels to show it (4K monitors, retina laptops); 1440p otherwise
    const px = innerWidth * Math.min(devicePixelRatio || 1, 2)
    video.src = isMobile() ? '/media/video/hero-mobile.mp4' : px > 2600 ? '/media/video/hero-4k.mp4' : '/media/video/hero.mp4'
    video.addEventListener('error', () => { if (video.src.includes('-4k')) video.src = '/media/video/hero.mp4' }, { once: true })
    if (!REDUCE) {
      video.autoplay = true
      video.play().catch(() => {})
      // pause decoding when the hero is fully covered
      new IntersectionObserver(([e]) => (e.isIntersecting ? video.play().catch(() => {}) : video.pause())).observe($('.hero'))
    }
    this.timecode()
    this.scroll()
  },

  timecode() {
    const tc = $('.hero__tc'); let last = ''
    gsap.ticker.add(() => {
      const t = this.video.currentTime || 0
      const s = `TC 00:00:${pad(Math.floor(t))}:${pad(Math.floor((t % 1) * 24))}`
      if (s !== last) { tc.textContent = s; last = s }
    })
  },

  // Letters near the cursor thin out along Oswald's weight axis, like pressure lifting off the type.
  proximity() {
    if (!FINE || REDUCE || !this.pairs) return
    const hero = $('.hero')
    const setters = this.pairs.map(([a, b]) => [gsap.quickTo(a, '--wght', { duration: 0.9, ease: 'power3' }), gsap.quickTo(b, '--wght', { duration: 0.9, ease: 'power3' })])
    let centers = []
    const measure = () => { centers = this.pairs.map(([, c]) => { const r = c.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2] }) }
    const relax = () => setters.forEach(([a, b]) => { a(700); b(700) })
    measure()
    ScrollTrigger.addEventListener('refresh', measure)
    let live = true
    ScrollTrigger.create({ trigger: hero, start: 'top top', end: () => `+=${innerHeight * 0.25}`, onLeave: () => { live = false; relax() }, onEnterBack: () => { live = true; measure() } })
    hero.addEventListener('pointermove', (e) => {
      if (!live) return
      centers.forEach(([cx, cy], i) => {
        const d = Math.hypot((e.clientX - cx) * 0.9, (e.clientY - cy) * 0.6)
        const g = Math.exp(-((d / 240) ** 2))
        const w = 700 - 300 * g
        setters[i][0](w); setters[i][1](w)
      })
    }, { passive: true })
    hero.addEventListener('pointerleave', relax)
  },

  waitForVideo() {
    const v = this.video
    return new Promise((res) => {
      if (v.readyState >= 3) return res()
      const done = () => res()
      v.addEventListener('canplay', done, { once: true })
      v.addEventListener('error', done, { once: true })
      setTimeout(done, 3500)
    })
  },

  async intro() {
    const loader = $('.loader'), num = $('.loader__num'), bar = $('.loader__bar i')
    const counter = { v: 0 }
    const setNum = () => { num.textContent = pad(Math.round(counter.v), 3); gsap.set(bar, { scaleX: counter.v / 100 }) }

    if (REDUCE) {
      loader.remove(); Nav.reveal()
      const st = $('.hero__statement'); st.classList.add('is-static'); $('.welcome').prepend(st)
      return
    }

    Scroll.stop()
    const split = (sel) => SplitText.create(sel, { type: 'chars', mask: 'chars', charsClass: 'c' }).chars
    const lineE = split('.hero__type--line .hero__word--esports'), solidE = split('.hero__type--solid .hero__word--esports')
    const lineT = split('.hero__type--line .hero__word--trading'), solidT = split('.hero__type--solid .hero__word--trading')
    this.pairs = [...lineE.map((c, i) => [c, solidE[i]]), ...lineT.map((c, i) => [c, solidT[i]])]
    const support = SplitText.create('.hero__support-in', { type: 'lines', mask: 'lines', linesClass: 'l' })

    gsap.set([...lineE, ...solidE], { yPercent: 110 })
    gsap.set([...lineT, ...solidT], { yPercent: -110 })
    gsap.set('.hero__intro', { clipPath: 'inset(49.8vh 0vw 49.8vh 0vw)' })
    gsap.set('.hero__video', { scale: 1.2 })
    gsap.set(support.lines, { yPercent: 110 })
    gsap.set('.hero__ctas .u-link, .hero__meta > *, .hero__cue > *', { autoAlpha: 0, y: 16 })

    // loader: count to ~80 while the video buffers, then complete
    const counting = gsap.to(counter, { v: 82, duration: 1.4, ease: 'power2.out', onUpdate: setNum })
    await Promise.all([this.waitForVideo(), counting.then()])
    await gsap.to(counter, { v: 100, duration: 0.45, ease: 'power2.inOut', onUpdate: setNum }).then()
    this.video.currentTime = 0

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
    tl.to(num, { yPercent: -105, duration: 0.8, ease: 'expo.in' })
      .to(loader, { autoAlpha: 0, duration: 0.5, ease: 'power2.out' }, '-=.15')
      .set(loader, { display: 'none' })
      // 1 — ESPORTS rises as a hairline, then fills
      .to(lineE, { yPercent: 0, duration: 1.5, stagger: 0.05 }, '-=.2')
      .to(solidE, { yPercent: 0, duration: 1.5, stagger: 0.05 }, '<.38')
      // 2 — TRADING drops in the same way and stretches open
      .to(lineT, { yPercent: 0, duration: 1.5, stagger: { each: 0.05, from: 'end' } }, '<.1')
      .to(solidT, { yPercent: 0, duration: 1.5, stagger: { each: 0.05, from: 'end' } }, '<.38')
      .fromTo('.hero__word--trading', { letterSpacing: '.18em' }, { letterSpacing: '-.005em', duration: 2, ease: 'expo.inOut' }, '<')
      // 3 — the arena opens from a single scan line
      .to('.hero__intro', { clipPath: 'inset(0vh 0vw 0vh 0vw)', duration: 1.7, ease: 'expo.inOut' }, '-=1.5')
      .to('.hero__video', { scale: 1, duration: 2.6 }, '<.25')
      // 4 — supporting copy, CTAs, metadata
      .to(support.lines, { yPercent: 0, duration: 1.2, stagger: 0.08 }, '-=1.9')
      .to('.hero__ctas .u-link', { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.1 }, '<.15')
      .to('.hero__meta > *, .hero__cue > *', { autoAlpha: 1, y: 0, duration: 1.1 }, '<.1')
      .add(() => Nav.reveal(), '<')
      .add(() => { Scroll.start(); App.afterIntro(); this.proximity() }, '-=.8')
  },

  scroll() {
    if (REDUCE) return
    const mm = gsap.matchMedia()
    mm.add({ d: BP.desktop, m: BP.mobile }, (ctx) => {
      const { d } = ctx.conditions
      const lead = SplitText.create('.hero__lead', { type: 'words' })
      const H = $('.hero').offsetHeight / innerHeight
      const cover = ((H - 2) / (H - 1)) * 10   // timeline time at which the Welcome sheet starts to overlap

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom bottom', scrub: true },
      })
      tl.fromTo('.hero__inner', { '--ft': d ? '20%' : '22%', '--fb': d ? '85%' : '67%' }, { '--ft': '0%', '--fb': '100%', duration: 3, ease: 'power2.inOut' }, 0)
        .to('.hero__vwrap', { scale: 1.06, duration: 10 }, 0)
        // the title splits and fully clears the frame before the statement arrives
        .to('.hero__word--esports', { xPercent: -115, duration: 2.9, ease: 'power2.in' }, 0)
        .to('.hero__word--trading', { xPercent: 115, duration: 2.9, ease: 'power2.in' }, 0)
        .to('.hero__word', { autoAlpha: 0, duration: 0.5 }, 2.4)
        .to('.hero__fade', { autoAlpha: 0, y: -30, duration: 1.1, stagger: 0.08 }, 0)
        .to('.hero__dim', { opacity: 0.5, duration: 2 }, 2.2)
        .set('.hero__statement', { visibility: 'visible' }, 3)
        .fromTo(lead.words, { opacity: 0.08 }, { opacity: 1, duration: 0.4, stagger: 0.12 }, 3)
        .from('.hero__sub', { autoAlpha: 0, y: 24, duration: 0.8 }, 4.3)
        // depth as the Welcome sheet slides over (it covers the last 100vh)
        .to('.hero__inner', { scale: 0.9, duration: 10 - cover, ease: 'power1.in' }, cover)
        .to('.hero__dim', { opacity: 0.85, duration: 10 - cover }, cover)
        .set({}, {}, 10)
      return () => lead.revert()
    })
  },
}

/* ==========================================================================
   THE BLACK BOX — "an individual pursuit": the sealed cube opens as you read
   ========================================================================== */
const Box = {
  init() {
    const v = $('.box__video'), fr = $('.box__fr')
    // Load the clip into memory before use: scrubbing needs random access, which some servers
    // (no HTTP range support) can't provide for a streamed file.
    const load = () => fetch('/media/video/cube.mp4').then((r) => r.blob()).then((blob) => { v.src = URL.createObjectURL(blob) }).catch(() => { v.src = '/media/video/cube.mp4' })
    ScrollTrigger.create({ trigger: '.box', start: 'top 300%', once: true, onEnter: load })
    const words = SplitText.create('.box__quiet', { type: 'words' }).words
    if (REDUCE) {
      v.addEventListener('loadedmetadata', () => { v.currentTime = v.duration * 0.5 }, { once: true })
      return
    }
    let dur = 10, target = 0, cur = 0, live = false, primed = false
    v.addEventListener('loadedmetadata', () => { dur = v.duration })
    // iOS only paints seeked frames after the video has played once
    const prime = () => { if (primed) return; primed = true; v.play().then(() => v.pause()).catch(() => {}) }

    gsap.set(words, { opacity: 0.12 })
    gsap.set('.box__tag--b', { autoAlpha: 0, y: 10 })

    // entrance: guides draw, the window opens from a scan line (echoing the hero)
    const enter = gsap.timeline({ scrollTrigger: { trigger: '.box', start: 'top 75%', once: true, onEnter: prime } })
    enter.from('.box__guide--t, .box__guide--b', { scaleX: 0, duration: 1.6, ease: 'expo.inOut' })
      .from('.box__guide--l, .box__guide--r', { scaleY: 0, duration: 1.6, ease: 'expo.inOut' }, 0.1)
      .fromTo('.box__window', { clipPath: 'inset(49.5% 0% 49.5% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut' }, 0.5)
      .from('.box__meta', { autoAlpha: 0, y: 10, duration: 1, stagger: 0.1, ease: 'expo.out' }, 1.1)

    // pinned: words light up, the cube turns and opens, the label changes
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: '.box', start: 'top top', end: 'bottom bottom', scrub: true,
        onUpdate: (self) => { target = self.progress },
      },
    })
    tl.to(words, { opacity: 1, stagger: 0.06, duration: 0.3 }, 0.02)
      .fromTo('.box__video', { scale: 1.12 }, { scale: 1, duration: 1 }, 0)
      .to('.box__bar i', { scaleY: 1, duration: 1 }, 0)
      .to('.box__tag--b', { autoAlpha: 1, y: 0, duration: 0.06 }, 0.56)
      .set({}, {}, 1)

    // Scrub the video only while the section is on screen; ease toward the scroll position.
    ScrollTrigger.create({ trigger: '.box', start: 'top bottom', end: 'bottom top', onToggle: (self) => { live = self.isActive; if (live) prime() } })
    let lastFr = -1
    gsap.ticker.add(() => {
      if (!live || !v.readyState) return
      cur += (target - cur) * 0.14
      const t = Math.min(dur - 0.05, cur * dur)
      if (!v.seeking && Math.abs(v.currentTime - t) > 1 / 48) v.currentTime = t
      const f = Math.round(cur * 240)
      if (f !== lastFr) { fr.textContent = pad(f, 3); lastFr = f }
    })
  },
}

/* ==========================================================================
   MANIFESTO — TRADE. COMPETE. WATCH. RANK.
   ========================================================================== */
const Manifesto = {
  init() {
    const words = $$('.manifesto__word')
    words.forEach((w) => fitText(w, { ratio: 0.72, maxVh: 42 }))
    if (REDUCE) { gsap.set(words, { display: 'none' }); return }
    const bg = $('.manifesto__bg img')
    const count = $('.manifesto__count'), idx = $$('.manifesto__index span')
    const splits = words.map((w) => SplitText.create(w.firstElementChild, { type: 'chars', mask: 'chars', charsClass: 'c' }))

    gsap.fromTo('.manifesto__sticky', { clipPath: 'inset(14% 10% 14% 10%)' }, {
      clipPath: 'inset(0% 0% 0% 0%)', ease: 'none',
      scrollTrigger: { trigger: '.manifesto', start: 'top bottom', end: 'top top', scrub: true },
    })

    splits.forEach((s) => gsap.set(s.chars, { yPercent: 112 }))
    gsap.set('.manifesto__final > *', { autoAlpha: 0, y: 40 })

    let current = -1
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: '.manifesto', start: 'top top', end: 'bottom bottom', scrub: true,
        onUpdate: (self) => {
          const i = Math.min(3, Math.floor(self.progress * 4.4))
          if (i === current) return
          current = i
          count.textContent = `${pad(i + 1)} / 04`
          idx.forEach((s, j) => s.classList.toggle('is-on', j === i))
        },
      },
    })
    const U = 2
    splits.forEach((s, i) => {
      const t = i * U
      tl.to(s.chars, { yPercent: 0, stagger: 0.05, duration: 0.8, ease: 'power3.out' }, t)
        .to(s.chars, { yPercent: -112, stagger: 0.04, duration: 0.7, ease: 'power3.in' }, t + 1.35)
    })
    // One continuous camera move along the chain: it travels with the words,
    // settles on the red tile at RANK, then pulls back to reveal the whole chain.
    tl.fromTo(bg, { xPercent: 8, scale: 1.3, rotation: -1.5 }, { xPercent: -3, scale: 1.12, rotation: 0, duration: 4 * U - 0.4, ease: 'sine.inOut' }, 0)
      .to(bg, { xPercent: 0, scale: 1, duration: 1.4, ease: 'power2.inOut' }, 4 * U - 0.4)
      .to('.manifesto__dim', { opacity: 1, duration: 0.9, ease: 'power2.inOut' }, 4 * U - 0.3)
    tl.to('.manifesto__final > *', { autoAlpha: 1, y: 0, stagger: 0.18, duration: 0.8, ease: 'power3.out' }, 4 * U)
      .from('.manifesto__final-words span', { yPercent: 40, stagger: 0.08, duration: 0.8, ease: 'power3.out' }, 4 * U)
      .to('.manifesto__bar i', { scaleX: 1, duration: 4 * U + 1.4 }, 0)
      .set({}, {}, 4 * U + 1.4)
  },
}

/* ==========================================================================
   WHAT IS — title assembles, then becomes the section heading
   ========================================================================== */
const WhatIs = {
  init() {
    const title = $('.whatis__title'), lines = $$('.whatis__line')
    const board = Board.init()
    if (REDUCE) { board(1); return gsap.set(title, { scale: isMobile() ? 0.42 : 0.3 }) }
    const mm = gsap.matchMedia()
    mm.add({ d: BP.desktop, m: BP.mobile }, (ctx) => {
      const { d } = ctx.conditions
      gsap.fromTo(lines, { xPercent: (i) => [-48, 36, -22][i] }, {
        xPercent: 0, ease: 'none',
        scrollTrigger: { trigger: '.whatis__pin', start: 'top bottom', end: 'top top', scrub: true },
      })
      gsap.set('.whatis__copy > *', { autoAlpha: 0, y: 50 })
      const centerY = () => (innerHeight - title.offsetHeight) / 2 - title.offsetTop
      const tl = gsap.timeline({
        scrollTrigger: { trigger: '.whatis__pin', start: 'top top', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true },
      })
      const match = { p: 0 }
      board(0)
      tl.fromTo(title, { y: centerY, scale: 1 }, { y: 0, scale: d ? 0.3 : 0.42, duration: 2, ease: 'power3.inOut', immediateRender: true }, 0.6)
        .to('.whatis__copy > *', { autoAlpha: 1, y: 0, stagger: 0.22, duration: 1, ease: 'power3.out' }, 2.1)
        // the board is laid down panel by panel, then the match plays out with the scroll
        .fromTo('.wb', { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'power3.inOut', immediateRender: true }, 2.7)
        .fromTo('.wb__panel > *, .wb__rules > *', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, stagger: 0.04, duration: 0.6, ease: 'power3.out', immediateRender: true }, 3)
        .to(match, { p: 1, duration: 3.4, ease: 'none', onUpdate: () => board(match.p) }, 3.5)
        .set({}, {}, 7.4)
    })
  },
}

/* ==========================================================================
   MATCH BOARD — an illustrative 1v1 and 3v3, driven by a progress value 0 → 1
   ========================================================================== */
const Board = {
  init() {
    const root = $('.wb'), N = 120, MIN = -2, MAX = 6
    // smooth, deterministic curves: B leads early, A overtakes late
    const curve = (keys, seed) => Array.from({ length: N }, (_, i) => {
      const t = i / (N - 1)
      let k = 0
      while (k < keys.length - 2 && t > keys[k + 1][0]) k++
      const [t0, v0] = keys[k], [t1, v1] = keys[k + 1]
      const u = (t - t0) / (t1 - t0), e = (1 - Math.cos(Math.PI * u)) / 2
      const n = Math.sin(t * 47 + seed) * 0.22 + Math.sin(t * 113 + seed * 3) * 0.12 + Math.sin(t * 19 + seed * 5) * 0.18
      return i === 0 ? 0 : v0 + (v1 - v0) * e + n * Math.min(1, t * 6)
    })
    const A = curve([[0, 0], [0.22, -1.1], [0.46, 1.7], [0.6, 1.1], [0.8, 3.1], [1, 4.82]], 1.3)
    const B = curve([[0, 0], [0.25, 1.9], [0.5, 2.5], [0.7, 2.2], [0.86, 3.4], [1, 3.17]], 4.1)
    A[N - 1] = 4.82; B[N - 1] = 3.17
    const X = (i) => (i / (N - 1)) * 1000, Y = (v) => ((MAX - v) / (MAX - MIN)) * 400
    const d = (s) => s.map((v, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join('')
    $('.wb__line--a', root).setAttribute('d', d(A))
    $('.wb__line--b', root).setAttribute('d', d(B))
    $('.wb__area', root).setAttribute('d', `${d(A)}L1000 400L0 400Z`)
    $('.wb__chart', root).style.setProperty('--zero', `${(Y(0) / 4).toFixed(2)}%`)

    const teams = [
      { name: 'Team Alpha', cls: 'a', mates: [2.35, 1.62, -0.41] },
      { name: 'Team Nova', cls: 'b', mates: [1.18, 0.84, 0.96] },
    ]
    $('.wb__teams', root).innerHTML = teams.map((t) => `
      <div class="wb__team wb__team--${t.cls}">
        <div class="wb__team-h"><span class="wb__team-n"><i></i>${t.name}<span class="wb__tag mono">Lead</span></span><span class="wb__team-v">+0.00%</span></div>
        <div class="wb__mates mono">${t.mates.map((_, j) => `<div class="wb__mate"><span>P${j + 1}</span><span class="wb__bar"><i></i></span><span>+0.00%</span></div>`).join('')}</div>
      </div>`).join('')

    const at = (s, p) => { const f = p * (N - 1), i = Math.min(N - 2, Math.floor(f)); return s[i] + (s[i + 1] - s[i]) * (f - i) }
    const fmt = (v) => `${v < 0 ? '−' : '+'}${Math.abs(v).toFixed(2)}%`
    const ui = {
      draw: $('.wb__draw', root), now: $('.wb__now', root), clock: $('.wb__clock', root),
      heads: [$('.wb__head--a', root), $('.wb__head--b', root)],
      players: [$('.wb__p--a', root), $('.wb__p--b', root)],
      teams: $$('.wb__team', root),
    }
    ui.nums = ui.players.map((p) => $('.wb__num', p))
    ui.tags = [...ui.players, ...ui.teams].map((el) => $('.wb__tag', el))
    ui.teamV = ui.teams.map((t) => $('.wb__team-v', t))
    ui.mates = ui.teams.map((t) => $$('.wb__mate', t).map((m) => [$('i', m), m.lastElementChild]))

    let last = -1
    return (p) => {
      if (Math.abs(p - last) < 0.0005) return
      last = p
      const pc = `${(p * 100).toFixed(3)}%`
      ui.draw.style.clipPath = `inset(-10% ${(100 - p * 100).toFixed(3)}% -10% 0)`
      ui.now.style.left = pc
      const va = at(A, p), vb = at(B, p)
      ;[va, vb].forEach((v, k) => { ui.heads[k].style.left = pc; ui.heads[k].style.top = `${(Y(v) / 4).toFixed(2)}%`; ui.nums[k].textContent = fmt(v) })
      const started = p > 0.02, done = p > 0.995
      ui.players[0].classList.toggle('is-lead', started && va >= vb)
      ui.players[1].classList.toggle('is-lead', started && vb > va)
      const secs = Math.round((1 - p) * 300)
      ui.clock.textContent = `${pad(Math.floor(secs / 60))}:${pad(secs % 60)}`
      // teams: each trader's contribution grows along their own path
      const totals = teams.map((t, ti) => t.mates.reduce((sum, f, j) => {
        const v = f * Math.min(1, p * 1.05) + Math.sin(p * 9 + j * 2 + ti) * 0.35 * Math.sin(Math.PI * p)
        const [bar, label] = ui.mates[ti][j], w = Math.min(50, (Math.abs(v) / 2.6) * 50)
        bar.style.width = `${w}%`; bar.style.left = v < 0 ? `${50 - w}%` : '50%'
        label.textContent = fmt(v)
        return sum + v
      }, 0))
      totals.forEach((v, ti) => { ui.teamV[ti].textContent = fmt(v); ui.teams[ti].classList.toggle('is-lead', started && v >= totals[1 - ti]) })
      ui.tags.forEach((t) => (t.textContent = done ? 'Winner' : 'Lead'))
    }
  },
}

/* ==========================================================================
   WAYS TO COMPETE — depth-of-field list
   Big formats scroll through a bracketed focus window: the one inside the
   brackets is sharp, its neighbours fall away into blur.
   ========================================================================== */
const Focus = {
  init() {
    const root = $('.focus')
    if (!root) return
    const items = DATA.explorer, n = items.length
    const list = $('.focus__list', root)
    list.innerHTML = items.map((it, i) => `
      <li class="focus__item">
        <button class="focus__word" data-i="${i}" data-cursor="Focus"><span>${esc(it.title)}</span></button>
        <p class="focus__sr">${esc(it.desc)}</p>
      </li>`).join('')
    $('.focus__total', root).textContent = pad(n)

    const words = $$('.focus__word', list)
    const ui = { now: $('.focus__now', root), desc: $('.focus__desc', root), cta: $('.focus__cta', root), brs: $$('.focus__br', root), rail: $('.focus__rail i', root) }

    let active = -1
    const setActive = (i, animate = true) => {
      if (i === active) return
      active = i
      ui.now.textContent = pad(i + 1)
      ui.desc.textContent = items[i].desc
      ui.cta.classList.toggle('is-on', i === n - 1)
      words.forEach((w, k) => w.classList.toggle('is-active', k === i))
      if (!animate || REDUCE) return
      gsap.fromTo(ui.desc, { autoAlpha: 0, y: 14, filter: 'blur(10px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'expo.out', overwrite: true })
      gsap.fromTo(ui.brs, { scaleY: 1.18 }, { scaleY: 1, duration: 0.9, ease: 'expo.out', overwrite: true })
    }
    setActive(0, false)

    if (REDUCE) { root.classList.add('is-static'); return }

    // scroll → list position, with a dwell on every word so each one "locks" into focus
    const span = n - 1
    const toPos = (p) => {
      const r = gsap.utils.clamp(0, span, p * (span + 0.6) - 0.3)
      const f = Math.min(Math.floor(r), span - 1), t = r - f
      const q = t < 0.28 ? 0 : t > 0.72 ? 1 : (t - 0.28) / 0.44
      return f + (q < 0.5 ? 2 * q * q : 1 - Math.pow(-2 * q + 2, 2) / 2)
    }
    const st = { target: 0, pos: 0, p: 0, live: false }
    let lh = 0
    const measure = () => { lh = words[0].offsetHeight }
    measure()
    ScrollTrigger.addEventListener('refresh', measure)

    const trigger = ScrollTrigger.create({
      trigger: root, start: 'top top', end: 'bottom bottom',
      onUpdate: (s) => { st.p = s.progress; st.target = toPos(s.progress) },
    })
    ScrollTrigger.create({ trigger: root, start: 'top bottom', end: 'bottom top', onToggle: (s) => (st.live = s.isActive) })

    // click a blurred word to bring it into focus
    words.forEach((w, i) => w.addEventListener('click', () => {
      const p = (i + 0.3 + (i === span ? 0.3 : 0)) / (span + 0.6)
      const y = trigger.start + (trigger.end - trigger.start) * p
      Scroll.lenis ? Scroll.lenis.scrollTo(y, { duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) }) : scrollTo({ top: y, behavior: 'smooth' })
    }))

    let last = -1
    gsap.ticker.add(() => {
      if (!st.live) return
      st.pos += (st.target - st.pos) * 0.14
      const pos = st.pos
      if (Math.abs(pos - last) > 0.0005) {
        last = pos
        list.style.transform = `translate3d(0, ${-(pos + 0.5) * lh}px, 0)`
        words.forEach((w, i) => {
          const d = Math.abs(i - pos)
          w.style.filter = d < 0.02 ? 'none' : `blur(${Math.min(d * 10, 20).toFixed(2)}px)`
          w.style.opacity = Math.max(0.22, 1 - d * 0.38).toFixed(3)
        })
        setActive(Math.round(pos))
      }
      ui.rail.style.transform = `scaleX(${st.p})`
    })
  },
}

/* ==========================================================================
   FROM TRADER TO COMPETITOR — the inline image becomes the world
   ========================================================================== */
const T2C = {
  init() {
    const sticky = $('.t2c__sticky'), slot = $('.t2c__slot'), stage = $('.t2c__stage')
    const imDuel = $('.t2c__scene'), you = $('.t2c__you')
    // the red figure's head, in image coordinates (the source is 1672 × 940)
    const placeYou = () => {
      const W = stage.offsetWidth, H = stage.offsetHeight, iw = 1672, ih = 940
      const k = Math.max(W / iw, H / ih), cs = getComputedStyle(imDuel)
      const ox = (W - iw * k) * (parseFloat(cs.getPropertyValue('--ox')) / 100)
      const oy = (H - ih * k) * (parseFloat(cs.getPropertyValue('--oy')) / 100)
      gsap.set(you, { x: ox + 1162 * k, y: oy + 596 * k - you.offsetHeight / 2 })
    }
    placeYou()
    ScrollTrigger.addEventListener('refreshInit', placeYou)
    const swapA = SplitText.create('.t2c__swap-a', { type: 'chars', mask: 'chars', charsClass: 'c' })
    const swapB = SplitText.create('.t2c__swap-b', { type: 'chars', mask: 'chars', charsClass: 'c' })
    const finale = SplitText.create('.t2c__finale-big', { type: 'words', mask: 'words', wordsClass: 'w' })
    const beats = $$('.t2c__beat')

    if (REDUCE) { $('.t2c').classList.add('is-static'); return }

    const slotInset = () => {
      // measure the slot's resting width (its entrance tween animates width from 0)
      const s = offsetWithin(slot, sticky), W = sticky.offsetWidth, H = sticky.offsetHeight
      const w = parseFloat(getComputedStyle(slot).fontSize) * 1.55
      return `inset(${s.y}px ${W - s.x - w}px ${H - s.y - s.h}px ${s.x}px round ${s.h / 2}px)`
    }

    // entrance: the sheet settles in, the question rises
    gsap.fromTo(sticky, { scale: 0.9, borderRadius: '3vw' }, {
      scale: 1, borderRadius: '0vw', ease: 'none',
      scrollTrigger: { trigger: '.t2c', start: 'top bottom', end: 'top top', scrub: true },
    })
    gsap.set(swapB.chars, { yPercent: 110 })
    gsap.from(['.t2c__asks', '.t2c__li'], {
      yPercent: 110, autoAlpha: 0, stagger: 0.1, duration: 1.4, ease: 'expo.out',
      scrollTrigger: { trigger: '.t2c', start: 'top 45%', toggleActions: 'play none none reverse' },
    })
    gsap.from('.t2c__slot', {
      width: 0, duration: 1.6, ease: 'expo.inOut', delay: 0.35,
      scrollTrigger: { trigger: '.t2c', start: 'top 45%', toggleActions: 'play none none reverse' },
    })
    gsap.set(beats, { autoAlpha: 0, y: 60 })
    gsap.set('.t2c__finale-pre', { autoAlpha: 0, y: 20 })
    gsap.set(finale.words, { yPercent: 110 })

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: '.t2c', start: 'top top', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true },
    })
    tl.fromTo(stage, { clipPath: slotInset }, { clipPath: 'inset(0px 0px 0px 0px round 0px)', duration: 1.6, ease: 'power3.inOut' }, 2.4)
      // the question changes
      .to('.t2c__ask--a', { autoAlpha: 0, y: -16, duration: 0.4 }, 1)
      .fromTo('.t2c__ask--b', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 1.3)
      .to(swapA.chars, { yPercent: -110, stagger: 0.025, duration: 0.5, ease: 'power3.in' }, 1)
      .to(swapB.chars, { yPercent: 0, stagger: 0.025, duration: 0.6, ease: 'power3.out' }, 1.4)
      .fromTo(stage, { opacity: 0 }, { opacity: 1, duration: 0.5, immediateRender: true }, 1.2)
      .to('.t2c__slot img', { opacity: 0, duration: 0.5 }, 1.2)
      .fromTo('.t2c__slot img', { scale: 1.5 }, { scale: 1.9, duration: 1.2 }, 0)
      // the inline image becomes the arena
      .fromTo(imDuel, { scale: 1.35 }, { scale: 1, duration: 2.2, ease: 'power2.out' }, 2.4)
      .to(['.t2c__center', '.t2c__label'], { autoAlpha: 0, duration: 0.3 }, 2.35)
      .set(['.t2c__q', '.t2c__asks', '.t2c__label'], { color: '#ece9e3' }, 2.7)
      .to(['.t2c__center', '.t2c__label'], { autoAlpha: 1, duration: 0.45 }, 3.45)
      .to('.t2c__shade', { opacity: () => (isMobile() ? 0.2 : 0.12), duration: 1 }, 2.9)
      .to(['.t2c__q', '.t2c__ask--b'], { autoAlpha: 0, y: -50, duration: 0.8, ease: 'power2.in' }, 4.3)
      // "another trader?" — and there you are: the one red figure in the crowd
      .fromTo(you, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 3.6)
      .fromTo('.t2c__you i', { scaleX: 0, transformOrigin: 'left' }, { scaleX: 1, duration: 0.5, ease: 'power3.out' }, 3.6)
    // three beats, one at a time
    beats.forEach((b, k) => {
      const t = 5.1 + k * 1.1
      tl.to(b, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out' }, t)
      tl.to(b, { autoAlpha: 0, y: -60, duration: 0.4, ease: 'power3.in' }, t + 0.75)
    })
    // finale — the crowd stays; it eases back and dims so the closing line reads
    tl.to(imDuel, { scale: 1.08, duration: 3, ease: 'power1.out' }, 8.3)
      .to('.t2c__shade', { opacity: 0.5, duration: 0.9 }, 8.3)
      .to('.t2c__finale-pre', { autoAlpha: 1, y: 0, duration: 0.5 }, 9)
      .to(finale.words, { yPercent: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out' }, 9.3)
      .set({}, {}, 11.4)
  },
}

/* ==========================================================================
   ECOSYSTEM DECK — text cards rise out of the floor, tilt and pile up
   ========================================================================== */
const Deck = {
  init() {
    const section = $('.eco'), stack = $('.deck__stack'), items = DATA.ecosystem, total = pad(items.length)
    const tone = ['paper', 'ink', 'paper', 'signal', 'ink', 'paper']
    stack.innerHTML = items.map((e, i) => `
      <li class="deck__card deck__card--${tone[i % tone.length]}">
        <span class="deck__num display" aria-hidden="true">${pad(i + 1)}</span>
        <p class="deck__top mono"><span>${pad(i + 1)} / ${total}</span></p>
        <h3 class="deck__name display">${esc(e.name)}</h3>
        <p class="deck__desc">${esc(e.desc)}</p>
        <p class="deck__rel mono"><span>Connects →</span>${e.rel.map((k) => `<span>${esc(items.find((x) => x.key === k).name)}</span>`).join('')}</p>
      </li>`).join('')
    const cards = $$('.deck__card', stack), now = $('.deck__now')
    if (REDUCE) { section.classList.add('is-static'); return }

    const tilt = [-3.5, 2.6, -2, 3.2, -2.6, 1.8]
    gsap.set(cards, { yPercent: 150, rotateX: 34, rotate: (i) => tilt[i] * 2.2, transformPerspective: 1600 })
    const tl = gsap.timeline({
      defaults: { ease: 'power2.out', duration: 1 },
      scrollTrigger: {
        trigger: '.deck', pin: true, scrub: true, start: 'top top', end: () => `+=${innerHeight * cards.length * 0.85}`, invalidateOnRefresh: true,
        onUpdate: () => (now.textContent = pad(Math.min(cards.length, Math.floor(tl.time() + 0.5) || 1))),
      },
    })
    cards.forEach((card, i) => {
      tl.to(card, { yPercent: 0, rotateX: 0, rotate: tilt[i], ease: 'power3.out' }, i)
      // everything already on the pile settles back one step
      cards.slice(0, i).forEach((prev, k) => {
        const depth = i - k
        tl.to(prev, { y: -depth * 16, scale: 1 - depth * 0.04, '--shade': Math.min(0.55, depth * 0.14) }, i)
      })
    })
    tl.to({}, { duration: 0.6 })
  },
}

/* ==========================================================================
   LEAGUE
   ========================================================================== */
const League = {
  init() {
    const etl = $('.league__etl')
    fitText(etl, { ratio: 0.94, maxVh: 76 })
    if (REDUCE) return
    gsap.fromTo(etl, { yPercent: 100 }, {
      yPercent: 0, duration: 1.6, ease: 'expo.out',
      scrollTrigger: { trigger: '.league__etl-wrap', start: 'top 85%', once: true },
    })
    gsap.fromTo(etl, { backgroundPosition: '50% 0%' }, {
      backgroundPosition: '50% 100%', ease: 'none',
      scrollTrigger: { trigger: '.league__etl-wrap', start: 'top bottom', end: 'bottom top', scrub: true },
    })
    $$('.league__pillar').forEach((p, i) => {
      gsap.from(p.children, {
        yPercent: 60, autoAlpha: 0, duration: 1.2, ease: 'expo.out', stagger: 0.06, delay: i * 0.05,
        scrollTrigger: { trigger: p, start: 'top 90%', once: true },
      })
    })
    gsap.from('.league__cta-text, .league__cta-side', {
      yPercent: 50, autoAlpha: 0, duration: 1.4, ease: 'expo.out', stagger: 0.1,
      scrollTrigger: { trigger: '.league__cta', start: 'top 90%', once: true },
    })
  },
}

/* ==========================================================================
   COMPETITIVE FORMATS — expanding columns
   ========================================================================== */
const Formats = {
  init() {
    const F = DATA.formats, n = F.length
    const list = $('.cf__list')
    list.innerHTML = F.map((f, i) => `<li><button class="cf__item" data-cursor="View"><span class="mono">${pad(i + 1)}</span><span class="cf__item-t">${esc(f.title)}</span></button></li>`).join('')
    const items = $$('.cf__item', list)
    const num = $('.cf__num span'), title = $('.cf__dtitle span'), desc = $('.cf__desc'), curEl = $('.cf__cur')
    const ring = $('.cf__ring'), sheen = $('.cf__sheen')
    let cur = -1

    const render = (i) => {
      num.textContent = pad(i + 1); title.textContent = F[i].title; desc.textContent = F[i].desc; curEl.textContent = pad(i + 1)
      items.forEach((b, j) => b.classList.toggle('is-on', j === i))
    }
    const show = (i) => {
      if (i === cur) return
      const dir = i > cur ? 1 : -1, first = cur < 0
      cur = i
      if (REDUCE || first) return render(i)
      gsap.timeline({ overwrite: true })
        .to([num, title], { yPercent: -110 * dir, duration: 0.35, ease: 'power3.in' }, 0)
        .to(desc, { autoAlpha: 0, duration: 0.25 }, 0)
        .add(() => render(i))
        .fromTo([num, title], { yPercent: 110 * dir }, { yPercent: 0, duration: 0.8, ease: 'expo.out', stagger: 0.05 })
        .fromTo(desc, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'expo.out' }, '<.1')
      // a single sweep of light across the trophy marks each change
      gsap.fromTo(sheen, { backgroundPosition: dir > 0 ? '160% 0' : '-60% 0' }, { backgroundPosition: dir > 0 ? '-60% 0' : '160% 0', duration: 1.3, ease: 'power2.inOut', overwrite: true })
    }
    render(0); show(0)

    if (REDUCE) {
      $('.cf__pin').style.height = 'auto'; $('.cf__sticky').style.position = 'relative'
      items.forEach((b, i) => b.addEventListener('click', () => show(i)))
      return
    }

    const st = ScrollTrigger.create({
      trigger: '.cf__pin', start: 'top top', end: 'bottom bottom',
      onUpdate: (self) => {
        show(Math.min(n - 1, Math.floor(self.progress * n)))
        gsap.set('.cf__bar i', { scaleX: self.progress })
      },
    })
    // clicking a format scrolls to its place in the sequence
    items.forEach((b, i) => b.addEventListener('click', () => {
      const y = st.start + (st.end - st.start) * ((i + 0.5) / n)
      Scroll.lenis ? Scroll.lenis.scrollTo(y, { duration: 1.2 }) : scrollTo({ top: y, behavior: 'smooth' })
    }))

    // the trophy rises out of the dark as the section arrives, and the ring turns with the scroll
    gsap.timeline({ scrollTrigger: { trigger: '.cf', start: 'top 85%', end: 'top top', scrub: true } })
      .fromTo('.cf__trophy', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power2.out' }, 0)
      .fromTo('.cf__trophy img', { scale: 1.25, yPercent: 8 }, { scale: 1, yPercent: 0, ease: 'power2.out' }, 0)
      .fromTo('.cf__halo', { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, ease: 'power2.out' }, 0)
      .fromTo(['.cf__head', '.cf__list', '.cf__detail', '.cf__count'], { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, stagger: 0.08, ease: 'power2.out' }, 0.35)
    gsap.fromTo(ring, { rotation: -20 }, { rotation: 340, ease: 'none', scrollTrigger: { trigger: '.cf__pin', start: 'top bottom', end: 'bottom top', scrub: true } })
    gsap.fromTo('.cf__trophy img', { y: 0 }, { y: -30, ease: 'none', scrollTrigger: { trigger: '.cf__pin', start: 'top top', end: 'bottom bottom', scrub: true }, immediateRender: false })
  },
}

/* ==========================================================================
   LATEST + ARTICLE VIEW
   ========================================================================== */
const Article = {
  isOpen: false,
  init() {
    this.el = $('.article'); this.card = $('.article-card')
    this.card.addEventListener('click', (e) => { e.preventDefault(); this.open(true) })
    // The magazine rests at an angle, straightens when approached, then follows the cursor slightly.
    const mag = $('.article-card__media')
    const rest = { rotationY: -16, rotationX: 7, rotationZ: 2, scale: 0.96 }
    if (!REDUCE) gsap.set(mag, rest)
    if (FINE && !REDUCE) {
      const ry = gsap.quickTo(mag, 'rotationY', { duration: 1, ease: 'power3' })
      const rx = gsap.quickTo(mag, 'rotationX', { duration: 1, ease: 'power3' })
      this.card.addEventListener('pointerenter', () => gsap.to(mag, { rotationZ: 0, scale: 1.02, duration: 1.2, ease: 'expo.out', overwrite: 'auto' }))
      this.card.addEventListener('pointermove', (e) => {
        const r = mag.getBoundingClientRect()
        ry(((e.clientX - r.left) / r.width - 0.5) * 9)
        rx(-((e.clientY - r.top) / r.height - 0.5) * 7)
      })
      this.card.addEventListener('pointerleave', () => gsap.to(mag, { ...rest, duration: 1.4, ease: 'expo.out', overwrite: true }))
    }
    $('.article__back').addEventListener('click', () => history.state?.article ? history.back() : this.close())
    addEventListener('popstate', () => (location.hash.startsWith('#/latest/') ? this.open(false) : this.close()))
    addEventListener('keydown', (e) => e.key === 'Escape' && this.isOpen && $('.article__back').click())
    if (!REDUCE) {
      gsap.from('.article-card__title span', {
        yPercent: 60, autoAlpha: 0, stagger: 0.1, duration: 1.4, ease: 'expo.out',
        scrollTrigger: { trigger: this.card, start: 'top 75%', once: true },
      })
      gsap.fromTo('.article-card__media img', { yPercent: -2.5 }, {
        yPercent: 2.5, ease: 'none', scrollTrigger: { trigger: this.card, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    }
  },
  open(push) {
    if (this.isOpen) return
    this.isOpen = true
    if (push) history.pushState({ article: true }, '', '#/latest/esports-trading-for-crypto')
    this.el.setAttribute('aria-hidden', 'false'); this.el.scrollTop = 0
    Scroll.stop()
    gsap.timeline()
      .set(this.el, { visibility: 'visible' })
      .fromTo(this.el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: REDUCE ? 0 : 1.2, ease: 'expo.inOut' })
      .from('.article__title, .article__meta, .article__media', { yPercent: 20, autoAlpha: 0, stagger: 0.08, duration: REDUCE ? 0 : 1.2, ease: 'expo.out' }, '-=.4')
      .add(() => { $('.article__back').focus({ preventScroll: true }); Cursor.refresh() })
  },
  close() {
    if (!this.isOpen) return
    this.isOpen = false
    if (location.hash.startsWith('#/latest/')) history.replaceState(null, '', location.pathname)
    this.el.setAttribute('aria-hidden', 'true')
    gsap.to(this.el, {
      clipPath: 'inset(0% 0% 100% 0%)', duration: REDUCE ? 0 : 1, ease: 'expo.inOut',
      onComplete: () => { gsap.set(this.el, { visibility: 'hidden' }); Scroll.start(); Cursor.refresh() },
    })
  },
}

/* ==========================================================================
   NEWSLETTER
   ========================================================================== */
const Newsletter = {
  init() {
    const valid = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)
    const form = $('.news__form'), input = $('.news__input'), status = $('.news__status'), msg = $('.news__msg'), fill = $('.news__fill')
    const say = (text, cls) => { msg.textContent = text; status.className = `news__status mono ${cls || ''}` }
    // the line under the field fills as you type, and turns red once the address is valid
    input.addEventListener('input', () => {
      const ok = valid(input.value)
      form.classList.toggle('is-valid', ok)
      fill.style.transform = `scaleX(${ok ? 1 : Math.min(0.9, input.value.length / 28)})`
      if (status.classList.contains('is-err')) say('')
    })
    form.addEventListener('submit', async (e) => {
      e.preventDefault()
      if (!valid(input.value)) return say('Please enter a valid email address.', 'is-err')
      say('Sending…')
      try {
        if (CONFIG.newsletterEndpoint) {
          const r = await fetch(CONFIG.newsletterEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: input.value }) })
          if (!r.ok) throw new Error(r.status)
        } else {
          console.warn('[Esports Trading] CONFIG.newsletterEndpoint is not set — signup was not sent anywhere.')
        }
        form.reset(); form.classList.remove('is-valid'); fill.style.transform = 'scaleX(0)'
        say('You’ve joined the movement.', 'is-ok')
      } catch {
        say('Something went wrong. Please try again.', 'is-err')
      }
    })

    // tapes: copy from the document, repeated to fill the width
    const lineA = '<span>News</span><b>·</b><span>Events</span><b>·</b><span>Rankings</span><b>·</b><span>And more</span><b>·</b>'
    const lineB = '<span>Join the Movement</span><b>·</b>'
    $$('.news__tape').forEach((tape, i) => {
      const track = $('.news__track', tape), unit = i === 0 ? lineB : lineA
      track.innerHTML = unit.repeat(i === 0 ? 8 : 4)
      track.insertAdjacentHTML('afterend', `<div class="news__track" aria-hidden="true">${track.innerHTML}</div>`)
    })
    if (REDUCE) return

    // continuous drift in opposite directions; scrolling speeds them up
    const tracks = $$('.news__tape').map((t) => $$('.news__track', t))
    const pos = [0, 0], dir = [1, -1]
    let boost = 0, live = false
    Scroll.lenis?.on('scroll', (l) => { boost = Math.min(6, Math.abs(l.velocity) * 0.12) })
    ScrollTrigger.create({ trigger: '.news', start: 'top bottom', end: 'bottom top', onToggle: (st) => (live = st.isActive) })
    gsap.ticker.add((_, dt) => {
      if (!live) return
      boost *= 0.92
      tracks.forEach((pair, i) => {
        const w = pair[0].offsetWidth
        pos[i] = (pos[i] + dir[i] * (0.035 + boost * 0.05) * dt) % w
        const x = pos[i] > 0 ? pos[i] - w : pos[i]
        pair.forEach((t) => (t.style.transform = `translateX(${x}px)`))
      })
    })
    // entrance: the tapes are laid down across the section
    gsap.from('.news__tape--a', { clipPath: 'inset(0% 100% 0% 0%)', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: '.news__tapes', start: 'top 85%', once: true } })
    gsap.from('.news__tape--b', { clipPath: 'inset(0% 0% 0% 100%)', duration: 1.6, ease: 'expo.inOut', delay: 0.15, scrollTrigger: { trigger: '.news__tapes', start: 'top 85%', once: true } })
    gsap.from('.news__field', { clipPath: 'inset(0% 100% 0% 0%)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: '.news__form', start: 'top 90%', once: true } })
  },
}

/* ==========================================================================
   PARTNERS
   ========================================================================== */
const Partners = {
  init() {
    if (REDUCE) return
    gsap.from('.partner', {
      autoAlpha: 0, y: 40, duration: 1.2, ease: 'expo.out', stagger: 0.07,
      scrollTrigger: { trigger: '.partners__grid', start: 'top 85%', once: true },
    })
  },
}

/* ==========================================================================
   FOOTER — final frame + evolving data structure
   ========================================================================== */
const Footer = {
  init() {
    $$('.ft__title .fit').forEach((el) => fitText(el, { ratio: 0.82, maxVh: 22 }))
    fitText($('.ft__sign'), { ratio: 1, maxVh: 40 })   // spans the panel's content width
    this.clock()
    this.data()
    if (REDUCE) return
    // the signature arrives as the page ends: bars of the E slide in, the wordmark rises
    gsap.timeline({ scrollTrigger: { trigger: '.ft__sign', start: 'top 98%', toggleActions: 'play none none reverse' } })
      .from('.ft__sign-e path', { xPercent: -80, opacity: 0, stagger: 0.1, duration: 1.1, ease: 'expo.out' }, 0)
      .from('.ft__sign-word', { yPercent: 60, opacity: 0, duration: 1.3, ease: 'expo.out' }, 0.15)
    gsap.fromTo('.ft__media img', { yPercent: -10, scale: 1.1 }, {
      yPercent: 8, scale: 1, ease: 'none',
      scrollTrigger: { trigger: '.ft', start: 'top bottom', end: 'top top', scrub: true },
    })
    $$('.ft__title .fit-target').forEach((el) => {
      const s = SplitText.create(el, { type: 'chars', mask: 'chars', charsClass: 'c' })
      gsap.from(s.chars, {
        yPercent: 110, duration: 1.4, ease: 'expo.out', stagger: 0.03,
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      })
    })
    gsap.from('.fp__k, .fp__col li', {
      autoAlpha: 0, y: 24, duration: 1.1, ease: 'expo.out', stagger: 0.04,
      scrollTrigger: { trigger: '.fp', start: 'top 80%', once: true },
    })
    gsap.from('.ft__steps li', {
      autoAlpha: 0, x: -30, duration: 1.1, ease: 'expo.out', stagger: 0.08,
      scrollTrigger: { trigger: '.ft__steps', start: 'top 85%', once: true },
    })
  },

  // local time, ticking in the panel's bottom row
  clock() {
    const el = $('.fp__clock')
    const tick = () => { const d = new Date(); el.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}` }
    tick(); setInterval(tick, 1000)
  },

  data() {
    const root = $('.ft__data')
    const W = 30
    const dots = '<i></i>'.repeat(W)
    root.innerHTML = `<div class="data__rule"></div>` +
      DATA.data.map(([k, v]) => `<div class="data__row"><span class="data__key">${k}</span><span class="data__lead">${dots}</span><span class="data__val">${v}</span></div>`).join('') +
      `<div class="data__rule"></div><div class="data__row"><span class="data__key">Index</span><span class="data__spark">${dots}</span></div>` +
      `<p class="data__note">Illustrative values — not live data</p>`
    const leads = $$('.data__lead', root).map((el) => [...el.children]), vals = $$('.data__val', root), bars = [...$('.data__spark', root).children]
    let series = Array.from({ length: W }, (_, i) => 3 + Math.round(Math.sin(i / 3) * 2))
    const pos = leads.map((_, i) => (i * 7) % W)
    const render = () => {
      leads.forEach((row, i) => row.forEach((d, j) => d.classList.toggle('on', j === pos[i])))
      bars.forEach((b, j) => (b.style.height = `${(series[j] + 1) * 2}px`))
    }
    render()
    if (REDUCE) return
    let tick = 0, running = false, timer
    const step = () => {
      tick++
      pos.forEach((p, i) => (pos[i] = (p + 1 + (i % 2)) % W))
      if (tick % 3 === 0) {
        const last = series[series.length - 1]
        series = [...series.slice(1), Math.max(0, Math.min(6, last + Math.round(Math.random() * 2 - 1)))]
      }
      // occasional scramble that always settles back to the stated value
      if (tick % 28 === 0) {
        const k = Math.floor(Math.random() * vals.length), el = vals[k], v = DATA.data[k][1]
        let n = 0
        const scr = setInterval(() => {
          el.textContent = ++n > 6 ? v : v.replace(/\d/g, () => Math.floor(Math.random() * 10))
          if (n > 6) clearInterval(scr)
        }, 55)
      }
      render()
    }
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) { running = true; timer = setInterval(step, 140) }
      if (!e.isIntersecting && running) { running = false; clearInterval(timer) }
    }).observe(root)
  },
}

/* ==========================================================================
   APP
   ========================================================================== */
const App = {
  async init() {
    await Promise.race([
      Promise.all([
        document.fonts.load('700 100px Oswald'),
        document.fonts.load('400 16px Inter'),
      ]).then(() => document.fonts.ready),
      new Promise((r) => setTimeout(r, 2500)),
    ])
    Scroll.init(); Scroll.bindAnchors()
    Cursor.init(); Nav.init(); Menu.init()
    Hero.init()
    Box.init()
    Manifesto.init()
    WhatIs.init()
    Focus.init()
    T2C.init()
    Deck.init()
    League.init()
    Formats.init()
    Article.init()
    Newsletter.init()
    Partners.init()
    Footer.init()
    Reveals.init()
    ScrollTrigger.refresh()
    await Hero.intro()
    if (REDUCE) this.afterIntro()
  },
  // Load + decode all images one at a time during idle time, top of page first.
  async predecode() {
    const idle = () => new Promise((r) => (window.requestIdleCallback ? requestIdleCallback(r, { timeout: 400 }) : setTimeout(r, 60)))
    for (const im of $$('img')) {
      await idle()
      if (im.dataset.src) { im.src = im.dataset.src; im.removeAttribute('data-src') }
      im.loading = 'eager'
      try { await im.decode() } catch {}
    }
  },
  afterIntro() {
    this.predecode()
    if (location.hash.startsWith('#/latest/')) Article.open(false)
    ScrollTrigger.refresh()
  },
}


export function start() {
  App.init()
}
