import React from 'react';
import { Lightbulb, ArrowRight, AlertTriangle } from 'lucide-react';

interface GapAnalysisCardProps {
  missingSkill: string;
  impactScore: number;
  type?: 'critical' | 'warning' | 'info';
}

export const GapAnalysisCard: React.FC<GapAnalysisCardProps> = ({ 
  missingSkill, 
  impactScore,
  type = 'critical' 
}) => {
  return (
    <div className="bg-gradient-to-br from-indigo-900/40 to-indigo-900/10 p-8 rounded-3xl text-white border border-indigo-500/20 relative overflow-hidden group">
      {/* Background Texture */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
             {type === 'critical' ? <AlertTriangle className="text-indigo-400" size={24} /> : <Lightbulb className="text-indigo-400" size={24} />}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest bg-indigo-500/20 px-3 py-1 rounded-lg border border-indigo-500/20 text-indigo-300">
            Impact: High
          </span>
        </div>

        <h3 className="text-lg font-bold mb-2 font-['Space_Grotesk']">Critical Gap Identified</h3>
        <p className="text-indigo-200/70 text-sm leading-relaxed mb-6 font-medium">
          Missing: <span className="text-white font-bold decoration-indigo-500 underline underline-offset-4">{missingSkill}</span>. 
          This reduces your seniority score by <span className="text-white">{impactScore}%</span>.
        </p>

        <button className="flex items-center gap-2 text-xs font-bold bg-indigo-500 hover:bg-indigo-400 transition-all px-5 py-3 rounded-xl text-white w-full justify-center shadow-lg shadow-indigo-900/50">
          Generate Study Plan <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};