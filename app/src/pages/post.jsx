import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FileText, Star, Download, MessageSquare, 
  ChevronLeft, Share2, Shield, Globe, Loader2, Send,
  BarChart3, TrendingUp, Users, Zap
} from 'lucide-react';

const ResourceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchDetail(); }, [id]);

  const fetchDetail = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/resource/${id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const json = await res.json();
      setData(json);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`http://localhost:3000/api/reviews/${id}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ rating, comment })
      });
      if (!res.ok) throw new Error("Submission failed.");
      setComment('');
      fetchDetail();
    } catch (err) { alert(err.message); } finally { setSubmitting(false); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#F5F5F7]"><Loader2 className="animate-spin text-[#0071E3]" size={32} /></div>;

  // --- CALCULATE ANALYTICS ---
  const totalReviews = data?.reviews?.length || 0;
  const avgRating = totalReviews > 0 
    ? (data.reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1) 
    : "0.0";

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] p-6 flex items-center justify-center">
      <div className="w-full max-w-7xl bg-white border border-[#D2D2D7] rounded-[2.5rem] shadow-sm overflow-hidden grid lg:grid-cols-12 min-h-[85vh]">
        
        {/* --- LEFT: ASSET IDENTITY & ANALYTICS (5 COLS) --- */}
        <div className="lg:col-span-5 bg-[#F5F5F7] p-12 border-r border-[#D2D2D7] flex flex-col justify-between overflow-y-auto custom-scrollbar">
          <div>
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#86868B] hover:text-[#1D1D1F] mb-10 transition-colors group">
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
              <span className="text-[10px] font-bold uppercase tracking-widest">System Grid</span>
            </button>

            <div className="flex items-center gap-3 mb-8">
              <div className="w-14 h-14 bg-white rounded-2xl border border-[#D2D2D7] flex items-center justify-center text-[#0071E3] shadow-sm">
                <FileText size={28} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#0071E3] uppercase tracking-[0.2em]">{data?.type}</span>
                <h1 className="text-3xl font-semibold tracking-tight leading-tight">{data?.title}</h1>
              </div>
            </div>

            {/* --- NEW: ANALYTICS DASHBOARD --- */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              <AnalyticsCard label="Quality Index" value={`${avgRating} / 5.0`} icon={Zap} />
              <AnalyticsCard label="Community" value={`${totalReviews} Reviews`} icon={Users} />
            </div>

            <div className="space-y-4 border-t border-[#D2D2D7] pt-8">
              <SectionLabel label="Technical Specifications" />
              <MetaRow label="Subject" value={data?.subject} />
              <MetaRow label="Semester" value={data?.semester} />
              <MetaRow label="Access" value={data?.privacy} icon={data?.privacy === 'PUBLIC' ? Globe : Shield} />
              <MetaRow label="Branch" value={data?.branch} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#D2D2D7] flex items-center justify-between shadow-sm mt-12">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#1D1D1F] text-white flex items-center justify-center font-bold text-xs">{data?.uploader?.name?.charAt(0)}</div>
              <div>
                <p className="text-xs font-bold text-[#1D1D1F]">{data?.uploader?.name}</p>
                <p className="text-[9px] font-bold text-[#86868B] uppercase tracking-tighter">{data?.uploader?.college}</p>
              </div>
            </div>
            <button className="p-3 hover:bg-[#F5F5F7] rounded-full transition-colors text-[#86868B]"><Share2 size={18}/></button>
          </div>
        </div>

        {/* --- RIGHT: FEED & INTERACTION (7 COLS) --- */}
        <div className="lg:col-span-7 flex flex-col h-[85vh] bg-white">
          <div className="p-8 border-b border-[#D2D2D7] flex items-center justify-between bg-white sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-[#0071E3]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Peer Intelligence</span>
            </div>
            <a href={data?.fileUrl} target="_blank" rel="noreferrer" className="px-6 py-3 bg-[#0071E3] text-white rounded-full font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-[#0077ED] transition-all">
              <Download size={14}/> Retrieve Binary
            </a>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
            {data?.reviews?.map(review => (
              <div key={review.id} className="animate-in fade-in slide-in-from-bottom-2">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-tight">{review.user?.name}</span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={10} fill={i < review.rating ? "#0071E3" : "none"} className={i < review.rating ? "text-[#0071E3]" : "text-[#D2D2D7]"} />
                      ))}
                    </div>
                  </div>
                  <span className="text-[9px] text-[#86868B] font-bold uppercase">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-[#424245] leading-relaxed pl-4 border-l-2 border-[#D2D2D7] font-medium">{review.comment}</p>
              </div>
            ))}
          </div>

          {/* Submission Module */}
          <div className="p-8 border-t border-[#D2D2D7] bg-[#F5F5F7]/50 backdrop-blur-sm">
            <SectionLabel label="Submit Analysis" />
            <form onSubmit={handleReviewSubmit} className="mt-4 space-y-4">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button key={num} type="button" onClick={() => setRating(num)} className={`w-10 h-10 rounded-xl font-bold text-xs transition-all border ${rating === num ? 'bg-[#0071E3] text-white border-[#0071E3]' : 'bg-white text-[#86868B] border-[#D2D2D7] hover:border-[#86868B]'}`}>
                    {num}
                  </button>
                ))}
              </div>
              <div className="relative">
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Analyze this resource..." className="w-full bg-white border border-[#D2D2D7] rounded-2xl p-4 pr-14 text-sm font-medium focus:outline-none focus:border-[#0071E3] transition-all h-20" />
                <button disabled={submitting || !comment} className={`absolute right-3 bottom-3 p-3 rounded-xl transition-all ${submitting || !comment ? 'bg-gray-100 text-gray-300' : 'bg-[#1D1D1F] text-white hover:bg-black shadow-lg'}`}>
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- NEW SUB-COMPONENTS FOR LIFE ---

const AnalyticsCard = ({ label, value, icon: Icon }) => (
  <div className="bg-white border border-[#D2D2D7] p-5 rounded-3xl shadow-sm">
    <div className="flex items-center gap-2 mb-2 text-[#86868B]">
      <Icon size={14} />
      <span className="text-[9px] font-bold uppercase tracking-widest">{label}</span>
    </div>
    <span className="text-xl font-semibold tracking-tight text-[#1D1D1F]">{value}</span>
  </div>
);

const SectionLabel = ({ label }) => (
  <div className="flex items-center gap-2 mb-4">
    <div className="w-1.5 h-1.5 bg-[#0071E3]" />
    <span className="text-[10px] font-bold text-[#1D1D1F] uppercase tracking-[0.2em]">{label}</span>
  </div>
);

const MetaRow = ({ label, value, icon: Icon }) => (
  <div className="flex items-center justify-between text-[10px] py-2 border-b border-[#D2D2D7]/30 last:border-0">
    <span className="font-bold text-[#86868B] uppercase tracking-widest">{label}</span>
    <div className="flex items-center gap-2">
      {Icon && <Icon size={12} className="text-[#0071E3]" />}
      <span className="font-bold text-[#1D1D1F] uppercase">{value}</span>
    </div>
  </div>
);

export default ResourceDetail;