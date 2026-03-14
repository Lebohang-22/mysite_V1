
import React from 'react';
import { Skill } from '../types';

const Skills: React.FC<{ skills: Skill[], categories: string[] }> = ({ skills, categories }) => {
  return (
    <section id="skills" className="py-24 border-t border-white/5">
      <h2 className="text-4xl font-bold tracking-tight mb-16">Technical Expertise</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {categories.map((cat) => (
          <div key={cat}>
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-blue-500 mb-8">{cat}</h3>
            <div className="space-y-6">
              {skills.filter(s => s.category === cat).map((skill) => (
                <div key={skill.name} className="group">
                  <div className="flex justify-between text-sm mb-2 font-medium">
                    <span className="text-gray-300">{skill.name}</span>
                    <span className="text-gray-500 font-mono">{skill.level}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 group-hover:brightness-125"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              {skills.filter(s => s.category === cat).length === 0 && (
                <p className="text-gray-600 text-xs italic">No skills listed yet.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
