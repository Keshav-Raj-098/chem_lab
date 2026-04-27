"use client"

import { useState, useEffect, useCallback } from 'react'
import { fetchResearchByStatus } from '@/lib/load_data/loadResearch'
import { ResearchStatus } from '@/lib/generated/prisma/enums'
import { Loader2, ChevronDown, X } from 'lucide-react'
import ResearchAnimations from '@/components/pub/researchAnimations'

interface Project {
  id: string
  title: string
  description: string
  body: string
  fundingAgencies: string[] | string | null
  investigators: string[] | string | null
  contributors: string[] | string | null
  duration: string | null
  status: ResearchStatus
  amntFunded: string | number | null
  completedOn: string | Date | null
  createdAt: string | Date
}

const toArray = (v: string[] | string | null | undefined): string[] => {
  if (!v) return []
  if (Array.isArray(v)) return v.filter(Boolean)
  return String(v).split(/[,;\n]/).map((s) => s.trim()).filter(Boolean)
}

type FundingFilter = 'ALL' | 'FUNDED' | 'UNFUNDED'

const ResearchPage = () => {
  const [status, setStatus] = useState<ResearchStatus | 'ALL'>('ALL')
  const [funding, setFunding] = useState<FundingFilter>('ALL')
  const [data, setData] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'amount-high' | 'amount-low'>('newest')
  const [statusOpen, setStatusOpen] = useState(false)
  const [fundingOpen, setFundingOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)
  const [activeProject, setActiveProject] = useState<Project | null>(null)

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

  useEffect(() => {
    if (!activeProject) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveProject(null)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [activeProject])

  const isFunded = (p: Project) => {
    const n = parseFloat(p.amntFunded?.toString() || '0')
    return n > 0
  }

  const filteredData = data.filter((p) => {
    if (funding === 'FUNDED') return isFunded(p)
    if (funding === 'UNFUNDED') return !isFunded(p)
    return true
  })

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    const amountA = parseFloat(a.amntFunded?.toString() || '0')
    const amountB = parseFloat(b.amntFunded?.toString() || '0')
    if (sortBy === 'amount-high') return amountB - amountA
    return amountA - amountB
  })

  const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
    const statusLabel = project.status === ResearchStatus.ONGOING ? 'Ongoing' : project.status === ResearchStatus.COMPLETED ? 'Completed' : 'Planned'
    const agencies = toArray(project.fundingAgencies)

    return (
      <div className="group relative bg-white py-2 px-3 border border-slate-100 rounded-lg transition-all duration-300 hover:bg-slate-50 hover:border-teal-200 mb-2">
        <div className="flex items-start gap-4">
          <span className="text-teal-600/30 font-serif text-lg italic min-w-[1.5rem] mt-0.5 group-hover:text-teal-600 transition-colors">
            {index + 1}.
          </span>

          <div className="flex-1 space-y-1 min-w-0">
            <h3 className="text-[#0f2557] font-serif text-base leading-tight group-hover:text-teal-700 transition-colors">
              {project.title}
            </h3>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-slate-500 font-sans">
              {agencies.length > 0 && (
                <div className="flex items-start gap-1.5">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] mt-0.5 shrink-0">Agency:</span>
                  <span className="text-slate-700 wrap-break-word">{agencies.join(', ')}</span>
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

          <button
            onClick={() => setActiveProject(project)}
            className="self-center shrink-0 px-3 py-1 text-xs font-medium text-teal-700 border border-teal-200 rounded-md hover:bg-teal-50 hover:border-teal-400 transition-colors cursor-pointer"
          >
            View
          </button>
        </div>
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

  const statusLabel = (s: ResearchStatus | 'ALL') =>
    s === 'ALL' ? 'All' : s === ResearchStatus.ONGOING ? 'Ongoing' : s === ResearchStatus.COMPLETED ? 'Completed' : 'Planned'

  const fundingLabel = (f: FundingFilter) =>
    f === 'ALL' ? 'All' : f === 'FUNDED' ? 'Funded' : 'Non-funded'

  return (
    <div className="min-h-screen bg-white">
      <ResearchAnimations />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-10">
          Research Projects
        </h1>
      </div>

      <div className="sticky top-[68px] z-40 bg-white border-y border-slate-100 py-3" data-anim="filter-bar">
        <div className="max-w-6xl mx-auto px-12 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Status */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium tracking-widest uppercase text-slate-400">Status</span>
              <div className="relative">
                <button
                  onClick={() => { setStatusOpen(!statusOpen); setFundingOpen(false); setSortOpen(false) }}
                  className="flex items-center gap-2 px-3 py-1 text-sm font-light text-slate-700 cursor-pointer hover:text-teal-600 transition-colors border border-slate-200 rounded-md"
                >
                  {statusLabel(status)}
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {statusOpen && (
                  <div className="absolute top-full mt-1 left-0 bg-white border border-slate-200 shadow-md py-1 min-w-35 z-50 rounded-md">
                    {(['ALL', ResearchStatus.ONGOING, ResearchStatus.COMPLETED, ResearchStatus.PLANNED] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => { setStatus(s); setStatusOpen(false) }}
                        className={`w-full px-3 py-1.5 text-sm font-light text-left transition-colors ${
                          status === s ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {statusLabel(s)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Funding */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium tracking-widest uppercase text-slate-400">Funding</span>
              <div className="relative">
                <button
                  onClick={() => { setFundingOpen(!fundingOpen); setStatusOpen(false); setSortOpen(false) }}
                  className="flex items-center gap-2 px-3 py-1 text-sm font-light text-slate-700 cursor-pointer hover:text-teal-600 transition-colors border border-slate-200 rounded-md"
                >
                  {fundingLabel(funding)}
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {fundingOpen && (
                  <div className="absolute top-full mt-1 left-0 bg-white border border-slate-200 shadow-md py-1 min-w-35 z-50 rounded-md">
                    {(['ALL', 'FUNDED', 'UNFUNDED'] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => { setFunding(f); setFundingOpen(false) }}
                        className={`w-full px-3 py-1.5 text-sm font-light text-left transition-colors ${
                          funding === f ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {fundingLabel(f)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <span className="text-xs text-slate-400">({sortedData.length})</span>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium tracking-widest uppercase text-slate-400">Sort</span>
            <div className="relative">
              <button
                onClick={() => { setSortOpen(!sortOpen); setStatusOpen(false); setFundingOpen(false) }}
                className="flex items-center gap-2 px-3 py-1 text-sm font-light text-slate-700 cursor-pointer hover:text-teal-600 transition-colors border border-slate-200 rounded-md"
              >
                {sortBy === 'newest' ? 'Newest' : sortBy === 'oldest' ? 'Oldest' : sortBy === 'amount-high' ? 'Amount ↓' : 'Amount ↑'}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {sortOpen && (
                <div className="absolute top-full mt-1 right-0 bg-white border border-slate-200 shadow-md py-1 min-w-35 z-50 rounded-md">
                  {[
                    { value: 'newest' as const, label: 'Newest' },
                    { value: 'oldest' as const, label: 'Oldest' },
                    { value: 'amount-high' as const, label: 'Amount ↓' },
                    { value: 'amount-low' as const, label: 'Amount ↑' },
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => { setSortBy(value); setSortOpen(false) }}
                      className={`w-full px-3 py-1.5 text-sm font-light text-left transition-colors ${
                        sortBy === value ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'
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

      {activeProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setActiveProject(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-start justify-between gap-4">
              <h2 className="font-serif text-xl text-[#0f2557] leading-snug">
                {activeProject.title}
              </h2>
              <button
                onClick={() => setActiveProject(null)}
                className="shrink-0 p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Status</div>
                  <div className={`${activeProject.status === ResearchStatus.ONGOING ? 'text-amber-600' : 'text-teal-600'} font-medium`}>
                    {activeProject.status === ResearchStatus.ONGOING ? 'Ongoing' : activeProject.status === ResearchStatus.COMPLETED ? 'Completed' : 'Planned'}
                  </div>
                </div>

                {activeProject.duration && (
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Period</div>
                    <div className="text-slate-700">{activeProject.duration}</div>
                  </div>
                )}

                {activeProject.amntFunded && (
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Funding</div>
                    <div className="text-slate-700">₹{activeProject.amntFunded}L</div>
                  </div>
                )}

                {activeProject.completedOn && (
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Completed</div>
                    <div className="text-slate-700">{new Date(activeProject.completedOn).toLocaleDateString()}</div>
                  </div>
                )}
              </div>

              {toArray(activeProject.fundingAgencies).length > 0 && (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Funding Agencies</div>
                  <div className="text-sm text-slate-700">{toArray(activeProject.fundingAgencies).join(', ')}</div>
                </div>
              )}

              {toArray(activeProject.investigators).length > 0 && (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Investigators</div>
                  <div className="text-sm text-slate-700">{toArray(activeProject.investigators).join(', ')}</div>
                </div>
              )}

              {toArray(activeProject.contributors).length > 0 && (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Contributors</div>
                  <div className="text-sm text-slate-700">{toArray(activeProject.contributors).join(', ')}</div>
                </div>
              )}

              {activeProject.description && (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Description</div>
                  <div className="text-sm text-slate-700 leading-relaxed">{activeProject.description}</div>
                </div>
              )}

              {activeProject.body && (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Details</div>
                  <div
                    className="text-sm text-slate-700 leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: activeProject.body }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ResearchPage
