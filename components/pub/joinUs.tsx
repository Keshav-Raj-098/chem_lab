import Link from 'next/link'

const JoinUs = () => {
  return (
    <section className="cta-section">
      <div className="cta-inner">
        <div className="cta-eyebrow" data-anim="fade-up">Get Involved</div>
        <h2 className="cta-heading" data-anim="cta-heading">
          Interested in collaborating or joining the lab?
        </h2>
        <p className="cta-subtitle" data-anim="fade-up">
          We welcome enquiries from prospective PhD students, postdocs, and research partners.
          Reach out to discuss opportunities, collaborations, or visiting positions.
        </p>
        <div data-anim="fade-up">
          <Link href="/contact" className="cta-button">
            Contact the Lab
          </Link>
        </div>
      </div>
    </section>
  )
}

export default JoinUs
