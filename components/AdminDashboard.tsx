
import React, { useState, useEffect } from 'react';
import { PortfolioData, Project, Skill, Experience, ContactMessage, UserCredentials } from '../types';

interface AdminProps {
  data: PortfolioData;
  onUpdate: (data: PortfolioData) => void;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
}

const AdminDashboard: React.FC<AdminProps> = ({ data, onUpdate, isAdmin, setIsAdmin }) => {
  // --- Auth UI States ---
  const [authMode, setAuthMode] = useState<'login' | 'setup' | 'forgot' | 'verify'>('login');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // --- Dashboard States ---
  const [activeTab, setActiveTab] = useState<'Projects' | 'Skills' | 'Experience' | 'Messages' | 'Settings'>('Projects');
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!data.auth) setAuthMode('setup');
  }, [data.auth]);

  // --- Feedback Logic ---
  const triggerSaveFeedback = (msg: string = 'DATABASE_SYNC_SUCCESS') => {
    setSaveStatus(msg);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  // --- DB Management ---
  const exportDatabase = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "portfolio_db_backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    triggerSaveFeedback('DB_DUMP_EXPORTED');
  };

  const importDatabase = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          onUpdate(json);
          triggerSaveFeedback('DB_RESTORE_SUCCESS');
          window.location.reload(); 
        } catch (err) {
          setError('Failed to parse Database file.');
        }
      };
      reader.readAsText(file);
    }
  };

  // --- Strict Validation ---
  const checkPasswordStrength = (pass: string) => {
    const minLen = pass.length >= 8;
    const hasUpper = /[A-Z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    return { minLen, hasUpper, hasNumber, hasSpecial, isStrong: minLen && hasUpper && hasNumber && hasSpecial };
  };

  const strength = checkPasswordStrength(passwordInput);

  const handleSetup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!strength.isStrong) {
      setError('Password security requirements not met.');
      return;
    }
    const newAuth: UserCredentials = {
      username: usernameInput,
      passwordHash: passwordInput,
      recoveryEmail: emailInput,
      recoveryPhone: phoneInput
    };
    setIsVerifying(true);
    setTimeout(() => {
      onUpdate({ ...data, auth: newAuth });
      setAuthMode('login');
      setError('');
      setIsVerifying(false);
      triggerSaveFeedback('SUPERUSER_CREATED');
    }, 1500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError('');
    setTimeout(() => {
      if (data.auth && usernameInput === data.auth.username && passwordInput === data.auth.passwordHash) {
        setIsAdmin(true);
      } else {
        setError('401: Unauthorized Access Denied.');
      }
      setIsVerifying(false);
    }, 1000);
  };

  // --- CRUD Handlers ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => callback(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGeneralUpdate = (field: keyof PortfolioData, value: any) => {
    onUpdate({ ...data, [field]: value });
    triggerSaveFeedback();
  };

  const saveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    
    // Ensure data structures are clean
    const currentProjects = Array.isArray(data.projects) ? data.projects : [];
    
    const newList = currentProjects.some(p => p.id === editingProject.id)
      ? currentProjects.map(p => p.id === editingProject.id ? editingProject : p)
      : [editingProject, ...currentProjects];
    
    onUpdate({ ...data, projects: newList });
    setEditingProject(null);
    triggerSaveFeedback('PROJECT_COMMITTED_TO_DB');
  };

  const saveSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;
    const currentSkills = Array.isArray(data.skills) ? data.skills : [];
    const newList = currentSkills.some(s => s.name === editingSkill.name)
      ? currentSkills.map(s => s.name === editingSkill.name ? editingSkill : s)
      : [editingSkill, ...currentSkills];
    onUpdate({ ...data, skills: newList });
    setEditingSkill(null);
    triggerSaveFeedback('SKILL_COMMITTED');
  };

  const saveExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExperience) return;
    const currentExp = Array.isArray(data.experience) ? data.experience : [];
    const newList = currentExp.some(exp => exp.id === editingExperience.id)
      ? currentExp.map(exp => exp.id === editingExperience.id ? editingExperience : exp)
      : [editingExperience, ...currentExp];
    onUpdate({ ...data, experience: newList });
    setEditingExperience(null);
    triggerSaveFeedback('EXPERIENCE_COMMITTED');
  };

  // --- Reordering Logic ---
  const onDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === index) return;

    const newList = [...data.experience];
    const [removed] = newList.splice(draggedItemIndex, 1);
    newList.splice(index, 0, removed);

    handleGeneralUpdate('experience', newList);
    setDraggedItemIndex(null);
    triggerSaveFeedback('HIERARCHY_REORDERED');
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] p-6 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent"></div>
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 max-w-md w-full p-10 rounded-[48px] shadow-2xl relative z-10 animate-in fade-in zoom-in duration-500">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="text-white font-black text-2xl">Dj</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
              {authMode === 'setup' ? 'Security Init' : 'Authorized Access'}
            </h2>
            <p className="text-gray-500 text-[9px] font-mono tracking-[0.3em] uppercase">Enterprise Superuser Portal</p>
          </div>

          <form onSubmit={authMode === 'setup' ? handleSetup : handleLogin} className="space-y-4">
            <input placeholder="Username" value={usernameInput} onChange={e => setUsernameInput(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:border-emerald-500 transition-all font-mono" required />
            {authMode === 'setup' && (
              <>
                <input placeholder="Verification Email" type="email" value={emailInput} onChange={e => setEmailInput(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none font-mono" required />
                <input placeholder="Recovery Phone" value={phoneInput} onChange={e => setPhoneInput(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none font-mono" required />
              </>
            )}
            <div className="space-y-2">
              <input placeholder="System Password" type="password" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:border-emerald-500 transition-all font-mono" required />
              {authMode === 'setup' && (
                <div className="px-4 py-2 bg-black/40 rounded-xl border border-white/5 grid grid-cols-2 gap-2 text-[8px] font-mono uppercase">
                  <span className={strength.minLen ? 'text-emerald-500' : 'text-gray-500'}>• 8+ Chars</span>
                  <span className={strength.hasUpper ? 'text-emerald-500' : 'text-gray-500'}>• Uppercase</span>
                  <span className={strength.hasNumber ? 'text-emerald-500' : 'text-gray-500'}>• Number</span>
                  <span className={strength.hasSpecial ? 'text-emerald-500' : 'text-gray-500'}>• Symbol</span>
                </div>
              )}
            </div>

            {error && <p className="text-red-400 text-xs text-center animate-pulse font-mono uppercase tracking-tighter">{error}</p>}
            
            <button type="submit" disabled={isVerifying} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-emerald-500/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 uppercase text-xs tracking-widest">
              {isVerifying ? 'Validating...' : authMode === 'setup' ? 'Deploy Superuser' : 'Unlock Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white animate-in fade-in duration-700 font-sans">
      {/* Save Toast */}
      {saveStatus && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 bg-emerald-500 text-black font-black text-[10px] rounded-full shadow-2xl shadow-emerald-500/50 animate-in fade-in slide-in-from-top-4 uppercase tracking-[0.2em]">
          [SYSTEM] {saveStatus}
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 flex flex-col fixed inset-y-0 left-0 z-50 bg-[#050505]">
        <div className="p-8 border-b border-white/5 flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-sm shadow-lg shadow-emerald-500/20">Dj</div>
          <span className="font-bold tracking-tight text-xs uppercase tracking-[0.2em]">Superuser Core</span>
        </div>
        <nav className="flex-1 p-6 space-y-2">
          {(['Projects', 'Skills', 'Experience', 'Messages', 'Settings'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setEditingProject(null); setEditingSkill(null); setEditingExperience(null); }}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex justify-between items-center ${activeTab === tab ? 'bg-white/10 text-emerald-400 border border-emerald-500/20 shadow-xl' : 'text-gray-400 hover:text-white hover:bg-white/5 hover:translate-x-1'}`}
            >
              {tab.toUpperCase()}
              {tab === 'Messages' && data.messages.filter(m => !m.read).length > 0 && <span className="bg-emerald-500 text-white text-[8px] px-1.5 py-0.5 rounded-full">{data.messages.filter(m => !m.read).length}</span>}
            </button>
          ))}
        </nav>
        <button onClick={() => setIsAdmin(false)} className="p-8 border-t border-white/5 text-left text-xs text-red-500/50 hover:text-red-500 font-bold transition-all uppercase tracking-widest">Terminate Session</button>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 ml-72">
        <header className="h-20 px-10 flex items-center justify-between sticky top-0 z-40 backdrop-blur-xl border-b border-white/5 bg-black/20">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-500">{activeTab}</h2>
          <div className="flex items-center gap-4">
            {activeTab === 'Projects' && !editingProject && (
              <button onClick={() => setEditingProject({ id: `proj_${Date.now()}`, title: '', description: '', tags: [], image: '', link: '', github: '' })} className="px-5 py-2 rounded-lg bg-emerald-500 text-white text-[10px] font-bold tracking-widest hover:scale-105 transition-all">+ ADD PROJECT</button>
            )}
            {activeTab === 'Skills' && !editingSkill && (
              <button onClick={() => setEditingSkill({ name: '', category: 'Backend', level: 50 })} className="px-5 py-2 rounded-lg bg-emerald-500 text-white text-[10px] font-bold tracking-widest hover:scale-105 transition-all">+ ADD SKILL</button>
            )}
            {activeTab === 'Experience' && !editingExperience && (
              <button onClick={() => setEditingExperience({ id: `exp_${Date.now()}`, company: '', role: '', period: '', description: [''] })} className="px-5 py-2 rounded-lg bg-emerald-500 text-white text-[10px] font-bold tracking-widest hover:scale-105 transition-all">+ ADD EXPERIENCE</button>
            )}
          </div>
        </header>

        <div className="p-10">
          <div className="glass rounded-[48px] overflow-hidden min-h-[700px] animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === 'Projects' && (
              <div className="p-10">
                {editingProject ? (
                  <form onSubmit={saveProject} className="max-w-3xl space-y-6 animate-in zoom-in duration-300">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold uppercase tracking-widest text-emerald-500">Configure Project</h3>
                      <button type="button" onClick={() => setEditingProject(null)} className="text-xs text-gray-500 hover:text-white uppercase font-bold tracking-widest">Discard Changes</button>
                    </div>
                    <input placeholder="Project Title" value={editingProject.title} onChange={e => setEditingProject({...editingProject, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none font-medium" required />
                    <textarea placeholder="Technical Description" value={editingProject.description} onChange={e => setEditingProject({...editingProject, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none resize-none" rows={4} required />
                    <input placeholder="Metadata Tags (comma separated, e.g. Django, API, React)" value={editingProject.tags.join(', ')} onChange={e => setEditingProject({...editingProject, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t !== '')})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none" />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <input placeholder="GitHub Repository URL" value={editingProject.github} onChange={e => setEditingProject({...editingProject, github: e.target.value})} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none" />
                      <input placeholder="Live Deployment URL" value={editingProject.link} onChange={e => setEditingProject({...editingProject, link: e.target.value})} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none" />
                    </div>
                    
                    <div className="flex gap-4">
                      <input placeholder="Cover Image URL (Unsplash or direct link)" value={editingProject.image} onChange={e => setEditingProject({...editingProject, image: e.target.value})} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none" />
                      <label className="px-6 py-3 bg-white/10 rounded-xl text-[10px] font-black tracking-widest uppercase cursor-pointer hover:bg-white/20 transition-all">
                        UPLOAD_LOCAL
                        <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, b => setEditingProject({...editingProject, image: b}))} />
                      </label>
                    </div>
                    
                    <div className="pt-6">
                      <button type="submit" className="w-full py-5 bg-emerald-600 rounded-2xl font-black hover:bg-emerald-500 uppercase text-[10px] tracking-[0.3em] shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all">Commit to Master Database</button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.projects && data.projects.length > 0 ? (
                      data.projects.map(p => (
                        <div key={p.id} className="glass p-6 rounded-3xl border-white/5 flex gap-4 group hover:border-emerald-500/30 transition-all hover:-translate-y-1">
                          <img src={p.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=300'} className="w-20 h-20 rounded-xl object-cover grayscale group-hover:grayscale-0" />
                          <div className="flex-1">
                            <h3 className="font-bold text-sm mb-1">{p.title || 'Untitled Project'}</h3>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {p.tags?.map(t => <span key={t} className="text-[8px] bg-white/5 px-1.5 py-0.5 rounded text-gray-500">{t}</span>)}
                            </div>
                            <div className="flex gap-4">
                              <button onClick={() => setEditingProject(p)} className="text-[10px] font-bold text-emerald-400 hover:underline">EDIT_NODE</button>
                              <button onClick={() => { if(confirm('Wipe this project node?')) handleGeneralUpdate('projects', data.projects.filter(proj => proj.id !== p.id)) }} className="text-[10px] font-bold text-red-500/50 hover:text-red-500">DELETE</button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 py-32 text-center opacity-20 uppercase tracking-[0.5em] font-mono text-xs">No projects indexed. Click + ADD PROJECT to begin.</div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Skills' && (
              <div className="p-10">
                {editingSkill ? (
                  <form onSubmit={saveSkill} className="max-w-xl space-y-6 animate-in zoom-in duration-300">
                    <input placeholder="Skill Name" value={editingSkill.name} onChange={e => setEditingSkill({...editingSkill, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none" required />
                    <select value={editingSkill.category} onChange={e => setEditingSkill({...editingSkill, category: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none">
                      {data.skillCategories.map(cat => <option key={cat} value={cat} className="bg-[#0a0a0a]">{cat}</option>)}
                    </select>
                    <div className="space-y-2">
                      <label className="text-[10px] text-gray-500">Proficiency: {editingSkill.level}%</label>
                      <input type="range" min="0" max="100" value={editingSkill.level} onChange={e => setEditingSkill({...editingSkill, level: parseInt(e.target.value)})} className="w-full accent-emerald-500" />
                    </div>
                    <div className="flex gap-4 pt-4">
                      <button type="submit" className="px-10 py-4 bg-emerald-600 rounded-2xl font-bold hover:bg-emerald-500 uppercase text-[10px] tracking-widest">Commit Skill</button>
                      <button type="button" onClick={() => setEditingSkill(null)} className="px-10 py-4 glass rounded-2xl font-bold text-xs uppercase">Cancel</button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {data.skills.map(s => (
                      <div key={s.name} className="glass p-6 rounded-3xl border-white/5 group hover:border-emerald-500/30 transition-all">
                        <h3 className="font-bold text-sm">{s.name}</h3>
                        <p className="text-[10px] text-emerald-500 mb-4">{s.category}</p>
                        <div className="flex gap-4">
                          <button onClick={() => setEditingSkill(s)} className="text-[10px] font-bold text-emerald-400">EDIT</button>
                          <button onClick={() => { if(confirm('Delete?')) handleGeneralUpdate('skills', data.skills.filter(sk => sk.name !== s.name)) }} className="text-[10px] font-bold text-red-500/50 hover:text-red-500">DELETE</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Experience' && (
              <div className="p-10">
                {editingExperience ? (
                  <form onSubmit={saveExperience} className="max-w-3xl space-y-6 animate-in zoom-in duration-300">
                    <div className="grid grid-cols-2 gap-4">
                      <input placeholder="Company" value={editingExperience.company} onChange={e => setEditingExperience({...editingExperience, company: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none" required />
                      <input placeholder="Role" value={editingExperience.role} onChange={e => setEditingExperience({...editingExperience, role: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none" required />
                    </div>
                    <input placeholder="Period" value={editingExperience.period} onChange={e => setEditingExperience({...editingExperience, period: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none" required />
                    <div className="space-y-4">
                      <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Job Metrics / Points</label>
                      {editingExperience.description.map((pt, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input value={pt} onChange={e => {
                            const newDesc = [...editingExperience.description];
                            newDesc[idx] = e.target.value;
                            setEditingExperience({...editingExperience, description: newDesc});
                          }} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none" />
                          <button type="button" onClick={() => setEditingExperience({...editingExperience, description: editingExperience.description.filter((_, i) => i !== idx)})} className="text-red-500 text-xl px-2">×</button>
                        </div>
                      ))}
                      <button type="button" onClick={() => setEditingExperience({...editingExperience, description: [...editingExperience.description, '']})} className="text-xs text-emerald-500 font-bold hover:underline">+ ADD LOG ENTRY</button>
                    </div>
                    <div className="flex gap-4 pt-6">
                      <button type="submit" className="px-10 py-4 bg-emerald-600 rounded-2xl font-bold hover:bg-emerald-500 uppercase text-[10px] tracking-widest">Commit Changes</button>
                      <button type="button" onClick={() => setEditingExperience(null)} className="px-10 py-4 glass rounded-2xl font-bold text-xs uppercase">Cancel</button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-4 opacity-50 italic">Drag cards to reorder hierarchy</p>
                    {data.experience.map((exp, index) => (
                      <div 
                        key={exp.id} 
                        draggable={true}
                        onDragStart={(e) => onDragStart(e, index)}
                        onDragOver={(e) => onDragOver(e, index)}
                        onDrop={(e) => onDrop(e, index)}
                        className={`glass p-8 rounded-[32px] border-white/5 flex justify-between items-center group transition-all cursor-move active:scale-[0.98] ${draggedItemIndex === index ? 'opacity-40 border-emerald-500/50 border-dashed' : 'hover:border-emerald-500/30'}`}
                      >
                        <div className="flex items-center gap-6">
                           <div className="text-gray-600 group-hover:text-emerald-500 transition-colors">
                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16"/></svg>
                           </div>
                           <div>
                            <h3 className="text-xl font-bold">{exp.role}</h3>
                            <p className="text-emerald-400 font-mono text-xs">{exp.company}</p>
                          </div>
                        </div>
                        <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-all">
                          <button onClick={() => setEditingExperience(exp)} className="text-xs font-bold text-emerald-400 hover:underline">EDIT_NODE</button>
                          <button onClick={() => { if(confirm('Wipe this experience block?')) handleGeneralUpdate('experience', data.experience.filter(e => e.id !== exp.id)) }} className="text-xs font-bold text-red-500/50 hover:text-red-500">DELETE</button>
                        </div>
                      </div>
                    ))}
                    {data.experience.length === 0 && (
                      <div className="py-32 text-center opacity-20 uppercase tracking-[0.5em] font-mono text-xs">No experience entries logged.</div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Messages' && (
              <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] h-full">
                <div className="border-r border-white/5 overflow-y-auto max-h-[700px]">
                  {data.messages.length === 0 ? (
                    <div className="p-20 text-center opacity-20 italic">No incoming transmissions.</div>
                  ) : (
                    data.messages.map(m => (
                      <button key={m.id} onClick={() => { setSelectedMessage(m); handleGeneralUpdate('messages', data.messages.map(msg => msg.id === m.id ? {...msg, read: true} : msg)); }} className={`w-full p-6 text-left border-b border-white/5 hover:bg-white/5 transition-all relative ${selectedMessage?.id === m.id ? 'bg-white/10' : ''}`}>
                        {!m.read && <div className="absolute top-6 right-6 w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>}
                        <span className="block font-bold text-sm mb-1">{m.name}</span>
                        <p className="text-xs text-gray-500 line-clamp-1">{m.message}</p>
                      </button>
                    ))
                  )}
                </div>
                <div className="p-12">
                  {selectedMessage ? (
                    <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-3xl font-black mb-2">{selectedMessage.name}</h3>
                          <p className="text-emerald-400 font-mono text-xs">{selectedMessage.email}</p>
                        </div>
                        <button onClick={() => { handleGeneralUpdate('messages', data.messages.filter(msg => msg.id !== selectedMessage.id)); setSelectedMessage(null); }} className="text-xs font-bold text-red-500/50 hover:text-red-500 uppercase tracking-widest">Wipe Data</button>
                      </div>
                      <div className="p-10 glass rounded-[40px] italic text-gray-300 border-emerald-500/10 text-lg">"{selectedMessage.message}"</div>
                    </div>
                  ) : <div className="h-full flex items-center justify-center opacity-10 uppercase tracking-[0.5em] font-mono text-xs text-center">Encrypted Inbox<br/>Select Message to Decrypt</div>}
                </div>
              </div>
            )}

            {activeTab === 'Settings' && (
              <div className="p-12 space-y-12 animate-in fade-in duration-500">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <h3 className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest border-b border-white/5 pb-4">Branding Sync</h3>
                    <div className="space-y-6">
                      <div className="flex gap-4 items-center">
                        <img src={data.profileImage} className="w-20 h-20 rounded-2xl object-cover border border-white/10 shadow-2xl" />
                        <label className="flex-1 block text-center py-4 bg-white/5 border border-dashed border-white/20 rounded-xl text-[10px] font-bold cursor-pointer hover:bg-white/10 transition-all">
                          Update Profile Photo
                          <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, b => handleGeneralUpdate('profileImage', b))} />
                        </label>
                      </div>
                      <input placeholder="Full Name" value={data.name} onChange={e => handleGeneralUpdate('name', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none" />
                      <textarea placeholder="Biography" value={data.about} onChange={e => handleGeneralUpdate('about', e.target.value)} rows={6} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm" />
                    </div>
                    
                    <h3 className="text-[10px] font-mono text-purple-500 uppercase tracking-widest border-b border-white/5 pb-4 pt-10">System Maintenance (VIRTUAL_DB)</h3>
                    <div className="glass p-6 rounded-3xl space-y-4 border-purple-500/20">
                      <p className="text-[10px] text-gray-500 font-mono leading-relaxed">Changes are saved automatically to the browser. Perform a Hard Export to download your entire configuration as a portable JSON file.</p>
                      <div className="flex gap-4">
                        <button onClick={exportDatabase} className="flex-1 py-3 bg-purple-600/20 text-purple-400 border border-purple-500/40 rounded-xl text-[10px] font-black tracking-widest uppercase hover:bg-purple-600 hover:text-white transition-all">Download DB Dump</button>
                        <label className="flex-1 py-3 bg-blue-600/20 text-blue-400 border border-blue-500/40 rounded-xl text-[10px] font-black tracking-widest uppercase hover:bg-blue-600 hover:text-white transition-all text-center cursor-pointer">
                          Restore DB
                          <input type="file" className="hidden" accept=".json" onChange={importDatabase} />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-12">
                     <div className="space-y-6">
                       <h3 className="text-[10px] font-mono text-blue-500 uppercase tracking-widest border-b border-white/5 pb-4">Social Access</h3>
                       <input placeholder="Email" value={data.email} onChange={e => handleGeneralUpdate('email', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs" />
                       <input placeholder="WhatsApp" value={data.whatsapp} onChange={e => handleGeneralUpdate('whatsapp', e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs" />
                     </div>
                     <div className="space-y-6">
                       <h3 className="text-[10px] font-mono text-red-500 uppercase tracking-widest border-b border-white/5 pb-4">Security Override</h3>
                       <div className="glass p-8 rounded-[32px] border-red-500/10 space-y-4">
                          <input placeholder="System Username" value={data.auth?.username} onChange={e => onUpdate({...data, auth: {...data.auth!, username: e.target.value}})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-emerald-400 font-mono" />
                          <input type="password" placeholder="Overwrite Master Password" onChange={e => e.target.value && onUpdate({...data, auth: {...data.auth!, passwordHash: e.target.value}})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono" />
                       </div>
                     </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
