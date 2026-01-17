import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface SkillRadarProps {
  skills: string[];
}

export const SkillRadarChart: React.FC<SkillRadarProps> = ({ skills }) => {
  const data = skills.map(skill => ({
    subject: skill,
    target: 120, // Renamed to 'target' for clarity
    you: Math.floor(Math.random() * 80) + 40, // Renamed to 'you'
    fullMark: 150,
  }));

  // Ensure chart handles low data count gracefully
  const chartData = data.length < 3 
    ? [...data, { subject: 'System Design', target: 120, you: 30, fullMark: 150 }, { subject: 'AWS', target: 120, you: 50, fullMark: 150 }] 
    : data;

  // Custom Tooltip for better explanation
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0A0A0A] border border-white/10 p-4 rounded-xl shadow-2xl">
          <p className="text-white font-bold font-['Space_Grotesk'] mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-400">
              <span className="text-indigo-400 font-bold">You:</span> {payload[1].value} pts
            </p>
            <p className="text-xs font-medium text-slate-400">
              <span className="text-slate-500 font-bold">Target:</span> {payload[0].value} pts
            </p>
            <p className="text-[10px] text-slate-500 mt-2 pt-2 border-t border-white/10">
              Gap: {payload[0].value - payload[1].value} pts
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
        {/* Grid lines */}
        <PolarGrid stroke="#333" strokeDasharray="3 3" />
        
        {/* Labels */}
        <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 'bold', fontFamily: 'Plus Jakarta Sans' }} 
        />
        
        <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
        
        {/* Target (Benchmark) Area */}
        <Radar
          name="Benchmark"
          dataKey="target"
          stroke="#475569"
          strokeWidth={2}
          fill="#475569"
          fillOpacity={0.15}
        />
        
        {/* User (You) Area */}
        <Radar
          name="You"
          dataKey="you"
          stroke="#6366f1"
          strokeWidth={3}
          fill="#6366f1"
          fillOpacity={0.4}
        />
        
        <Tooltip content={<CustomTooltip />} cursor={false} />
      </RadarChart>
    </ResponsiveContainer>
  );
};