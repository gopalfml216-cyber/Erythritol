import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';

interface SkillData {
  skill: string;
  userScore: number;   // Your skill level (0-100)
  targetScore: number; // Required level (0-100)
}

export const SkillRadarChart = ({ skills }: { skills: string[] }) => {
  // 1. Logic: Transform simple string skills into "scored" data for the chart
  // In a real app, the backend calculates this. Here we mock the comparison.
  const targetSkills = ["React", "TypeScript", "Node.js", "AWS", "System Design", "Docker"];
  
  const data: SkillData[] = targetSkills.map(target => ({
    skill: target,
    // If user has the skill, give 90 points, else 20 points
    userScore: skills.some(s => s.toLowerCase().includes(target.toLowerCase())) ? 90 : 20,
    targetScore: 85 // The "Standard" required for the job
  }));

  return (
    <div className="w-full h-[350px] bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
      <h3 className="text-lg font-bold text-gray-800 mb-2">Skill Gap Visualization</h3>
      <div className="flex-1 w-full min-h-0"> {/* min-h-0 is crucial for Recharts in Flex containers */}
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="skill" tick={{ fill: '#6b7280', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar name="You" dataKey="userScore" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
            <Radar name="Target Role" dataKey="targetScore" stroke="#9ca3af" fill="#d1d5db" fillOpacity={0.3} />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};