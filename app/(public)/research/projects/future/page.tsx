import React from 'react'
import { Lightbulb } from 'lucide-react'

const projects = [
  "<b>CO2 to platform chemical conversion</b> using <b>electrochemical route</b>",
  "<b>Biomass conversion</b> to <b>platform chemicals</b> through <b>photochemical route</b>",
  "<b>Anode development</b> for <b>direct hydrocarbon 500 W SOFC stack</b>",
  "<b>Microfluidics</b> - <b>microplant</b>, <b>lab on a chip</b>, <b>micro fuel cell</b>",
  "<b>Glucose fuel cell</b> - <b>power source for body implants</b>",
  "<b>Fuel cell stack</b> for <b>emergency power</b> for portable equipment",
  "<b>Micro fuel cell</b> for <b>medical implants</b>",
  "<b>Artificial leaf</b> (<b>leaf on a chip</b>)"
]

const FutureProjectsPage = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 tracking-tight text-primary">Future Projects</h2>
      
      <div className="space-y-4">
        {projects.map((project, index) => (
          <div 
            key={index} 
            className="flex items-start gap-4 p-5 md:p-6 bg-card text-card-foreground rounded-xl shadow-sm border border-border hover:shadow-md hover:border-primary/50 transition-all duration-300 group"
          >
            <div className="mt-0.5 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
               <Lightbulb className="w-4 h-4 text-primary" />
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

export default FutureProjectsPage
