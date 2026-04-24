import { Metadata } from 'next'
import { PublicationCategory } from '@/lib/generated/prisma/enums'
import { fetchAllCategoriesInitial } from '@/lib/load_data/load_publications'
import CategorySection from './_components/CategorySection'

// ISR: page is statically generated and re-validated every hour.
// Data-layer cache (unstable_cache) also uses the 'publications' tag —
// admins can call revalidateTag('publications') after any mutation to bust both.
export const revalidate = 3600

const INITIAL_PAGE_SIZE = 10

const CATEGORY_LABELS: Record<PublicationCategory, string> = {
  JOURNAL: 'Journal Articles',
  CONFERENCE: 'Conference Proceedings',
  PATENTS: 'Patents',
  BOOK: 'Books & Book Chapters',
  INVITED_TALK: 'Invited Talks',
  PRESENTATION: 'Presentations',
  NATIONAL_REPORT: 'National Reports',
  PUBLICATION: 'Other Publications',
  OTHER: 'Other',
}

// Display order — most prominent scholarly output first.
const CATEGORY_ORDER: PublicationCategory[] = [
  'JOURNAL',
  'CONFERENCE',
  'PATENTS',
  'BOOK',
  'INVITED_TALK',
  'PRESENTATION',
  'NATIONAL_REPORT',
  'PUBLICATION',
  'OTHER',
] as PublicationCategory[]

const SITE_TITLE = 'Publications | ChemLab'
const SITE_DESCRIPTION =
  'Peer-reviewed journal articles, conference proceedings, patents, books, and invited talks from the Chemical Research Lab at IIT Delhi.'

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: [
    'Publications',
    'Research Papers',
    'Journal Articles',
    'Conference Proceedings',
    'Patents',
    'Invited Talks',
    'Chemical Research',
    'IIT Delhi Chemistry',
  ],
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
}

const stripHtml = (html: string) =>
  html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

export default async function PublicationsPage() {
  const groups = await fetchAllCategoriesInitial(INITIAL_PAGE_SIZE)

  // Build display list in canonical order; skip empty categories.
  const orderedGroups = CATEGORY_ORDER.map((cat) =>
    groups.find((g) => g.category === cat)
  )
    .filter((g): g is NonNullable<typeof g> => Boolean(g))
    .filter((g) => g.items.length > 0)

  const grandTotal = orderedGroups.reduce((acc, g) => acc + g.total, 0)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: SITE_TITLE,
    description: SITE_DESCRIPTION,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: grandTotal,
      itemListElement: orderedGroups.flatMap((g, groupIdx) =>
        g.items.slice(0, 5).map((item, i) => ({
          '@type': 'ListItem',
          position: groupIdx * 100 + i + 1,
          item: {
            '@type': 'ScholarlyArticle',
            headline: stripHtml(item.body).slice(0, 160),
            description: stripHtml(item.body).slice(0, 300),
            datePublished: item.year ? String(item.year) : item.createdAt,
            genre: CATEGORY_LABELS[g.category],
          },
        }))
      ),
    },
  }

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="page-header">
        <div className="page-header-inner">
          <div className="page-header-eyebrow">Research Output</div>
          <h1 className="page-header-title">Publications</h1>
          <p className="page-header-subtitle">
            Peer-reviewed journal articles, conference proceedings, patents, and invited talks
            from the laboratory. Grouped by category — expand each section to browse the
            complete record.
          </p>
          {grandTotal > 0 && (
            <p className="mt-4 text-xs font-semibold tracking-[0.16em] uppercase text-slate-400 tabular-nums">
              {grandTotal.toLocaleString()} publications across {orderedGroups.length}{' '}
              {orderedGroups.length === 1 ? 'category' : 'categories'}
            </p>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 md:px-10 py-16 md:py-20 space-y-10 md:space-y-12">
        {orderedGroups.length === 0 ? (
          <div className="text-center py-24 text-slate-400 text-sm">
            No publications recorded yet.
          </div>
        ) : (
          orderedGroups.map((group) => (
            <CategorySection
              key={group.category}
              category={group.category}
              displayName={CATEGORY_LABELS[group.category]}
              initialItems={group.items}
              initialTotal={group.total}
              initialHasMore={group.hasMore}
              pageSize={INITIAL_PAGE_SIZE}
            />
          ))
        )}
      </main>
    </div>
  )
}
