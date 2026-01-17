import React from 'react';
import { CheckCircle2, Circle, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

interface RoadmapPhaseProps {
  phase: number;
  title: string;
  duration: string;
  status: 'completed' | 'in-progress' | 'locked';
  description: string;
}

export const RoadmapPhase = ({ phase, title, duration, status, description }: RoadmapPhaseProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: phase * 0.1 }}
      className={`relative flex gap-4 p-4 rounded-xl border transition-all ${
        status === 'in-progress' ? 'bg-blue-50 border-blue-200' : 
        status === 'completed' ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-100 opacity-75'
      }`}
    >
      {/* Icon Indicator */}
      <div className={`
        shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2
        ${status === 'completed' ? 'bg-green-100 border-green-500 text-green-600' : 
          status === 'in-progress' ? 'bg-blue-100 border-blue-500 text-blue-600' : 'bg-gray-100 border-gray-300 text-gray-400'}
      `}>
        {status === 'completed' ? <CheckCircle2 size={16} /> : 
         status === 'in-progress' ? <Circle size={16} /> : <Lock size={16} />}
      </div>

      {/* Content */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs font-bold uppercase tracking-wider ${
            status === 'in-progress' ? 'text-blue-600' : 'text-gray-400'
          }`}>
            Phase {phase} • {duration}
          </span>
        </div>
        <h4 className="font-bold text-gray-900">{title}</h4>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
    </motion.div>
  );
};