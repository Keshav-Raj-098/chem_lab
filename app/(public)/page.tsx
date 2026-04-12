import Link from "next/link";
import ResearchCards from "@/components/pub/researchCards";
import ResearchFacilitiesSection from "@/components/pub/researchFacilitiesSection";
import NewsSection from "@/components/pub/newsCard";
import JoinUs from "@/components/pub/joinUs";
import HomeAnimations from "@/components/pub/homeAnimations";

export default function Home() {
  return (
    <div className="relative">
      {/* GSAP animations — client component targeting DOM via data attributes */}
      <HomeAnimations />

      {/* ═══ HERO ═══ */}
      <section className="hero">
        <div className="hero-bg" style={{ backgroundImage: 'url("/hero2.jpg")' }} />
        <div className="hero-overlay" />

        {/* Decorative molecular SVG */}
        <div className="hero-molecular-svg" data-anim="hero-molecular">
          <svg width="500" height="500" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g stroke="rgba(255,255,255,0.3)" strokeWidth="0.5">
              <polygon points="250,120 290,143 290,187 250,210 210,187 210,143" />
              <polygon points="290,143 330,166 330,210 290,233 250,210 250,166" />
              <polygon points="250,210 290,233 290,277 250,300 210,277 210,233" />
              <polygon points="210,143 250,166 250,210 210,233 170,210 170,166" />
              <polygon points="330,166 370,189 370,233 330,256 290,233 290,189" />
              <polygon points="170,166 210,189 210,233 170,256 130,233 130,189" />
              <polygon points="290,277 330,300 330,344 290,367 250,344 250,300" />
              <polygon points="210,277 250,300 250,344 210,367 170,344 170,300" />
              <polygon points="370,233 410,256 410,300 370,323 330,300 330,256" />
              <polygon points="130,233 170,256 170,300 130,323 90,300 90,256" />
              <polygon points="330,344 370,367 370,411 330,434 290,411 290,367" />
              <polygon points="170,344 210,367 210,411 170,434 130,411 130,367" />
            </g>
            <g fill="rgba(255,255,255,0.2)">
              <circle cx="250" cy="120" r="3" /><circle cx="290" cy="143" r="3" />
              <circle cx="290" cy="187" r="3" /><circle cx="250" cy="210" r="3" />
              <circle cx="210" cy="187" r="3" /><circle cx="210" cy="143" r="3" />
              <circle cx="330" cy="166" r="3" /><circle cx="330" cy="210" r="3" />
              <circle cx="290" cy="233" r="3" /><circle cx="250" cy="166" r="3" />
              <circle cx="170" cy="166" r="3" /><circle cx="170" cy="210" r="3" />
              <circle cx="210" cy="233" r="3" /><circle cx="290" cy="277" r="3" />
              <circle cx="250" cy="300" r="3" /><circle cx="210" cy="277" r="3" />
              <circle cx="370" cy="189" r="2.5" /><circle cx="370" cy="233" r="2.5" />
              <circle cx="330" cy="256" r="2.5" /><circle cx="130" cy="189" r="2.5" />
              <circle cx="130" cy="233" r="2.5" /><circle cx="170" cy="256" r="2.5" />
              <circle cx="330" cy="300" r="2.5" /><circle cx="330" cy="344" r="2.5" />
              <circle cx="290" cy="367" r="2.5" /><circle cx="250" cy="344" r="2.5" />
              <circle cx="210" cy="367" r="2.5" /><circle cx="170" cy="344" r="2.5" />
              <circle cx="170" cy="300" r="2.5" />
              <circle cx="410" cy="256" r="2" /><circle cx="410" cy="300" r="2" />
              <circle cx="370" cy="323" r="2" /><circle cx="90" cy="256" r="2" />
              <circle cx="90" cy="300" r="2" /><circle cx="130" cy="323" r="2" />
              <circle cx="370" cy="367" r="2" /><circle cx="370" cy="411" r="2" />
              <circle cx="330" cy="434" r="2" /><circle cx="290" cy="411" r="2" />
              <circle cx="210" cy="411" r="2" /><circle cx="170" cy="434" r="2" />
              <circle cx="130" cy="411" r="2" /><circle cx="130" cy="367" r="2" />
            </g>
          </svg>
        </div>

        <div className="hero-content">
          <div className="hero-badge" data-anim="hero-badge">
            <span className="hero-badge-dot" />
            <span className="hero-badge-text">IIT Delhi &middot; Chemical Engineering</span>
          </div>

          <h1 className="hero-title" data-anim="hero-title">
            Chemical Research Lab<br />
            <span className="hero-title-accent">IIT Delhi</span>
          </h1>

          <p className="hero-subtitle" data-anim="hero-subtitle">
            Pioneering disruptive innovations in chemical sciences through
            advanced material design and sustainable methodologies.
          </p>

          <div className="hero-buttons" data-anim="hero-buttons">
            <Link href="/research/projects" className="hero-btn-primary">
              Explore Research
            </Link>
            <Link href="/publications" className="hero-btn-secondary">
              Publications
            </Link>
          </div>
        </div>

        <div className="hero-scroll-indicator" data-anim="hero-scroll">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M5 8l5 5 5-5" />
          </svg>
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <section className="stats-bar" data-anim="stats-section">
        <div className="stats-grid">
          <div className="stat-item" data-anim="stat" data-count="100" data-suffix="+">
            <div className="stat-number">0+</div>
            <div className="stat-label">Publications</div>
          </div>
          <div className="stat-item" data-anim="stat" data-count="20" data-suffix="+">
            <div className="stat-number">0+</div>
            <div className="stat-label">Research Projects</div>
          </div>
          <div className="stat-item" data-anim="stat" data-count="15" data-suffix="+">
            <div className="stat-number">0+</div>
            <div className="stat-label">Awards</div>
          </div>
          <div className="stat-item" data-anim="stat" data-count="10" data-suffix="+">
            <div className="stat-number">0+</div>
            <div className="stat-label">Collaborations</div>
          </div>
          <div className="stat-item" data-anim="stat" data-count="32" data-suffix="">
            <div className="stat-number">0</div>
            <div className="stat-label">Team Members</div>
          </div>
        </div>
      </section>

      {/* ═══ ABOUT ═══ */}
      <section className="section" style={{ background: 'white' }}>
        <div className="section-container">
          <div className="about-grid">
            <div data-anim="about-left">
              <div className="section-label">About the Lab</div>
              <h2 className="section-heading">Advancing Chemical Sciences at IIT Delhi</h2>
              <p className="about-body">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum odio quod voluptates voluptatum beatae ad asperiores pariatur labore eveniet aliquid libero fuga ex, cumque reprehenderit quisquam delectus saepe sequi? Animi distinctio dolorem, deleniti doloremque enim sapiente quo, debitis eum reiciendis, repellat soluta numquam dolorum alias voluptate atque eaque culpa exercitationem nostrum. Voluptas ad porro vero fugiat modi? Consectetur cum dicta illum nisi aliquam blanditiis amet tempore temporibus mollitia ex quibusdam provident quos odit enim, inventore maxime?
              </p>
            </div>
            <div data-anim="about-right">
              <div className="about-card">
                <div className="about-focus-item">
                  <div className="about-focus-number">01</div>
                  <div className="about-focus-title">Catalysis &amp; Reaction Engineering</div>
                  <div className="about-focus-desc">Designing next-generation catalytic systems for efficient chemical transformations and industrial applications.</div>
                </div>
                <div className="about-focus-item">
                  <div className="about-focus-number">02</div>
                  <div className="about-focus-title">Advanced Material Synthesis</div>
                  <div className="about-focus-desc">Developing novel materials with tailored properties for energy, environment, and healthcare applications.</div>
                </div>
                <div className="about-focus-item">
                  <div className="about-focus-number">03</div>
                  <div className="about-focus-title">Sustainable Chemical Processes</div>
                  <div className="about-focus-desc">Creating green methodologies that minimize environmental impact while maximizing process efficiency.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ RESEARCH AREAS ═══ */}
      <section className="section research-section">
        <div className="section-container">
          <div className="section-header-row">
            <div>
              <div className="section-label">Latest Work</div>
              <h2 className="section-heading">Research &amp; Announcements</h2>
            </div>
            <Link href="/research/areas" className="section-link">Explore more &rarr;</Link>
          </div>
          <ResearchCards />
          <div style={{ marginTop: 40 }}>
            <Link href="/research/areas" className="explore-btn">Explore more</Link>
          </div>
        </div>
      </section>

      {/* ═══ SCROLL QUOTE INTERLUDE ═══ */}
      <section className="section" style={{ background: 'white' }}>
        <div className="section-container">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 48 }}>
            <span style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 300, color: 'var(--c-text-primary)', lineHeight: 1.3 }} data-anim="fade-up">
              Don&apos;t just capture change.
            </span>
            <span style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 300, color: 'var(--c-teal)', lineHeight: 1.3, marginTop: 4 }} data-anim="fade-up">
              Act on it.
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32, maxWidth: 900, margin: '0 auto' }}>
            <div data-anim="fade-left" style={{ fontSize: '1rem', color: 'var(--c-text-muted)', lineHeight: 1.75 }}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus incidunt nulla debitis laudantium consequuntur ab nobis qui ea distinctio labore, hic adipisci ex in magni ducimus minima maiores voluptates sed quos autem facilis dignissimos repudiandae.
            </div>
            <div data-anim="fade-right" style={{ fontSize: '1rem', color: 'var(--c-text-muted)', lineHeight: 1.75 }}>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Veniam, illum aliquid velit sunt modi libero accusantium praesentium eos cumque ducimus consequatur voluptatum iusto atque! Reprehenderit, quam fugiat perspiciatis eaque sed explicabo deleniti impedit aliquam ea, distinctio esse. Dicta, accusamus. Fugiat ad assumenda deleniti laborum necessitatibus!
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FACILITIES ═══ */}
      <section className="section" style={{ background: 'white' }}>
        <div className="section-container">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>Our Infrastructure</div>
            <h2 className="section-heading" style={{ textAlign: 'center' }}>Research Facilities</h2>
            <p className="facilities-subtitle">
              Our lab is equipped with state-of-the-art instruments that enable cutting-edge research in chemical sciences. From advanced spectrometers to high-resolution microscopes, we have the tools necessary to explore the frontiers of chemistry.
            </p>
          </div>
          <ResearchFacilitiesSection />
        </div>
      </section>

      {/* ═══ NEWS ═══ */}
      <NewsSection />

      {/* ═══ CTA ═══ */}
      <JoinUs />
    </div>
  );
}
