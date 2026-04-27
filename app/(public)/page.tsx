import Link from "next/link";
import ResearchCards from "@/components/pub/researchCards";
import ResearchFacilitiesSection from "@/components/pub/researchFacilitiesSection";
import NewsSection from "@/components/pub/newsCard";
import JoinUs from "@/components/pub/joinUs";
import { Reveal, HeroReveal, StatCounter } from "@/components/pub/reveal";
import {
  fetchHomeStats,
  fetchLatestPublications,
  fetchLatestProjects,
  fetchLatestEquipments,
} from "@/lib/load_data/load_home";

export const revalidate = 3600;

export default async function Home() {
  const [stats, publications, projects, equipments] = await Promise.all([
    fetchHomeStats(),
    fetchLatestPublications(4),
    fetchLatestProjects(2),
    fetchLatestEquipments(8),
  ]);
  return (
    <div className="relative">
      {/* ═══ HERO ═══ */}
      <section className="hero">
        <div className="hero-bg" style={{ backgroundImage: 'url("/hero2.jpg")' }} />
        <div className="hero-overlay" />

        <div className="hero-content">
          <HeroReveal delay={0.2}>
            <div className="hero-badge">
              <span className="hero-badge-label">Department of Chemical Engineering &middot; IIT Delhi</span>
            </div>
          </HeroReveal>

          <HeroReveal delay={0.4} y={40} duration={1}>
            <h1 className="hero-title">
              Advancing chemical sciences
              <span className="hero-title-accent">through rigorous research.</span>
            </h1>
            <span className="hero-title-divider" />
          </HeroReveal>

          <HeroReveal delay={0.7}>
            <p className="hero-subtitle">
              We pursue fundamental questions in catalysis, advanced materials, and sustainable
              chemical processes, translating discoveries into applications that serve science
              and society.
            </p>
          </HeroReveal>

          <HeroReveal delay={0.9}>
            <div className="hero-buttons">
              <Link href="/research/areas" className="hero-btn-primary">
                Explore Research
              </Link>
              <Link href="/publications" className="hero-btn-secondary">
                View Publications
              </Link>
            </div>
          </HeroReveal>
        </div>

        <div className="hero-scroll-indicator">
          <HeroReveal delay={1.1} duration={0.6}>
            <div className="hero-scroll-bounce">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 8l5 5 5-5" />
              </svg>
            </div>
          </HeroReveal>
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <section className="stats-bar">
        <div className="stats-grid">
          <StatCounter to={stats.publications} label="Publications" />
          <StatCounter to={stats.projects} label="Research Projects" delay={0.05} />
          <StatCounter to={stats.awards} label="Awards" delay={0.1} />
          <StatCounter to={stats.alumni} label="Alumni" delay={0.15} />
          <StatCounter to={stats.groupMembers} label="Team Members" delay={0.2} />
        </div>
      </section>

      {/* ═══ ABOUT ═══ */}
      <section className="section" style={{ background: 'white' }}>
        <div className="section-container">
          <div className="about-grid">
            <Reveal x={-40} y={0}>
              <div className="section-label">About the Lab</div>
              <h2 className="section-heading">Advancing Chemical Sciences at IIT Delhi</h2>
              <p className="about-body">
                Our laboratory brings together researchers investigating the frontiers of chemical
                engineering — from single-atom catalysts that enable greener reactions to advanced
                materials designed for energy storage, environmental remediation, and healthcare.
                We publish in leading journals, collaborate with industry, and train the next
                generation of chemical scientists.
              </p>
            </Reveal>
            <Reveal x={40} y={0}>
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
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ RESEARCH & ANNOUNCEMENTS ═══ */}
      <section className="section research-section">
        <div className="section-container">
          <Reveal>
            <div className="section-header-row">
              <div>
                <div className="section-label">Latest Work</div>
                <h2 className="section-heading">Research &amp; Announcements</h2>
              </div>
              <Link href="/research/areas" className="section-link">View all research &rarr;</Link>
            </div>
          </Reveal>
          <ResearchCards publications={publications} projects={projects} />
          <Reveal>
            <div style={{ marginTop: 48 }}>
              <Link href="/research/areas" className="explore-btn">Explore Research Areas</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ FACILITIES ═══ */}
      <section className="section" style={{ background: 'white' }}>
        <div className="section-container">
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div className="section-label" style={{ justifyContent: 'center' }}>Our Infrastructure</div>
              <h2 className="section-heading" style={{ textAlign: 'center' }}>Research Facilities</h2>
              <p className="facilities-subtitle">
                Our laboratory is equipped with state-of-the-art instruments supporting research across
                spectroscopy, microscopy, thermal analysis, and chemical characterization.
              </p>
            </div>
          </Reveal>
          <ResearchFacilitiesSection equipments={equipments} />
        </div>
      </section>

      {/* ═══ NEWS ═══ */}
      <NewsSection />

      {/* ═══ CTA ═══ */}
      <JoinUs />
    </div>
  );
}
