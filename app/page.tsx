import { ContactForm } from "@/components/ContactForm";
import { Navigation } from "@/components/Navigation";
import { ParticleField } from "@/components/ParticleField";
import { ScrollReveal } from "@/components/ScrollReveal";

const engines = [
  ["01", "Technology", "Embodied AI · Intelligent Systems · Applications"],
  ["02", "Capital", "Private Markets · Real Assets · Growth"],
  ["03", "Global Services", "Entrepreneurs · Families · Global Expansion"],
] as const;

const stages = ["Learn", "Build", "Deploy", "Commercialize"];

// 生态板块的四家实体，各自链到独立站点。eduready.ai 的 www 会 301 到根域，
// 这里直接写最终地址，省掉一次跳转。
const units = [
  {
    position: "unit-a",
    category: "TECHNOLOGY",
    name: "AXIN Intelligent Systems",
    href: "https://eduready.ai/",
  },
  {
    position: "unit-b",
    category: "GLOBAL SERVICES",
    name: "YUNO Family Office",
    href: "https://www.yunofamilyoffice.com/",
  },
  {
    position: "unit-c",
    category: "CAPITAL",
    name: "METO Capital",
    href: "https://www.metocapital.com/",
  },
  {
    position: "unit-d",
    category: "EDUCATION & TALENT",
    name: "Aili Academy",
    href: "https://www.ailiacademy.com/",
  },
] as const;

export default function Home() {
  return (
    <main>
      <ScrollReveal />
      <Navigation />

      <section id="home" className="hero section-dark">
        <ParticleField />
        <div className="grid-layer" aria-hidden="true" />
        <div className="hero-glow" aria-hidden="true" />
        <div className="page-shell hero-shell">
          <div className="hero-meta">
            <span>AXIN INTERNATIONAL GROUP</span>
            <span>TECHNOLOGY · CAPITAL · GLOBAL SERVICES</span>
          </div>
          <div className="hero-brand" aria-label="AXIN">
            <span className="brand-back" aria-hidden="true">AXIN</span>
            <span className="brand-mid" aria-hidden="true">AXIN</span>
            <h1>AXIN</h1>
            <span className="brand-shine" aria-hidden="true">AXIN</span>
          </div>
          <div className="hero-bottom">
            <h2>Powering the Next Generation<br />of Global Growth.</h2>
            <p>A U.S.-based platform connecting technology, capital and global opportunity.</p>
          </div>
        </div>
        <a className="scroll-hint" href="#group">Scroll to explore <span>↓</span></a>
      </section>

      <div className="marquee" aria-hidden="true"><div>
        {Array.from({ length: 2 }).flatMap((_, copy) => [
          <span key={`a${copy}`}>AXIN INTERNATIONAL GROUP</span>, <i key={`i1${copy}`}>◆</i>,
          <span key={`b${copy}`}>TECHNOLOGY</span>, <i key={`i2${copy}`}>◆</i>,
          <span key={`c${copy}`}>CAPITAL</span>, <i key={`i3${copy}`}>◆</i>,
          <span key={`d${copy}`}>GLOBAL SERVICES</span>, <i key={`i4${copy}`}>◆</i>,
        ])}
      </div></div>

      <section id="group" className="group section-dark">
        <div className="continuity-light" aria-hidden="true" />
        <div className="page-shell">
          <div className="section-label">01 / THE GROUP</div>
          <div className="group-heading" data-reveal>
            <p className="eyebrow">AXIN INTERNATIONAL GROUP</p>
            <h2>Built at the intersection of <em>technology</em>, <em>capital</em> and <em>global growth.</em></h2>
          </div>
          <div className="engine-list">
            {engines.map(([number, title, description]) => (
              <article key={title} className="engine-row" data-reveal>
                <span className="engine-number">{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
                <span className="engine-arrow">↗</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="technology" className="technology section-dark">
        <div className="technology-aura" aria-hidden="true" />
        <div className="page-shell technology-grid">
          <div className="technology-copy" data-reveal>
            <div className="section-label">02 / INTELLIGENT SYSTEMS</div>
            <p className="eyebrow">AXIN INTELLIGENT SYSTEMS</p>
            <h2>Intelligence Is Becoming <em>Physical.</em></h2>
            <p className="technology-intro">Building the application layer between intelligent technology and real-world deployment.</p>
          </div>
          <div className="technology-core" aria-hidden="true">
            <div className="core-halo halo-one" />
            <div className="core-halo halo-two" />
            <div className="core-orbit orbit-one" />
            <div className="core-orbit orbit-two" />
            <div className="core-sphere"><span /></div>
          </div>
          <div className="stage-list">
            {stages.map((stage, index) => (
              <div className="stage" key={stage} data-reveal>
                <span>0{index + 1}</span><strong>{stage}</strong><i />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="ecosystem" className="ecosystem section-dark">
        <div className="page-shell">
          <div className="section-label">03 / ECOSYSTEM</div>
          <div className="ecosystem-heading" data-reveal>
            <p className="eyebrow">ONE ECOSYSTEM</p>
            <h2>Multiple engines of <em>global growth.</em></h2>
          </div>
          <div className="ecosystem-map" data-reveal>
            <div className="ring ring-one" aria-hidden="true" />
            <div className="ring ring-two" aria-hidden="true" />
            <div className="ecosystem-center">AXIN</div>
            {units.map(unit => (
              <a
                key={unit.position}
                className={`unit ${unit.position}`}
                href={unit.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${unit.name} — ${unit.category}, opens in a new tab`}
              >
                <small>{unit.category}</small>
                <strong>{unit.name}</strong>
                <span className="unit-go" aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="global" className="global section-dark">
        <div className="global-orb" aria-hidden="true"><div /><i /><i /><i /></div>
        <div className="page-shell global-layout">
          <div className="global-copy" data-reveal>
            <div className="section-label">04 / GLOBAL GROWTH</div>
            <p className="eyebrow">FROM INNOVATION</p>
            <h2>To Global <em>Scale.</em></h2>
          </div>
          <div className="global-themes" data-reveal>
            <span>Market Entry</span><span>Commercialization</span><span>Talent</span><span>Capital</span>
          </div>
        </div>
      </section>

      <section id="contact" className="contact section-dark">
        <div className="contact-orbit orbit-a" aria-hidden="true" />
        <div className="contact-orbit orbit-b" aria-hidden="true" />
        <div className="contact-light" aria-hidden="true" />
        <div className="page-shell contact-layout">
          <div className="contact-copy" data-reveal>
            <p className="eyebrow">AXIN INTERNATIONAL GROUP</p>
            <h2>What&apos;s Next<br />Starts <em>Here.</em></h2>
            <p>Build with AXIN. Grow with AXIN. Partner with AXIN.</p>
          </div>
          <div data-reveal><ContactForm /></div>
        </div>
        <footer className="page-shell footer">
          <strong>AXIN</strong><span>Technology · Capital · Global Services</span><span>© {new Date().getFullYear()} AXIN International Group</span>
        </footer>
      </section>
    </main>
  );
}
