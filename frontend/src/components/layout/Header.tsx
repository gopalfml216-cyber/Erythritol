import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, FileText, TrendingUp, Briefcase, Bell } from 'lucide-react';

export const Header = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 w-full z-50 transition-all duration-300 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 font-['Plus_Jakarta_Sans']">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Layout className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight font-['Space_Grotesk']">WeVolve</span>
            </Link>
          </div>

          {/* Navigation Links - Opening in NEW TABS */}
          <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1.5 rounded-2xl border border-white/5">
            {[
              { path: '/', label: 'Resume Parser', icon: FileText, newTab: false },
              { path: '/gap-analysis', label: 'Gap Analysis', icon: TrendingUp, newTab: true },
              { path: '/jobs', label: 'Job Board', icon: Briefcase, newTab: true },
            ].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                target={link.newTab ? "_blank" : undefined}
                rel={link.newTab ? "noopener noreferrer" : undefined}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive(link.path)
                    ? 'bg-[#1F2937] text-white shadow-lg shadow-black/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <link.icon size={14} />
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Profile Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0B0F19]" />
            </button>
            
            <div className="h-8 w-[1px] bg-white/10 mx-2" />
            
            <button className="flex items-center gap-3 pl-1 pr-4 py-1 rounded-full hover:bg-white/5 transition-all border border-transparent hover:border-white/5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                AN
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-white leading-none">Archish</p>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">Pro Member</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};