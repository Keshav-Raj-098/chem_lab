import React from 'react'

const projects = [
  "<b>Electrocatalysis</b>, <b>Electrochemical</b> & <b>Materials Engineering</b>",
  "<b>Na-ion battery development</b> - <b>cathode</b> and <b>anode materials</b>",
  "<b>Supercapacitor</b> <b>anode / cathode materials development</b>",
  "<b>Direct Alcohol Flowing Electrolyte Alkaline Fuel Cell</b>",
  "<b>Direct Alcohol PEM (Proton Exchange Membrane) Fuel Cell (DAPEMFC)</b>",
  "<b>Hydrogen generation</b> from water using <b>PEM electrolyzer</b>",
  "<b>Development of electrocatalysts</b> for <b>DAPEMFC</b>, <b>PEM electrolyzer</b>",
  "<b>Degradation</b> of <b>PEMFC catalysts</b> and <b>MEA</b>",
  "<b>Degradation</b> of <b>Ni-YSZ</b> in <b>SOFC Anode</b>",
  "<b>Anode</b> (<b>Cu-Co</b>, <b>Cu-Mo-ceria/YSZ</b>, <b>Perovskite LSCT A-/YSZ</b>) for <b>direct hydrocarbon SOFC</b>",
  "<b>Electrolyte</b> (<b>GDC</b>, <b>LDC</b>, <b>SDC</b> and <b>carbonates</b>) for <b>low temperature solid oxide fuel cell</b>",
  "<b>Direct Glucose Fuel Cell</b> - <b>micro fuel cell</b>",
  "<b>Microfluidic electrolyser</b> and <b>microfluidic fuel cell</b> tandem operation",
  "<b>Electro-reduction of CO2</b> to <b>organic compounds</b>",
  "<b>Photochemical</b> and <b>photo-electrochemical water splitting</b> for <b>H2</b> and <b>O2 generation</b>",
  "<b>C1, C2, C3</b> and <b>platform chemical conversion</b> using <b>electrochemical route</b>",
  "<b>Biomass conversion</b> to <b>platform chemicals</b> through <b>photochemical route</b>",
  "<b>FeNi L10 magnetic materials development</b>",
  "<b>Interfacial Engineering</b> & <b>Separation Technology</b> - <b>Waste Water Treatment</b>",
  "<b>Removal of dye</b> by <b>liquid-liquid extraction</b> using <b>reverse micelles</b>",
  "<b>Extraction of dyes</b> by <b>colloidal gas aphrons</b>",
  "<b>Aggregation</b> and <b>sedimentation of clay particles</b> dispersed in water by <b>cationic surfactants</b>",
  "<b>Extraction of metals</b> (<b>Li</b>, <b>Co</b>) from <b>spent LIB</b> and <b>metal-hydride batteries</b>",
  "<b>Surfactants</b> & <b>fluid flow phenomena</b> - <b>Enhanced Oil Recovery (EOR)</b>",
  "<b>Oil droplet detachment</b> from <b>solid surface</b> in <b>shear flow</b> and in the presence of <b>surfactants</b>",
  "<b>De-wetting dynamics</b> of <b>oil droplet</b> on <b>solid substrate</b> in the presence of <b>surfactants</b>"
]

const CompletedProjectsPage = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 tracking-tight text-primary">Completed Projects</h2>
      
      <div className="space-y-4">
        {projects.map((project, index) => (
          <div 
            key={index} 
            className="flex items-start gap-4 p-5 md:p-6 bg-card text-card-foreground rounded-xl shadow-sm border border-border hover:shadow-md hover:border-primary/50 transition-all duration-300"
          >
            <div className="mt-0.5 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
               <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
               </svg>
            </div>
            <div 
              className="text-[17px] leading-relaxed [&>b]:text-foreground [&>b]:font-semibold" 
              dangerouslySetInnerHTML={{ __html: project }} 
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default CompletedProjectsPage
