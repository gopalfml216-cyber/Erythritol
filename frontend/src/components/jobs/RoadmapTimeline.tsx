import { motion } from 'framer-motion';
import { TrendingUp, CheckCircle2, Circle, DollarSign, Clock } from 'lucide-react';

// Using the RoadmapStep structure to ensure compatibility
interface RoadmapStep {
  id: string;
  level: string;
  title: string;
  estimated_salary: string;
  duration_estimate: string;
  skills_to_acquire: string[];
}

interface RoadmapProps {
  steps: RoadmapStep[];
}

export const RoadmapTimeline = ({ steps }: RoadmapProps) => {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h3 className="text-xl font-black text-slate-800 tracking-tighter flex items-center gap-2">
            <TrendingUp className="text-blue-600" /> Career Roadmap
          </h3>
          <p className="text-xs font-bold text-slate-400 mt-1">AI-Projected Growth Path</p>
        </div>
        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl uppercase tracking-widest">
          Live Track
        </span>
      </div>

      <div className="relative">
        {steps.map((step, index) => (
          <div key={step.id} className="relative flex gap-8 pb-12 last:pb-0">
            {/* Vertical Line Connector */}
            {index !== steps.length - 1 && (
              <div className="absolute left-[15px] top-10 bottom-0 w-[3px] bg-slate-100 rounded-full" />
            )}

            {/* Status Node */}
            <div className="relative z-10 flex-shrink-0 mt-2">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-lg transition-transform hover:scale-110 
                ${index === 0 ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-white text-slate-300 border-2 border-slate-100'}`}>
                {index === 0 ? <CheckCircle2 size={18} /> : <Circle size={14} fill="currentColor" />}
              </div>
            </div>

            {/* Content Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ x: 10 }}
              className="flex-1 bg-slate-50 p-6 rounded-[2rem] border border-transparent hover:border-blue-200 hover:bg-white transition-all group"
            >
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                <div>
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1 block">
                    {step.level}
                  </span>
                  <h4 className="text-lg font-black text-slate-800 group-hover:text-blue-600 transition-colors">
                    {step.title}
                  </h4>
                </div>
                
                <div className="flex flex-row md:flex-col items-end gap-2 text-right">
                  <div className="flex items-center gap-1 text-slate-900 font-black">
                    <DollarSign size={14} className="text-blue-600" />
                    <span>{step.estimated_salary}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                    <Clock size={12} />
                    <span>{step.duration_estimate}</span>
                  </div>
                </div>
              </div>
              
              {/* Skill Tags for Next Step */}
              <div className="flex flex-wrap gap-2">
                {step.skills_to_acquire.map((skill) => (
                  <span key={skill} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-wider group-hover:border-blue-100 group-hover:text-blue-500">
                    + {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};