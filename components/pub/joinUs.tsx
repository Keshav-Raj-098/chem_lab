import Link from 'next/link'
import { Reveal } from '@/components/pub/reveal'

const JoinUs = () => {
  return (
    <section className="cta-section">
      <div className="cta-inner">
        <Reveal y={16} duration={0.6}>
          <div className="cta-eyebrow">Get Involved</div>
        </Reveal>
        <Reveal y={24} delay={0.1}>
          <h2 className="cta-heading">
            Interested in collaborating or joining the lab?
          </h2>
        </Reveal>
        <Reveal y={20} delay={0.2}>
          <p className="cta-subtitle">
            We welcome enquiries from prospective PhD students, postdocs, and research partners.
            Reach out to discuss opportunities, collaborations, or visiting positions.
          </p>
        </Reveal>
        <Reveal y={20} delay={0.3}>
          <Link href="/contact" className="cta-button">
            Contact the Lab
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

export default JoinUs
