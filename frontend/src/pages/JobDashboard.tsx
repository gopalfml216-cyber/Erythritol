import  { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, MapPin, Zap, Filter, ArrowUpRight
} from 'lucide-react';

// 🚨 FIXED PORTS: Changed from "../../../" to "../"
import { jobApi } from '../api/jobApi'; 
import type { JobPosting } from '../types';   
import { useUserStore } from '../store/useUserStore';

// ... rest of the code remains exactly the same ...
const JobDashboard = () => {
  // 1. State for Real Data
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Get User Profile from Store
  const { candidate } = useUserStore();

  // 2. Fetch Jobs on Load
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        // Fetch real data from backend
        const data = await jobApi.searchJobs(search);
        setJobs(data);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search to prevent too many API calls
    const timeoutId = setTimeout(() => {
      fetchJobs();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-6">
        
        {/* --- LEFT COLUMN: Profile Snapshot --- */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm"
          >
            <h3 className="text-lg font-bold mb-4">Your Profile Snapshot</h3>
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                {candidate?.name ? candidate.name.charAt(0).toUpperCase() : "G"}
              </div>
              <div>
                <p className="font-bold text-sm truncate max-w-[120px]">
                  {candidate?.name || "Guest User"}
                </p>
                <p className="text-xs text-slate-500">
                  {candidate?.skills?.[0] || "Aspiring Developer"}
                </p>
              </div>
            </div>
            
            {/* Dynamic Skill Tags from Resume */}
            {candidate?.skills && (
              <div className="flex flex-wrap gap-2 mt-4">
                 {candidate.skills.slice(0, 5).map((skill: string, i: number) => (
                   <span key={i} className="text-[10px] px-2 py-1 bg-blue-50 text-blue-600 rounded-md font-medium">
                     {skill}
                   </span>
                 ))}
              </div>
            )}
          </motion.div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Filter size={18}/> Filters</h3>
            <div className="flex flex-wrap gap-2">
              {['Remote', 'Full-time', 'Engineering', 'Design'].map(tag => (
                <span key={tag} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-100 cursor-pointer">
                  {tag} +
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* --- CENTER COLUMN: Hero & Feed --- */}
        <div className="col-span-12 lg:col-span-6 space-y-6">
          {/* Main Hero Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-[2.5rem] border border-blue-100 text-center"
          >
            <h1 className="text-3xl md:text-4xl font-black text-slate-800 leading-tight mb-4">
              Smarter Matches.<br/>Less Searching.
            </h1>
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search job titles (e.g. 'Frontend')..." 
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border-none shadow-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </motion.div>

          {/* REAL Job Feed List */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold px-2">
              {loading ? "Finding opportunities..." : `Recommended Jobs (${jobs.length})`}
            </h3>
            
            {loading ? (
              // Loading Skeleton
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="h-32 bg-white rounded-[2rem] animate-pulse" />
                ))}
              </div>
            ) : (
              // The Real List
              jobs.map((job) => (
                <motion.div 
                  key={job.job_id}
                  whileHover={{ x: 10 }}
                  className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group cursor-pointer transition-all hover:border-blue-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                      {job.company.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{job.title}</h4>
                      <p className="text-xs text-slate-400">
                        {job.company} • {job.location} • {job.job_type}
                      </p>
                      {/* Match Score Badge */}
                      {job.match_score && (
                        <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                          {Math.round(job.match_score * 100)}% Match
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div className="hidden sm:block">
                      {/* Handle salary array [min, max] */}
                      <p className="font-bold text-sm">
                        ${(job.salary_range[0]/1000).toFixed(0)}k - {(job.salary_range[1]/1000).toFixed(0)}k
                      </p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Yearly</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* --- RIGHT COLUMN: Real-time Insights --- */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm"
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-bold">Market Pulse</h3>
              <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-md font-bold uppercase">Live</span>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-black text-slate-800">{jobs.length}</p>
                  <p className="text-xs text-slate-500 font-medium">Active Jobs Found</p>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin-slow" />
              </div>
            </div>
          </motion.div>

          <div className="bg-[#1E293B] p-6 rounded-[2rem] text-white overflow-hidden relative">
            <div className="relative z-10">
              <Zap className="text-yellow-400 mb-4" fill="currentColor" />
              <h3 className="font-bold text-lg leading-tight mb-2">Upload Resume?</h3>
              <p className="text-slate-400 text-xs mb-4">Get AI-matched jobs by uploading your CV.</p>
              <button className="w-full py-3 bg-blue-600 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all">
                Update Profile
              </button>
            </div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default JobDashboard;