"use client"

import React from 'react'
import ResearchAreaCard from "./researchAreaCard"
import fetchResearchAreas from '@/lib/load_data/load_research_areas';


export default function ResearchAreasPage() {
  const [data, setData] = React.useState<any[] | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchResearchAreas();
        setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0d9488]"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-slate-900">
        <p>Failed to load research areas.</p>
      </div>
    );
  }

  return (
    <div className="research-areas-page-container">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-10">
          Research Areas
        </h1>
      </div>

      <div className="research-areas-list">
        {data.map((item, index) => (
          <ResearchAreaCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </div>
  );
}


