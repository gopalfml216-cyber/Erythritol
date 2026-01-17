import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ReadinessScoreProps {
  score: number;
  previousScore?: number;
}

export const ReadinessScore: React.FC<ReadinessScoreProps> = ({ score, previousScore = 60 }) => {
  const isUp = score >= previousScore;
  
  return (
    <div className="flex items-center gap-4 bg-[#111] px-6 py-3 rounded-2xl border border-white/5">
      <div className="text-right">
        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Match Score</p>
        <div className="flex items-baseline justify-end gap-2">
           <p className="text-3xl font-bold text-emerald-400 font-['Space_Grotesk']">{score}%</p>
           {/* Diff Indicator */}
           <span className={`text-[10px] font-bold ${isUp ? 'text-emerald-500' : 'text-red-500'}`}>
             {isUp ? '+' : ''}{score - previousScore}%
           </span>
        </div>
      </div>
      
      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border transition-all ${
        isUp 
          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_-3px_rgba(16,185,129,0.2)]' 
          : 'bg-red-500/10 text-red-400 border-red-500/20'
      }`}>
        {isUp ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
      </div>
    </div>
  );
};