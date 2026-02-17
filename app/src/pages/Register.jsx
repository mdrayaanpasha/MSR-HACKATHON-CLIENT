import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Lock, GraduationCap, 
  BookOpen, Hash, Check, Loader2, Sparkles, Zap, 
  Coffee, Brain, Trophy, ChevronRight 
} from 'lucide-react';

const RegistrationForm = () => {
  const [loading, setLoading] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [mounted, setMounted] = useState(false);

  // Animation trigger on mount
  useEffect(() => { setMounted(true); }, []);

  const [formData, setFormData] = useState({
    name: '', email: '', password: '',
    college: '', branch: '', semester: '',
    bio: '', type: 'HARDWORKING', goal: '80%'
  });

  const studentTypes = [
    { id: 'LAZY', label: 'Chill', icon: Coffee, color: 'from-orange-400 to-red-400', desc: 'Efficiency through inactivity' },
    { id: 'BALANCED', label: 'Balanced', icon: Zap, color: 'from-cyan-400 to-blue-400', desc: 'The perfect equilibrium' },
    { id: 'HARDWORKING', label: 'Grinder', icon: Sparkles, color: 'from-purple-400 to-pink-400', desc: 'Relentless pursuit' },
    { id: 'GENIUS', label: 'Prodigy', icon: Brain, color: 'from-emerald-400 to-green-400', desc: 'Built different' },
  ];

  const goals = [
    { id: '35%', label: 'Pass', sub: '35%', color: 'bg-zinc-600' },
    { id: '60%', label: 'Avg', sub: '60%', color: 'bg-yellow-500' },
    { id: '80%', label: 'Good', sub: '80%', color: 'bg-blue-500' },
    { id: '95%', label: 'Top', sub: '95%', color: 'bg-emerald-500' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4 md:p-8 font-sans relative overflow-hidden">
      
      {/* --- BACKGROUND FX --- */}
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Moving Orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]"></div>

      {/* --- MAIN CARD --- */}
      <div className={`
        relative w-full max-w-2xl
        bg-zinc-900/40 backdrop-blur-2xl border border-white/5 rounded-3xl shadow-2xl overflow-hidden
        transition-all duration-1000 ease-out transform
        ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
      `}>
        
        {/* --- FORM SECTION --- */}
        <div className="p-6 md:p-10 relative">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Create Profile</h2>
              <p className="text-zinc-500 text-sm mt-2">Initialize your student database entry.</p>
            </div>
            <div className="hidden md:block text-xs font-mono text-zinc-600 border border-zinc-800 px-2 py-1 rounded">
              VER 2.0.4
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* 1. Identity Grid */}
            <div className="space-y-3">
              <Label>Identity Matrix</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ModernInput 
                  icon={User} 
                  placeholder="Full Name" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  isActive={activeField === 'name'}
                  onFocus={() => setActiveField('name')}
                />
                <ModernInput 
                  icon={Mail} 
                  placeholder="Email Address" 
                  type="email"
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  isActive={activeField === 'email'}
                  onFocus={() => setActiveField('email')}
                />
              </div>
              <ModernInput 
                icon={Lock} 
                placeholder="Set Password" 
                type="password"
                value={formData.password} 
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                isActive={activeField === 'password'}
                onFocus={() => setActiveField('password')}
              />
            </div>

            {/* 2. Academic Grid */}
            <div className="space-y-3">
              <Label>Academic Data</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ModernInput 
                  icon={GraduationCap} 
                  placeholder="College / Institute" 
                  value={formData.college} 
                  onChange={(e) => setFormData({...formData, college: e.target.value})}
                  isActive={activeField === 'college'}
                  onFocus={() => setActiveField('college')}
                />
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <ModernInput 
                      icon={BookOpen} 
                      placeholder="Branch" 
                      value={formData.branch} 
                      onChange={(e) => setFormData({...formData, branch: e.target.value})}
                      isActive={activeField === 'branch'}
                      onFocus={() => setActiveField('branch')}
                    />
                  </div>
                  <ModernInput 
                    icon={Hash} 
                    placeholder="Sem" 
                    type="number"
                    value={formData.semester} 
                    onChange={(e) => setFormData({...formData, semester: e.target.value})}
                    isActive={activeField === 'semester'}
                    onFocus={() => setActiveField('semester')}
                  />
                </div>
              </div>
              <textarea 
                className="w-full bg-zinc-900/50 border border-white/5 text-zinc-300 rounded-xl p-4 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all resize-none text-sm"
                placeholder="Brief bio or academic interests..."
                rows="2"
              ></textarea>
            </div>

            {/* 3. The Vibe Selector (Bento Style) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Select Archetype</Label>
                <span className="text-xs text-indigo-400 font-medium">{formData.type}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {studentTypes.map((t) => {
                   const isSelected = formData.type === t.id;
                   return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setFormData({...formData, type: t.id})}
                      className={`
                        relative group flex flex-col items-start justify-between p-4 h-32 rounded-2xl border transition-all duration-300 overflow-hidden
                        ${isSelected 
                          ? 'bg-white/5 border-white/20 shadow-[0_0_30px_-10px_rgba(255,255,255,0.1)]' 
                          : 'bg-zinc-900/30 border-white/5 hover:bg-zinc-800/50'}
                      `}
                    >
                      <div className={`
                        absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${t.color} opacity-10 blur-2xl rounded-full 
                        transform translate-x-10 -translate-y-10 group-hover:opacity-20 transition-opacity
                        ${isSelected ? 'opacity-30' : ''}
                      `} />
                      
                      <t.icon className={`w-6 h-6 mb-2 ${isSelected ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                      
                      <div className="relative z-10 text-left">
                        <span className={`block text-sm font-bold ${isSelected ? 'text-white' : 'text-zinc-400'}`}>
                          {t.label}
                        </span>
                        <span className="text-[10px] text-zinc-500 leading-tight block mt-1">
                          {t.desc}
                        </span>
                      </div>
                      
                      {isSelected && (
                        <div className="absolute bottom-3 right-3">
                           <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white]"></div>
                        </div>
                      )}
                    </button>
                   );
                })}
              </div>
            </div>

            {/* 4. Goal Slider (Interactive Bar) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Target Output</Label>
                <div className="flex items-center gap-2">
                   <Trophy size={12} className="text-yellow-500" />
                   <span className="text-xs text-zinc-400">Aiming for: <span className="text-white font-bold">{formData.goal}</span></span>
                </div>
              </div>
              <div className="p-1 bg-zinc-900/80 rounded-xl border border-white/5 flex gap-1">
                {goals.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setFormData({...formData, goal: g.id})}
                    className={`
                      flex-1 py-3 rounded-lg text-xs font-medium transition-all duration-300 relative overflow-hidden
                      ${formData.goal === g.id 
                        ? 'text-white shadow-lg bg-white/10' 
                        : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}
                    `}
                  >
                    {/* Background glow on active */}
                    {formData.goal === g.id && (
                      <div className={`absolute bottom-0 left-0 w-full h-1 ${g.color} opacity-80`} />
                    )}
                    <span className="relative z-10">{g.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`
                group w-full py-4 mt-4 rounded-xl font-bold text-white relative overflow-hidden transition-all duration-300
                ${loading ? 'bg-zinc-800 cursor-wait' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)] active:scale-[0.99]'}
              `}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <div className="relative flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin" /> : (
                  <>
                    <span>Initialize Profile</span>
                    <ChevronRight size={16} className="text-white/80 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

// --- Sub-Components ---

const Label = ({ children }) => (
  <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 pl-1">
    {children}
  </h3>
);

const ModernInput = ({ icon: Icon, isActive, ...props }) => (
  <div className={`
    relative group transition-all duration-300
    ${isActive ? 'scale-[1.02]' : ''}
  `}>
    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
      <Icon className={`h-4 w-4 transition-colors duration-300 ${isActive ? 'text-indigo-400' : 'text-zinc-600 group-hover:text-zinc-500'}`} />
    </div>
    <input
      {...props}
      className={`
        w-full bg-zinc-900/50 border text-white rounded-xl py-3.5 pl-11 pr-4 text-sm
        placeholder-zinc-600 focus:outline-none transition-all duration-300
        ${isActive 
          ? 'border-indigo-500/50 shadow-[0_0_20px_-5px_rgba(99,102,241,0.2)] bg-zinc-900/80' 
          : 'border-white/5 hover:border-white/10 hover:bg-zinc-900/70'}
      `}
    />
  </div>
);

export default RegistrationForm;