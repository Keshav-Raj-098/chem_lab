"use client"
import { useMemo, useState } from 'react'
import Image from 'next/image'
import { Reveal } from '@/components/pub/reveal'
import type { HomeEquipmentItem } from '@/lib/load_data/load_home'

interface FacilityItem {
  name: string
  category: string
  categoryLabel: string
  image: string
  specs: { key: string; value: string }[]
}

const FALLBACK_IMAGE = '/equipments/a.png'

function toFacility(e: HomeEquipmentItem): FacilityItem {
  const specs: { key: string; value: string }[] = []
  if (e.manufacturer) specs.push({ key: 'Manufacturer', value: e.manufacturer })
  if (e.model) specs.push({ key: 'Model', value: e.model })
  if (e.serialNumber) specs.push({ key: 'Serial No.', value: e.serialNumber })
  if (e.installedOn) {
    const installed = new Date(e.installedOn)
    specs.push({
      key: 'Installed',
      value: installed.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    })
  }
  return {
    name: e.name,
    category: e.category.toLowerCase(),
    categoryLabel: e.category.toUpperCase(),
    image: FALLBACK_IMAGE,
    specs,
  }
}

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

interface Props {
  equipments?: HomeEquipmentItem[]
}

const ResearchFacilitiesSection = ({ equipments = [] }: Props) => {
  const facilities = useMemo(() => equipments.map(toFacility), [equipments])

  const tabs = useMemo(() => {
    const seen = new Map<string, string>()
    facilities.forEach((f) => {
      if (!seen.has(f.category)) seen.set(f.category, f.categoryLabel)
    })
    return [{ id: 'all', label: 'All Equipment' }, ...Array.from(seen.entries()).map(([id, label]) => ({ id, label }))]
  }, [facilities])

  const [activeTab, setActiveTab] = useState('all')

  const filteredFacilities = activeTab === 'all'
    ? facilities
    : facilities.filter((f) => f.category === activeTab)

  if (facilities.length === 0) {
    return (
      <p style={{ textAlign: 'center', color: 'var(--c-text-muted)', padding: '48px 0' }}>
        No equipment listed yet.
      </p>
    )
  }

  return (
    <div>
      {tabs.length > 2 && (
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
      )}

      <div className="facilities-grid">
        {filteredFacilities.map((item, index) => (
          <Reveal key={`${activeTab}-${index}`} delay={index * 0.07} y={24}>
            <FacilityCard item={item} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}

export default ResearchFacilitiesSection
