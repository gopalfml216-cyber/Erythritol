import React from 'react';
import { LucideIcon, Lock, CheckCircle2, CircleDashed } from 'lucide-react';

export interface RoadmapStep {
  id: number;
  title: string;
  desc: string;
  status: 'completed' | 'current' | 'locked';
  duration: string;
}

interface RoadmapPhaseProps {
  step: RoadmapStep;
  index: number;
}

export const RoadmapPhase: React.FC<RoadmapPhaseProps> = ({ step, index }) => {
  const getStatusStyles = () => {
    switch (step.status) {
      case 'completed':
        return {
          border: 'border-emerald-500/20 hover:border-emerald-500/40',
          bg: 'bg-emerald-900/10',
          iconColor: 'text-emerald-400',
          textColor: 'text-slate-300',
          Icon: CheckCircle2
        };
      case 'current':
        return {
          border: 'border-indigo-500/40 hover:border-indigo-500/60 shadow-[0_0_20px_-5px_rgba(99,102,241,0.15)]',
          bg: 'bg-indigo-900/10',
          iconColor: 'text-indigo-400',
          textColor: 'text-white',
          Icon: CircleDashed
        };
      default: // locked
        return {
          border: 'border-white/5 hover:border-white/10',
          bg: 'bg-[#111]',
          iconColor: 'text-slate-600',
          textColor: 'text-slate-500',
          Icon: Lock
        };
    }
  };

  const styles = getStatusStyles();
  const Icon = styles.Icon;

  return (
    <div className={`relative p-5 rounded-2xl border ${styles.border} ${styles.bg} transition-all duration-300 group`}>
      {/* Connector Line (except for last item) */}
      <div className="absolute left-[29px] top-[50px] bottom-[-20px] w-px bg-white/5 z-0 group-last:hidden" />

      <div className="flex items-start gap-4 relative z-10">
        <div className={`mt-0.5 p-1 rounded-full bg-[#050505] border border-white/5 ${styles.iconColor}`}>
          <Icon size={16} />
        </div>
        
        <div className="w-full">
          <div className="flex justify-between items-center mb-1">
             <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 font-['Space_Grotesk']">
               Phase 0{index + 1}
             </span>
             <span className="text-[9px] font-bold bg-black/40 px-2 py-0.5 rounded text-slate-400 border border-white/5">
               {step.duration}
             </span>
          </div>
          
          <h4 className={`text-sm font-bold mb-2 ${styles.textColor} font-['Plus_Jakarta_Sans']`}>
            {step.title}
          </h4>
          
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            {step.desc}
          </p>
        </div>
      </div>
    </div>
  );
};