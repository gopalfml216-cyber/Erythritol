import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

interface SkillItem {
  name: string;
  score: number; // 0-100
  gap: number; // positive = ahead, negative = behind
}

interface SkillsListProps {
  skills: string[]; // Or complex object if available
}

export const SkillsList: React.FC<SkillsListProps> = ({ skills }) => {
  // Mocking detailed data based on simple string array
  const detailedSkills: SkillItem[] = skills.map((skill, index) => ({
    name: skill,
    score: 80 + (index % 2 === 0 ? 10 : -20),
    gap: index % 2 === 0 ? 15 : -10
  }));

  // Add a missing skill for demo
  detailedSkills.push({ name: "System Design", score: 30, gap: -40 });

  return (
    <div className="p-6 bg-[#0E0E0E] border border-white/5 rounded-[1.5rem] h-full flex flex-col">
       <div className="flex justify-between items-center mb-6">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Skill Vector</h4>
          <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-slate-400 font-mono">LIVE_DATA</span>
       </div>
       
       <div className="space-y-5 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {detailedSkills.map((item) => (
             <div key={item.name} className="group">
                <div className="flex justify-between text-xs font-medium mb-2">
                   <div className="flex items-center gap-2">
                      {item.gap > 0 ? (
                        <CheckCircle2 size={12} className="text-emerald-500" />
                      ) : (
                        <XCircle size={12} className="text-red-500" />
                      )}
                      <span className="text-slate-300 group-hover:text-white transition-colors">{item.name}</span>
                   </div>
                   <span className={`font-bold font-mono ${item.gap > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {item.gap > 0 ? '+' : ''}{item.gap}%
                   </span>
                </div>
                
                <div className="w-full h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                   <div 
                      className={`h-full rounded-full transition-all duration-1000 ${item.gap > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} 
                      style={{ width: `${item.score}%` }}
                   />
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};