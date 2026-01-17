import { Link } from 'react-router-dom';
import { LayoutDashboard, FileText, Briefcase, Zap } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
      <div className="max-w-[1440px] mx-auto px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <Zap size={22} fill="currentColor" />
          </div>
          <span className="text-xl font-black text-slate-800 tracking-tighter">WeVolve</span>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-10">
          {[
            { name: 'Resume Parser', icon: <FileText size={18}/>, path: '/' },
            { name: 'Gap Analysis', icon: <LayoutDashboard size={18}/>, path: '/gap-analysis' },
            { name: 'Job Board', icon: <Briefcase size={18}/>, path: '/jobs' }
          ].map((link) => (
            <Link key={link.name} to={link.path} className="flex items-center gap-2 text-sm font-black text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-widest">
              {link.icon} {link.name}
            </Link>
          ))}
        </div>

        <button className="px-8 py-3 bg-slate-900 text-white text-xs font-black rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">
          Work with us
        </button>
      </div>
    </nav>
  );
};