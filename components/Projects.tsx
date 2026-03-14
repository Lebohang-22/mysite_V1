
import React from 'react';
import { Project } from '../types';

const Projects: React.FC<{ projects: Project[] }> = ({ projects }) => {
  return (
    <section id="projects" className="py-24 border-t border-white/5">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
        <div>
          <h2 className="text-4xl font-bold tracking-tight mb-4">Selected Works</h2>
          <p className="text-gray-400 max-w-md">A collection of projects that define my journey and technical capabilities.</p>
        </div>
        <div className="text-sm font-mono text-gray-500 uppercase tracking-widest">
          Count: {projects.length}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div key={project.id} className="group relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden glass border border-white/5 mb-6 relative transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-blue-500/20 group-hover:border-white/20">
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                 <div className="flex gap-3">
                   <a href={project.github} className="p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white hover:text-black transition-colors">
                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.627-5.373-12-12-12z"/></svg>
                   </a>
                   <a href={project.link} className="p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white hover:text-black transition-colors">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                   </a>
                 </div>
              </div>
            </div>
            
            <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{project.title}</h3>
            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="text-[10px] font-mono uppercase tracking-widest text-gray-400 bg-white/5 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
