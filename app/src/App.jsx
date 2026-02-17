import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import HyperModernAuth from "./pages/Register"
import HyperUpload from "./pages/upload";
import ResourceExplorer from "./pages/explorer";
import ResourceDetail from "./pages/post";
import AcademicFeed from "./pages/home";
import AcademicDashboard from "./pages/profile";
import NexusExplorer from "./pages/file";
import ResourceUpdatePage from "./pages/resourceUpdate";
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Plus, Search, LayoutGrid, 
  User, HardDrive, LogOut 
} from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  const navLinks = [
    { label: 'Feed', path: '/', icon: LayoutGrid },
    { label: 'Explore', path: '/explore', icon: Search },
    { label: 'Files', path: '/file', icon: HardDrive },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/register');
  };

  // Don't show Navbar on register page
  if (location.pathname === '/register') return null;

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-xl border-b border-[#D2D2D7] z-[100] h-16 flex items-center justify-center px-8">
      <div className="w-full max-w-7xl flex justify-between items-center">
        
        {/* Brand */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-2.5 h-2.5 bg-[#0071E3] rounded-sm" />
          <h1 className="text-xl font-bold tracking-tighter text-[#1D1D1F]">NEXUS.</h1>
        </div>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-1 bg-[#F5F5F7] p-1 rounded-xl border border-[#D2D2D7]/50">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                  isActive 
                    ? 'bg-white text-[#0071E3] shadow-sm border border-[#D2D2D7]' 
                    : 'text-[#86868B] hover:text-[#1D1D1F]'
                }`}
              >
                <Icon size={14} />
                {link.label}
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/upload')} 
            className="hidden sm:flex bg-[#0071E3] text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest items-center gap-2 hover:bg-[#0077ED] transition-all shadow-lg shadow-[#0071E3]/20"
          >
            <Plus size={14} /> Deploy
          </button>
          
          <div className="h-8 w-[1px] bg-[#D2D2D7] mx-1" />
          
          <button 
            onClick={handleLogout}
            className="p-2 text-[#86868B] hover:text-red-600 transition-colors"
            title="Terminate Session"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
};


export default function App(){
  return(
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<AcademicFeed/>} />
          <Route path="/upload" element={<HyperUpload/>} />
         <Route path="/register" element={<HyperModernAuth />} />
         <Route path="/explore" element={<ResourceExplorer/>} />
         <Route path="/resource/:id" element={<ResourceDetail/>} />
          <Route path="/resource-update/:id" element={<ResourceUpdatePage/>} />


         <Route path="/profile" element={<AcademicDashboard/>} />
         <Route path="/file" element={<NexusExplorer/>} />


        
      </Routes>
    </Router>
  )
}