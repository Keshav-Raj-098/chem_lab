"use client"
import { useState } from 'react'
import Image from 'next/image'

interface FacilityItem {
  name: string
  category: string
  categoryLabel: string
  image: string
  specs: { key: string; value: string }[]
}

const facilities: FacilityItem[] = [
  {
    name: "XRD (X-Ray Diffractometer)",
    category: "characterisation",
    categoryLabel: "CHARACTERISATION",
    image: "/equipments/a.png",
    specs: [
      { key: "Model", value: "Bruker D8 Advance" },
      { key: "Radiation", value: "Cu K-alpha" },
      { key: "2-theta Range", value: "5 to 90 deg" },
      { key: "Step Size", value: "0.02 deg" },
      { key: "Sample Stage", value: "Rotating" },
    ],
  },
  {
    name: "FTIR Spectrometer",
    category: "characterisation",
    categoryLabel: "CHARACTERISATION",
    image: "/equipments/a.png",
    specs: [
      { key: "Model", value: "Bruker Alpha II" },
      { key: "Range", value: "400-4000 cm-1" },
      { key: "Resolution", value: "4 cm-1" },
      { key: "Mode", value: "ATR" },
    ],
  },
  {
    name: "Gas Chromatograph",
    category: "reaction",
    categoryLabel: "REACTION & SYNTHESIS",
    image: "/equipments/a.png",
    specs: [
      { key: "Model", value: "Agilent 7890B" },
      { key: "Detector", value: "FID + TCD" },
      { key: "Columns", value: "Capillary" },
      { key: "Temp Range", value: "Up to 450 C" },
    ],
  },
  {
    name: "Tubular Furnace",
    category: "reaction",
    categoryLabel: "REACTION & SYNTHESIS",
    image: "/equipments/a.png",
    specs: [
      { key: "Max Temp", value: "1200 C" },
      { key: "Zones", value: "3-zone" },
      { key: "Tube Diameter", value: "50 mm" },
      { key: "Atmosphere", value: "Inert / Reactive" },
    ],
  },
]

const FacilityCard = ({ item }: { item: FacilityItem }) => {
  return (
    <div className="facility-card">
      <div className="facility-card-img">
        <Image 
          src={item.image} 
          alt={item.name} 
          width={120} 
          height={100} 
          loading="lazy"
          style={{ maxHeight: 100, objectFit: 'contain' }} 
        />
      </div>
      <span className="facility-card-tag">{item.categoryLabel}</span>
      <h3 className="facility-card-name">{item.name}</h3>
      <div>
        {item.specs.map((spec, i) => (
          <div key={i} className="facility-spec">
            <span className="facility-spec-key">{spec.key}</span>
            <span className="facility-spec-value">{spec.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const ResearchFacilitiesSection = () => {
  const [activeTab, setActiveTab] = useState("all")

  const filteredFacilities = activeTab === "all"
    ? facilities
    : facilities.filter(f => f.category === activeTab)

  const tabs = [
    { id: "all", label: "All Equipment" },
    { id: "characterisation", label: "Characterisation" },
    { id: "reaction", label: "Reaction & Synthesis" },
  ]

  return (
    <div>
      {/* Filter tabs */}
      <div className="facilities-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`facilities-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Card grid */}
      <div className="facilities-grid">
        {filteredFacilities.map((item, index) => (
          <FacilityCard key={index} item={item} />
        ))}
      </div>
    </div>
  )
}

export default ResearchFacilitiesSection
