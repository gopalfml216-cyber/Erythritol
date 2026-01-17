import React from 'react';
import { RoadmapPhase } from './RoadmapPhase';
import { ArrowRight } from 'lucide-react';

export const RoadmapTimeline = () => {
  // Mock Data: In a real app, this comes from the "Gap Analysis" API
  const phases = [
    { 
      phase: 1, 
      title: "Frontend Mastery", 
      duration: "2 Weeks", 
      status: "completed" as const, 
      description: "Master React Hooks, Tailwind CSS, and State Management." 
    },
    { 
      phase: 2, 
      title: "Backend Fundamentals", 
      duration: "4 Weeks", 
      status: "in-progress" as const, 
      description: "Learn FastAPI, Pydantic, and Database connectivity." 
    },
    { 
      phase: 3, 
      title: "System Design", 
      duration: "3 Weeks", 
      status: "locked" as const, 
      description: "Understand Microservices, Caching, and Load Balancing." 
    },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Personalized Learning Path</h3>
      
      <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {phases.map((p) => (
          <RoadmapPhase key={p.phase} {...p} />
        ))}
      </div>

      <button className="w-full mt-6 py-3 bg-slate-900 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10">
        Start Learning <ArrowRight size={16} />
      </button>
    </div>
  );
};