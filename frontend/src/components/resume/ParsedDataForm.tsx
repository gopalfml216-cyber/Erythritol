import React, { useState } from 'react';
import { useUserStore } from '../../store/useUserStore';
import { motion } from 'framer-motion';
import { Save, Plus, X, AlertTriangle } from 'lucide-react';

export const ParsedDataForm = () => {
  const { candidate, setCandidate } = useUserStore();
  const [activeSection, setActiveSection] = useState<'personal' | 'skills' | 'experience'>('personal');

  if (!candidate) return null;

  // Helper to update simple fields (Name, Email, etc.)
  const updateField = (field: keyof typeof candidate, value: any) => {
    setCandidate({ ...candidate, [field]: value });
  };

  // Helper to add a new skill
  const addSkill = () => {
    const newSkill = prompt("Enter new skill:");
    if (newSkill) {
      updateField('skills', [...candidate.skills, newSkill]);
    }
  };

  // Helper to remove a skill
  const removeSkill = (skillToRemove: string) => {
    updateField('skills', candidate.skills.filter(s => s !== skillToRemove));
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      
      {/* 1. Header with Confidence Score */}
      <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Review Your Profile</h2>
          <p className="text-slate-400 text-sm">We extracted this from your resume. Please correct any errors.</p>
        </div>
        
        {/* Visual Confidence Badge */}
        <div className="flex items-center gap-3 bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
          <div className="text-right">
            <p className="text-xs text-slate-400 uppercase font-semibold">Confidence Score</p>
            <p className={`text-xl font-bold ${candidate.confidenceScore > 80 ? 'text-green-400' : 'text-amber-400'}`}>
              {candidate.confidenceScore}%
            </p>
          </div>
          {candidate.confidenceScore < 80 && <AlertTriangle className="text-amber-400" />}
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex border-b border-gray-200">
        {['personal', 'skills', 'experience'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSection(tab as any)}
            className={`flex-1 py-4 text-sm font-medium uppercase tracking-wider transition-colors
              ${activeSection === tab ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50/50' : 'text-gray-500 hover:text-gray-700'}
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 3. Form Content Area */}
      <div className="p-8 min-h-[400px]">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* --- PERSONAL SECTION --- */}
          {activeSection === 'personal' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={candidate.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Email Address</label>
                <input
                  type="email"
                  value={candidate.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                <input
                  type="text"
                  value={candidate.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>
          )}

          {/* --- SKILLS SECTION --- */}
          {activeSection === 'skills' && (
            <div>
              <div className="flex flex-wrap gap-2 mb-6">
                {candidate.skills.map((skill) => (
                  <span key={skill} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 group">
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="text-blue-400 hover:text-red-600 transition-colors">
                      <X size={14} />
                    </button>
                  </span>
                ))}
                <button
                  onClick={addSkill}
                  className="border-2 border-dashed border-gray-300 text-gray-500 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 hover:border-blue-500 hover:text-blue-500 transition-colors"
                >
                  <Plus size={14} /> Add Skill
                </button>
              </div>
              <p className="text-sm text-gray-500 italic border-l-4 border-blue-200 pl-3">
                * Tip: Adding specific technologies (e.g., "FastAPI" instead of "Backend") improves your job match score significantly.
              </p>
            </div>
          )}

          {/* --- EXPERIENCE SECTION --- */}
          {activeSection === 'experience' && (
            <div className="space-y-6">
              {candidate.experience.map((exp, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:border-blue-300 transition-colors">
                  <div className="flex flex-col md:flex-row gap-4 mb-2">
                    <input
                      value={exp.role}
                      placeholder="Job Title"
                      className="font-bold bg-transparent border-b border-transparent focus:border-blue-500 outline-none text-lg flex-1"
                      onChange={(e) => {
                        const newExp = [...candidate.experience];
                        newExp[index].role = e.target.value;
                        updateField('experience', newExp);
                      }}
                    />
                    <input
                      value={exp.duration}
                      placeholder="Duration"
                      className="text-gray-500 text-sm bg-transparent border-b border-transparent focus:border-blue-500 outline-none md:text-right"
                      onChange={(e) => {
                        const newExp = [...candidate.experience];
                        newExp[index].duration = e.target.value;
                        updateField('experience', newExp);
                      }}
                    />
                  </div>
                  <input
                    value={exp.company}
                    placeholder="Company Name"
                    className="text-gray-600 w-full bg-transparent mb-2 outline-none italic"
                    onChange={(e) => {
                      const newExp = [...candidate.experience];
                      newExp[index].company = e.target.value;
                      updateField('experience', newExp);
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* 4. Footer Actions */}
      <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-4">
        <button 
          onClick={() => setCandidate(null)} // Reset to upload again
          className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button 
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-600/20"
          onClick={() => alert("Profile Saved! Redirecting to Job Board...")}
        >
          <Save size={18} />
          Confirm & Save
        </button>
      </div>
    </div>
  );
};