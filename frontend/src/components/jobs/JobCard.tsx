import { motion } from 'framer-motion';
import { MapPin, DollarSign, Bookmark, ArrowUpRight, Briefcase } from 'lucide-react';

// Change these two lines specifically:
import { useJobStore } from '../../store/useJobStore'; // Added an extra ../
import type { JobPosting } from '../../types/job';     // Added an extra ../

interface JobCardProps {
  job: JobPosting;
}

export const JobCard = ({ job }: JobCardProps) => {
  const { savedJobs, toggleSaveJob } = useJobStore();
  const isSaved = savedJobs.includes(job.job_id);

  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.01 }}
      className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-300 flex items-center justify-between group cursor-pointer"
    >
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 bg-slate-50 rounded-[1.8rem] flex items-center justify-center text-2xl font-black text-blue-600 border border-slate-100 transition-colors group-hover:bg-blue-50">
          {job.company_name ? job.company_name.charAt(0) : <Briefcase size={24} />}
        </div>

        <div className="space-y-2">
          <h4 className="text-xl font-black text-slate-800 tracking-tight leading-none group-hover:text-blue-600 transition-colors">
            {job.title}
          </h4>
          <div className="flex items-center gap-3 text-sm font-bold text-slate-400">
            <span className="text-blue-600/80">{job.company_name}</span>
            <span className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
            <div className="flex items-center gap-1.5">
              <MapPin size={14} className="text-slate-300" />
              {job.location}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="text-right hidden md:block">
          <div className="flex items-center justify-end text-slate-900 font-black text-xl tracking-tighter">
            <DollarSign size={18} className="text-blue-600" />
            <span>{job.salary}</span>
          </div>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mt-1">Estimated</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveJob(job.job_id);
            }}
            className={`p-4 rounded-2xl transition-all duration-300 ${
              isSaved ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
            }`}
          >
            <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} strokeWidth={2.5} />
          </button>
          
          <div className="p-4 bg-slate-900 text-white rounded-2xl group-hover:bg-blue-600 group-hover:shadow-lg group-hover:shadow-blue-200 transition-all duration-300">
            <ArrowUpRight size={20} strokeWidth={3} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};