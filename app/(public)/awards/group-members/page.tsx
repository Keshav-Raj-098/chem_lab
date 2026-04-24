import { AwardType } from "@/lib/generated/prisma/enums";
import { fetchAwardsAction } from "@/lib/load_data/loadAwards";
import { Timeline } from "@/components/pub/Timeline/Timeline";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Group Member Awards | Chem Lab",
  description: "Outstanding achievements and recognitions received by our research group members.",
};

const GroupMemberAwardsPage = async () => {
  const result = await fetchAwardsAction({
    type: AwardType.GROUP_MEMBER,
    page: 1,
    pageSize: 20,
  });

  const awards = result.success ? result.data : [];
  const hasMore = result.hasMore;

  return (
    <div className="min-h-screen bg-white">
      <header className="page-header">
        <div className="page-header-inner">
          <div className="page-header-eyebrow">Awards &amp; Recognition</div>
          <h1 className="page-header-title">Group Member Awards</h1>
          <p className="page-header-subtitle">
            Honours, fellowships, and awards earned by members of our research group for their
            contributions to chemical research and academic excellence.
          </p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 md:px-10 py-16">
        <Timeline
          initialAwards={awards || []}
          initialHasMore={hasMore || false}
          awardType={AwardType.GROUP_MEMBER}
          fetchAction={fetchAwardsAction}
        />
      </div>
    </div>
  );
};

export default GroupMemberAwardsPage;
