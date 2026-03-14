
import React from 'react';
import { Experience as ExpType } from '../types';

const Experience: React.FC<{ experience: ExpType[] }> = ({ experience }) => {
  return (
    <section id="experience" className="py-24 border-t border-white/5">
      <h2 className="text-4xl font-bold tracking-tight mb-16">Professional Journey</h2>
      
      <div className="space-y-12">
        {experience.map((exp, index) => (
          <div key={exp.id} className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 group">
            <div className="text-gray-500 font-mono text-sm pt-2">
              {exp.period}
            </div>
            <div className="relative pl-0 md:pl-10">
              {/* Vertical line connector */}
              {index !== experience.length - 1 && (
                <div className="hidden md:block absolute left-0 top-10 bottom-[-48px] w-[1px] bg-white/10"></div>
              )}
              {/* Dot marker */}
              <div className="hidden md:block absolute left-[-4px] top-3 w-2 h-2 rounded-full bg-blue-500 group-hover:scale-150 transition-transform"></div>
              
              <div className="glass rounded-3xl p-8 hover:border-white/20 transition-all duration-300">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                  <div>
                    <h3 className="text-2xl font-bold">{exp.role}</h3>
                    <p className="text-blue-400 font-medium">{exp.company}</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {exp.description.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-400 leading-relaxed">
                      <span className="mt-2 w-1 h-1 rounded-full bg-gray-600 shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience;
