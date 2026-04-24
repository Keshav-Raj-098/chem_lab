import { fetchNewsAction } from "@/lib/news";
import { Timeline } from "@/components/pub/Timeline/Timeline";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events | Chem Lab",
  description: "Stay updated with the latest events and seminars at our research laboratory.",
};

const EventsPage = async () => {
  const result = await fetchNewsAction({
    type: "Event",
    page: 1,
    pageSize: 20,
  });

  const news = result.success ? result.data : [];
  const hasMore = result.hasMore;

  return (
    <div className="min-h-screen bg-white">
      <header className="page-header">
        <div className="page-header-inner">
          <div className="page-header-eyebrow">News</div>
          <h1 className="page-header-title">Events &amp; Seminars</h1>
          <p className="page-header-subtitle">
            Seminars, workshops, and gatherings hosted by our research community. Browse recent
            and upcoming events from the laboratory.
          </p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 md:px-10 py-16">
        <Timeline
          initialAwards={news || []}
          initialHasMore={hasMore || false}
          awardType="Event"
          fetchAction={fetchNewsAction}
        />
      </div>
    </div>
  );
};

export default EventsPage;
