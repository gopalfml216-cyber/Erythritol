import React from 'react';
import { CheckCircle2, Circle, Lock } from 'lucide-react';

export const RoadmapTimeline = () => {
  const steps = [
    {
      title: "Frontend Mastery",
      desc: "Master React Hooks, Tailwind CSS, and State Management.",
      status: "current",
      color: "border-emerald-500/20 text-emerald-400",
      bg: "bg-emerald-500/5",
      icon: CheckCircle2
    },
    {
      title: "Backend Fundamentals",
      desc: "Learn FastAPI, Pydantic, and Database connectivity.",
      status: "upcoming",
      color: "border-indigo-500/20 text-indigo-400",
      bg: "bg-indigo-500/5",
      icon: Circle
    },
    {
      title: "System Design",
      desc: "Understand Microservices, Caching, and Load Balancing.",
      status: "locked",
      color: "border-slate-700 text-slate-500",
      bg: "bg-slate-800/20",
      icon: Lock
    }
  ];

  return (
    <div className="space-y-4 h-full">
      {steps.map((step, i) => (
        <div 
          key={i} 
          className={`p-5 rounded-2xl border ${step.color} ${step.bg} transition-all hover:border-opacity-50 group cursor-pointer`}
        >
          <div className="flex items-start gap-4">
            <div className={`mt-0.5 ${step.status === 'locked' ? 'text-slate-600' : step.color.split(' ')[1]}`}>
              <step.icon size={18} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Phase {i + 1}</p>
              <h4 className={`text-sm font-bold mb-2 ${step.status === 'locked' ? 'text-slate-500' : 'text-white'}`}>
                {step.title}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                {step.desc}
              </p>
            </div>
          </div>
        </div>
      ))}
      
      <button className="w-full mt-auto py-4 bg-white hover:bg-slate-200 text-black rounded-xl text-xs font-bold transition-colors font-['Space_Grotesk']">
         Start Learning
      </button>
    </div>
  );
};