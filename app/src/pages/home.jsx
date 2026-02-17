import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Download, Loader2, Plus, 
  Clock, Link as LinkIcon, User as UserIcon, 
  ChevronRight, Sparkles, Send, Zap, Cpu, X
} from 'lucide-react';

const NexusHomeFeed = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState([]);
  const [user, setUser] = useState(null);

  // --- AI DIALOG STATES ---
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState(null);
  const [isAiThinking, setIsAiThinking] = useState(false);

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
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({}), 
      });
      const result = await response.json();
      setResources(result.data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleAiQuery = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsAiThinking(true);
    setAiResponse(null);

    try {
      const res = await fetch('http://localhost:3000/api/ai/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setAiResponse(data.answer);
    } catch (err) {
      setAiResponse("Neural link failed. Synchronization offline.");
    } finally {
      setIsAiThinking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans selection:bg-[#0071E3] selection:text-white">
      
      {/* --- FLOATING AI TRIGGER (RIGHT BUTTON) --- */}
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsAiOpen(true)}
        className="fixed bottom-8 right-8 z-[90] w-16 h-16 bg-[#1D1D1F] text-white rounded-[1.8rem] shadow-2xl flex items-center justify-center border border-white/10 group"
      >
        <Sparkles size={24} className="group-hover:text-[#0071E3] transition-colors" />
        <div className="absolute -top-1 -right-1 bg-[#0071E3] text-[7px] font-black px-1.5 py-0.5 rounded shadow-sm">AI</div>
      </motion.button>

      {/* --- AI COMMAND DIALOG --- */}
      <AnimatePresence>
        {isAiOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#F5F5F7]/80 backdrop-blur-xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-3xl rounded-[3rem] border border-[#D2D2D7] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-8 border-b border-[#F5F5F7] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Cpu className="text-[#0071E3]" size={24} />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Omni-Brain Terminal</span>
                </div>
                <button onClick={() => setIsAiOpen(false)} className="p-2 hover:bg-[#F5F5F7] rounded-full transition-all"><X size={20}/></button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-6 custom-scrollbar">
                {!aiResponse && !isAiThinking && (
                  <div className="text-center py-20 opacity-20 italic text-sm font-medium">Awaiting Neural Input...</div>
                )}
                
                {isAiThinking && (
                  <div className="flex flex-col items-center py-20 gap-4">
                    <Loader2 className="animate-spin text-[#0071E3]" size={32} />
                    <span className="text-[9px] font-black uppercase tracking-widest animate-pulse">Scanning Personal Context...</span>
                  </div>
                )}

                {aiResponse && (
                  <div className="prose prose-sm max-w-none prose-headings:text-[#1D1D1F] prose-headings:font-black prose-p:text-[#424245] prose-p:leading-relaxed">
                    <ReactMarkdown>{aiResponse}</ReactMarkdown>
                  </div>
                )}
              </div>

              <form onSubmit={handleAiQuery} className="p-8 bg-[#F5F5F7] border-t border-[#D2D2D7]">
                <div className="relative">
                  <input 
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask about exam patterns, notes, or strategies..."
                    className="w-full bg-white border border-[#D2D2D7] rounded-2xl py-5 pl-6 pr-16 text-sm font-bold outline-none focus:border-[#0071E3] transition-all shadow-sm"
                  />
                  <button type="submit" disabled={isAiThinking} className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-[#1D1D1F] text-white rounded-xl">
                    <Send size={18} />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- HEADER --- */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-[#D2D2D7] z-50 h-16 flex items-center justify-center px-8">
        <div className="w-full max-w-7xl flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-2.5 h-2.5 bg-[#0071E3] rounded-sm" />
            <h1 className="text-xl font-bold tracking-tighter uppercase">Nexus</h1>
          </div>
          <button onClick={() => navigate('/upload')} className="bg-[#0071E3] text-white px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
            <Plus size={14} /> New Deployment
          </button>
        </div>
      </nav>

      <main className="pt-24 pb-12 flex justify-center px-6">
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* --- LEFT: PROFILE --- */}
          <div className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="bg-white border border-[#D2D2D7] rounded-[2.5rem] p-8 shadow-sm">
              <div className="flex flex-col items-center text-center pb-6 border-b border-[#F5F5F7]">
                <div className="w-20 h-20 rounded-[2.2rem] bg-[#1D1D1F] text-white flex items-center justify-center text-2xl font-bold mb-4 shadow-xl">
                  {user?.name?.charAt(0)}
                </div>
                <h2 className="text-sm font-black uppercase tracking-tight">{user?.name}</h2>
                <p className="text-[10px] text-[#86868B] font-bold uppercase tracking-tighter mt-1">{user?.college}</p>
              </div>
              <div className="pt-6 space-y-1">
                <SidebarLink icon={UserIcon} label="My Feed" active onClick={() => navigate('/')} />
                <SidebarLink icon={FileText} label="My Files" onClick={() => navigate('/file')} />
                <SidebarLink icon={Clock} label="My Profile" onClick={() => navigate('/profile')} />
              </div>
            </div>
          </div>

          {/* --- CENTER: FEED --- */}
          <div className="lg:col-span-6 space-y-8">
            <div className="px-2 flex items-center justify-between border-b border-[#D2D2D7]/50 pb-4">
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#86868B]">Global Network Stream</span>
            </div>
            {resources.map((item) => (
              <ResourcePost key={item.id} data={item} onView={() => navigate(`/resource/${item.id}`)} />
            ))}
          </div>

          {/* --- RIGHT: STATS --- */}
          <div className="hidden lg:block lg:col-span-3 space-y-6">
             <div className="bg-[#1D1D1F] text-white rounded-[2.5rem] p-8 shadow-xl">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 mb-6">Status Info</h3>
                <StatusRow label="Archetype" value={user?.type || "None"} />
                <StatusRow label="Goal" value={user?.goal || "None"} />
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// --- POST COMPONENT ---
const ResourcePost = ({ data, onView }) => (
  <div className="bg-white border border-[#D2D2D7] rounded-[2.5rem] overflow-hidden transition-all shadow-sm hover:shadow-md cursor-pointer" onClick={onView}>
    <div className="p-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[#F5F5F7] border border-[#D2D2D7] flex items-center justify-center text-[11px] font-black text-[#0071E3]">
          {data.uploader?.name?.charAt(0)}
        </div>
        <div>
          <p className="text-xs font-bold text-[#1D1D1F]">{data.uploader?.name}</p>
          <p className="text-[9px] font-bold text-[#86868B] uppercase tracking-tighter">{data.uploader?.college}</p>
        </div>
      </div>
    </div>
    <div className="mx-6 h-56 bg-[#F5F5F7] rounded-[2rem] border border-[#D2D2D7] flex flex-col items-center justify-center p-8">
       <div className="w-14 h-16 bg-white shadow-sm rounded-xl border border-[#D2D2D7] flex items-center justify-center text-[#0071E3] mb-4">
          <FileText size={28} />
       </div>
       <h3 className="text-md font-black tracking-tight text-[#1D1D1F]">{data.title}</h3>
       <span className="text-[9px] font-black text-[#86868B] uppercase tracking-widest mt-2">{data.subject}</span>
    </div>
    <div className="p-6">
       <div className="w-full py-3 bg-white border border-[#D2D2D7] rounded-xl text-center text-[9px] font-black uppercase tracking-widest">View Resource</div>
    </div>
  </div>
);

const SidebarLink = ({ icon: Icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-5 py-4 rounded-[1.2rem] transition-all ${active ? 'bg-[#0071E3] text-white' : 'text-[#86868B] hover:bg-[#F5F5F7]'}`}>
    <Icon size={18} />
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

const StatusRow = ({ label, value }) => (
  <div className="flex items-center justify-between text-[10px] mb-2 last:mb-0">
    <span className="font-bold text-[#86868B] uppercase tracking-widest">{label}</span>
    <span className="font-black text-white uppercase tracking-tighter">{value}</span>
  </div>
);

export default NexusHomeFeed;