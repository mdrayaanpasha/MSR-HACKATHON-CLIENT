import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, BookOpen, Layers, 
  Hash, Tag, Download, User, 
  ExternalLink, Loader2, Sparkles, Clock,
  ChevronRight, Bookmark
} from 'lucide-react';

const ResourceExplorer = () => {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState([]);
  const [query, setQuery] = useState('');
  
  // Filter States
  const [filters, setFilters] = useState({
    subject: '',
    semester: '',
    type: ''
  });

  useEffect(() => { 
    setMounted(true);
    fetchResources(); 
  }, []);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://msr-hackathon-server.vercel.app/api/resource/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          search: query,
          ...filters
        }),
      });
      const result = await response.json();
      setResources(result.data || []);
    } catch (error) {
      console.error("Search Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans flex items-center justify-center p-6">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[#E5E5E5] opacity-20" style={{ backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }}></div>

      <div className={`
        relative w-full max-w-7xl bg-white border border-[#D2D2D7] rounded-[2.5rem] 
        shadow-sm overflow-hidden grid lg:grid-cols-12 min-h-[85vh]
        transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
      `}>

        {/* --- LEFT PANEL: FILTERS (4 COLS) --- */}
        <div className="lg:col-span-4 bg-[#F5F5F7] p-10 border-r border-[#D2D2D7] flex flex-col">
          <header className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2.5 h-2.5 bg-[#0071E3] rounded-sm" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#86868B]">Module 03: Explorer</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight leading-tight">Global<br/>Repository.</h1>
          </header>

          <div className="space-y-8">
            {/* Subject Filter */}
            <SolidFilterInput 
              label="Subject Taxonomy" 
              icon={BookOpen} 
              placeholder="e.g. Microcontrollers"
              value={filters.subject}
              onChange={(v) => handleFilterChange('subject', v)}
            />

            {/* Semester Filter */}
            <div className="space-y-3">
              <FilterLabel icon={Hash} label="Academic Semester" />
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <button 
                    key={s}
                    onClick={() => handleFilterChange('semester', filters.semester === s ? '' : s)}
                    className={`py-2 rounded-lg text-xs font-bold border transition-all ${filters.semester === s ? 'bg-[#1D1D1F] text-white border-[#1D1D1F]' : 'bg-white text-[#86868B] border-[#D2D2D7] hover:border-[#86868B]'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div className="space-y-3">
              <FilterLabel icon={Layers} label="Resource Category" />
              <div className="space-y-2">
                {['NOTES', 'PYQ', 'LAB', 'OTHER'].map(t => (
                  <button 
                    key={t}
                    onClick={() => handleFilterChange('type', filters.type === t ? '' : t)}
                    className={`w-full py-3 px-4 rounded-xl text-left text-[11px] font-bold border transition-all flex items-center justify-between ${filters.type === t ? 'bg-[#1D1D1F] text-white border-[#1D1D1F]' : 'bg-white text-[#86868B] border-[#D2D2D7] hover:border-[#86868B]'}`}
                  >
                    {t}
                    {filters.type === t && <ChevronRight size={14} />}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={fetchResources}
              className="w-full h-12 bg-[#0071E3] text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-[#0077ED] transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : 'Refresh Registry'}
            </button>
          </div>
        </div>

        {/* --- RIGHT PANEL: SEARCH & FEED (8 COLS) --- */}
        <div className="lg:col-span-8 bg-white flex flex-col h-[85vh]">
          
          {/* Top Search Bar */}
          <div className="p-8 border-b border-[#D2D2D7] flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86868B]" size={18} />
              <input 
                type="text" 
                placeholder="Search by title, tags, or subject..."
                className="w-full h-14 bg-[#F5F5F7] border border-[#D2D2D7] rounded-2xl pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-[#0071E3] transition-all"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchResources()}
              />
            </div>
          </div>

          {/* Results Feed */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center opacity-40">
                <Loader2 className="animate-spin mb-4" size={32} />
                <p className="text-[10px] font-bold uppercase tracking-widest">Scanning Database...</p>
              </div>
            ) : resources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {resources.map((item, idx) => (
                  <ResourceCard key={item.id} data={item} />
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-[#86868B]">
                <Sparkles size={40} className="mb-4 opacity-20" />
                <p className="text-xs font-bold uppercase tracking-widest">No resources found in current grid</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub-Components ---

const ResourceCard = ({ data }) => (
  <div className="group border border-[#D2D2D7] hover:border-[#0071E3] rounded-2xl p-6 transition-all hover:shadow-sm bg-white relative overflow-hidden" onClick={e=>window.location.href=`/resource/${data.id}`}>
    {/* Ranking Indicator (Smart Match) */}
    <div className="absolute top-0 right-0 p-3">
       <div className="flex items-center gap-1.5 px-2 py-1 bg-[#F5F5F7] rounded-md border border-[#D2D2D7]">
         <div className="w-1.5 h-1.5 bg-[#0071E3] rounded-full" />
         <span className="text-[9px] font-bold text-[#1D1D1F] uppercase tracking-tighter">{data.type}</span>
       </div>
    </div>

    <div className="mb-4">
      <h3 className="font-semibold text-[#1D1D1F] text-lg leading-tight group-hover:text-[#0071E3] transition-colors mb-2">
        {data.title}
      </h3>
      <div className="flex flex-wrap gap-2">
        <Badge icon={BookOpen} text={data.subject} />
        <Badge icon={Layers} text={`Sem ${data.semester}`} />
      </div>
    </div>

    <p className="text-[#86868B] text-[11px] leading-relaxed mb-6 line-clamp-2 italic font-medium">
      "{data.description || 'No system description provided for this entry.'}"
    </p>

    <div className="flex items-center justify-between pt-6 border-t border-[#D2D2D7]/50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-[#F5F5F7] border border-[#D2D2D7] flex items-center justify-center text-[10px] font-bold text-[#0071E3]">
          {data.uploader?.name?.charAt(0) || 'U'}
        </div>
        <div>
          <p className="text-[10px] font-bold text-[#1D1D1F]">{data.uploader?.name}</p>
          <p className="text-[9px] font-bold text-[#86868B] uppercase">{data.uploader?.college}</p>
        </div>
      </div>
      <a 
        href={data.fileUrl} 
        target="_blank" 
        rel="noreferrer"
        className="w-10 h-10 bg-[#1D1D1F] hover:bg-black text-white rounded-xl flex items-center justify-center transition-all"
      >
        <ExternalLink size={16} />
      </a>
    </div>
  </div>
);

const Badge = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#F5F5F7] rounded-full border border-[#D2D2D7]">
    <Icon size={10} className="text-[#86868B]" />
    <span className="text-[9px] font-bold text-[#86868B] uppercase tracking-widest">{text}</span>
  </div>
);

const FilterLabel = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-2 mb-2">
    <Icon size={14} className="text-[#86868B]" />
    <span className="text-[10px] font-bold text-[#86868B] uppercase tracking-widest">{label}</span>
  </div>
);

const SolidFilterInput = ({ label, icon, value, onChange, placeholder }) => (
  <div className="w-full">
    <FilterLabel icon={icon} label={label} />
    <input
      type="text"
      placeholder={placeholder}
      className="w-full bg-white border border-[#D2D2D7] focus:border-[#0071E3] rounded-xl py-3 px-4 text-xs font-medium outline-none transition-all placeholder-[#D2D2D7]"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default ResourceExplorer;