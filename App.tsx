
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { INITIAL_DATA } from './constants';
import { PortfolioData } from './types';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Contact from './components/Contact';
import AIAssistant from './components/AIAssistant';
import AdminDashboard from './components/AdminDashboard';

const App: React.FC = () => {
  const [data, setData] = useState<PortfolioData>(() => {
    const saved = localStorage.getItem('portfolio_data_v2');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return sessionStorage.getItem('is_superuser_session') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('portfolio_data_v2', JSON.stringify(data));
  }, [data]);

  const handleUpdateData = (newData: PortfolioData) => {
    setData(newData);
  };

  const handleLoginStatus = (status: boolean) => {
    setIsAdmin(status);
    if (status) sessionStorage.setItem('is_superuser_session', 'true');
    else sessionStorage.removeItem('is_superuser_session');
  };

  return (
    <Router>
      <div className="min-h-screen selection:bg-emerald-500/30 bg-[#050505] text-white overflow-x-hidden">
        <Navbar isAdmin={isAdmin} onLogout={() => handleLoginStatus(false)} cvUrl={data.cvUrl} name={data.name} unreadCount={data.messages?.filter(m => !m.read).length || 0} />
        
        <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none z-0"></div>
        <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

        <Routes>
          <Route path="/" element={
            <main className="container mx-auto px-6 pt-24 pb-20 max-w-6xl relative z-10 animate-in fade-in duration-1000">
              <Hero data={data} isAdmin={isAdmin} />
              <div id="about"><About about={data.about} isAdmin={isAdmin} /></div>
              <div id="projects"><Projects projects={data.projects} /></div>
              <div id="experience"><Experience experience={data.experience} /></div>
              <div id="skills"><Skills skills={data.skills} categories={data.skillCategories} /></div>
              <div id="contact"><Contact data={data} onUpdate={handleUpdateData} /></div>
              <AIAssistant portfolioData={data} />
            </main>
          } />
          <Route path="/admin" element={
            <AdminDashboard 
              data={data} 
              onUpdate={handleUpdateData} 
              isAdmin={isAdmin} 
              setIsAdmin={handleLoginStatus} 
            />
          } />
        </Routes>

        <footer className="border-t border-white/5 py-12 text-center relative z-10">
          <div className="container mx-auto px-6 max-w-6xl flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-left">
              <h4 className="font-black tracking-tighter text-xl mb-1 uppercase">{data.name.split(' ')[0]}<span className="text-emerald-500">.</span></h4>
              <p className="text-gray-500 text-[10px] font-mono uppercase tracking-[0.2em]">{data.title}</p>
            </div>
            <p className="text-gray-500 text-xs tracking-wider">
              © {new Date().getFullYear()} {data.name}. Secure Cloud Architecture.
            </p>
            <div className="flex gap-4">
              <a href={data.github} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors text-xs font-bold">GITHUB</a>
              <a href={data.linkedin} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors text-xs font-bold">LINKEDIN</a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

const Navbar: React.FC<{ isAdmin: boolean; onLogout: () => void; cvUrl?: string; name: string; unreadCount: number }> = ({ isAdmin, onLogout, cvUrl, name, unreadCount }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBrandClick = () => {
    const nextCount = clickCount + 1;
    setClickCount(nextCount);
    if (nextCount === 3) {
      navigate('/admin');
      setClickCount(0);
    }
    // Reset click count after 2 seconds of inactivity
    setTimeout(() => setClickCount(0), 2000);
  };

  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${isScrolled ? 'py-4 glass border-b' : 'py-10 bg-transparent'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center max-w-6xl">
        <button 
          onClick={handleBrandClick} 
          className="text-2xl font-black tracking-tighter flex items-center gap-2 group cursor-pointer"
        >
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-xs text-white group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/20">Dj</div>
          <span>{name.split(' ')[0].toUpperCase()}<span className="text-emerald-500">.</span></span>
        </button>
        
        <div className="flex items-center gap-8">
          <div className="hidden lg:flex gap-8 text-[10px] font-bold uppercase tracking-widest">
            {['about', 'projects', 'skills'].map((id) => (
              <button key={id} onClick={() => scrollToSection(id)} className="transition-all hover:text-emerald-400 text-gray-400">
                {id.toUpperCase()}
              </button>
            ))}
            {cvUrl && (
              <a href={cvUrl} download={`${name}_CV.pdf`} className="text-white hover:text-emerald-400 border-l border-white/10 pl-8 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                RESUME
              </a>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {isAdmin && (
              <>
                <Link to="/admin" className="relative px-6 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold tracking-widest uppercase transition-all shadow-lg shadow-emerald-500/10">
                  DASHBOARD
                  {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[8px] font-black animate-bounce shadow-lg">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                <button onClick={onLogout} className="text-[10px] font-bold text-red-500/50 hover:text-red-500 transition-colors uppercase">Logout</button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default App;
