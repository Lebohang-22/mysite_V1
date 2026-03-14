
import React, { useState } from 'react';
import { PortfolioData, ContactMessage } from '../types';

const Contact: React.FC<{ data: PortfolioData; onUpdate: (data: PortfolioData) => void }> = ({ data, onUpdate }) => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '', hp_field: '' });
  const [errors, setErrors] = useState<{ email?: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleInputChange = (field: string, value: string) => {
    setFormState({ ...formState, [field]: value });
    if (field === 'email') {
      if (errors.email) setErrors({ ...errors, email: undefined });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Honeypot check (Antispam Handshake)
    if (formState.hp_field !== '') {
      console.warn("SPAM_DETECTION: Unauthorized bot submission intercepted.");
      // Silently simulate success to discourage retry
      setSubmitted(true);
      setFormState({ name: '', email: '', message: '', hp_field: '' });
      return;
    }

    // Validation Logic
    if (!validateEmail(formState.email)) {
      setErrors({ email: 'INVALID_PROTOCOL_FORMAT' });
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    // Create new message object
    const newMessage: ContactMessage = {
      id: Date.now().toString(),
      name: formState.name,
      email: formState.email,
      message: formState.message,
      timestamp: new Date().toLocaleString(),
      read: false
    };

    // Update global state
    const newData = {
      ...data,
      messages: [newMessage, ...(data.messages || [])]
    };
    
    onUpdate(newData);

    setTimeout(() => {
      setSubmitted(true);
      setFormState({ name: '', email: '', message: '', hp_field: '' });
      setErrors({});
      setTimeout(() => setSubmitted(false), 5000);
    }, 800);
  };

  return (
    <section id="contact" className="py-24 border-t border-white/5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div className="animate-in slide-in-from-left-4 duration-700">
          <h2 className="text-4xl font-bold tracking-tight mb-8">Get in touch.</h2>
          <p className="text-xl text-gray-400 mb-12">
            Have a project in mind or just want to say hi? I'm always open to discussing new opportunities and architectural challenges.
          </p>
          
          <div className="space-y-6">
            {/* Contact Details */}
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg group-hover:shadow-emerald-500/10">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </div>
              <a href={`mailto:${data.email}`} className="text-lg hover:text-emerald-400 transition-colors font-medium">
                {data.email}
              </a>
            </div>

            {data.linkedin && (
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg group-hover:shadow-blue-500/10">
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </div>
                <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="text-lg hover:text-blue-400 transition-colors font-medium">
                  LinkedIn Profile
                </a>
              </div>
            )}

            {data.github && (
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg group-hover:shadow-white/10">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.627-5.373-12-12-12z"/></svg>
                </div>
                <a href={data.github} target="_blank" rel="noopener noreferrer" className="text-lg hover:text-white transition-colors font-medium">
                  GitHub Repositories
                </a>
              </div>
            )}

            {data.whatsapp && (
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg group-hover:shadow-emerald-500/10">
                  <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.438 9.889-9.886.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.89 4.44-9.892 9.886-.001 2.125.593 3.456 1.574 5.111l-.973 3.558 3.691-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                </div>
                <a href={`https://wa.me/${data.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-lg hover:text-emerald-400 transition-colors font-medium">
                  WhatsApp: {data.whatsapp}
                </a>
              </div>
            )}
          </div>
        </div>

        <div className={`glass rounded-[40px] p-8 md:p-12 transition-all duration-300 ${isShaking ? 'animate-bounce' : ''} shadow-2xl shadow-black/50`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Honeypot Field - Hidden from humans */}
            <div className="hidden" aria-hidden="true">
              <input 
                type="text" 
                name="subject_confirm" 
                value={formState.hp_field}
                onChange={(e) => handleInputChange('hp_field', e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">Identifier_Name</label>
                <input 
                  type="text" 
                  required
                  value={formState.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-mono text-sm"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className={`block text-xs font-mono uppercase tracking-widest mb-2 transition-colors ${errors.email ? 'text-red-400' : 'text-gray-500'}`}>
                  Target_Email {errors.email && `[${errors.email}]`}
                </label>
                <input 
                  type="text" 
                  required
                  value={formState.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full bg-white/5 border rounded-2xl px-6 py-4 focus:outline-none focus:ring-1 transition-all font-mono text-sm ${errors.email ? 'border-red-500/50 focus:border-red-500/70 focus:ring-red-500/50 text-red-200' : 'border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/50'}`}
                  placeholder="john@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">Payload_Message</label>
              <textarea 
                required
                rows={5}
                value={formState.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all resize-none font-mono text-sm"
                placeholder="Transmission details..."
              ></textarea>
            </div>
            <button 
              type="submit" 
              className={`w-full py-5 rounded-2xl font-black transition-all transform active:scale-[0.98] uppercase text-xs tracking-[0.3em] ${submitted ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-500/20'}`}
              disabled={submitted}
            >
              {submitted ? 'TRANSMISSION_SUCCESS' : 'SEND_MESSAGE'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
