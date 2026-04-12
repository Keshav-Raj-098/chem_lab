import Link from 'next/link'

interface NewsCardProps {
  title:string;
  body: string;
  createdAt: string;
}

export const NewsCard = ({ title, body, createdAt }: NewsCardProps) => {
  return (
    <div className="news-card">
      <h3 className="news-card-title">{title}</h3>
      <div className="news-card-date">
        {new Date(createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })}
      </div>
      <div
        className="news-card-body prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: body }}
      />
    </div>
  )
}

const newsData: NewsCardProps[] = [
  {
    title: "Professor Sharma awarded National Excellence in Chemistry",
    body: "<p>Professor Sharma awarded the <strong>National Excellence in Chemistry</strong> for pioneering work in 2026.</p>",
    createdAt: "2026-03-15T00:00:00Z"
  },
  {
    title: "New research paper on Green Hydrogen published",
    body: "<p>New research paper on <strong>Green Hydrogen</strong> published in the latest issue of <em>Nature Materials</em>.</p>",
    createdAt: "2026-03-10T00:00:00Z"
  },
  {
    title: "Three new PhD scholars join the lab",
    body: "<p>The lab welcomes <strong>three new PhD scholars</strong> starting their research on electro-caloric materials.</p>",
    createdAt: "2026-02-28T00:00:00Z"
  },
  {
    title: "Patent granted for sustainable polymer synthesis",
    body: "<p>Successful collaboration with <strong>Industrial Partners</strong> leads to a new patent for sustainable polymers.</p>",
    createdAt: "2026-02-15T00:00:00Z"
  },
  {
    title: "Annual Chemistry Symposium announced for May 2026",
    body: "<p>Join us for the <strong>Annual Chemistry Symposium</strong> scheduled for May 2026 at IIT Delhi.</p>",
    createdAt: "2026-01-20T00:00:00Z"
  }
]

const NewsSection = () => {
  return (
    <section className="section news-section">
      <div className="section-container">
        <div className="section-header-row">
          <div>
            <div className="section-label">Latest Updates</div>
            <h2 className="section-heading">News &amp; Announcements</h2>
          </div>
          <Link href="/news" className="section-link">View all news &rarr;</Link>
        </div>

        <div className="news-grid">
          {newsData.map((news, index) => (
            <NewsCard key={index} {...news} />
          ))}

          {/* CTA card in 6th slot */}
          <div className="news-cta-card">
            <p className="news-cta-card-text">Stay updated with our latest research</p>
            <Link href="/contact" className="news-cta-card-link">Subscribe to updates &rarr;</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NewsSection
