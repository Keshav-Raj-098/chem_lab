import Link from "next/link";
import ResearchCards from "@/components/pub/researchCards";
import ResearchFacilitiesSection from "@/components/pub/researchFacilitiesSection";
import NewsSection from "@/components/pub/newsCard";
import JoinUs from "@/components/pub/joinUs";
import HomeAnimations from "@/components/pub/homeAnimations";

export default function Home() {
  return (
    <div className="relative">
      <HomeAnimations />

      {/* ═══ HERO ═══ */}
      <section className="hero">
        <div className="hero-bg" style={{ backgroundImage: 'url("/hero2.jpg")' }} />
        <div className="hero-overlay" />

        <div className="hero-content">
          <div className="hero-badge" data-anim="hero-badge">
            <span className="hero-badge-label">Department of Chemical Engineering &middot; IIT Delhi</span>
          </div>

          <h1 className="hero-title" data-anim="hero-title">
            Advancing chemical sciences
            <span className="hero-title-accent">through rigorous research.</span>
          </h1>

          <span className="hero-title-divider" data-anim="hero-title" />

          <p className="hero-subtitle" data-anim="hero-subtitle">
            We pursue fundamental questions in catalysis, advanced materials, and sustainable
            chemical processes, translating discoveries into applications that serve science
            and society.
          </p>

          <div className="hero-buttons" data-anim="hero-buttons">
            <Link href="/research/areas" className="hero-btn-primary">
              Explore Research
            </Link>
            <Link href="/publications" className="hero-btn-secondary">
              View Publications
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
                Our laboratory brings together researchers investigating the frontiers of chemical
                engineering — from single-atom catalysts that enable greener reactions to advanced
                materials designed for energy storage, environmental remediation, and healthcare.
                We publish in leading journals, collaborate with industry, and train the next
                generation of chemical scientists.
              </p>
            </div>
            <div data-anim="about-right">
              <div className="about-card">
                <div className="about-focus-item">
                  <div className="about-focus-number">I.</div>
                  <div className="about-focus-title">Catalysis &amp; Reaction Engineering</div>
                  <div className="about-focus-desc">Designing catalytic systems for efficient chemical transformations and industrial applications.</div>
                </div>
                <div className="about-focus-item">
                  <div className="about-focus-number">II.</div>
                  <div className="about-focus-title">Advanced Material Synthesis</div>
                  <div className="about-focus-desc">Developing novel materials with tailored properties for energy, environment, and healthcare.</div>
                </div>
                <div className="about-focus-item">
                  <div className="about-focus-number">III.</div>
                  <div className="about-focus-title">Sustainable Chemical Processes</div>
                  <div className="about-focus-desc">Creating green methodologies that minimize environmental impact while maximizing efficiency.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ RESEARCH & ANNOUNCEMENTS ═══ */}
      <section className="section research-section">
        <div className="section-container">
          <div className="section-header-row">
            <div>
              <div className="section-label">Latest Work</div>
              <h2 className="section-heading">Research &amp; Announcements</h2>
            </div>
            <Link href="/research/areas" className="section-link">View all research &rarr;</Link>
          </div>
          <ResearchCards />
          <div style={{ marginTop: 48 }}>
            <Link href="/research/areas" className="explore-btn">Explore Research Areas</Link>
          </div>
        </div>
      </section>

      {/* ═══ FACILITIES ═══ */}
      <section className="section" style={{ background: 'white' }}>
        <div className="section-container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="section-label" style={{ justifyContent: 'center' }}>Our Infrastructure</div>
            <h2 className="section-heading" style={{ textAlign: 'center' }}>Research Facilities</h2>
            <p className="facilities-subtitle">
              Our laboratory is equipped with state-of-the-art instruments supporting research across
              spectroscopy, microscopy, thermal analysis, and chemical characterization.
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
