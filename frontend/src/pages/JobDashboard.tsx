import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, MapPin, ArrowUpRight, Filter, Briefcase, Zap, TrendingUp, ArrowLeft } from 'lucide-react';

const JobDash = () => {
  const jobs = [
    { title: "Backend Developer", company: "TechCorp India", loc: "Bangalore", salary: "$100k", match: 94, color: "text-emerald-400 border-emerald-500/20" },
    { title: "Full Stack Developer", company: "StartupXYZ", loc: "Hyderabad", salary: "$120k", match: 88, color: "text-indigo-400 border-indigo-500/20" },
    { title: "Frontend Engineer", company: "WebSolutions", loc: "Pune", salary: "$90k", match: 82, color: "text-purple-400 border-purple-500/20" },
    { title: "Python Developer", company: "DataTech", loc: "Mumbai", salary: "$110k", match: 78, color: "text-amber-400 border-amber-500/20" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-12 px-6 font-['Plus_Jakarta_Sans'] text-white relative">
      
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.3] -z-10 pointer-events-none" />

      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* --- NAVIGATION: BACK BUTTON --- */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
            <div className="p-2 rounded-lg bg-white/5 border border-white/5 group-hover:bg-white/10 group-hover:border-white/10 transition-all">
               <ArrowLeft size={16} />
            </div>
            <span className="text-sm font-bold font-['Space_Grotesk']">Back to Dashboard</span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-12 gap-8">
          
          {/* --- PROFILE SNAPSHOT --- */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="bg-[#0A0A0A] p-6 rounded-3xl border border-white/10 text-center"
            >
              <div className="relative inline-block mb-6">
                 <div className="w-24 h-24 rounded-full p-[2px] bg-gradient-to-tr from-indigo-500 to-purple-500">
                   <div className="w-full h-full rounded-full bg-[#0A0A0A] flex items-center justify-center border-4 border-[#0A0A0A]">
                      <span className="text-2xl font-bold text-white font-['Space_Grotesk']">84%</span>
                   </div>
                 </div>
                 <div className="absolute bottom-0 right-0 bg-indigo-500 p-1.5 rounded-full border-4 border-[#0A0A0A]">
                   <Zap size={12} fill="currentColor" className="text-white"/>
                 </div>
              </div>
              <h2 className="text-lg font-bold text-white font-['Space_Grotesk']">Rahul Kumar</h2>
              <p className="text-slate-500 text-xs mb-6 font-medium uppercase tracking-widest">Senior Full Stack</p>
              <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold transition-colors border border-white/5">
                Edit Preferences
              </button>
            </motion.div>

            <div className="bg-[#0A0A0A] p-6 rounded-3xl border border-white/10">
              <h3 className="text-xs font-bold text-slate-400 mb-4 flex items-center gap-2 uppercase tracking-widest">
                <Filter size={12} /> Filter Stream
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Remote', 'Full-time', '$100k+', 'React', 'Python'].map(tag => (
                  <span key={tag} className="px-3 py-1.5 rounded-lg bg-[#111] text-[10px] font-bold text-slate-400 border border-white/5 hover:border-indigo-500/50 hover:text-indigo-400 cursor-pointer transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* --- MAIN JOB FEED --- */}
          <div className="col-span-12 lg:col-span-6 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-[#0A0A0A] p-8 rounded-3xl border border-white/10 text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-grid-pattern opacity-10" />
              <h1 className="text-2xl font-bold mb-2 font-['Space_Grotesk']">Market Opportunities</h1>
              <p className="text-slate-400 text-sm mb-6 font-medium">Live feed of roles matching your skill vector.</p>
              
              <div className="relative max-w-lg mx-auto">
                <input 
                  type="text" 
                  placeholder="Search by role, stack, or salary..." 
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#151515] border border-white/10 text-white placeholder-slate-600 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all text-sm font-medium"
                />
                <Search className="absolute left-4 top-4 text-slate-500" size={18} />
              </div>
            </motion.div>

            <div className="space-y-3">
              <div className="flex justify-between items-end px-2 mb-2">
                 <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">High Priority Matches</h3>
              </div>
              
              {jobs.map((job, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className="group bg-[#0A0A0A] p-5 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer hover:bg-[#0e0e0e]"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-xl bg-[#111] flex items-center justify-center text-slate-300 border border-white/5 group-hover:text-white transition-colors`}>
                        <Briefcase size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-white group-hover:text-indigo-400 transition-colors font-['Space_Grotesk']">{job.title}</h4>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 font-medium">
                          <span>{job.company}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-700"/>
                          <span className="flex items-center gap-1"><MapPin size={10}/> {job.loc}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className="block text-lg font-bold text-white font-['Space_Grotesk'] mb-1">{job.salary}</span>
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${job.color} bg-opacity-5`}>
                        {job.match}% Match
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* --- RIGHT STATS --- */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#0A0A0A] p-6 rounded-3xl border border-white/10 shadow-2xl text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-2">Active Pipeline</p>
                <div className="text-5xl font-bold text-white font-['Space_Grotesk']">30</div>
                <p className="text-slate-500 text-xs mt-2 font-medium">Roles needing your stack</p>
             </motion.div>

             <div className="bg-[#0A0A0A] p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group">
                <div className="relative z-10">
                   <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center text-white mb-5 shadow-lg shadow-indigo-500/20">
                      <TrendingUp size={20} />
                   </div>
                   <h3 className="text-lg font-bold text-white mb-2 font-['Space_Grotesk']">Profile Visibility</h3>
                   <p className="text-slate-400 text-xs mb-6 font-medium leading-relaxed">
                      Recruiters are 40% more likely to view candidates with verified skill badges.
                   </p>
                   <button className="w-full py-3 bg-white hover:bg-slate-200 text-black rounded-xl text-xs font-bold transition-colors">
                      Verify Skills
                   </button>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default JobDash;