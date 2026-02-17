import React, { useState, useEffect } from 'react';
import { 
  FileText, Star, Settings, LogOut, Plus, 
  ChevronRight, Activity, Shield, Globe,
  Loader2, Zap, Target, Check, X, Edit3,
  MessageSquare, Hash, BookOpen, Trash2
} from 'lucide-react';

const AcademicDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // --- EDIT STATES ---
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/users/profile', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setProfile(data);
      setEditForm(data);
    } catch (err) {
      console.error("Sync Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/users/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({
          ...editForm,
          semester: parseInt(editForm.semester)
        })
      });
      if (res.ok) {
        setIsEditing(false);
        fetchProfile();
      }
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  if (loading && !profile) return (
    <div className="h-screen flex items-center justify-center bg-[#F5F5F7]">
      <Loader2 className="animate-spin text-[#0071E3]" size={32} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] p-6 flex items-center justify-center font-sans selection:bg-[#0071E3] selection:text-white">
      
      {/* Structural Pattern */}
      <div className="absolute inset-0 bg-[#E5E5E5] opacity-20" style={{ backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }}></div>

      <div className="relative w-full max-w-7xl bg-white border border-[#D2D2D7] rounded-[2.5rem] shadow-sm overflow-hidden grid lg:grid-cols-12 min-h-[85vh] animate-in fade-in duration-700">
        
        {/* --- LEFT: IDENTITY & LIVE CONFIG (5 COLS) --- */}
        <div className="lg:col-span-5 bg-[#F5F5F7] p-12 border-r border-[#D2D2D7] flex flex-col justify-between overflow-y-auto custom-scrollbar">
          <div>
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-[#0071E3] rounded-sm" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#86868B]">
                  {isEditing ? 'Configuring Neural Link' : 'Identity Module'}
                </span>
              </div>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className={`p-2 rounded-xl transition-all ${isEditing ? 'bg-black text-white' : 'bg-white border border-[#D2D2D7] text-[#86868B] hover:text-[#1D1D1F]'}`}
              >
                {isEditing ? <X size={16} /> : <Edit3 size={16} />}
              </button>
            </div>

            {/* Avatar Section */}
            <div className="flex flex-col items-center text-center mb-10">
              <div className="w-24 h-24 rounded-[2.5rem] bg-[#1D1D1F] text-white flex items-center justify-center text-3xl font-bold mb-4 shadow-xl border-4 border-white">
                {profile?.name?.charAt(0)}
              </div>
              {isEditing ? (
                <input 
                  className="bg-white border border-[#D2D2D7] rounded-xl px-4 py-2 text-center text-xl font-bold outline-none focus:border-[#0071E3] w-full max-w-xs"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                />
              ) : (
                <h1 className="text-3xl font-semibold tracking-tight">{profile?.name}</h1>
              )}
              <p className="text-[10px] font-bold text-[#86868B] uppercase tracking-widest mt-2">{profile?.college}</p>
            </div>

            {/* Editable Traits */}
            <div className="space-y-8 mb-10">
              <div className="space-y-3">
                <SectionLabel label="User Archetype" />
                <div className="grid grid-cols-2 gap-2">
                  {['CHILL', 'BALANCED', 'GRINDER', 'PRODIGY'].map((type) => (
                    <button
                      key={type}
                      disabled={!isEditing}
                      onClick={() => setEditForm({...editForm, type})}
                      className={`py-3 rounded-xl text-[10px] font-bold border transition-all ${editForm.type === type ? 'bg-[#0071E3] text-white border-[#0071E3] shadow-md' : 'bg-white text-[#86868B] border-[#D2D2D7]'} ${!isEditing && 'cursor-default'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <SectionLabel label="Target Metric" />
                <div className="flex bg-white border border-[#D2D2D7] rounded-2xl p-1 gap-1">
                  {['Pass', 'Avg', 'Good', 'Top'].map((goal) => (
                    <button
                      key={goal}
                      disabled={!isEditing}
                      onClick={() => setEditForm({...editForm, goal})}
                      className={`flex-1 py-2 rounded-xl text-[10px] font-bold transition-all ${editForm.goal === goal ? 'bg-[#1D1D1F] text-white shadow-sm' : 'text-[#86868B]'} ${!isEditing && 'cursor-default'}`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Technical Data */}
            <div className="space-y-4 border-t border-[#D2D2D7] pt-8">
              <EditableMetaRow isEditing={isEditing} label="Discipline" value={editForm.branch} onChange={(v) => setEditForm({...editForm, branch: v})} />
              <EditableMetaRow isEditing={isEditing} label="Semester" value={editForm.semester} type="number" onChange={(v) => setEditForm({...editForm, semester: v})} />
              <div className="flex items-center justify-between text-[10px] py-2">
                <span className="font-bold text-[#86868B] uppercase tracking-widest">Bio Matrix</span>
                {isEditing ? (
                  <textarea 
                    className="bg-white border border-[#D2D2D7] rounded-xl px-3 py-2 text-[10px] font-medium outline-none focus:border-[#0071E3] w-2/3"
                    value={editForm.bio}
                    onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                  />
                ) : (
                  <span className="text-[10px] font-medium text-[#1D1D1F] max-w-[60%] text-right truncate italic">"{profile?.bio || 'No logs'}"</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8">
            {isEditing ? (
              <button onClick={handleUpdate} className="w-full py-5 bg-[#0071E3] text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-lg shadow-[#0071E3]/20 hover:bg-[#0077ED] transition-all">
                <Check size={14} /> Commit Identity Updates
              </button>
            ) : (
              <button onClick={() => { localStorage.clear(); window.location.href='/login'; }} className="w-full py-5 bg-white border border-[#D2D2D7] text-red-600 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-red-50 transition-all">
                <LogOut size={14} /> Terminate Session
              </button>
            )}
          </div>
        </div>

        {/* --- RIGHT: ACTIVITY FEED & REVIEWS (7 COLS) --- */}
        <div className="lg:col-span-7 flex flex-col h-[85vh] bg-white overflow-hidden">
          
          <div className="p-8 border-b border-[#D2D2D7] flex items-center justify-between sticky top-0 bg-white z-10">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-[#0071E3]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">System Activity</span>
            </div>
            <button onClick={() => window.location.href='/upload'} className="px-5 py-2.5 bg-[#1D1D1F] text-white rounded-xl font-bold text-[9px] uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all">
              <Plus size={14}/> New Deployment
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-12">
            
            {/* 1. Uploaded Assets */}
            <div className="space-y-6">
              <SectionHeader label="Your Deployed Assets" count={profile?.uploads?.length} icon={FileText} />
              <div className="grid grid-cols-1 gap-4">
                {profile?.uploads?.map(asset => (
                  <div key={asset.id} className="group p-5 border border-[#D2D2D7] rounded-[2rem] flex items-center justify-between hover:border-[#0071E3] transition-all bg-white cursor-pointer" onClick={() => window.location.href=`/resource/${asset.id}`}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#F5F5F7] rounded-xl flex items-center justify-center text-[#86868B] group-hover:text-[#0071E3] transition-all"><FileText size={20} /></div>
                      <div>
                        <h4 className="text-sm font-bold text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors">{asset.title}</h4>
                        <span className="text-[9px] font-black uppercase text-[#86868B] tracking-widest">{asset.subject}</span>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-[#D2D2D7] group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Review History */}
            <div className="space-y-6">
              <SectionHeader label="Intelligence Feed (Reviews)" count={profile?.reviews?.length} icon={MessageSquare} />
              <div className="grid grid-cols-1 gap-4">
                {profile?.reviews?.map(rev => (
                  <div key={rev.id} className="p-6 bg-[#F5F5F7] rounded-[2rem] border border-[#D2D2D7]/50 relative group">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={10} fill={i < rev.rating ? "#1D1D1F" : "none"} className={i < rev.rating ? "text-[#1D1D1F]" : "text-[#D2D2D7]"} />
                        ))}
                      </div>
                      <span className="text-[9px] font-bold text-[#86868B] uppercase">{new Date(rev.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs font-medium text-[#424245] leading-relaxed mb-4 italic">"{rev.comment}"</p>
                    <div className="flex items-center gap-2 text-[9px] font-bold uppercase text-[#86868B] tracking-tighter">
                      <Hash size={10} /> {rev.resource?.title || 'System Asset'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

// --- SUB COMPONENTS ---

const SectionHeader = ({ label, count, icon: Icon }) => (
  <div className="flex items-center justify-between border-b border-[#F5F5F7] pb-2">
    <div className="flex items-center gap-2">
      <Icon size={14} className="text-[#86868B]" />
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1D1D1F]">{label}</span>
    </div>
    <span className="bg-[#F5F5F7] px-2 py-0.5 rounded text-[10px] font-bold text-[#0071E3]">{count || 0}</span>
  </div>
);

const SectionLabel = ({ label }) => (
  <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 pl-1">{label}</h3>
);

const EditableMetaRow = ({ isEditing, label, value, onChange, type="text" }) => (
  <div className="flex items-center justify-between text-[10px] py-2 border-b border-[#D2D2D7]/30 last:border-0">
    <span className="font-bold text-[#86868B] uppercase tracking-widest">{label}</span>
    {isEditing ? (
      <input type={type} className="bg-white border border-[#D2D2D7] rounded-lg px-2 py-1 text-[10px] font-bold text-[#0071E3] outline-none focus:border-[#0071E3] w-1/3 text-right" value={value} onChange={(e) => onChange(e.target.value)} />
    ) : (
      <span className="font-bold text-[#1D1D1F] uppercase">{value}</span>
    )}
  </div>
);

export default AcademicDashboard;