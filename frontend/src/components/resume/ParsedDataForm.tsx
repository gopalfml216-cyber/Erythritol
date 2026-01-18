import React, { useState, useMemo } from 'react';
import { useUserStore } from '../../store/useUserStore';
import { motion } from 'framer-motion';
import { Save, Plus, X, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ParsedResume, Experience } from '../../types';

type Section = 'personal' | 'skills' | 'experience';

export const ParsedDataForm: React.FC = () => {
  const { candidate, setCandidate } = useUserStore();
  const [activeSection, setActiveSection] = useState<Section>('personal');
  const navigate = useNavigate();

  if (!candidate) return null;

  /* ----------------------------------
     Derived / Safe Defaults
  ---------------------------------- */
  const skills = candidate.skills ?? [];
  const experience = candidate.experience ?? [];
  const confidenceScores = candidate.confidence_scores ?? {};

  /* ----------------------------------
     Overall Confidence Score
  ---------------------------------- */
  const overallScore = useMemo(() => {
  const values = Object.values(confidenceScores).filter(
    (v): v is number => typeof v === 'number'
  );

  if (values.length === 0) return 0;

  const total = values.reduce((acc, val) => acc + val, 0);
  return Math.round((total / values.length) * 100);
}, [confidenceScores]);

  /* ----------------------------------
     Helpers
  ---------------------------------- */
  const updateField = <K extends keyof ParsedResume>(
    field: K,
    value: ParsedResume[K]
  ) => {
    setCandidate({
      ...candidate,
      [field]: value,
    });
  };

  const addSkill = () => {
    const newSkill = prompt('Enter new skill:');
    if (!newSkill) return;
    updateField('skills', [...skills, newSkill]);
  };

  const removeSkill = (skillToRemove: string) => {
    updateField(
      'skills',
      skills.filter((s) => s !== skillToRemove)
    );
  };

  const updateExperience = (index: number, updated: Partial<Experience>) => {
    const updatedExp = [...experience];
    updatedExp[index] = { ...updatedExp[index], ...updated };
    updateField('experience', updatedExp);
  };

  const handleSave = () => {
    navigate('/gap-analysis');
  };

  /* ----------------------------------
     Render
  ---------------------------------- */
  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* HEADER */}
      <div className="bg-slate-900 text-white p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Review Your Profile</h2>
          <p className="text-slate-400 text-sm">
            We extracted this from your resume. Please correct any errors.
          </p>
        </div>

        <div
          className={`flex items-center gap-3 px-4 py-2 rounded-lg border ${
            overallScore > 75
              ? 'bg-green-900/30 border-green-500/50'
              : 'bg-amber-900/30 border-amber-500/50'
          }`}
        >
          <div className="text-right">
            <p className="text-xs text-slate-400 uppercase font-semibold">
              AI Confidence
            </p>
            <p
              className={`text-xl font-bold ${
                overallScore > 75 ? 'text-green-400' : 'text-amber-400'
              }`}
            >
              {overallScore}%
            </p>
          </div>
          {overallScore < 75 ? (
            <AlertTriangle className="text-amber-400" />
          ) : (
            <CheckCircle2 className="text-green-400" />
          )}
        </div>
      </div>

      {/* TABS */}
      <div className="flex border-b border-gray-200">
        {(['personal', 'skills', 'experience'] as Section[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSection(tab)}
            className={`flex-1 py-4 text-sm font-medium uppercase tracking-wider transition-colors
              ${
                activeSection === tab
                  ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50/50'
                  : 'text-gray-500 hover:text-gray-700'
              }
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="p-8 min-h-[400px]">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* PERSONAL */}
          {activeSection === 'personal' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                value={candidate.name ?? ''}
                onChange={(v) => updateField('name', v)}
              />
              <Input
                label="Email Address"
                value={candidate.email ?? ''}
                onChange={(v) => updateField('email', v)}
              />
              <Input
                label="Phone Number"
                value={candidate.phone ?? ''}
                onChange={(v) => updateField('phone', v)}
              />
            </div>
          )}

          {/* SKILLS */}
          {activeSection === 'skills' && (
            <div>
              <div className="flex flex-wrap gap-2 mb-6">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="text-blue-400 hover:text-red-600"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
                <button
                  onClick={addSkill}
                  className="border-2 border-dashed border-gray-300 text-gray-500 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 hover:border-blue-500 hover:text-blue-500"
                >
                  <Plus size={14} /> Add Skill
                </button>
              </div>
            </div>
          )}

          {/* EXPERIENCE */}
          {activeSection === 'experience' && (
            <div className="space-y-6">
              {experience.map((exp, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <input
                    value={exp.title}
                    placeholder="Job Title"
                    className="font-bold bg-transparent border-b border-transparent focus:border-blue-500 outline-none text-lg w-full"
                    onChange={(e) =>
                      updateExperience(index, { title: e.target.value })
                    }
                  />
                  <input
                    value={exp.company}
                    placeholder="Company Name"
                    className="text-gray-600 w-full bg-transparent mt-2 outline-none italic"
                    onChange={(e) =>
                      updateExperience(index, { company: e.target.value })
                    }
                  />
                  <input
                    value={exp.duration}
                    placeholder="Duration"
                    className="text-sm text-gray-500 bg-transparent mt-2 outline-none"
                    onChange={(e) =>
                      updateExperience(index, { duration: e.target.value })
                    }
                  />
                </div>
              ))}
              {experience.length === 0 && (
                <p className="text-center text-gray-400">
                  No experience detected. You can add it manually.
                </p>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* FOOTER */}
      <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-4">
        <button
          onClick={() => setCandidate(null)}
          className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Save size={18} />
          Confirm & Analyze
        </button>
      </div>
    </div>
  );
};

/* ----------------------------------
   Small Reusable Input
---------------------------------- */
const Input = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="space-y-2">
    <label className="text-sm font-semibold text-gray-700">{label}</label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
    />
  </div>
);
