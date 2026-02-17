import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FileText, Check, X, ChevronLeft, 
  Loader2, Save, Trash2, Shield, 
  Globe, Info, Database, AlertCircle
} from 'lucide-react';

const ResourceUpdatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  
  // Data States
  const [originalData, setOriginalData] = useState(null);
  const [formData, setFormData] = useState({
    title: '', description: '', subject: '',
    semester: '', branch: '', yearBatch: '',
    type: '', tags: '', privacy: ''
  });

  useEffect(() => {
    fetchInitialData();
  }, [id]);

  const fetchInitialData = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/resource/${id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Access Denied');

      setOriginalData(data);
      setFormData({
        title: data.title,
        description: data.description,
        subject: data.subject,
        semester: data.semester.toString(),
        branch: data.branch,
        yearBatch: data.yearBatch,
        type: data.type,
        tags: data.tags,
        privacy: data.privacy
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');

    try {
      const res = await fetch(`http://localhost:3000/api/resource/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({
          ...formData,
          semester: parseInt(formData.semester)
        })
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Update failed');

      navigate(`/resource/${id}`); // Redirect to detail page on success
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#F5F5F7]">
      <Loader2 className="animate-spin text-[#0071E3]" size={32} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] p-6 flex items-center justify-center font-sans">
      
      <div className="relative w-full max-w-7xl bg-white border border-[#D2D2D7] rounded-[2.5rem] shadow-sm overflow-hidden grid lg:grid-cols-12 min-h-[85vh] animate-in fade-in duration-700">
        
        {/* --- LEFT: CURRENT SYSTEM STATE (5 COLS) --- */}
        <div className="lg:col-span-5 bg-[#F5F5F7] p-12 border-r border-[#D2D2D7] flex flex-col justify-between">
          <div>
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#86868B] hover:text-[#1D1D1F] mb-12 transition-colors group">
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
              <span className="text-[10px] font-bold uppercase tracking-widest">Abort Configuration</span>
            </button>

            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-[#0071E3]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#86868B]">Current Index Data</span>
              </div>
              
              <div className="p-8 bg-white border border-[#D2D2D7] rounded-3xl shadow-sm">
                <FileText size={32} className="text-[#0071E3] mb-4" />
                <h2 className="text-xl font-bold tracking-tight mb-2">{originalData?.title}</h2>
                <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-[#86868B]">
                  {originalData?.privacy === 'PUBLIC' ? <Globe size={10} /> : <Shield size={10} />}
                  {originalData?.privacy} ACCESS
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-[#D2D2D7]">
                <ReadOnlyRow label="Subject" value={originalData?.subject} />
                <ReadOnlyRow label="Branch" value={originalData?.branch} />
                <ReadOnlyRow label="Type" value={originalData?.type} />
                <ReadOnlyRow label="Deployed" value={new Date(originalData?.createdAt).toLocaleDateString()} />
              </div>
            </div>
          </div>

          <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-3">
            <Info size={16} className="text-[#0071E3] mt-0.5" />
            <p className="text-[10px] font-medium text-[#0071E3] leading-relaxed uppercase tracking-tight">
              Modifying these parameters will re-index this resource across the Nexus grid.
            </p>
          </div>
        </div>

        {/* --- RIGHT: CONFIGURATION TERMINAL (7 COLS) --- */}
        <div className="lg:col-span-7 p-12 md:p-16 overflow-y-auto custom-scrollbar">
          <form onSubmit={handleUpdate} className="max-w-xl mx-auto space-y-10">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#F5F5F7] pb-6">
               <div className="flex items-center gap-3">
                 <Database size={18} className="text-[#0071E3]" />
                 <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Update Module</h3>
               </div>
               <span className="text-[9px] font-bold text-[#86868B] uppercase">ID: {id?.substring(0,8)}</span>
            </div>

            {/* Inputs */}
            <div className="space-y-6">
               <SolidInput label="Resource Title" name="title" value={formData.title} onChange={(v) => setFormData({...formData, title: v})} />
               
               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-widest ml-1">Privacy Protocol</label>
                 <div className="flex p-1 bg-[#F5F5F7] border border-[#D2D2D7] rounded-xl">
                   {['PUBLIC', 'PRIVATE'].map(p => (
                     <button key={p} type="button" onClick={() => setFormData({...formData, privacy: p})}
                       className={`flex-1 py-2.5 rounded-lg text-[10px] font-bold transition-all ${formData.privacy === p ? 'bg-white text-[#1D1D1F] shadow-sm' : 'text-[#86868B]'}`}>
                       {p}
                     </button>
                   ))}
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-6">
                 <SolidInput label="Subject" name="subject" value={formData.subject} onChange={(v) => setFormData({...formData, subject: v})} />
                 <SolidInput label="Semester" name="semester" type="number" value={formData.semester} onChange={(v) => setFormData({...formData, semester: v})} />
               </div>

               <div className="relative group">
                 <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-widest mb-2 block ml-1">Description Override</label>
                 <textarea 
                   className="w-full bg-[#F5F5F7] border border-transparent focus:border-[#D2D2D7] focus:bg-white rounded-xl p-4 text-sm font-medium outline-none transition-all resize-none"
                   rows="3"
                   value={formData.description}
                   onChange={(e) => setFormData({...formData, description: e.target.value})}
                 />
               </div>
            </div>

            {/* Error Feed */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-3 text-[11px] font-bold animate-pulse">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            {/* Actions */}
            <div className="pt-6 grid grid-cols-1 gap-4">
              <button 
                type="submit" 
                disabled={updating}
                className="w-full h-14 bg-[#0071E3] text-white rounded-xl font-bold uppercase tracking-[0.2em] text-[11px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#0071E3]/20 active:scale-95"
              >
                {updating ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />} Commit Changes
              </button>
              
              <button type="button" className="w-full h-14 bg-white border border-red-100 text-red-500 rounded-xl font-bold uppercase tracking-[0.2em] text-[11px] transition-all hover:bg-red-50 flex items-center justify-center gap-2">
                <Trash2 size={14} /> Purge from System
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

// --- SUBS ---

const ReadOnlyRow = ({ label, value }) => (
  <div className="flex items-center justify-between text-[10px] py-2 border-b border-[#D2D2D7]/50 last:border-0">
    <span className="font-bold text-[#86868B] uppercase tracking-widest">{label}</span>
    <span className="font-bold text-[#1D1D1F] uppercase">{value}</span>
  </div>
);

const SolidInput = ({ label, value, onChange, type="text" }) => (
  <div className="w-full">
    <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-widest mb-2 block ml-1">{label}</label>
    <input 
      type={type}
      className="w-full bg-[#F5F5F7] border border-transparent focus:border-[#D2D2D7] focus:bg-white rounded-xl py-3.5 px-4 text-sm font-medium outline-none transition-all"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default ResourceUpdatePage;