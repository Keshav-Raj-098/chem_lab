"use client"

import { useState, useEffect, useCallback } from 'react'
import { fetchResearchByStatus } from '@/lib/load_data/loadResearch'
import { ResearchStatus, ResearchProjectType } from '@/lib/generated/prisma/enums'
import { 
  Loader2, 
  ChevronDown, 
  CheckCircle2, 
  FlaskConical, 
  TrendingUp, 
  History, 
  Sparkles, 
  Target, 
  Layers, 
  Calendar, 
  Building2, 
  Coins,
  Users
} from 'lucide-react'
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
  type: ResearchProjectType
  amntFunded: string | number | null
  completedOn: string | Date | null
  createdAt: string | Date
}

const ResearchPage = () => {
  const [data, setData] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  
  // Visibility counts for sections
  const [visibleFunded, setVisibleFunded] = useState(6)
  const [visibleNonFunded, setVisibleNonFunded] = useState(6)

  const loadData = useCallback(async () => {
    setLoading(true)
    const ongoingRes = await fetchResearchByStatus(1, ResearchStatus.ONGOING, 100)
    const completedRes = await fetchResearchByStatus(1, ResearchStatus.COMPLETED, 100)
    const plannedRes = await fetchResearchByStatus(1, ResearchStatus.PLANNED, 100)

    let allData: Project[] = []
    if (ongoingRes.success) allData = [...allData, ...(ongoingRes.data as unknown as Project[])]
    if (completedRes.success) allData = [...allData, ...(completedRes.data as unknown as Project[])]
    if (plannedRes.success) allData = [...allData, ...(plannedRes.data as unknown as Project[])]

    setData(allData)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const getProcessedData = (type: ResearchProjectType) => {
    const filtered = data.filter(p => p.type === type)
    return filtered.sort((a, b) => {
      // Prioritize ONGOING projects
      if (a.status === ResearchStatus.ONGOING && b.status !== ResearchStatus.ONGOING) return -1
      if (a.status !== ResearchStatus.ONGOING && b.status === ResearchStatus.ONGOING) return 1
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }

  const fundedProjects = getProcessedData(ResearchProjectType.FUNDED)
  const nonFundedProjects = getProcessedData(ResearchProjectType.NON_FUNDED)

  const getStatusInfo = (s: ResearchStatus) => {
    switch (s) {
      case ResearchStatus.ONGOING: return { label: 'Ongoing', color: 'bg-amber-100 text-amber-800 border-amber-200', icon: <TrendingUp className="w-3.5 h-3.5" /> }
      case ResearchStatus.COMPLETED: return { label: 'Completed', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: <CheckCircle2 className="w-3.5 h-3.5" /> }
      default: return { label: 'Planned', color: 'bg-indigo-100 text-indigo-800 border-indigo-200', icon: <FlaskConical className="w-3.5 h-3.5" /> }
    }
  }

  const ProjectCard = ({ project }: { project: Project }) => {
    const isExpanded = expandedId === project.id
    const status = getStatusInfo(project.status)

    return (
      <div
        className={`group relative bg-white border rounded-2xl transition-all duration-500 overflow-hidden cursor-pointer ${
          isExpanded 
            ? 'border-teal-400 shadow-2xl shadow-teal-900/10 ring-1 ring-teal-500/20 z-10 scale-[1.01]' 
            : 'border-slate-200 hover:border-teal-300 hover:shadow-xl hover:-translate-y-1'
        }`}
        onClick={() => setExpandedId(isExpanded ? null : project.id)}
      >
        {/* Card Header Section */}
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest border shadow-sm ${status.color}`}>
                  {status.icon}
                  {status.label}
                </span>
                {project.type === ResearchProjectType.FUNDED && (
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest shadow-md">
                    Sponsored Project
                  </span>
                )}
              </div>

              <h3 className={`font-serif leading-snug transition-colors duration-300 ${
                isExpanded ? 'text-2xl md:text-3xl text-slate-900' : 'text-xl md:text-2xl text-[#0f2557] group-hover:text-teal-700'
              }`}>
                {project.title}
              </h3>

              {/* Minimal Metadata Row */}
              <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-2">
                {project.fundingAgencies && project.fundingAgencies[0] && (
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Grantor</p>
                      <p className="text-sm font-semibold text-slate-700">{project.fundingAgencies[0]}</p>
                    </div>
                  </div>
                )}
                {project.duration && (
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Timeline</p>
                      <p className="text-sm font-semibold text-slate-700">{project.duration}</p>
                    </div>
                  </div>
                )}
                {project.amntFunded && (
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500 border border-emerald-100">
                      <Coins className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Funding</p>
                      <p className="text-sm font-bold text-emerald-600">₹{project.amntFunded}L</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={`hidden md:flex flex-shrink-0 items-center justify-center w-12 h-12 rounded-full border transition-all duration-300 ${
              isExpanded ? 'bg-teal-600 border-teal-500 text-white rotate-180' : 'bg-slate-50 border-slate-200 text-slate-400 group-hover:text-teal-600 group-hover:border-teal-300'
            }`}>
              <ChevronDown className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Expanded Content View */}
        {isExpanded && (
          <div className="bg-slate-50/50 border-t border-slate-100 p-6 md:p-8 space-y-8 animate-in zoom-in-95 fade-in duration-500">
            {project.body && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-teal-600">
                  <Layers className="w-4 h-4" />
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.2em]">Research Abstract</span>
                </div>
                <div 
                  className="text-base text-slate-700 leading-relaxed font-sans max-w-4xl bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm" 
                  dangerouslySetInnerHTML={{ __html: project.body }} 
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {project.investigators && project.investigators.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-indigo-600">
                    <Target className="w-4 h-4" />
                    <span className="text-[11px] font-extrabold uppercase tracking-[0.2em]">Principal Investigators</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {project.investigators.map((inv, i) => (
                      <span key={i} className="px-4 py-2 bg-white text-slate-900 text-sm font-bold rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-500" />
                        {inv}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {project.contributors && project.contributors.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Users className="w-4 h-4" />
                    <span className="text-[11px] font-extrabold uppercase tracking-[0.2em]">Key Contributors</span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm text-slate-600 font-medium">
                    {project.contributors.join(' • ')}
                  </div>
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
      <div className="min-h-screen bg-white pt-28 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest animate-pulse">Initializing Lab Portfolio</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-teal-200 selection:text-teal-900 pb-24">
      <ResearchAnimations />

      {/* ═══ HERO SECTION ═══ */}
      <div className="relative pt-20 pb-12 overflow-hidden bg-white border-b border-slate-200/60">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-50/50 via-white to-white -z-10" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-teal-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-70 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-200/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 opacity-70 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-5" data-anim="header-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-white text-[10px] font-bold tracking-widest uppercase shadow-sm cursor-default transition-transform hover:scale-105">
              <Sparkles className="w-3 h-3 text-teal-400" />
              Scientific Portfolio
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Research <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">Projects</span>
            </h1>
            
            <p className="text-base md:text-lg text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
              Advancing scientific frontiers through rigorous inquiry and strategic high-impact collaborations.
            </p>
          </div>
        </div>
      </div>

      {/* ═══ MAIN CONTENT ═══ */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-16 lg:py-24 space-y-24">
        
        {/* SECTION: FUNDED RESEARCH */}
        <section data-anim="funded-section">
          <div className="flex items-end justify-between mb-8 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                Funded Research
                <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-500 rounded-full align-middle">
                  {fundedProjects.length}
                </span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {fundedProjects.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <p className="text-slate-600 font-bold text-xl md:text-2xl tracking-tight">No funded projects yet</p>
                <p className="text-slate-500 mt-2 font-medium">Check back later for updates.</p>
              </div>
            ) : (
              <>
                {fundedProjects.slice(0, visibleFunded).map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
                
                {visibleFunded < fundedProjects.length && (
                  <div className="mt-10 flex justify-center">
                    <button 
                      onClick={() => setVisibleFunded(prev => prev + 6)}
                      className="group relative inline-flex items-center justify-center gap-3 px-10 py-4 bg-white text-slate-900 font-bold rounded-full overflow-hidden transition-all duration-300 border-2 border-slate-200 hover:border-transparent hover:shadow-2xl hover:shadow-teal-900/20 hover:-translate-y-1"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors duration-300">
                        Load More
                        <ChevronDown className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                      </span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* SECTION: NON-FUNDED RESEARCH */}
        <section data-anim="non-funded-section">
          <div className="flex items-end justify-between mb-8 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                Non-Funded Research
                <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-500 rounded-full align-middle">
                  {nonFundedProjects.length}
                </span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {nonFundedProjects.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <p className="text-slate-600 font-bold text-xl md:text-2xl tracking-tight">No non-funded projects yet</p>
                <p className="text-slate-500 mt-2 font-medium">Check back later for updates.</p>
              </div>
            ) : (
              <>
                {nonFundedProjects.slice(0, visibleNonFunded).map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}

                {visibleNonFunded < nonFundedProjects.length && (
                  <div className="mt-10 flex justify-center">
                    <button 
                      onClick={() => setVisibleNonFunded(prev => prev + 6)}
                      className="group relative inline-flex items-center justify-center gap-3 px-10 py-4 bg-white text-slate-900 font-bold rounded-full overflow-hidden transition-all duration-300 border-2 border-slate-200 hover:border-transparent hover:shadow-2xl hover:shadow-teal-900/20 hover:-translate-y-1"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors duration-300">
                        Load More
                        <ChevronDown className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                      </span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

      </main>
    </div>
  )
}

export default ResearchPage
