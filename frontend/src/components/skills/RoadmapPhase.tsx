import React from 'react';
// FIX: Split imports. 'LucideIcon' is a type, the others are components.
import type { LucideIcon } from 'lucide-react'; 
import { Lock, CheckCircle2, CircleDashed } from 'lucide-react';

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
  isLast?: boolean; 
}

export const RoadmapPhase: React.FC<RoadmapPhaseProps> = ({ step, index, isLast }) => {
  
  // Logic to determine styles based on status
  const getStatusStyles = () => {
    switch (step.status) {
      case 'completed':
        return {
          border: 'border-emerald-500/20 hover:border-emerald-500/40',
          bg: 'bg-emerald-900/10',
          iconColor: 'text-emerald-400',
          Icon: CheckCircle2
        };
      case 'current':
        return {
          border: 'border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.3)]',
          bg: 'bg-indigo-900/10',
          iconColor: 'text-indigo-400',
          Icon: CircleDashed
        };
      case 'locked':
      default:
        return {
          border: 'border-white/5',
          bg: 'bg-[#111]',
          iconColor: 'text-slate-600',
          Icon: Lock
        };
    }
  };

  const styles = getStatusStyles();
  const Icon = styles.Icon;

  return (
    <div className="relative pl-8 pb-12 last:pb-0">
      {/* Connector Line */}
      {!isLast && (
        <div className={`absolute left-[15px] top-8 bottom-0 w-[2px] ${
          step.status === 'completed' ? 'bg-emerald-500/20' : 'bg-white/5'
        }`} />
      )}

      {/* Icon Bubble */}
      <div className={`absolute left-0 top-0 w-8 h-8 rounded-full border ${styles.border} ${styles.bg} flex items-center justify-center z-10 transition-all duration-300`}>
         <Icon size={14} className={styles.iconColor} />
      </div>

      {/* Card Content */}
      <div className={`p-5 rounded-2xl border ${styles.border} bg-[#0A0A0A] transition-all duration-300 group hover:bg-[#0F0F0F]`}>
         <div className="flex justify-between items-start mb-2">
            <h4 className={`font-bold text-sm ${step.status === 'locked' ? 'text-slate-500' : 'text-white'}`}>
               {step.title}
            </h4>
            <span className="text-[10px] font-bold font-mono text-slate-600 bg-white/5 px-2 py-1 rounded">
               {step.duration}
            </span>
         </div>
         <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            {step.desc}
         </p>
      </div>
    </div>
  );
};