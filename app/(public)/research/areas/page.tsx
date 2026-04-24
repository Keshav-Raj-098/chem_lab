"use client"

import React from 'react'
import { motion } from 'framer-motion'
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
      <div className="min-h-screen flex items-center justify-center bg-[#080d18]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0d9488]"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080d18] text-white">
        <p>Failed to load research areas.</p>
      </div>
    );
  }

  return (
    <div className="research-areas-page-container">
      <div className="research-areas-header">
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="page-title"
        >
          Research Areas
        </motion.h1>
        <div className="title-underline"></div>
      </div>

      <div className="research-areas-list">
        {data.map((item, index) => (
          <ResearchAreaCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </div>
  );
}


