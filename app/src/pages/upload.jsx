import React, { useState, useEffect, useRef } from 'react';
import { 
  CloudUpload, FileText, CheckCircle2, AlertCircle, 
  ChevronRight, Loader2, GraduationCap, Info, X, Cpu,
  Database, Shield, Globe
} from 'lucide-react';

const HyperUploadFinal = () => {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({ type: '', msg: '' });
  
  const fileInputRef = useRef(null);
  useEffect(() => { setMounted(true); }, []);

  const [formData, setFormData] = useState({
    title: '', description: '', subject: '',
    semester: '', branch: '', yearBatch: '2026',
    type: 'NOTES', tags: '', privacy: 'PUBLIC'
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setStatus({ type: 'error', msg: 'System Error: No file detected in buffer.' });

    setLoading(true);
    const data = new FormData();
    data.append('file', file);
    Object.keys(formData).forEach(key => data.append(key, formData[key]));

    try {
      const res = await fetch('http://localhost:3000/api/resource/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: data
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Transmission failed.');
      setStatus({ type: 'success', msg: 'Uplink Successful: Resource indexed.' });
    } catch (err) {
      setStatus({ type: 'error', msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans flex items-center justify-center p-6 selection:bg-[#0071E3] selection:text-white">
      
      {/* Structural Background Pattern */}
      <div className="absolute inset-0 bg-[#E5E5E5] opacity-20" style={{ backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }}></div>

      <div className={`
        relative w-full max-w-7xl bg-white border border-[#D2D2D7] rounded-[2.5rem] 
        shadow-sm overflow-hidden grid lg:grid-cols-12 min-h-[800px]
        transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
      `}>

        {/* --- LEFT PANEL: STATUS & BRANDING (5 COLS) --- */}
        <div className="lg:col-span-5 bg-[#F5F5F7] p-12 border-r border-[#D2D2D7] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-10">
              <div className="w-2.5 h-2.5 bg-[#0071E3] rounded-sm" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#86868B]">Storage Terminal</span>
            </div>
            
            <h1 className="text-5xl font-semibold tracking-tight leading-[1.1] text-[#1D1D1F]">
              Resource<br/>Deployment.
            </h1>
            <p className="mt-6 text-[#86868B] text-sm font-medium leading-relaxed max-w-sm">
              Upload study materials to the global academic grid. All files are indexed for peer discovery.
            </p>

            {/* Drag & Drop Zone */}
            <div 
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => { e.preventDefault(); setDragActive(false); setFile(e.dataTransfer.files[0]); }}
              onClick={() => fileInputRef.current.click()}
              className={`
                mt-12 w-full h-64 rounded-3xl border border-[#D2D2D7] transition-all flex flex-col items-center justify-center cursor-pointer p-6
                ${dragActive ? 'bg-[#E8E8ED] border-[#0071E3]' : 'bg-white hover:bg-[#F5F5F7]'}
                ${file ? 'border-[#0071E3] bg-white' : ''}
              `}
            >
              <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
              {!file ? (
                <div className="text-center">
                  <CloudUpload className="mx-auto mb-4 text-[#86868B]" size={36} />
                  <p className="text-xs font-bold uppercase tracking-widest text-[#1D1D1F]">Drop Binary</p>
                  <p className="text-[10px] text-[#86868B] mt-1 italic uppercase tracking-tighter">Max payload: 50MB</p>
                </div>
              ) : (
                <div className="text-center animate-in zoom-in-95">
                  <div className="w-16 h-20 bg-white border border-[#D2D2D7] shadow-sm rounded-lg flex items-center justify-center mx-auto relative">
                     <FileText size={28} className="text-[#0071E3]" />
                     <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="absolute -top-2 -right-2 w-5 h-5 bg-[#1D1D1F] text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"><X size={10}/></button>
                  </div>
                  <p className="text-[10px] font-bold text-[#1D1D1F] mt-4 break-all px-2 uppercase">{file.name}</p>
                </div>
              )}
            </div>
          </div>

          {/* System Status Indicators */}
          <div className="space-y-4">
             <StatusLine icon={Database} label="Sync Status" value="Active" color="text-emerald-600" />
             <StatusLine icon={Shield} label="Security" value="Encrypted" color="text-[#0071E3]" />
             <StatusLine icon={Globe} label="Region" value="Bengaluru / SJU" color="text-[#86868B]" />
          </div>
        </div>

        {/* --- RIGHT PANEL: FORM MODULE (7 COLS) --- */}
        <div className="lg:col-span-7 p-10 md:p-14 overflow-y-auto custom-scrollbar bg-white">
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-12">
            
            {/* Identity Info */}
            <div className="space-y-6">
              <SectionHeader number="01" label="Metadata Indexing" />
              <div className="grid gap-6">
                <ModernSolidInput label="Resource Title" name="title" placeholder="e.g. OS Midsem Prep" value={formData.title} onChange={handleChange} />
                <div className="w-full">
                  <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-[0.2em] mb-2 block">Content Overview</label>
                  <textarea name="description" rows="3" className="w-full bg-white border border-[#D2D2D7] rounded-xl p-4 text-sm font-medium focus:outline-none focus:border-[#0071E3] transition-all resize-none" value={formData.description} onChange={handleChange} placeholder="What knowledge is contained in this file?" />
                </div>
              </div>
            </div>

            {/* Academic Context */}
            <div className="space-y-6">
              <SectionHeader number="02" label="Academic Taxonomy" />
              <div className="grid md:grid-cols-2 gap-6">
                <ModernSolidInput label="Subject Name" name="subject" placeholder="Theory of Computation" value={formData.subject} onChange={handleChange} />
                <ModernSolidInput label="Semester" name="semester" type="number" placeholder="4" value={formData.semester} onChange={handleChange} />
                <ModernSolidInput label="Branch / Major" name="branch" placeholder="CSE" value={formData.branch} onChange={handleChange} />
                <ModernSolidInput label="Keywords / Tags" name="tags" placeholder="exam, notes, 2026" value={formData.tags} onChange={handleChange} />
              </div>
            </div>

            {/* Classification & Privacy */}
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-[0.2em] block">Asset Type</label>
                <div className="flex flex-wrap gap-2">
                  {['NOTES', 'PYQ', 'LAB', 'OTHER'].map(t => (
                    <button key={t} type="button" onClick={() => setFormData({...formData, type: t})}
                      className={`px-4 py-2 rounded-lg text-[10px] font-bold transition-all border ${formData.type === t ? 'bg-[#1D1D1F] text-white border-[#1D1D1F]' : 'bg-white text-[#86868B] border-[#D2D2D7] hover:border-[#1D1D1F]'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-[0.2em] block">Visibility protocol</label>
                <div className="flex p-1 bg-[#F5F5F7] border border-[#D2D2D7] rounded-xl">
                  {['PUBLIC', 'PRIVATE'].map(p => (
                    <button key={p} type="button" onClick={() => setFormData({...formData, privacy: p})}
                      className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${formData.privacy === p ? 'bg-white text-[#1D1D1F] shadow-sm border border-[#D2D2D7]' : 'text-[#86868B]'}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Final Action */}
            <div className="pt-6 space-y-4">
              {status.msg && (
                <div className={`p-4 rounded-xl flex items-center gap-3 text-xs font-bold border ${status.type === 'success' ? 'bg-[#F2FBF6] text-[#008037] border-[#D1F2DE]' : 'bg-[#FFF2F2] text-[#D11124] border-[#FAD2D2]'}`}>
                  {status.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  {status.msg}
                </div>
              )}

              <button type="submit" disabled={loading || !file}
                className={`w-full h-14 rounded-xl font-bold uppercase tracking-[0.2em] text-[11px] transition-all flex items-center justify-center gap-2 ${loading || !file ? 'bg-[#F5F5F7] text-[#D2D2D7] cursor-not-allowed' : 'bg-[#0071E3] text-white hover:bg-[#0077ED]'}`}>
                {loading ? <Loader2 className="animate-spin" /> : <><span>Commit to Database</span> <ChevronRight size={14}/></>}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

// --- Sub-Components ---

const SectionHeader = ({ number, label }) => (
  <div className="flex items-center gap-3 pb-3 border-b border-[#D2D2D7]">
    <span className="text-xs font-bold text-[#0071E3]">{number}</span>
    <span className="text-[10px] font-bold text-[#1D1D1F] uppercase tracking-[0.3em]">{label}</span>
  </div>
);

const ModernSolidInput = ({ label, ...props }) => (
  <div className="w-full">
    <label className="text-[10px] font-bold text-[#86868B] uppercase tracking-[0.2em] mb-2 block">{label}</label>
    <input
      {...props}
      className="w-full bg-white border border-[#D2D2D7] focus:border-[#0071E3] rounded-xl py-3.5 px-4 text-sm font-medium text-[#1D1D1F] placeholder-[#D2D2D7] outline-none transition-all"
    />
  </div>
);

const StatusLine = ({ icon: Icon, label, value, color }) => (
  <div className="flex items-center justify-between py-2 border-b border-[#D2D2D7]/50">
    <div className="flex items-center gap-3">
      <Icon size={14} className="text-[#86868B]" />
      <span className="text-[10px] font-bold text-[#86868B] uppercase tracking-widest">{label}</span>
    </div>
    <span className={`text-[10px] font-bold uppercase tracking-widest ${color}`}>{value}</span>
  </div>
);

export default HyperUploadFinal;