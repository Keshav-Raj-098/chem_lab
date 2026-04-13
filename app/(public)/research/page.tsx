"use client"

import { useState, useEffect, useCallback } from 'react'
import { fetchResearchByStatus } from '@/lib/load_data/loadResearch'
import { ResearchStatus } from '@/lib/generated/prisma/enums'
import { Loader2, ChevronDown } from 'lucide-react'
import ResearchAnimations from '@/components/pub/researchAnimations'

interface Project {
  id: string
  title: string
  description: string
  body: string
  fundingAgencies: string[]
  investigators: string[]
  contributors: string[]
  duration: string | null
  status: ResearchStatus
  amntFunded: string | number | null
  completedOn: string | Date | null
  createdAt: string | Date
}

const ResearchPage = () => {
  const [status, setStatus] = useState<ResearchStatus | 'ALL'>('ALL')
  const [data, setData] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'amount-high' | 'amount-low'>('newest')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [statusOpen, setStatusOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    const res = await fetchResearchByStatus(1, status === 'ALL' ? ResearchStatus.ONGOING : status, 100)
    if (res.success) {
      let allData = res.data as unknown as Project[]
      if (status === 'ALL') {
        const completed = await fetchResearchByStatus(1, ResearchStatus.COMPLETED, 100)
        const planned = await fetchResearchByStatus(1, ResearchStatus.PLANNED, 100)
        if (completed.success) allData = [...allData, ...(completed.data as unknown as Project[])]
        if (planned.success) allData = [...allData, ...(planned.data as unknown as Project[])]
      }
      setData(allData)
    }
    setLoading(false)
  }, [status])

  useEffect(() => {
    loadData()
  }, [loadData])

  const sortedData = [...data].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    const amountA = parseFloat(a.amntFunded?.toString() || '0')
    const amountB = parseFloat(b.amntFunded?.toString() || '0')
    if (sortBy === 'amount-high') return amountB - amountA
    return amountA - amountB
  })

  const getStatusColor = (s: ResearchStatus) => {
    if (s === ResearchStatus.ONGOING) return 'text-teal-600'
    if (s === ResearchStatus.COMPLETED) return 'text-slate-600'
    return 'text-amber-600'
  }

  const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
    const isExpanded = expandedId === project.id

    const handleToggle = () => {
      setExpandedId(isExpanded ? null : project.id)
    }

    const statusLabel = project.status === ResearchStatus.ONGOING ? 'Ongoing' : project.status === ResearchStatus.COMPLETED ? 'Completed' : 'Planned'

    return (
      <div
        className="group relative bg-white py-2 px-3 border border-slate-100 rounded-lg transition-all duration-300 hover:bg-slate-50 hover:border-teal-200 mb-2"
        onClick={handleToggle}
      >
        <div className="flex items-start gap-4">
          <span className="text-teal-600/30 font-serif text-lg italic min-w-[1.5rem] mt-0.5 group-hover:text-teal-600 transition-colors">
            {index + 1}.
          </span>

          <div className="flex-1 space-y-1">
            {/* Title */}
            <h3 className="text-[#0f2557] font-serif text-base leading-tight cursor-pointer group-hover:text-teal-700 transition-colors">
              {project.title}
            </h3>

            {/* Metadata - Compact Inline Row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-slate-500 font-sans">
              {project.fundingAgencies && project.fundingAgencies.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Agency:</span>
                  <span className="text-slate-700">{project.fundingAgencies[0]}</span>
                </div>
              )}

              {project.duration && (
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Period:</span>
                  <span className="text-slate-700">{project.duration}</span>
                </div>
              )}

              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Status:</span>
                <span className={`${project.status === ResearchStatus.ONGOING ? 'text-amber-600' : 'text-teal-600'} font-medium`}>
                  {statusLabel}
                </span>
              </div>

              {project.amntFunded && (
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Funding:</span>
                  <span className="text-slate-700">₹{project.amntFunded}L</span>
                </div>
              )}
            </div>
          </div>

          <div className="self-center">
            <ChevronDown className={`w-4 h-4 text-slate-300 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-teal-600' : 'group-hover:text-slate-400'}`} />
          </div>
        </div>

        {/* Expanded details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-slate-100 ml-9 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            {project.body && (
              <div className="text-sm text-slate-600 leading-relaxed font-sans max-w-3xl" dangerouslySetInnerHTML={{ __html: project.body }} />
            )}

            <div className="flex gap-4 text-xs">
              {project.investigators && project.investigators.length > 0 && (
                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-tighter mr-2">Lead:</span>
                  <span className="text-slate-700">{project.investigators.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-28 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-teal-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <ResearchAnimations />

      {/* Header */}
      <div className="pt-28 pb-6">
        <div className="max-w-6xl mx-auto px-12">
          <div data-anim="header-left">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-px bg-teal-600" />
              <span className="text-xs font-medium tracking-widest uppercase text-teal-600">Research Portfolio</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-light tracking-tight text-slate-900">Research Projects</h1>
            <p className="mt-2 text-sm text-slate-500 font-light max-w-2xl">
              A comprehensive collection of ongoing and completed research initiatives across catalysis, materials science, and sustainable processes.
            </p>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="sticky top-[68px] z-40 bg-white border-y border-slate-100 py-3" data-anim="filter-bar">
        <div className="max-w-6xl mx-auto px-12 flex items-center justify-between gap-4">
          {/* Left: Status */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium tracking-widest uppercase text-slate-400">Filter</span>
            <div className="relative">
              <button
                onClick={() => setStatusOpen(!statusOpen)}
                className="flex items-center gap-2 px-3 py-1 text-sm font-light text-slate-700 cursor-pointer hover:text-teal-600 transition-colors"
              >
                {status === 'ALL' ? 'All' : status === ResearchStatus.ONGOING ? 'Ongoing' : status === ResearchStatus.COMPLETED ? 'Completed' : 'Planned'}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {statusOpen && (
                <div className="absolute top-full mt-1 left-0 bg-white border border-slate-200 shadow-md py-1 min-w-[140px] z-50">
                  {['ALL', ResearchStatus.ONGOING, ResearchStatus.COMPLETED, ResearchStatus.PLANNED].map((s) => (
                    <button
                      key={s}
                      onClick={() => { setStatus(s as any); setStatusOpen(false) }}
                      className={`w-full px-3 py-1.5 text-sm font-light text-left transition-colors ${
                        status === s
                          ? 'bg-teal-50 text-teal-700'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {s === 'ALL' ? 'All' : s === ResearchStatus.ONGOING ? 'Ongoing' : s === ResearchStatus.COMPLETED ? 'Completed' : 'Planned'}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <span className="text-xs text-slate-400">({sortedData.length})</span>
          </div>

          {/* Right: Sort */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium tracking-widest uppercase text-slate-400">Sort</span>
            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-2 px-3 py-1 text-sm font-light text-slate-700 cursor-pointer hover:text-teal-600 transition-colors"
              >
                {sortBy === 'newest' ? 'Newest' : sortBy === 'oldest' ? 'Oldest' : sortBy === 'amount-high' ? 'Amount ↓' : 'Amount ↑'}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {sortOpen && (
                <div className="absolute top-full mt-1 right-0 bg-white border border-slate-200 shadow-md py-1 min-w-[140px] z-50">
                  {[
                    { value: 'newest' as const, label: 'Newest' },
                    { value: 'oldest' as const, label: 'Oldest' },
                    { value: 'amount-high' as const, label: 'Amount High→Low' },
                    { value: 'amount-low' as const, label: 'Amount Low→High' },
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => { setSortBy(value); setSortOpen(false) }}
                      className={`w-full px-3 py-1.5 text-sm font-light text-left transition-colors ${
                        sortBy === value
                          ? 'bg-teal-50 text-teal-700'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-12 py-6">
        {sortedData.length === 0 ? (
          <div className="py-20 text-center text-slate-400 font-light">
            No projects found
          </div>
        ) : (
          <div>
            {sortedData.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ResearchPage
