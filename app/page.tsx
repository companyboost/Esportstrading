import type { CSSProperties } from "react";
import LandingScript from "./_landing/LandingScript";

export default function Home() {
  return (
    <>
      <div className="grain" aria-hidden="true"></div>
      <div className="cursor" aria-hidden="true"><div className="cursor__dot"></div><span className="cursor__label mono"></span></div>
      
      <div className="loader" aria-hidden="true">
        <div className="loader__top mono"><span>Esports Trading</span><span>Loading</span></div>
        <div className="loader__count display"><span className="loader__num">000</span></div>
        <div className="loader__bar"><i></i></div>
      </div>
      
      {/* ============================== NAVIGATION ============================== */}
      <div className="brand-e" aria-hidden="true"><svg viewBox="0 0 507 459"><path d="M171 0H507L419 92H238L206 179L66 281Z"/><path d="M236 182H415L331 276H170L143 353L0 457L50 319Z"/><path d="M160 367H415L344 459H33Z"/></svg></div>
      <header className="nav">
        <a className="nav__brand" href="#top" aria-label="Esports Trading — back to top">
          <span className="nav__mark" aria-hidden="true"></span><span className="nav__word"><b>sports</b><span>Trading</span></span>
        </a>
        <nav className="nav__links mono" aria-label="Primary">
          <a href="#what-is"><span className="roll"><span data-text="What is it">What is it</span></span></a>
          <a href="#ecosystem"><span className="roll"><span data-text="Ecosystem">Ecosystem</span></span></a>
          <a href="#league"><span className="roll"><span data-text="League">League</span></span></a>
          <a href="#formats"><span className="roll"><span data-text="Formats">Formats</span></span></a>
          <a className="nav__cta" href="#updates"><span className="roll"><span data-text="[ Get updates ]">[ Get updates ]</span></span></a>
        </nav>
        <button className="nav__menu mono" aria-expanded="false" aria-controls="menu"><span className="roll"><span data-text="Menu">Menu</span></span></button>
      </header>
      
      <div className="menu" id="menu" aria-hidden="true">
        <nav className="menu__links display" aria-label="Mobile">
          <a href="#what-is"><span>What is it</span></a>
          <a href="#ecosystem"><span>Ecosystem</span></a>
          <a href="#league"><span>League</span></a>
          <a href="#formats"><span>Formats</span></a>
          <a href="#updates"><span>Updates</span></a>
        </nav>
        <div className="menu__foot mono"><span>EsportsTrading.com</span><span>© 2026</span></div>
      </div>
      
      <main>
      
      {/* ================================= HERO ================================= */}
      <section className="hero" id="top" aria-label="Esports Trading">
        <div className="hero__sticky">
          <div className="hero__inner">
            <div className="hero__frame">
              <div className="hero__intro">
                <div className="hero__vwrap">
                  <video className="hero__video" muted loop playsInline preload="auto" poster="/media/video/hero-poster.jpg" aria-hidden="true"></video>
                </div>
                <div className="hero__shade"></div>
                <div className="hero__dim"></div>
              </div>
            </div>
      
      
            <h1 className="hero__title">
              <span className="sr-only">Esports Trading</span>
              <span className="hero__type hero__type--line" aria-hidden="true">
                <span className="hero__word hero__word--esports display">Esports</span>
                <span className="hero__word hero__word--trading display">Trading</span>
              </span>
              <span className="hero__type hero__type--solid" aria-hidden="true">
                <span className="hero__word hero__word--esports display">Esports</span>
                <span className="hero__word hero__word--trading display">Trading</span>
              </span>
            </h1>
      
            <div className="hero__meta mono hero__fade" aria-hidden="true"><span>EsportsTrading.com</span><span className="hero__tc">TC 00:00:00:00</span></div>
            <p className="hero__support hero__fade"><span className="hero__support-in" data-split>The next emerging Billion Dollar Competitive Sport.</span></p>
            <div className="hero__ctas hero__fade">
              <a className="u-link u-link--down" href="#welcome" data-cursor="Discover"><span>DISCOVER ESPORTS TRADING</span><span className="arr">↓</span></a>
              <a className="u-link" href="#league" data-cursor="Explore"><span>EXPLORE THE LEAGUE</span><span className="arr">→</span></a>
            </div>
            <div className="hero__cue mono hero__fade" aria-hidden="true"><i></i><span>Scroll</span></div>
      
            <div className="hero__statement">
              <p className="hero__lead">Esports Trading is where trading skills meet competition.</p>
              <p className="hero__sub">Traders compete head-to-head and in organized events or on platforms that facilitate competitions, putting their strategy, market knowledge, skills, and decision-making to the test.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* ========================== WELCOME (quiet) ========================== */}
      <section className="welcome" id="welcome">
        <div className="grid">
          <h2 className="welcome__head display" data-reveal="lines">Welcome to the next era of competitive trading</h2>
      
        </div>
      
        {/* THE BLACK BOX: a scroll-scrubbed cube that opens as the sentence is read */}
        <div className="box">
          <div className="box__sticky">
            <div className="box__text">
              <span className="mono box__kicker">For decades —</span>
              <p className="box__quiet">For decades, trading has largely been an individual pursuit.</p>
            </div>
            <div className="box__stage">
              <span className="box__guide box__guide--t" aria-hidden="true"></span>
              <span className="box__guide box__guide--b" aria-hidden="true"></span>
              <span className="box__guide box__guide--l" aria-hidden="true"></span>
              <span className="box__guide box__guide--r" aria-hidden="true"></span>
              <div className="box__window">
                <video className="box__video" muted playsInline preload="auto" poster="/media/video/cube-poster.jpg" aria-hidden="true"></video>
              </div>
              <span className="box__tag box__tag--b mono"><i></i>Competitions</span>
              <span className="box__meta mono" aria-hidden="true">FR <b className="box__fr">000</b> / 240</span>
              <span className="box__bar" aria-hidden="true"><i></i></span>
            </div>
          </div>
        </div>
      
        <div className="grid">
          <p className="welcome__big display" data-reveal="lines">Esports Trading<br />changes that<span className="red">.</span></p>
          <div className="welcome__rule" data-reveal="rule"></div>
          <p className="welcome__para-label mono">PvP / Teams / Tournaments / Leagues</p>
          <p className="welcome__para" data-reveal="lines">Instead of simply trading against the market, competitors can test their skills against other traders through structured competitions, PvP duels, team events, tournaments, and leagues.</p>
        </div>
      </section>
      
      {/* ======================= MANIFESTO (high energy) ======================= */}
      <section className="manifesto" aria-label="Trade. Compete. Watch. Rank.">
        <div className="manifesto__sticky">
          <div className="manifesto__bg" aria-hidden="true">
            <img src="/media/img/chain.webp" srcSet="/media/img/chain-sm.webp 1400w, /media/img/chain-md.webp 2400w, /media/img/chain.webp 3840w, /media/img/chain-xl.webp 5120w" sizes="(max-width: 899px) 290vw, 165vw" width="3840" height="2222" alt="" loading="lazy" decoding="async" />
            <div className="manifesto__shade"></div>
          </div>
          <div className="manifesto__dim" aria-hidden="true"></div>
      
          <p className="manifesto__word display" aria-hidden="true"><span>Trade.</span></p>
          <p className="manifesto__word display" aria-hidden="true"><span>Compete.</span></p>
          <p className="manifesto__word display" aria-hidden="true"><span>Watch.</span></p>
          <p className="manifesto__word display" aria-hidden="true"><span>Rank.</span></p>
      
          <div className="manifesto__final">
            <h2 className="manifesto__final-words display"><span>Trade.</span> <span>Compete.</span> <span>Watch.</span> <span>Rank.</span></h2>
            <p className="manifesto__final-line">This is trading built for competition.</p>
          </div>
      
          <div className="manifesto__hud mono" aria-hidden="true">
            <span className="manifesto__count">01 / 04</span>
            <span className="manifesto__index"><span>Trade</span><span>Compete</span><span>Watch</span><span>Rank</span></span>
            <span>Scroll</span>
          </div>
          <div className="manifesto__bar"><i></i></div>
        </div>
      </section>
      
      {/* ======================== WHAT IS ESPORTS TRADING ======================== */}
      <section className="whatis" id="what-is">
        <div className="whatis__pin">
          <div className="whatis__sticky">
            <h2 className="whatis__title display">
              <span className="whatis__line">What is</span>
              <span className="whatis__line">Esports</span>
              <span className="whatis__line">Trading<span className="red">?</span></span>
            </h2>
            <div className="whatis__copy">
              <p className="whatis__p1">Esports Trading is an emerging category of competitive trading that transforms solo market participation into competitions.</p>
              <p className="whatis__p2">Competitors can face one another individually or as part of a team, with results determined by predefined competition rules and measurable trading performance.</p>
            </div>
      
            {/* the copy, played out: one illustrative match, scrubbed by the scroll */}
            <div className="wb" aria-hidden="true">
              <div className="wb__panel wb__panel--solo">
                <p className="wb__k mono"><span>Individually</span><span>1 v 1</span></p>
                <div className="wb__score">
                  <div className="wb__p wb__p--a"><span className="wb__who mono"><i></i>Trader A</span><span className="wb__tag mono">Lead</span><span className="wb__num display">+0.00%</span></div>
                  <div className="wb__p wb__p--b"><span className="wb__who mono"><i></i>Trader B</span><span className="wb__tag mono">Lead</span><span className="wb__num display">+0.00%</span></div>
                </div>
              </div>
              <div className="wb__panel wb__panel--chart">
                <p className="wb__k mono"><span>Measurable performance</span><span><span className="wb__round">Round 03</span><b className="wb__clock">05:00</b></span></p>
                <div className="wb__chart">
                  <span className="wb__zero mono">0%</span>
                  <div className="wb__draw">
                    <svg viewBox="0 0 1000 400" preserveAspectRatio="none">
                      <defs><linearGradient id="wb-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d22a1e" stopOpacity=".28"/><stop offset="1" stopColor="#d22a1e" stopOpacity="0"/></linearGradient></defs>
                      <path className="wb__area" fill="url(#wb-fill)"/>
                      <path className="wb__line wb__line--b" vectorEffect="non-scaling-stroke"/>
                      <path className="wb__line wb__line--a" vectorEffect="non-scaling-stroke"/>
                    </svg>
                  </div>
                  <span className="wb__now"></span>
                  <span className="wb__head wb__head--b"></span>
                  <span className="wb__head wb__head--a"></span>
                </div>
              </div>
              <div className="wb__panel wb__panel--team">
                <p className="wb__k mono"><span>As a team</span><span>3 v 3</span></p>
                <div className="wb__teams"></div>
              </div>
              <div className="wb__rules mono">
                <span className="wb__rules-k">Predefined rules</span>
                <span>Same market</span><span>Same time window</span><span>Same starting capital</span><span>Ranked by return</span>
                <span className="wb__note">Illustrative match — not live data</span>
              </div>
            </div>
          </div>
        </div>
      
        <div className="focus" style={{ '--n': 6 } as CSSProperties}>
          <div className="focus__sticky">
            <div className="focus__hud focus__hud--top mono" aria-hidden="true"><span>Ways to compete</span><span><b className="focus__now">01</b> / <span className="focus__total">06</span></span></div>
            <div className="focus__side">
              <p className="focus__desc" aria-hidden="true"></p>
              <a className="focus__cta u-link big-link" href="#trader-to-competitor" data-cursor="Learn"><span>Learn how Esports Trading works</span><span className="arr">→</span></a>
            </div>
            <div className="focus__col">
              <span className="focus__br focus__br--l" aria-hidden="true"></span><span className="focus__br focus__br--r" aria-hidden="true"></span>
              <ol className="focus__list" aria-label="Ways to compete">{/* rendered from DATA.explorer */}</ol>
            </div>
            <div className="focus__rail" aria-hidden="true"><i></i></div>
          </div>
        </div>
      </section>
      
      {/* ======================= FROM TRADER TO COMPETITOR ======================= */}
      <section className="t2c" id="trader-to-competitor">
        <div className="t2c__sticky">
          <div className="t2c__stage" aria-hidden="true">
            <div className="t2c__scene">
              <img className="t2c__img" src="/media/img/t2c-crowd.webp" width="1672" height="940" alt="" loading="lazy" decoding="async" />
              <span className="t2c__you mono"><i></i><b>You</b></span>
            </div>
            <div className="t2c__shade"></div>
          </div>
      
          <div className="t2c__label">
            <h2 className="t2c__h2 display">From trader to competitor</h2>
          </div>
      
          <div className="t2c__center">
            <div className="t2c__asks">
              <p className="t2c__ask t2c__ask--a">Traditional trading asks:</p>
              <p className="t2c__ask t2c__ask--b">Esports Trading introduces another question:</p>
            </div>
            <p className="t2c__q display" aria-label="Can you beat the market? Can you beat another trader?">
              <span className="t2c__line"><span className="t2c__li">Can you <span className="t2c__slot"><img src="/media/img/market-line-sm.webp" alt="" loading="lazy" decoding="async" /></span> beat</span></span>
              <span className="t2c__line t2c__swap"><span className="t2c__li"><span className="t2c__swap-a">the market?</span><span className="t2c__swap-b">another trader?</span></span></span>
            </p>
          </div>
      
          <div className="t2c__beats">
            <p className="t2c__beat"><span className="mono">01</span>Markets become the playing field.</p>
            <p className="t2c__beat"><span className="mono">02</span>Trading strategies become the game plan.</p>
            <p className="t2c__beat"><span className="mono">03</span>Traders become competitors.</p>
          </div>
      
          <div className="t2c__finale">
            <p className="t2c__finale-pre">And competitions create something markets have rarely had:</p>
            <p className="t2c__finale-big oneliner">A spectator experience.</p>
          </div>
        </div>
      </section>
      
      {/* =============================== ECOSYSTEM =============================== */}
      <section className="eco" id="ecosystem" aria-labelledby="eco-title">
        <div className="deck">
          <div className="deck__intro">
            <h2 className="deck__h2 display" id="eco-title">The Esports<br />Trading<br /><span className="deck__arr" aria-hidden="true">↳</span>Ecosystem</h2>
            <p className="deck__lead">Esports Trading isn't one game, platform, or competition. It is an ecosystem.</p>
            <p className="deck__count mono" aria-hidden="true"><b className="deck__now">01</b> / 06</p>
          </div>
          <ol className="deck__stack">{/* cards rendered from DATA.ecosystem */}</ol>
        </div>
      </section>
      
      {/* ================================ LEAGUE ================================ */}
      <section className="league" id="league">
        <div className="grid">
          <h2 className="league__name display" data-reveal="lines">Esports Trading League</h2>
        </div>
        <div className="league__etl-wrap"><p className="league__etl display" aria-hidden="true"><span className="fit-target">ETL</span></p></div>
      
        <ul className="league__pillars">
          <li className="league__pillar"><span className="mono">01</span><h3 className="display">Organized Competition.</h3><span className="mono">—</span></li>
          <li className="league__pillar"><span className="mono">02</span><h3 className="display">Common Standards.</h3><span className="mono">—</span></li>
          <li className="league__pillar"><span className="mono">03</span><h3 className="display">Championship Events.</h3><span className="mono">—</span></li>
        </ul>
      
        <div className="league__copy grid">
          <p data-reveal="lines">The <strong>Esports Trading League (ETL)</strong> is being developed to provide structure for organized competitive trading.</p>
          <p data-reveal="lines">The league's mission is to help establish transparent competition standards, consistent rules, player and team structures, rankings, sanctioned events, and championship competition.</p>
        </div>
      
        <a className="league__cta" href="https://www.esportstradingleagues.com/" target="_blank" rel="noopener" data-cursor="Visit">
          <span className="league__cta-text display">Visit Esports Trading League</span>
          <span className="league__cta-side"><span className="league__cta-arrow">→</span><span className="mono">www.esportstradingleagues.com</span></span>
        </a>
      </section>
      
      {/* ========================== COMPETITIVE FORMATS ========================== */}
      <section className="cf" id="formats">
        <div className="cf__pin">
          <div className="cf__sticky">
            <div className="cf__head">
              <h2 className="cf__title display">Competitive Formats</h2>
              <p className="cf__sub">There’s more than one way to compete in Esports Trading.</p>
            </div>
      
            <div className="cf__stage" aria-hidden="true">
              <div className="cf__halo"></div>
              <div className="cf__ring"><i></i></div>
              <figure className="cf__trophy">
                <img src="/media/img/trophy-hero.webp" srcSet="/media/img/trophy-hero-sm.webp 600w, /media/img/trophy-hero.webp 1024w" sizes="(max-width: 899px) 60vw, 40vw" alt="" loading="lazy" decoding="async" />
                <div className="cf__sheen"></div>
              </figure>
            </div>
      
            <ol className="cf__list">{/* rendered from DATA.formats */}</ol>
      
            <div className="cf__detail" aria-live="polite">
              <span className="cf__num" aria-hidden="true"><span>01</span></span>
              <h3 className="cf__dtitle display"><span></span></h3>
              <p className="cf__desc"></p>
            </div>
            <div className="cf__count mono" aria-hidden="true"><span className="cf__cur">01</span><span className="cf__bar"><i></i></span><span>05</span></div>
          </div>
        </div>
      </section>
      
      {/* ================================ LATEST ================================ */}
      <section className="latest" id="latest">
        <div className="latest__head mono">
          <h2 className="latest__h2 display">Latest from Esports Trading</h2>
          <span>01 Article</span>
        </div>
        <a className="article-card" href="#/latest/esports-trading-for-crypto" data-cursor="Read">
          <div className="article-card__stage"><div className="article-card__media"><img src="/media/img/magazine.webp" srcSet="/media/img/magazine-sm.webp 900w, /media/img/magazine.webp 1600w" sizes="(max-width: 899px) 100vw, 55vw" alt="" loading="lazy" decoding="async" /></div></div>
          <div className="article-card__text">
            <div className="article-card__meta mono"><span>Article</span><span>Crypto</span></div>
            <h3 className="article-card__title display"><span>Esports Trading</span><span>for Crypto is</span><span>the next Billion</span><span>Dollar Industry</span></h3>
            <div className="article-card__foot"><span className="article-card__arrow"><span>→</span></span><span className="mono">Read the article</span></div>
          </div>
        </a>
      </section>
      
      {/* ============================== NEWSLETTER ============================== */}
      <section className="news" id="updates">
        <p className="news__label mono"><span>Stay Informed</span></p>
      
        <div className="news__tapes" aria-hidden="true">
          <div className="news__tape news__tape--b display"><div className="news__track"></div></div>
          <div className="news__tape news__tape--a display"><div className="news__track"></div></div>
        </div>
      
        <div className="news__main">
          <h2 className="news__title display" data-reveal="lines">Get Esports Trading Updates</h2>
          <p className="news__sub" data-reveal="lines">News, events, rankings and more.</p>
          <form className="news__form" noValidate>
            <label className="news__field" htmlFor="news-email">
              <span className="news__prefix mono"><i></i>Your email</span>
              <input className="news__input" id="news-email" name="email" type="email" autoComplete="email" placeholder="name@domain.com" required />
              <button className="news__submit" type="submit" data-cursor="Join"><span>Join the Movement</span><span className="arr">→</span></button>
              <span className="news__fill" aria-hidden="true"></span>
            </label>
            <p className="news__status mono" role="status" aria-live="polite"><span className="news__msg"></span></p>
          </form>
        </div>
      </section>
      
      {/* =============================== PARTNERS =============================== */}
      <section className="partners" id="partners">
        <div className="partners__head">
          <h2 className="partners__h2 display" data-reveal="lines">Founding Platforms &amp; Partners</h2>
          <p className="partners__kicker mono">A strong ecosystem together</p>
        </div>
        <ul className="partners__grid">
          <li><div className="partner" data-cursor="Partner"><span className="partner__top mono"><span>P / 01</span></span><span className="partner__name display">FatCat Arena</span></div></li>
          <li><a className="partner" href="https://www.esportstradingleague.com" target="_blank" rel="noopener" data-cursor="Visit"><span className="partner__top mono"><span>P / 02</span><span>↗</span></span><span className="partner__name display">Esports Trading League</span></a></li>
          <li><div className="partner" data-cursor="Partner"><span className="partner__top mono"><span>P / 03</span></span><span className="partner__name display">TradingView</span></div></li>
          <li><div className="partner" data-cursor="Partner"><span className="partner__top mono"><span>P / 04</span></span><span className="partner__name display">Interactive Brokers</span></div></li>
          <li><div className="partner" data-cursor="Partner"><span className="partner__top mono"><span>P / 05</span></span><span className="partner__name display">Tradovate</span></div></li>
          <li><div className="partner" data-cursor="Partner"><span className="partner__top mono"><span>P / 06</span></span><span className="partner__name display">Commsovre</span></div></li>
          <li><div className="partner partner--more"><span className="partner__name">And more to come.</span></div></li>
        </ul>
      </section>
      
      </main>
      
      {/* ============================ FOOTER / FINAL ============================ */}
      <footer className="ft">
        <div className="ft__media" aria-hidden="true"><img src="/media/img/summit.webp" srcSet="/media/img/summit-sm.webp 900w, /media/img/summit.webp 1920w" sizes="100vw" alt="" loading="lazy" decoding="async" /></div>
        <h2 className="ft__title display" aria-label="Building the sport of trading">
          <span className="fit" aria-hidden="true"><span className="fit-target">Building the</span></span>
          <span className="fit" aria-hidden="true"><span className="fit-target">Sport of Trading</span></span>
        </h2>
      
        <div className="ft__body grid">
          <p className="ft__begin" data-reveal="lines">Every competitive category begins somewhere.</p>
          <ol className="ft__steps">
            <li><span className="mono">01</span><span>Rules are established.</span></li>
            <li><span className="mono">02</span><span>Players emerge.</span></li>
            <li><span className="mono">03</span><span>Teams form.</span></li>
            <li><span className="mono">04</span><span>Rivalries develop.</span></li>
            <li><span className="mono">05</span><span>Fans watch.</span></li>
            <li><span className="mono">06</span><span>Champions are crowned.</span></li>
          </ol>
          <div className="ft__data data" aria-hidden="true"></div>
          <p className="ft__close" data-reveal="lines">Esports Trading is building the infrastructure to form the next billion dollar industry.</p>
          <p className="ft__legal">Esports Trading is a competitive trading category. Trading and competition may involve financial risk. Availability of particular products, competitions, prizes, or financial instruments may vary by jurisdiction.</p>
        </div>
      
        {/* the closing panel: links, time, and the signature bleeding off the bottom */}
        <div className="fp">
          <div className="fp__glow" aria-hidden="true"></div>
          <div className="fp__top grid">
            <div className="fp__time">
              <p className="fp__k mono">Local time</p>
              <p className="fp__clock display">00:00:00</p>
              <p className="fp__words mono"><span>Trade</span><span>Compete</span><span>Watch</span><span>Rank</span></p>
            </div>
            <div className="fp__cols">
              {/* TODO: point the placeholder (#) links at real pages once they exist */}
              <nav className="fp__col" aria-label="Explore">
                <p className="fp__k mono">Explore</p>
                <ul><li><a href="#"><span>About</span><span className="fp__go" aria-hidden="true">↗</span></a></li><li><a href="#"><span>Media</span><span className="fp__go" aria-hidden="true">↗</span></a></li><li><a href="#"><span>Partnerships</span><span className="fp__go" aria-hidden="true">↗</span></a></li><li><a href="#"><span>Contact</span><span className="fp__go" aria-hidden="true">↗</span></a></li></ul>
              </nav>
              <nav className="fp__col" aria-label="Social">
                <p className="fp__k mono">Social</p>
                <ul><li><a href="https://twitter.com" target="_blank" rel="noopener"><svg className="fp__bird" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg><span>Twitter</span><span className="fp__go" aria-hidden="true">↗</span></a></li><li><a href="#"><span>Email</span><span className="fp__go" aria-hidden="true">↗</span></a></li></ul>
              </nav>
              <nav className="fp__col" aria-label="Legal">
                <p className="fp__k mono">Legal</p>
                <ul><li><a href="#"><span>Privacy Policy</span><span className="fp__go" aria-hidden="true">↗</span></a></li><li><a href="#"><span>Terms of Service</span><span className="fp__go" aria-hidden="true">↗</span></a></li></ul>
              </nav>
            </div>
          </div>
      
          <div className="fp__bar">
            <span className="fp__copy mono">© 2026 EsportsTrading.com</span>
            <span className="fp__line" aria-hidden="true"></span>
            <a className="fp__up" href="#top" data-cursor="Top" aria-label="Back to top"><span className="mono">Back to top</span><span className="fp__up-btn" aria-hidden="true"><i>↑</i></span></a>
          </div>
      
          <a className="ft__sign" href="#top" aria-label="Esports Trading — back to top" data-cursor="Top">
            <span className="ft__sign-row fit-target">
              <svg className="ft__sign-e" viewBox="0 0 507 459" aria-hidden="true"><path d="M171 0H507L419 92H238L206 179L66 281Z"/><path d="M236 182H415L331 276H170L143 353L0 457L50 319Z"/><path d="M160 367H415L344 459H33Z"/></svg>
              <span className="ft__sign-word display"><b>sports</b><span>Trading</span></span>
            </span>
          </a>
        </div>
      </footer>
      
      {/* ============================== ARTICLE VIEW ============================== */}
      <article className="article" aria-hidden="true" aria-labelledby="article-title" data-lenis-prevent="">
        <div className="article__bar mono">
          <button className="article__back" data-cursor="Back"><span className="roll"><span data-text="← Back to Esports Trading">← Back to Esports Trading</span></span></button>
          <span>Latest from Esports Trading</span>
        </div>
        <header className="article__head">
          <div className="article__meta mono"><span>Article</span><span>Crypto</span></div>
          <h1 className="article__title display" id="article-title">Esports Trading for Crypto is the next Billion Dollar Industry</h1>
        </header>
        <div className="article__media"><img className="cover" src="/media/img/arena-to-data.webp" alt="" loading="lazy" decoding="async" /></div>
        <div className="article__body grid">
          <div className="article__prose">
            <p className="article__lead">Crypto markets never close. They run around the clock, around the world, and they already have one of the most engaged communities in finance. Esports Trading gives that energy a new shape: competition.</p>

            <h2 className="display">From solo pursuit to competitive sport</h2>
            <p>For most of its history, trading has been an individual pursuit. You against the market, with results that stay private. Esports Trading changes that. Instead of simply trading against the market, competitors test their skills against other traders through structured competitions: PvP duels, team events, tournaments, and leagues.</p>
            <p>The question shifts from &ldquo;Can you beat the market?&rdquo; to &ldquo;Can you beat another trader?&rdquo; That one change turns a solitary activity into something that can be organized, ranked, followed, and watched.</p>

            <h2 className="display">Why crypto is the natural arena</h2>
            <p>Crypto has the ingredients that competitive formats need.</p>
            <ul className="article__list">
              <li><span className="mono">01</span><span><strong>Always-on markets.</strong> Trading runs 24/7, so competitions can be scheduled for any time zone, any day of the week.</span></li>
              <li><span className="mono">02</span><span><strong>Global and digital-native.</strong> Crypto traders already live online, in the same places where esports audiences gather.</span></li>
              <li><span className="mono">03</span><span><strong>Fast, visible price action.</strong> Volatile markets produce moments that are easy to follow and exciting to watch.</span></li>
              <li><span className="mono">04</span><span><strong>A community that competes.</strong> Leaderboards, trading challenges, and public track records are already part of crypto culture.</span></li>
            </ul>

            <h2 className="display">What makes a competition fair</h2>
            <p>A sport needs rules everyone can trust. In Esports Trading, results are decided by predefined competition rules and measurable trading performance: the same market, the same time window, the same starting capital, ranked by return. Skill, strategy, and decision-making separate the winners, not the size of anyone&rsquo;s account.</p>

            <h2 className="display">Formats built for crypto</h2>
            <p>There&rsquo;s more than one way to compete. Two traders go head-to-head in 1v1 PvP matches. Trading teams represent organizations in team-vs-team play. Tournament brackets bring many competitors together to decide champions. Creator and exhibition events feature well-known traders and personalities. Open competitions let newcomers enter events, set records, and start climbing the rankings.</p>

            <h2 className="display">The spectator experience</h2>
            <p>Competition creates something markets have rarely had: an audience. Fans can follow traders, teams, rivalries, and championship events. They can watch strategies unfold live and see the market from a new angle. Once people watch, you get the things every major competitive category is built on: storylines, stars, and fan loyalty.</p>

            <h2 className="display">Why the opportunity is so large</h2>
            <p>Esports showed that a competitive category can grow into a global industry through players, teams, leagues, broadcasts, sponsors, and fans. Crypto brings a large, highly engaged audience that is already comfortable with digital-first experiences. Together they create room for a new ecosystem of platforms, leagues, tournaments, teams, and media. That is why Esports Trading for crypto has the makings of the next billion dollar industry.</p>

            <h2 className="display">Building the sport of trading</h2>
            <p>Every competitive category begins somewhere. Rules are established. Players emerge. Teams form. Rivalries develop. Fans watch. Champions are crowned. The Esports Trading League is being developed to provide that structure, with transparent competition standards, consistent rules, rankings, sanctioned events, and championship competition.</p>
            <p className="article__cta display">Trade. Compete. Watch. Rank.</p>

            <p className="article__legal">Esports Trading is a competitive trading category. Trading and competition may involve financial risk. Availability of particular products, competitions, prizes, or financial instruments may vary by jurisdiction.</p>
          </div>
        </div>
      </article>
      <LandingScript />
    </>
  );
}
