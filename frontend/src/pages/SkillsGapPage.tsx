import React, { useEffect } from 'react';
import { useUserStore } from '../store/useUserStore';
import { SkillRadarChart } from '../components/skills/SkillRadarChart';
import { RoadmapTimeline } from '../components/skills/RoadmapTimeline';
import { Trophy, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const SkillsGapPage = () => {
  const { candidate, setCandidate } = useUserStore();

  // DEV MODE: If no data exists, load this Mock Data automatically
  // This ensures you ALWAYS see the page during development
  useEffect(() => {
    if (!candidate) {
      setCandidate({
        name: "Demo Candidate",
        email: "demo@example.com",
        phone: "123-456-7890",
        // These skills will be compared in the Radar Chart
        skills: ["React", "JavaScript", "HTML", "CSS"], 
        experience: [],
        education: [],
        confidenceScore: 85
      });
    }
  }, [candidate, setCandidate]);

  if (!candidate) return <div className="p-20 text-center">Loading Demo Data...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* 1. Header Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Career Analysis: {candidate.name}</h1>
            <p className="text-gray-500">Target Role: <span className="font-semibold text-blue-600">Senior Full Stack Developer</span></p>
          </div>
          
          <div className="flex items-center gap-6">
             <Link to="/" className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1">
                <RefreshCw size={14} /> Re-upload Resume
             </Link>
             <div className="flex gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-400">Match Score</p>
                  <p className="text-2xl font-bold text-blue-600">65%</p>
                </div>
                <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                  <TrendingUp size={24} />
                </div>
             </div>
          </div>
        </div>

        {/* 2. Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Radar Chart (Takes up 2 columns) */}
          <div className="lg:col-span-2 h-[450px]"> {/* Fixed Height ensures chart renders */}
            <SkillRadarChart skills={candidate.skills} />
          </div>

          {/* Right: Roadmap (Takes up 1 column) */}
          <div className="lg:col-span-1 h-[450px]">
            <RoadmapTimeline />
          </div>
        </div>

        {/* 3. Missing Skills Alert */}
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="text-amber-600 mt-1 shrink-0" />
          <div>
            <h4 className="font-bold text-amber-900">Critical Skills Missing</h4>
            <p className="text-amber-800 text-sm mt-1">
              To reach "Senior" level, you need to demonstrate experience with 
              <span className="font-bold"> System Design</span> and <span className="font-bold"> Cloud Architecture (AWS)</span>.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SkillsGapPage;