import React, { useState, useEffect } from 'react';
import { 
  FileText, Folder, HardDrive, Search, 
  Filter, MoreVertical, Download, Eye, 
  Clock, Shield, Globe, Plus, Loader2,
  ChevronRight, LayoutGrid, List
} from 'lucide-react';

const NexusExplorer = () => {
  const [view, setView] = useState('grid'); // 'grid' or 'list'
  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState([]);
  const [category, setCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { fetchFiles(); }, [category]);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://msr-hackathon-server.vercel.app/api/resource/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          type: category === 'ALL' ? undefined : category,
          search: searchQuery
        }),
      });
      const result = await response.json();

      setResources(result.data || []);
      window.location.href="/"
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans flex items-center justify-center p-6">
      
      <div className="relative w-full max-w-7xl bg-white border border-[#D2D2D7] rounded-[2.5rem] shadow-sm overflow-hidden grid lg:grid-cols-12 h-[85vh] animate-in fade-in duration-700">
        
        {/* --- SIDEBAR (3 COLS) --- */}
        <div className="lg:col-span-3 bg-[#F5F5F7] p-8 border-r border-[#D2D2D7] flex flex-col justify-between">
          <div className="space-y-8">
            <div className="flex items-center gap-2 mb-10">
              <div className="w-2.5 h-2.5 bg-[#0071E3] rounded-sm" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#86868B]">Finder v1.0</span>
            </div>

            <div className="space-y-1">
              <NavButton icon={HardDrive} label="All Files" active={category === 'ALL'} onClick={() => setCategory('ALL')} />
              <NavButton icon={FileText} label="Notes" active={category === 'NOTES'} onClick={() => setCategory('NOTES')} />
              <NavButton icon={Clock} label="PYQs" active={category === 'QUESTION_PAPER'} onClick={() => setCategory('QUESTION_PAPER')} />
              <NavButton icon={Folder} label="Projects" active={category === 'PROJECT_REPORT'} onClick={() => setCategory('PROJECT_REPORT')} />
            </div>
          </div>

          <div className="p-6 bg-white border border-[#D2D2D7] rounded-3xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-bold text-[#86868B] uppercase tracking-widest">Storage</span>
              <span className="text-[9px] font-bold text-[#1D1D1F]">72%</span>
            </div>
            <div className="h-1 w-full bg-[#F5F5F7] rounded-full overflow-hidden">
              <div className="h-full bg-[#0071E3] w-[72%]" />
            </div>
          </div>
        </div>

        {/* --- MAIN EXPLORER (9 COLS) --- */}
        <div className="lg:col-span-9 flex flex-col bg-white overflow-hidden">
          
          {/* Toolbar */}
          <div className="p-6 border-b border-[#D2D2D7] flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868B]" size={14} />
                <input 
                  type="text" 
                  placeholder="Search in Grid..." 
                  className="w-full bg-[#F5F5F7] border border-transparent focus:border-[#D2D2D7] rounded-xl py-2 pl-10 pr-4 text-xs font-medium outline-none transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchFiles()}
                />
              </div>
              <button onClick={() => setView(view === 'grid' ? 'list' : 'grid')} className="p-2.5 bg-[#F5F5F7] rounded-xl text-[#86868B] hover:text-[#1D1D1F] transition-all">
                {view === 'grid' ? <List size={16} /> : <LayoutGrid size={16} />}
              </button>
            </div>

            <button onClick={() => window.location.href='/upload'} className="bg-[#0071E3] text-white px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-[#0071E3]/10">
              <Plus size={14} /> Deploy
            </button>
          </div>

          {/* File Space */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-white">
            {loading ? (
              <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-[#0071E3]" /></div>
            ) : resources.length > 0 ? (
              <div className={view === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6' : 'flex flex-col gap-2'}>
                {resources.map((file) => (
                  view === 'grid' ? <FileCard key={file.id} file={file} /> : <FileListRow key={file.id} file={file} />
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-30 italic">
                <FileText size={48} className="mb-4" />
                <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Empty Directory</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

// --- COMPONENTS ---

const NavButton = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${active ? 'bg-white text-[#0071E3] shadow-sm border border-[#D2D2D7]' : 'text-[#86868B] hover:bg-white hover:text-[#1D1D1F]'}`}
  >
    <Icon size={16} />
    <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
  </button>
);

const FileCard = ({ file }) => (
  <div 
    className="group bg-white border border-[#D2D2D7] rounded-3xl p-4 flex flex-col items-center text-center transition-all hover:border-[#0071E3] hover:shadow-md cursor-pointer"
    onClick={() => window.location.href=`/resource-update/${file.id}`}
  >
    <div className="w-full aspect-square bg-[#F5F5F7] rounded-2xl flex items-center justify-center mb-4 transition-colors group-hover:bg-white">
       <div className="relative">
          <FileText size={40} className="text-[#86868B] group-hover:text-[#0071E3] transition-colors" />
          <div className={`absolute -bottom-1 -right-1 p-1 rounded-md border border-white ${file.privacy === 'PUBLIC' ? 'bg-emerald-500' : 'bg-[#0071E3]'}`}>
            {file.privacy === 'PUBLIC' ? <Globe size={8} className="text-white"/> : <Shield size={8} className="text-white"/>}
          </div>
       </div>
    </div>
    <h4 className="text-[11px] font-bold text-[#1D1D1F] line-clamp-1 px-1">{file.title}</h4>
    <span className="text-[9px] font-bold text-[#86868B] uppercase tracking-tighter mt-1">{file.subject}</span>
  </div>
);

const FileListRow = ({ file }) => (
  <div 
    className="flex items-center justify-between p-3 border border-transparent border-b-[#F5F5F7] hover:border-[#D2D2D7] hover:bg-[#F5F5F7]/30 rounded-xl transition-all cursor-pointer group"
    onClick={() => window.location.href=`/resource-update/${file.id}`}
  >
    <div className="flex items-center gap-4 flex-1">
      <FileText size={18} className="text-[#86868B] group-hover:text-[#0071E3]" />
      <span className="text-xs font-bold text-[#1D1D1F] truncate max-w-[200px]">{file.title}</span>
    </div>
    <div className="flex items-center gap-12">
      <span className="text-[10px] font-bold text-[#86868B] uppercase tracking-widest w-24 text-right">{file.type}</span>
      <span className="text-[10px] font-bold text-[#D2D2D7] uppercase tracking-widest w-24 text-right">{new Date(file.createdAt).toLocaleDateString()}</span>
      <MoreVertical size={14} className="text-[#D2D2D7]" />
    </div>
  </div>
);

export default NexusExplorer;