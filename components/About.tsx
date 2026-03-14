
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const About: React.FC<{ about: string; isAdmin?: boolean }> = ({ about, isAdmin }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { 
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px' 
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="about" 
      className="py-32 border-t border-white/5 overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 items-start">
        <div className={`transition-all duration-1000 ease-out transform ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
        }`}>
          <span className="text-xs font-mono text-emerald-500 uppercase tracking-[0.4em] font-bold mb-6 block">01 / Profile</span>
          <h2 className="text-5xl md:text-6xl font-extrabold tracking-tighter leading-tight">
            The Story<br/>Behind the <span className="text-emerald-500">Code</span>.
          </h2>
          <div className="mt-10 h-1 w-20 bg-gradient-to-r from-emerald-500 to-transparent rounded-full"></div>
        </div>
        
        <div className={`transition-all duration-1000 delay-300 ease-out transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}>
          <div className="glass p-12 rounded-[48px] border-white/5 relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-500">
            {isAdmin && (
              <Link to="/admin" className="absolute top-8 right-8 p-3 glass border-emerald-500/30 rounded-2xl text-emerald-400 hover:scale-110 transition-all z-20 group" title="Edit About Section">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                <span className="absolute right-full mr-4 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-[10px] uppercase tracking-widest bg-black/80 px-2 py-1 rounded">Update Bio</span>
              </Link>
            )}
            
            {/* Subtle background glow */}
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>
            
            <div className="absolute top-0 left-0 w-1.5 h-full bg-white/5 group-hover:bg-emerald-500 transition-colors duration-700"></div>
            
            <div className="space-y-6">
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-medium">
                {about}
              </p>
              <div className="flex gap-4 pt-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Status</span>
                  <span className="text-xs font-bold text-emerald-400">Deployed & Ready</span>
                </div>
                <div className="w-[1px] h-8 bg-white/10 mx-4"></div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Focus</span>
                  <span className="text-xs font-bold text-white">Full-Stack Architecture</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
