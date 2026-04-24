import React from 'react'

interface ResearchCardProps {
  category: string;
  heroTitle: string;
  date: string;
  source: string;
  mainTitle: string;
  description: string;
}

export const ResearchCardItem = ({
  category = "PUBLICATION",
  heroTitle = "New paper in ACS Nano on single-atom catalysts",
  date = "March 2026",
  source = "ACS Nano",
  mainTitle = "Single-atom Fe catalysts for oxygen reduction",
  description = "Unprecedented selectivity using carbon-hosted iron sites."
}: Partial<ResearchCardProps>) => {
  return (
    <div className="research-card">
      {/* Thumbnail */}
      <div className="research-card-thumb">
        <div className="research-card-thumb-pattern" />
        <div className="research-card-thumb-gradient" />
        <div className="research-card-tag">{category}</div>
        <h3 className="research-card-thumb-title">
          {heroTitle.includes(source) ? heroTitle.split(source).map((part, i) => (
            <React.Fragment key={i}>
              {part}
              {i === 0 && <span className="accent">{source}</span>}
            </React.Fragment>
          )) : heroTitle}
        </h3>
      </div>

      {/* Body */}
      <div className="research-card-body">
        <p className="research-card-meta">
          {date} <span className="dot" /> {source}
        </p>
        <h4 className="research-card-title">{mainTitle}</h4>
        <p className="research-card-snippet">{description}</p>
      </div>
    </div>
  );
};

const ResearchCards = () => {
  return (
    <div className="research-grid">
      <ResearchCardItem />
      <ResearchCardItem />
      <ResearchCardItem />
      <ResearchCardItem />
      <ResearchCardItem />
      <ResearchCardItem
        category="PROJECT"
        source="Grant"
        heroTitle="New major research grant for IIT Delhi"
        mainTitle="Sustainable Chemical Processing"
        description="Developing closed-loop chemical engineering systems for local industries."
      />
    </div>
  )
}

export default ResearchCards
