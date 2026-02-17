import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Lock, GraduationCap, 
  BookOpen, Hash, Loader2, Sparkles, Zap, 
  Coffee, Brain, ChevronRight, Target, ArrowRight,
  ShieldCheck, Activity, Globe
} from 'lucide-react';

const HyperAuthWide = () => {
  const [isLogin, setIsLogin] = useState(false); // Toggle between Login/Register
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [mounted, setMounted] = useState(false);
  
  // Animation trigger
  useEffect(() => { setMounted(true); }, []);

  // Form State
  const [formData, setFormData] = useState({
    name: '', email: '', password: '',
    college: '', branch: '', semester: '',
    bio: '', type: 'HARDWORKING', goal: '80%'
  });

  // Constants
  const API_BASE = 'https://msr-hackathon-server.vercel.app/api/users'; // Based on your request

  const STUDENT_TYPES = [
    { id: 'LAZY', label: 'Chill', icon: Coffee, color: 'text-orange-600 bg-orange-50 border-orange-200' },
    { id: 'BALANCED', label: 'Balanced', icon: Zap, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { id: 'HARDWORKING', label: 'Grinder', icon: Sparkles, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { id: 'GENIUS', label: 'Prodigy', icon: Brain, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  ];

  const GOALS = [
    { id: 'PASS', label: 'Pass', color: 'bg-red-500' },
    { id: 'AVG', label: 'Avg', color: 'bg-yellow-500' },
    { id: 'HIGH', label: 'Good', color: 'bg-blue-600' },
    { id: 'TOP', label: 'Top', color: 'bg-emerald-600' },
  ];

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const endpoint = isLogin ? `${API_BASE}/login` : `${API_BASE}/register`;
    
    // Payload formatting: Backend expects integer for semester
    const payload = isLogin 
      ? { email: formData.email, password: formData.password }
      : { ...formData, semester: parseInt(formData.semester) || 1 };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Connection refused by host.');

      // --- SUCCESS STATE ---
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setSuccess(isLogin ? "Welcome back, Commander." : "Identity Matrix Initialized.");
      window.location.href="/"
      
      // Optional: Redirect
      // setTimeout(() => window.location.href = '/dashboard', 1000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-gray-900 font-sans flex items-center justify-center p-4 md:p-6 overflow-hidden relative">
      
      {/* --- AMBIENT BACKGROUND --- */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
      <div className="absolute top-[-10%] left-[20%] w-[800px] h-[800px] bg-blue-100/40 rounded-full blur-[120px] pointer-events-none mix-blend-multiply animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></div>

      {/* --- WIDE GLASS CARD --- */}
      <div className={`
        relative w-full max-w-7xl h-[90vh] md:h-auto min-h-[700px]
        bg-white/70 backdrop-blur-2xl border border-white/60 rounded-[3rem] 
        shadow-[0_40px_100px_-30px_rgba(0,0,0,0.08)] overflow-hidden
        grid grid-cols-1 lg:grid-cols-12
        transition-all duration-1000 ease-out transform
        ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
      `}>

        {/* --- LEFT PANEL: STATUS & INFO (4 Cols) --- */}
        <div className="hidden lg:flex lg:col-span-5 bg-gray-50/50 flex-col justify-between p-12 border-r border-white/50 relative overflow-hidden">
           {/* Decor */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-bl-[100px] opacity-60"></div>

           <div>
             <div className="flex items-center gap-2 mb-8">
               <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
               <span className="text-xs font-extrabold tracking-[0.2em] text-gray-400 uppercase">System v4.0</span>
             </div>
             <h1 className="text-5xl font-extrabold tracking-tighter text-gray-900 leading-[0.9]">
               ACADEMIC<br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">NEXUS</span>
             </h1>
             <p className="mt-6 text-gray-500 font-medium leading-relaxed max-w-sm">
               Initialize your digital student persona. Track metrics, optimize grades, and synchronize with the campus grid.
             </p>
           </div>

           {/* Stats / Features */}
           <div className="space-y-4">
             <FeatureRow icon={ShieldCheck} title="Secure Encryption" text="Bcrypt Hashing" />
             <FeatureRow icon={Activity} title="Real-time Metrics" text="Live Tracking" />
             <FeatureRow icon={Globe} title="Global Sync" text="Campus Wide" />
           </div>

           {/* Bottom Badge */}
           <div className="flex items-center gap-4 pt-8 border-t border-gray-200/60">
             <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Server Status</div>
             <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-100">
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> ONLINE
             </div>
           </div>
        </div>

        {/* --- RIGHT PANEL: INTERACTIVE FORM (8 Cols) --- */}
        <div className="lg:col-span-7 p-8 md:p-14 overflow-y-auto custom-scrollbar relative">
          
          {/* Top Nav */}
          <div className="flex justify-end mb-8">
             <button 
               onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }}
               className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-gray-100 hover:border-gray-300 shadow-sm transition-all"
             >
               <span className="text-xs font-bold text-gray-500 uppercase tracking-widest group-hover:text-gray-900">
                 {isLogin ? 'Need an account?' : 'Have an account?'}
               </span>
               <span className="text-xs font-bold text-blue-600 group-hover:underline decoration-2 underline-offset-2">
                 {isLogin ? 'Register' : 'Login'}
               </span>
             </button>
          </div>

          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {isLogin ? 'Access Portal' : 'New Identity'}
            </h2>
            <p className="text-gray-400 text-sm mb-8">
              {isLogin ? 'Enter credentials to decrypt your dashboard.' : 'Fill required fields to generate JWT.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Login View */}
              {isLogin && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500">
                  <InputGroup icon={Mail} type="email" name="email" placeholder="Student Email" value={formData.email} onChange={handleChange} />
                  <InputGroup icon={Lock} type="password" name="password" placeholder="Password Key" value={formData.password} onChange={handleChange} />
                </div>
              )}

              {/* Register View (Expanded) */}
              {!isLogin && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
                  
                  {/* Row 1 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputGroup icon={User} name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} />
                    <InputGroup icon={Mail} name="email" placeholder="Email" type="email" value={formData.email} onChange={handleChange} />
                  </div>

                  {/* Row 2 */}
                  <InputGroup icon={Lock} name="password" placeholder="Password" type="password" value={formData.password} onChange={handleChange} />

                  {/* Row 3 - Academic */}
                  <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <GraduationCap size={16} className="text-gray-400" />
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Academic Data</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputGroup icon={BookOpen} name="college" placeholder="College" value={formData.college} onChange={handleChange} bg="bg-white" />
                      <InputGroup icon={Hash} name="branch" placeholder="Branch" value={formData.branch} onChange={handleChange} bg="bg-white" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <InputGroup icon={Hash} name="semester" placeholder="Semester (Int)" type="number" value={formData.semester} onChange={handleChange} bg="bg-white" />
                       <InputGroup icon={User} name="bio" placeholder="Short Bio" value={formData.bio} onChange={handleChange} bg="bg-white" />
                    </div>
                  </div>

                  {/* Selectors */}
                  <div className="space-y-5">
                    {/* Archetype */}
                    <div>
                      <Label>User Archetype</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                        {STUDENT_TYPES.map((t) => (
                          <button key={t.id} type="button" onClick={() => setFormData({...formData, type: t.id})}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${formData.type === t.id ? `${t.color} scale-105 shadow-sm` : 'bg-white border-gray-100 text-gray-400 hover:bg-gray-50'}`}>
                            <t.icon size={18} className="mb-1.5" />
                            <span className="text-[10px] font-bold uppercase">{t.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Goals */}
                    <div>
                      <Label>Target Metric</Label>
                      <div className="flex gap-2 mt-2 bg-gray-100 p-1 rounded-xl">
                        {GOALS.map((g) => (
                          <button key={g.id} type="button" onClick={() => setFormData({...formData, goal: g.id})}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${formData.goal === g.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                             {g.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* Status Messages */}
              {error && <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium flex items-center gap-2 animate-pulse"><ShieldCheck size={16}/> {error}</div>}
              {success && <div className="p-4 rounded-xl bg-emerald-50 text-emerald-600 text-sm font-medium flex items-center gap-2"><ShieldCheck size={16}/> {success}</div>}

              {/* Action */}
              <button disabled={loading} className="w-full h-14 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold tracking-wide transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3 shadow-xl shadow-gray-200">
                {loading ? <Loader2 className="animate-spin" /> : <><span>{isLogin ? 'AUTHENTICATE' : 'INITIALIZE'}</span><ArrowRight size={18} className="opacity-60"/></>}
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub-Components ---

const FeatureRow = ({ icon: Icon, title, text }) => (
  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/40 border border-white/50 backdrop-blur-sm">
    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm">
      <Icon size={20} />
    </div>
    <div>
      <div className="text-sm font-bold text-gray-900">{title}</div>
      <div className="text-xs text-gray-500">{text}</div>
    </div>
  </div>
);

const Label = ({ children }) => (
  <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 pl-1">
    {children}
  </h3>
);

const InputGroup = ({ icon: Icon, bg = "bg-gray-50", ...props }) => (
  <div className="relative group">
    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
      <Icon className="h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
    </div>
    <input
      {...props}
      className={`w-full ${bg} border border-transparent focus:bg-white rounded-xl py-3.5 pl-11 pr-4 text-sm font-semibold text-gray-900 placeholder-gray-400 outline-none focus:border-blue-100 focus:ring-4 focus:ring-blue-50/50 transition-all`}
    />
  </div>
);

export default HyperAuthWide;