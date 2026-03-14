import React from 'react';
import { Link } from 'react-router-dom';
import { PortfolioData } from '../types';

const Hero: React.FC<{ data: PortfolioData; isAdmin?: boolean }> = ({ data, isAdmin }) => {
  return (
    <section className="min-h-[90vh] flex flex-col justify-center py-20 relative overflow-hidden rounded-[60px] mt-8 group/hero">
      <div className="absolute inset-0 z-0">
        <img 
          src={data.backgroundImage} 
          alt="Atmospheric Background" 
          className="w-full h-full object-cover opacity-20 filter grayscale group-hover/hero:grayscale-0 group-hover/hero:scale-105 transition-all duration-[2000ms] ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/50 via-transparent to-[#050505]"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-12 items-center relative z-10 px-10 md:px-20">
        <div className="max-w-4xl relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono tracking-widest uppercase backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            {data.cvUrl ? 'Active for Hire' : 'Available for Collaboration'}
          </div>
          
          <h1 className="text-7xl md:text-[8rem] font-extrabold tracking-tighter leading-[0.85] mb-8 drop-shadow-2xl">
            Building <span className="gradient-text">Scalable</span><br/>Infrastructure.
          </h1>
          
          <p className="text-xl text-gray-400 leading-relaxed mb-12 max-w-2xl font-medium">
            Recent IT graduate specializing in <span className="text-white">Django systems</span> and <span className="text-emerald-500">Cisco network engineering</span>. Designing secure, high-performance digital environments.
          </p>
          
          <div className="flex flex-wrap gap-6">
            <a 
              href="#projects" 
              className="px-12 py-5 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-500 transition-all transform hover:scale-105 active:scale-95 shadow-2xl shadow-emerald-600/20"
            >
              View My Work
            </a>
            {data.cvUrl && (
              <a 
                href={data.cvUrl}
                download={`${data.name}_CV.pdf`}
                className="px-12 py-5 glass hover:bg-emerald-500 hover:text-white font-bold rounded-2xl transition-all transform hover:scale-105 active:scale-95 border border-emerald-500/30 flex items-center gap-3 text-emerald-400"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                Download Resume
              </a>
            )}
          </div>
        </div>

        <div className="hidden lg:flex justify-end items-center relative group/profile">
          <div className="relative w-72 h-[420px] rounded-[48px] overflow-hidden glass border-white/10 shadow-2xl transition-all duration-700 group-hover/profile:scale-105 group-hover/profile:-rotate-1 group-hover/profile:border-emerald-500/30">
            <img 
              src={data.profileImage} 
              alt={data.name} 
              className="w-full h-full object-cover transition-all duration-700 group-hover/profile:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            <div className="absolute bottom-10 left-10 right-10">
              <div className="bg-emerald-500 text-black font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-widest mb-2 inline-block shadow-lg">Portfolio Admin</div>
              <h3 className="text-2xl font-bold tracking-tight text-white mb-1">{data.name}</h3>
              <p className="text-gray-400 text-xs font-mono uppercase tracking-widest">{data.title}</p>
            </div>
          </div>
          
          {data.cvUrl && (
            <div className="absolute -bottom-6 -left-6 glass px-6 py-4 rounded-3xl border-emerald-500/40 animate-bounce duration-[4000ms] shadow-2xl">
               <div className="flex flex-col gap-1">
                 <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Hire Interest?</span>
                 <a href={data.cvUrl} download={`${data.name}_CV.pdf`} className="text-[8px] font-mono text-white underline decoration-emerald-500/50 hover:text-emerald-400">GET CV PACK.EXE</a>
               </div>
            </div>
          )}
          
          <div className="absolute -top-10 -right-6 glass p-4 rounded-3xl border-blue-500/20 flex items-center gap-3">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"></div>
             <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Network_v2.0</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;