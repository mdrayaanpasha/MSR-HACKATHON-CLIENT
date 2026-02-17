import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Lock, GraduationCap, 
  BookOpen, Hash, Loader2, Sparkles, Zap, 
  Coffee, Brain, Trophy, ChevronRight, Target
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
    { id: 'LAZY', label: 'Chill', icon: Coffee, color: 'text-orange-500 bg-orange-50 border-orange-200', desc: 'Efficiency through inactivity' },
    { id: 'BALANCED', label: 'Balanced', icon: Zap, color: 'text-blue-500 bg-blue-50 border-blue-200', desc: 'The perfect equilibrium' },
    { id: 'HARDWORKING', label: 'Grinder', icon: Sparkles, color: 'text-purple-500 bg-purple-50 border-purple-200', desc: 'Relentless pursuit' },
    { id: 'GENIUS', label: 'Prodigy', icon: Brain, color: 'text-emerald-500 bg-emerald-50 border-emerald-200', desc: 'Built different' },
  ];

  const goals = [
    { id: '35%', label: 'Pass', sub: 'Survive', color: 'bg-red-500' },
    { id: '60%', label: 'Avg', sub: 'Decent', color: 'bg-yellow-500' },
    { id: '80%', label: 'Good', sub: 'High', color: 'bg-blue-600' },
    { id: '95%', label: 'Top', sub: 'Elite', color: 'bg-emerald-600' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // --- LOGIC TO SAVE TO LOCAL STORAGE ---
    // Simulating API delay
    setTimeout(() => {
        // 1. Create a fake token (In real app, this comes from backend)
        const fakeToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.simulated-token";
        
        // 2. Save Token
        localStorage.setItem('authToken', fakeToken);
        
        // 3. Save User Data (optional, but good for UI updates)
        localStorage.setItem('userProfile', JSON.stringify(formData));

        console.log("Success: Data saved to LocalStorage"); // Check console to verify
        setLoading(false);
        alert("Profile Created! Token saved to LocalStorage.");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-gray-900 flex items-center justify-center p-4 md:p-8 font-sans relative overflow-hidden">
      
      {/* --- BACKGROUND FX (LIGHT THEME) --- */}
      {/* Subtle Dot Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
      
      {/* Soft Ambient Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[120px] pointer-events-none mix-blend-multiply"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-100/50 rounded-full blur-[120px] pointer-events-none mix-blend-multiply"></div>

      {/* --- MAIN CARD --- */}
      <div className={`
        relative w-full max-w-2xl
        bg-white/80 backdrop-blur-xl border border-white/40 rounded-[2.5rem] 
        shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] overflow-hidden
        transition-all duration-1000 ease-out transform
        ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
      `}>
        
        {/* --- FORM SECTION --- */}
        <div className="p-8 md:p-12 relative">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-4xl font-extrabold tracking-tight text-gray-900">
                Create Profile
              </h2>
              <p className="text-gray-500 text-sm mt-2 font-medium">Initialize your academic database entry.</p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              SYSTEM V2.0.4
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* 1. Identity Grid */}
            <div className="space-y-4">
              <Label>Identity Matrix</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
            <div className="space-y-4">
              <Label>Academic Data</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <ModernInput 
                  icon={GraduationCap} 
                  placeholder="College / Institute" 
                  value={formData.college} 
                  onChange={(e) => setFormData({...formData, college: e.target.value})}
                  isActive={activeField === 'college'}
                  onFocus={() => setActiveField('college')}
                />
                <div className="grid grid-cols-3 gap-5">
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
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300 transition-all resize-none text-sm font-medium placeholder-gray-400 shadow-inner"
                placeholder="Brief bio or academic interests..."
                rows="2"
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
              ></textarea>
            </div>

            {/* 3. The Vibe Selector (Clean Bento) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Select Archetype</Label>
                <span className="text-xs text-gray-900 font-bold bg-gray-100 px-2 py-1 rounded-md">{formData.type}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {studentTypes.map((t) => {
                   const isSelected = formData.type === t.id;
                   return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setFormData({...formData, type: t.id})}
                      className={`
                        relative group flex flex-col items-start justify-between p-4 h-32 rounded-2xl border-2 transition-all duration-200 ease-out
                        ${isSelected 
                          ? `${t.color} shadow-lg scale-[1.02]` 
                          : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50'}
                      `}
                    >
                      <t.icon className={`w-6 h-6 mb-2 ${isSelected ? 'text-inherit' : 'text-gray-400'}`} />
                      
                      <div className="text-left z-10">
                        <span className={`block text-sm font-bold ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}>
                          {t.label}
                        </span>
                        <span className={`text-[10px] leading-tight block mt-1 ${isSelected ? 'text-gray-700' : 'text-gray-400'}`}>
                          {t.desc}
                        </span>
                      </div>
                    </button>
                   );
                })}
              </div>
            </div>

            {/* 4. Goal Slider (Hyper Premium Segmented Control) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Target Output</Label>
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                   <Target size={14} className="text-gray-900" />
                   <span className="text-xs text-gray-500 font-medium">Aim: <span className="text-gray-900 font-bold">{formData.goal}</span></span>
                </div>
              </div>
              
              <div className="p-1.5 bg-gray-100 rounded-2xl flex gap-2 relative">
                {goals.map((g) => {
                    const isActive = formData.goal === g.id;
                    return (
                        <button
                            key={g.id}
                            type="button"
                            onClick={() => setFormData({...formData, goal: g.id})}
                            className={`
                            relative flex-1 py-4 rounded-xl text-sm font-bold transition-all duration-300 flex flex-col items-center justify-center gap-1
                            ${isActive 
                                ? 'bg-white text-gray-900 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] ring-1 ring-black/5' 
                                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200/50'}
                            `}
                        >
                            {/* Dot Indicator */}
                            <div className={`w-1.5 h-1.5 rounded-full mb-1 transition-colors ${isActive ? g.color : 'bg-gray-300'}`} />
                            
                            <span className="z-10">{g.label}</span>
                            
                            {/* Subtext only visible on desktop/larger screens or when active */}
                            <span className={`text-[10px] font-medium transition-all ${isActive ? 'text-gray-500 opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                                {g.sub}
                            </span>
                        </button>
                    )
                })}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`
                group w-full py-5 rounded-2xl font-bold text-white text-lg relative overflow-hidden transition-all duration-300
                ${loading 
                    ? 'bg-gray-800 cursor-wait' 
                    : 'bg-gray-900 hover:bg-black hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] hover:scale-[1.005] active:scale-[0.99]'}
              `}
            >
              <div className="relative flex items-center justify-center gap-3">
                {loading ? <Loader2 className="animate-spin" /> : (
                  <>
                    <span>Initialize Profile</span>
                    <ChevronRight size={20} className="text-white/60 group-hover:translate-x-1 transition-transform" />
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
  <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-gray-400 pl-1 mb-1">
    {children}
  </h3>
);

const ModernInput = ({ icon: Icon, isActive, ...props }) => (
  <div className={`
    relative group transition-all duration-300
    ${isActive ? 'scale-[1.01]' : ''}
  `}>
    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
      <Icon className={`h-5 w-5 transition-colors duration-300 ${isActive ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-500'}`} />
    </div>
    <input
      {...props}
      className={`
        w-full bg-gray-50 border rounded-2xl py-4 pl-12 pr-4 text-sm font-medium text-gray-900
        placeholder-gray-400 focus:outline-none transition-all duration-300 shadow-sm
        ${isActive 
          ? 'border-gray-300 bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] ring-2 ring-gray-100' 
          : 'border-gray-200 hover:border-gray-300 hover:bg-white'}
      `}
    />
  </div>
);

export default RegistrationForm;