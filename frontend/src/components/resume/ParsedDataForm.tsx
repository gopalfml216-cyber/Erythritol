import React, { useMemo } from 'react';
import { useUserStore } from '../../store/useUserStore';
import { motion } from 'framer-motion';
import { Save, Plus, X, Target, Briefcase, User, GraduationCap, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ParsedDataForm = () => {
  const { candidate, setCandidate } = useUserStore();
  const navigate = useNavigate();

  const overallScore = useMemo(() => {
    if (!candidate?.confidence_scores) return 0;
    const scores = Object.values(candidate.confidence_scores);
    if (scores.length === 0) return 0;
    const total = scores.reduce((acc, curr) => acc + (typeof curr === 'number' ? curr : 0), 0);
    return Math.round((total / scores.length) * 100);
  }, [candidate?.confidence_scores]);

  if (!candidate) return null;

  const updateField = (field: keyof typeof candidate, value: any) => {
    setCandidate({ ...candidate, [field]: value });
  };

  const removeSkill = (skillToRemove: string) => {
    updateField('skills', candidate.skills.filter(s => s !== skillToRemove));
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* --- TOP HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Review Your AI Profile</h1>
          <p className="text-slate-500 font-bold">We've extracted these details. Fine-tune them to improve your match score.</p>
        </div>
        <div className="bg-white p-4 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-4">
           <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Profile Health</p>
              <p className="text-2xl font-black text-blue-600">{overallScore}%</p>
           </div>
           <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
              <CheckCircle2 size={24} />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* --- LEFT: Personal & Skills --- */}
        <div className="col-span-12 lg:col-span-5 space-y-8">
          {/* Personal Info Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-slate-900 text-white rounded-2xl"><User size={20} /></div>
              <h3 className="text-xl font-black text-slate-800">Identity</h3>
            </div>
            <div className="space-y-4">
              {['name', 'email', 'phone'].map((field) => (
                <div key={field} className="group">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-1 block tracking-widest">{field}</label>
                  <input
                    type="text"
                    value={(candidate as any)[field] || ''}
                    onChange={(e) => updateField(field as any, e.target.value)}
                    className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl transition-all outline-none font-bold text-slate-700"
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Skills Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-600 text-white rounded-2xl"><Target size={20} /></div>
                <h3 className="text-xl font-black text-slate-800">Skillset</h3>
              </div>
              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Plus size={20} /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill) => (
                <span key={skill} className="pl-4 pr-2 py-2 bg-slate-900 text-white rounded-xl text-[11px] font-black uppercase flex items-center gap-2 group transition-all hover:bg-blue-600">
                  {skill}
                  <button onClick={() => removeSkill(skill)} className="p-1 hover:bg-white/20 rounded-md"><X size={12} /></button>
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* --- RIGHT: Experience & Education --- */}
        <div className="col-span-12 lg:col-span-7 space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-indigo-600 text-white rounded-2xl"><Briefcase size={20} /></div>
              <h3 className="text-xl font-black text-slate-800">Experience</h3>
            </div>
            <div className="space-y-6">
              {candidate.experience.map((exp, index) => (
                <div key={index} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-blue-200 transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <input
                      value={exp.title}
                      className="text-lg font-black text-slate-800 bg-transparent outline-none w-full"
                      onChange={(e) => {
                        const newExp = [...candidate.experience];
                        newExp[index].title = e.target.value;
                        updateField('experience', newExp);
                      }}
                    />
                    <span className="text-[10px] font-black text-slate-400 uppercase whitespace-nowrap">{exp.duration}</span>
                  </div>
                  <input
                    value={exp.company}
                    className="text-sm font-bold text-blue-600 bg-transparent outline-none w-full mb-4"
                    onChange={(e) => {
                      const newExp = [...candidate.experience];
                      newExp[index].company = e.target.value;
                      updateField('experience', newExp);
                    }}
                  />
                  <div className="space-y-1">
                    {exp.description.map((desc, i) => (
                      <p key={i} className="text-xs text-slate-500 font-medium leading-relaxed">• {desc}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* --- FLOATING ACTION BAR --- */}
      <motion.div 
        initial={{ y: 100 }} animate={{ y: 0 }}
        className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-xl p-4 rounded-[2rem] border border-white/10 shadow-2xl flex items-center gap-8 px-10"
      >
        <div className="hidden md:block">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</p>
           <p className="text-sm font-bold text-white">Verification Mode</p>
        </div>
        <div className="h-8 w-[1px] bg-white/10 hidden md:block" />
        <div className="flex gap-4">
          <button onClick={() => setCandidate(null)} className="px-6 py-3 text-white font-black text-sm hover:text-red-400 transition-all">Discard</button>
          <button 
            onClick={() => navigate('/gap-analysis')}
            className="px-8 py-3 bg-blue-600 text-white font-black text-sm rounded-xl flex items-center gap-2 hover:bg-white hover:text-blue-600 transition-all shadow-xl shadow-blue-500/20"
          >
            <Save size={18} /> Confirm Profile
          </button>
        </div>
      </motion.div>
    </div>
  );
};