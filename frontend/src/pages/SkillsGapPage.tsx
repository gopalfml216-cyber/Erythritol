import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import { 
  ArrowLeft, RefreshCw, Target, Users, TrendingUp, AlertCircle, Info, UploadCloud 
} from 'lucide-react';

// --- Import Custom Components ---
import { SkillRadarChart } from '../components/skills/SkillRadarChart';
import { RoadmapTimeline } from '../components/skills/RoadmapTimeline';
import { GapAnalysisCard } from '../components/skills/GapAnalysisCard';
import { ReadinessScore } from '../components/skills/ReadinessScore';
import { SkillsList } from '../components/skills/SkillsList';

const SkillsGapPage = () => {
  // 1. Get data from the global store
  const { candidate, setCandidate } = useUserStore();

  // ---------------------------------------------------------
  // DEBUGGING: Demo Data Fallback
  // I have commented this out. This ensures that if the page 
  // loads data, it is coming from your BACKEND/Store, not this dummy object.
  // ---------------------------------------------------------
  /*
  useEffect(() => {
    if (!candidate) {
      setCandidate({
        name: "Demo Candidate",
        email: "demo@example.com",
        phone: "123-456-7890",
        skills: ["React", "JavaScript", "HTML", "CSS", "Node.js"], 
        experience: [],
        education: [],
        projects: ["Portfolio Website", "E-commerce App"],
        confidence_scores: { skills: 0.85, email: 1, phone: 1 }
      });
    }
  }, [candidate, setCandidate]);
  */

  // 2. Empty State Handling (If no backend data is found)
  if (!candidate) return (
    <div className="min-h-screen bg-dots-dark flex flex-col items-center justify-center p-6 text-center font-['Plus_Jakarta_Sans'] text-white">
      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 animate-pulse">
        <UploadCloud className="text-slate-500" size={32} />
      </div>
      <h2 className="text-2xl font-bold font-['Space_Grotesk'] mb-2">No Analysis Data Found</h2>
      <p className="text-slate-400 max-w-md mb-8">
        Your session may have expired or no resume was uploaded. Please upload a resume to generate a new analysis.
      </p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2"
      >
        <ArrowLeft size={16} /> Upload Resume
      </Link>
    </div>
  );

  // 3. Main Dashboard (Rendered only if candidate data exists)
  return (
    <div className="min-h-screen bg-dots-dark pt-28 pb-12 px-4 md:px-8 font-['Plus_Jakarta_Sans'] text-white relative">
      
      {/* Top Gradient Fade */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-[#050505] to-transparent -z-10 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* --- NAVIGATION --- */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
            <div className="p-2 rounded-lg bg-white/5 border border-white/5 group-hover:bg-white/10 group-hover:border-white/10 transition-all">
               <ArrowLeft size={16} />
            </div>
            <span className="text-sm font-bold font-['Space_Grotesk']">Back to Dashboard</span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-12 gap-6">
          
          {/* --- ROW 1: HEADER & SCORE --- */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="col-span-12 bg-[#0A0A0A] p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6"
          >
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center text-indigo-400 border border-white/10">
                <Target size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight font-['Space_Grotesk']">Analysis: {candidate.name}</h1>
                <p className="text-slate-400 font-medium text-sm mt-1">Target Role: <span className="text-indigo-400 font-bold">Senior Full Stack Developer</span></p>
              </div>
            </div>
            
            <div className="flex items-center gap-8">
              <Link to="/" className="text-xs font-bold text-slate-500 hover:text-white transition-colors flex items-center gap-2 uppercase tracking-widest">
                 <RefreshCw size={14} /> Re-upload
              </Link>
              <ReadinessScore score={65} previousScore={60} />
            </div>
          </motion.div>

          {/* --- ROW 2: RADAR CHART --- */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="col-span-12 lg:col-span-8 bg-[#0A0A0A] p-8 rounded-3xl border border-white/10 shadow-2xl min-h-[500px]"
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-white font-['Space_Grotesk']">Competency Vector</h3>
              
              <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                  <span className="flex items-center gap-2 text-indigo-400">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"/> You
                  </span>
                  <span className="flex items-center gap-2 text-slate-500">
                    <div className="w-2 h-2 rounded-full bg-slate-600"/> Benchmark
                  </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
               <div className="md:col-span-8 h-[400px] w-full bg-[#050505] rounded-2xl flex items-center justify-center border border-white/5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-dots-dark opacity-50 pointer-events-none" />
                  {/* Passing REAL candidate skills */}
                 <SkillRadarChart skills={candidate.skills ?? []} />
 
               </div>

               <div className="md:col-span-4 flex flex-col gap-4">
                  <div className="p-4 bg-[#111] border border-white/5 rounded-2xl">
                      <div className="flex items-center gap-2 mb-2 text-slate-400">
                          <Info size={14} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Graph Guide</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                          The <span className="text-slate-300">Grey Area</span> is the ideal Senior Role profile. The <span className="text-indigo-400">Indigo Area</span> is your current skill shape.
                      </p>
                  </div>
                  <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex-1">
                     <div className="flex items-center gap-2 mb-3 text-indigo-400">
                        <TrendingUp size={16} />
                        <span className="text-xs font-bold uppercase tracking-widest">Key Insight</span>
                     </div>
                     <p className="text-xs text-slate-300 leading-relaxed font-medium mb-3">
                        Your profile is heavily weighted towards <strong>Frontend Engineering</strong>.
                     </p>
                     <div className="flex gap-2 items-start p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/20">
                        <AlertCircle size={14} className="text-indigo-300 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-indigo-200 font-medium">
                           To reach Senior level, expand coverage in <strong>System Design</strong>.
                        </p>
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>

          {/* --- SIDE PANEL: SKILLS LIST --- */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="col-span-12 lg:col-span-4 h-full"
          >
            {/* Passing REAL candidate skills */}
            <SkillsList skills={candidate.skills ?? []} />

          </motion.div>

          {/* --- GAP ANALYSIS CARD --- */}
          <div className="col-span-12 md:col-span-4">
            <GapAnalysisCard missingSkill="System Design" impactScore={15} type="critical" />
          </div>

          {/* --- ROADMAP TIMELINE --- */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="col-span-12 md:col-span-8 bg-[#0A0A0A] p-8 rounded-3xl border border-white/10 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-bold text-white font-['Space_Grotesk']">Personalized Learning Path</h3>
               <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-white/5 px-2 py-1 rounded">AI Generated</span>
            </div>
            <div className="bg-[#0E0E0E] rounded-2xl p-6 border border-white/5">
               <RoadmapTimeline />
            </div>
          </motion.div>

          {/* --- FOOTER CARD --- */}
          <div className="col-span-12 bg-[#0A0A0A] p-8 rounded-3xl border border-white/10 shadow-2xl flex items-center justify-between group cursor-pointer hover:border-white/20 transition-all">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2 font-['Space_Grotesk']">Unlock Expert Network</h3>
              <p className="text-slate-500 text-sm max-w-md font-medium">
                Get peer-to-peer reviews from Senior Engineers at TechCorp, Google, and Amazon.
              </p>
            </div>
            <button className="w-14 h-14 bg-white text-black rounded-xl flex items-center justify-center hover:bg-slate-200 transition-all">
              <Users size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsGapPage;