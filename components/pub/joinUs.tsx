import Link from 'next/link'

const JoinUs = () => {
  return (
    <section className="cta-section">
      <div className="cta-inner">
        <div className="cta-eyebrow" data-anim="fade-up">Get Involved</div>
        <h2 className="cta-heading" data-anim="cta-heading">
          Want to be a partner or collaborate?
        </h2>
        <p className="cta-subtitle" data-anim="fade-up">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem fugit totam et dolores corrupti earum fuga, sint officiis ratione placeat?
        </p>
        <div data-anim="fade-up">
          <Link href="/contact" className="cta-button">
            Join Us
          </Link>
        </div>
      </div>
    </section>
  )
}

export default JoinUs
