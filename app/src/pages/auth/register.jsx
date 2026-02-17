import React, { useState } from 'react';
import { 
  ArrowRight, Check, Sparkles, Zap, 
  Coffee, PenTool, Terminal, Loader2 
} from 'lucide-react';

const CleanAuth = () => {
  const [view, setView] = useState('login'); // 'login' or 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Plain English Student Archetypes
  const ARCHETYPES = [
    { id: 'HARDWORKING', icon: Zap, label: 'The Grinder', text: 'I work hard for every grade.' },
    { id: 'LAZY_GENIUS', icon: Coffee, label: 'Chill & Smart', text: 'Minimal effort, good results.' },
    { id: 'ARTIST', icon: PenTool, label: 'The Creator', text: 'I care more about building things.' },
    { id: 'HACKER', icon: Terminal, label: 'The Hacker', text: 'I break code to learn how it works.' },
  ];

  // Plain English Goals
  const GOALS = [
    { id: 'PASS', label: 'Just Pass', color: 'bg-green-100 text-green-700' },
    { id: 'AVG', label: 'Stay Average', color: 'bg-blue-100 text-blue-700' },
    { id: 'HIGH', label: 'Top 10%', color: 'bg-purple-100 text-purple-700' },
    { id: 'TOP', label: 'Be #1', color: 'bg-orange-100 text-orange-700' },
  ];

  const [formData, setFormData] = useState({
    name: '', email: '', password: '',
    college: '', branch: '', semester: '1',
    bio: '', type: ARCHETYPES[1].id, goal: GOALS[2].id
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const isLogin = view === 'login';
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    const payload = isLogin 
      ? { email: formData.email, password: formData.password }
      : { ...formData, semester: parseInt(formData.semester) };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Something went wrong.');

      // Success
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      alert(`Success! Welcome, ${data.user.name || 'User'}`);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 font-sans flex justify-center items-center p-4 md:p-8">
      
      {/* Main Card */}
      <div className="w-full max-w-2xl bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden relative">
        
        {/* Top Decorative Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500"></div>

        <div className="p-8 md:p-12">
          
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-3">
              {view === 'login' ? 'Welcome back.' : 'Create your profile.'}
            </h1>
            <p className="text-gray-500 text-lg">
              {view === 'login' 
                ? 'Enter your details to access your dashboard.' 
                : 'Join the community and track your progress.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Login / Register Fields */}
            <div className="space-y-5">
              
              {view === 'register' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <Input label="Full Name" name="name" placeholder="e.g. Rayaan Pasha" value={formData.name} onChange={handleChange} />
                    <Input label="Which Semester?" type="number" name="semester" placeholder="e.g. 3" value={formData.semester} onChange={handleChange} />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-5">
                    <Input label="College / University" name="college" placeholder="e.g. St. Joseph's" value={formData.college} onChange={handleChange} />
                    <Input label="Branch / Major" name="branch" placeholder="e.g. Computer Science" value={formData.branch} onChange={handleChange} />
                  </div>

                  {/* "Human" Selectors for Type */}
                  <div className="pt-4">
                    <label className="block text-sm font-semibold text-gray-900 mb-3">What kind of student are you?</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {ARCHETYPES.map((type) => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setFormData({...formData, type: type.id})}
                          className={`
                            flex items-start p-4 rounded-xl border-2 text-left transition-all duration-200 group
                            ${formData.type === type.id 
                              ? 'border-black bg-gray-50 ring-1 ring-black/5' 
                              : 'border-gray-100 hover:border-gray-200 bg-white'}
                          `}
                        >
                          <div className={`p-2 rounded-lg mr-3 ${formData.type === type.id ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'}`}>
                            <type.icon size={18} />
                          </div>
                          <div>
                            <div className="font-bold text-sm text-gray-900">{type.label}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{type.text}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* "Human" Selectors for Goal */}
                  <div className="pt-2">
                    <label className="block text-sm font-semibold text-gray-900 mb-3">What is your goal this semester?</label>
                    <div className="flex flex-wrap gap-2">
                      {GOALS.map((goal) => (
                        <button
                          key={goal.id}
                          type="button"
                          onClick={() => setFormData({...formData, goal: goal.id})}
                          className={`
                            px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200
                            ${formData.goal === goal.id 
                              ? 'bg-black text-white shadow-lg shadow-black/20 scale-105' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                          `}
                        >
                          {goal.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Common Fields */}
              <Input label="Email Address" type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} />
              <Input label="Password" type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              disabled={loading}
              className="w-full h-14 bg-black text-white rounded-xl font-semibold text-lg hover:bg-gray-900 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/10"
            >
              {loading ? <Loader2 className="animate-spin" /> : (
                <>
                  {view === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={20} className="opacity-50" />
                </>
              )}
            </button>
          </form>

          {/* Toggle View */}
          <div className="mt-8 text-center pt-8 border-t border-gray-100">
            <p className="text-gray-500">
              {view === 'login' ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button
              onClick={() => { setView(view === 'login' ? 'register' : 'login'); setError(''); }}
              className="mt-2 text-black font-semibold hover:underline decoration-2 underline-offset-4 decoration-gray-300 transition-all"
            >
              {view === 'login' ? 'Join for free' : 'Log in here'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

// Reusable "Plain English" Input
const Input = ({ label, ...props }) => (
  <div className="w-full">
    <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
      {label}
    </label>
    <input
      {...props}
      className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent hover:bg-gray-100 focus:bg-white focus:border-black rounded-xl text-gray-900 outline-none transition-all placeholder:text-gray-400 text-base font-medium"
    />
  </div>
);

export default CleanAuth;