import React from 'react'
import { Calendar, Building, Banknote } from 'lucide-react'

const projects = [
  {
    "id": 1,
    "title": "Model development for the removal of mobile oil from solid substrates in presence of surfactants",
    "duration": "1999-2001",
    "funding_agency": "Unilever Research / HLL",
    "amount": "4.2 lacs"
  },
  {
    "id": 2,
    "title": "Development of direct ethanol fuel cell",
    "duration": "2002-2006",
    "funding_agency": "Ministry of Non-conventional Energy Sources, Govt of India",
    "amount": "27 lacs"
  },
  {
    "id": 3,
    "title": "Oil droplet detachment from solid substrate in shear field (EOR application)",
    "duration": "2004-2007",
    "funding_agency": "Department of Science and Technology, Govt of India",
    "amount": "20 lacs"
  },
  {
    "id": 4,
    "title": "Aggregation & sedimentation of clay particles in presence of surfactants",
    "duration": "2004-2006",
    "funding_agency": "IIT Delhi Thrust Area",
    "amount": "6.0 lacs"
  },
  {
    "id": 5,
    "title": "Workshop on Recent Challenges in Fuel Cell Technology",
    "duration": "2006-2007",
    "funding_agency": "DST",
    "amount": "5.3 lacs"
  },
  {
    "id": 6,
    "title": "Development of direct alcohol fuel cell and test protocols",
    "duration": "2008-2011",
    "funding_agency": "Ministry of New and Renewable Energy",
    "amount": "86 lacs"
  },
  {
    "id": 7,
    "title": "Hydrogen generation using high temp PEMWE (with Newcastle University)",
    "duration": "2008-2011",
    "funding_agency": "UKIERI-DST (Shell Hydrogen Corporate Champ)",
    "amount": "42,354"
  },
  {
    "id": 8,
    "title": "CO2 sequestration via electrochemical route",
    "duration": "2009-2012",
    "funding_agency": "KFUPM, Saudi Arabia",
    "amount": "Riyal 2,14,000"
  },
  {
    "id": 9,
    "title": "Scope of Fuel Cell Technology in India",
    "duration": "2009",
    "funding_agency": "NEDO Japan",
    "amount": "5.5 lacs"
  },
  {
    "id": 10,
    "title": "Direct Glucose Fuel Cell",
    "duration": "2009-2012",
    "funding_agency": "DST",
    "amount": "40 lacs"
  },
  {
    "id": 11,
    "title": "Direct hydrocarbon SOFC",
    "duration": "2008-2011",
    "funding_agency": "MNRE",
    "amount": "46 lacs"
  },
  {
    "id": 12,
    "title": "Transference number measurement of GDC and SDC",
    "duration": "2011-2014",
    "funding_agency": "CSIR",
    "amount": "12.5 lacs"
  },
  {
    "id": 13,
    "title": "Low temperature SOEC for CO2 conversion",
    "duration": "2012-2014",
    "funding_agency": "UKIERI",
    "amount": "16 lacs"
  },
  {
    "id": 14,
    "title": "Electrocatalyst for PEM water electrolyzer",
    "duration": "2011-2013",
    "funding_agency": "ISRO",
    "amount": "22.5 lacs"
  },
  {
    "id": 15,
    "title": "Nano fabrication and nano-scale devices (multi-PI project)",
    "duration": "2010-2017",
    "funding_agency": "MCIT",
    "amount": "49.25 crores"
  },
  {
    "id": 16,
    "title": "Solar multifunctional device (holographic + PV + PEC)",
    "duration": "2011-2014",
    "funding_agency": "DST",
    "amount": "3.92 crores"
  },
  {
    "id": 17,
    "title": "Mind the Gap – polymer fuel cell commercialization",
    "duration": "2012-2015",
    "funding_agency": "RCUK-DST",
    "amount": "92 lacs (IITD share)"
  },
  {
    "id": 18,
    "title": "Electrochemical CO2 reduction to hydrocarbons",
    "duration": "2014-2016",
    "funding_agency": "GAIL",
    "amount": "68 lacs"
  },
  {
    "id": 19,
    "title": "Ethylene glycol fuel cell catalysts",
    "duration": "2014-2017",
    "funding_agency": "GITA (Indo-Taiwan)",
    "amount": "22.5 lacs"
  },
  {
    "id": 20,
    "title": "Metal/molten metal SOFC anode characterization",
    "duration": "2015-2016",
    "funding_agency": "Alfaisal University / RGU UK",
    "amount": "2.05 lacs"
  },
  {
    "id": 21,
    "title": "Nanocomposite materials for ceramic fuel cells",
    "duration": "2014-2017",
    "funding_agency": "New Indigo (EU-DST)",
    "amount": "53 lacs"
  },
  {
    "id": 22,
    "title": "Direct hydrocarbon SOFC development",
    "duration": "2015-2018",
    "funding_agency": "DRDO",
    "amount": "1.32 crores"
  },
  {
    "id": 23,
    "title": "Anode development for hydrocarbon SOFC",
    "duration": "2015-2017",
    "funding_agency": "UKIERI",
    "amount": "24.99 lacs"
  },
  {
    "id": 24,
    "title": "Scale-up of hydrocarbon SOFC for ONGC",
    "duration": "2016-2019",
    "funding_agency": "ONGC",
    "amount": "2.54 crores"
  },
  {
    "id": 25,
    "title": "Gold refining process optimization (UAY)",
    "duration": "2017-2019",
    "funding_agency": "MMTC-PAMP + MHRD + Ministry of Mines",
    "amount": "94.25 lacs"
  },
  {
    "id": 26,
    "title": "CO2 reduction in SOEC (Phase II)",
    "duration": "2019-2021",
    "funding_agency": "GAIL R&D",
    "amount": "67 lacs"
  },
  {
    "id": 27,
    "title": "CO2 to chemical fuels conversion",
    "duration": "2018-2021",
    "funding_agency": "Ministry of Steel",
    "amount": "77 lacs"
  },
  {
    "id": 28,
    "title": "Energy Storage Platform of Battery (ESPOB)",
    "duration": "2019-2024",
    "funding_agency": "DST MECSP",
    "amount": "10.37 crores"
  },
  {
    "id": 29,
    "title": "Centre for Electrochemical Energy Storage",
    "duration": "Ongoing",
    "funding_agency": "DST-SERB",
    "amount": "9.76 crores (IMMT: 85.49 lacs)"
  }
]

const SponsoredProjectsPage = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 tracking-tight text-primary">Sponsored Projects</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div 
            key={project.id} 
            className="flex flex-col p-6 bg-card text-card-foreground rounded-xl shadow-sm border border-border hover:shadow-md hover:border-primary/50 transition-all duration-300 group"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <span className="text-primary font-semibold text-sm">{project.id}</span>
            </div>
            
            <h3 className="text-lg font-semibold mb-6 leading-relaxed flex-grow text-foreground/90">{project.title}</h3>
            
            <div className="space-y-3 pt-4 border-t border-border/50">
              <div className="flex items-start gap-3 text-[15px] text-muted-foreground">
                <Calendar className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                <span><span className="font-medium text-foreground">Duration:</span> {project.duration}</span>
              </div>
              <div className="flex items-start gap-3 text-[15px] text-muted-foreground">
                <Building className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                <span><span className="font-medium text-foreground">Agency:</span> {project.funding_agency}</span>
              </div>
              <div className="flex items-start gap-3 text-[15px] text-muted-foreground">
                <Banknote className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                <span><span className="font-medium text-foreground">Funding:</span> {project.amount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SponsoredProjectsPage
