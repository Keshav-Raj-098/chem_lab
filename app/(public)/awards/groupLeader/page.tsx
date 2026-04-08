import React from 'react'


const awards =  [
    "<b>MRSI Medal</b> for <b>2022</b> by <b>Materials Research Society of India</b>",
    "<b>Gold Medal</b> <b>2022</b> by <b>Society of Materials Chemistry</b>",
    "<b>Odisha State Business Leadership Award</b> under <b>R&D category</b> <b>2021-22</b> from <b>Interview Times</b>",
    "<b>Eminent Chemical Engineer Award</b> from <b>IEI</b>, <b>2021</b>",
    "Among <b>Top 2% Scientists in world ranking</b> brought out by <b>Stanford University</b>, <b>2020</b>",
    "<b>Fellow</b> of <b>Indian National Academy of Engineering (FNAE)</b>, <b>2020</b>",
    "<b>Fellow</b> of the <b>Royal Society of Chemistry (FRSC)</b>, <b>2020</b>",
    "<b>Fellow</b> of <b>International Association of Advanced Materials (FIAAM), Sweden</b>, <b>2020</b>",
    "<b>Chemcon 2018 Distinguished Speaker Award</b> organized at <b>NIT Jalandhar</b>",
    "<b>Herdillia Award</b>, <b>Excellence in Basic Research in Chemical Engineering</b>, <b>IIChE 2016</b>",
    "<b>Dr A. V. Rama Rao Foundation's Research Award</b> in <b>Chemical Engineering/Technology</b>, <b>2016</b>",
    "<b>Research Excellence Award</b>, <b>The Indus Foundation Inc.</b>, USA and India, <b>2016</b>",
    "<b>Fellow</b> of <b>The National Academy of Sciences, India (FNASc)</b>, <b>2015</b>",
    "<b>Best Paper Award</b> in <b>International Conference of Electrochemical Society of India</b>, <b>IISc Bangalore</b>, Aug 7-9, <b>2014</b>",
    "<b>ISEAC Journal Publication Award</b> <b>2012</b> – <b>1st Prize</b> publication in peer-reviewed international journal",
    "<b>Prof. R. D. Desai 80th Birthday Commemoration Medal & Prize</b>, <b>2012</b>, <b>Indian Chemical Society</b>",
    "<b>Fellow</b> of <b>Indian Chemical Society</b>, <b>2012</b>",
    "<b>Prof. Bal Krishna Memorial Lecture</b> - <b>International Year of Chemistry</b>, <b>48th Convention of Chemists</b>, Indian Chemical Society, Dec 4, <b>2011</b>",
    "<b>Fellow</b> of <b>Institute of Engineers (FIE)</b>, <b>2011</b>",
    "<b>FITT Award</b> for best <b>M.Tech./Ph.D. Thesis</b> <b>2010</b>; Rs <b>40,000</b> prize money shared with student <b>A. Awasthi</b>",
    "<b>Distinguished Alumni Award</b>, <b>Department of Chemical Engineering</b>, <b>Calcutta University</b>, <b>2010</b>",
    "<b>Visiting Fellow</b>, <b>Royal Society, UK</b>, <b>University of Newcastle upon Tyne</b>, <b>2008</b>",
    "<b>DAAD Faculty Research Award</b> on <b>Fuel Cell Technology</b>, <b>University of Karlsruhe, Germany</b>, <b>2006</b>",
    "<b>Visiting Professor</b>, <b>Department of Chemical Engineering</b>, <b>University of Newcastle, Australia</b>, <b>2005</b>",
    "<b>Visiting Professor</b>, <b>Department of Chemical & Materials Engineering</b>, <b>University of Alberta, Canada</b>, <b>2000, 2002</b>",
    "<b>Best Paper</b> in <b>Energy Engineering Session</b>: Verma, A., Singh, K. V., and Basu, S., <b>Studies on Alkaline Fuel Cell</b>, <b>56th Annual Session of IIChE</b>, Chemcon 2003, Bhubaneswar, Dec 19-22, <b>2003</b>",
    "<b>Best Paper</b> in <b>Transfer Processes</b>: Basu, S., Sinha, S. N., and Nigam, K. D. P., <b>Effects of Surfactants on Adhesion, Spreading, and Retention of Fungicide Droplets</b>, Chemcon 2002, Hyderabad, Dec 19-22, <b>2002</b>"
  ]


const page = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="space-y-4">
        {awards && awards?.map((award, index) => (
          <div 
            key={index} 
            className="flex items-start gap-4 p-6 bg-card text-card-foreground rounded-xl shadow-sm border border-border hover:shadow-md hover:border-primary/50 transition-all duration-300"
          >
            <div className="mt-2.5 w-2 h-2 rounded-full bg-primary shrink-0" />
            <div 
              className="text-[17px] leading-relaxed" 
              dangerouslySetInnerHTML={{ __html: award }} 
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default page
