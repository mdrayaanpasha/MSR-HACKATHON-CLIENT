import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Standard for React redirection
import { 
  FileText, Share2, Download, 
  ExternalLink, Loader2, Plus,
  Bookmark, Clock, Link as LinkIcon, 
  User as UserIcon, Settings, ChevronRight
} from 'lucide-react';

const NexusHomeFeed = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
    fetchPersonalizedFeed();
  }, []);

  const fetchPersonalizedFeed = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/resource/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({}), 
      });
      const result = await response.json();
      setResources(result.data || []);
    } catch (err) {
      console.error("Feed Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (id) => {
    navigator.clipboard.writeText(`${window.location.origin}/resource/${id}`);
    alert("Resource link copied to clipboard.");
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans selection:bg-[#0071E3] selection:text-white">
      
      {/* --- HEADER --- */}
      <nav className="fixed top-0 w-full bg-white border-b border-[#D2D2D7] z-50 h-16 flex items-center justify-center px-8">
        <div className="w-full max-w-7xl flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-2.5 h-2.5 bg-[#0071E3]" />
            <h1 className="text-xl font-bold tracking-tighter">NEXUS.</h1>
          </div>
          
          <button 
            onClick={() => navigate('/upload')} 
            className="bg-[#0071E3] text-white px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-[#0077ED] transition-all"
          >
            <Plus size={14} /> New Deployment
          </button>
        </div>
      </nav>

      <main className="pt-24 pb-12 flex justify-center px-6">
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* --- LEFT: NAVIGATION --- */}
          <div className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="bg-white border border-[#D2D2D7] rounded-[2rem] p-6 shadow-sm">
              <div className="flex flex-col items-center text-center pb-6 border-b border-[#F5F5F7]">
                <div className="w-20 h-20 rounded-[2rem] bg-[#1D1D1F] text-white flex items-center justify-center text-2xl font-bold mb-4 shadow-sm">
                  {user?.name?.charAt(0) || 'R'}
                </div>
                <h2 className="text-sm font-bold uppercase tracking-tight">{user?.name || 'Rayaan Pasha'}</h2>
                <p className="text-[10px] text-[#86868B] font-bold uppercase tracking-tighter mt-1">{user?.college || 'St. Joseph\'s University'}</p>
              </div>

              <div className="pt-6 space-y-2">
                <SidebarLink icon={UserIcon} label="My Feed" active onClick={() => navigate('/')} />
                <SidebarLink icon={FileText} label="My Files" onClick={() => navigate('/file')} />
                <SidebarLink icon={Clock} label="My Profile" onClick={() => navigate('/profile')} />
              </div>
            </div>
          </div>

          {/* --- CENTER: FEED --- */}
          <div className="lg:col-span-6 space-y-8">
            <div className="px-2 pb-2 flex items-center justify-between">
               <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#86868B]">Global Network Activity</span>
               {loading && <Loader2 size={14} className="animate-spin text-[#0071E3]" />}
            </div>
            
            {loading && resources.length === 0 ? (
              <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#0071E3]" size={32} /></div>
            ) : resources.map((item) => (
              <ResourcePost 
                key={item.id} 
                data={item} 
                onShare={() => copyToClipboard(item.id)}
                onView={() => navigate(`/resource/${item.id}`)}
              />
            ))}
          </div>

          {/* --- RIGHT: BRAND PANEL --- */}
          <div className="hidden lg:block lg:col-span-3">
             <div className="bg-[#1D1D1F] text-white rounded-[2rem] p-8 shadow-xl">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-6">Nexus Terminal</h3>
                <p className="text-xs font-medium leading-relaxed mb-8">Access peer-to-peer study materials and synchronize your semester progress.</p>
                <button className="w-full py-3 bg-[#0071E3] rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#0077ED] transition-colors">
                  View Docs <ChevronRight size={14} />
                </button>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const ResourcePost = ({ data, onShare, onView }) => (
  <div className="bg-white border border-[#D2D2D7] rounded-[2.5rem] overflow-hidden transition-all shadow-sm hover:shadow-md">
    <div className="p-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#F5F5F7] border border-[#D2D2D7] flex items-center justify-center text-[10px] font-bold text-[#0071E3]">
          {data.uploader?.name?.charAt(0)}
        </div>
        <div>
          <p className="text-xs font-bold text-[#1D1D1F]">{data.uploader?.name}</p>
          <p className="text-[9px] font-bold text-[#86868B] uppercase tracking-tighter">{data.uploader?.college}</p>
        </div>
      </div>
      <div className="px-3 py-1 bg-[#F5F5F7] rounded-lg border border-[#D2D2D7] text-[9px] font-black uppercase tracking-widest text-[#1D1D1F]">
        {data.type}
      </div>
    </div>

    <div 
      className="mx-6 h-64 bg-[#F5F5F7] rounded-3xl border border-[#D2D2D7] flex flex-col items-center justify-center p-8 group relative cursor-pointer"
      onClick={onView}
    >
      <div className="z-10 text-center group-hover:scale-105 transition-transform duration-500">
         <div className="w-16 h-20 bg-white shadow-sm rounded-lg border border-[#D2D2D7] flex items-center justify-center text-[#0071E3] mb-4 mx-auto transition-all group-hover:shadow-lg">
            <FileText size={32} />
         </div>
         <h3 className="text-lg font-bold tracking-tight text-[#1D1D1F] line-clamp-1">{data.title}</h3>
         <span className="text-[9px] font-bold text-[#86868B] uppercase tracking-[0.2em] mt-2 block">{data.subject}</span>
      </div>
    </div>

    <div className="p-6">
      <div className="flex items-center gap-3">
        <button 
          onClick={onShare}
          className="flex-1 bg-white border border-[#D2D2D7] hover:border-[#1D1D1F] text-[#1D1D1F] h-12 rounded-xl flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all"
        >
          <LinkIcon size={14} /> Copy Link
        </button>
        <a 
          href={data.fileUrl} 
          target="_blank" 
          rel="noreferrer"
          className="w-12 h-12 bg-white border border-[#D2D2D7] rounded-xl flex items-center justify-center text-[#0071E3] hover:bg-[#F5F5F7] transition-all"
        >
          <Download size={18} />
        </a>
      </div>
    </div>
  </div>
);

const SidebarLink = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${active ? 'bg-[#0071E3] text-white shadow-lg shadow-[#0071E3]/20' : 'text-[#86868B] hover:bg-[#F5F5F7] hover:text-[#1D1D1F]'}`}
  >
    <Icon size={18} />
    <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
  </button>
);

export default NexusHomeFeed;