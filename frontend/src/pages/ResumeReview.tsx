import  { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, Code,  GraduationCap, 
  FolderGit2, Edit2, Save, X, CheckCircle, AlertTriangle,
  ArrowLeft, FileText, ExternalLink, Loader2
} from 'lucide-react';
import { useUserStore } from '../store/useUserStore';

export const ResumeReview = () => {
  const navigate = useNavigate();
  const { candidate, setCandidate, resumeFile } = useUserStore();
  
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editedData, setEditedData] = useState(candidate);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (!candidate) {
        navigate('/');
    } else {
        setEditedData(candidate);
    }
  }, [candidate, navigate]);

  if (!candidate) return null;

  const handleEdit = (field: string) => {
    setEditingField(field);
    setEditedData(candidate);
  };

  const handleSave = (field: string) => {
    if (editedData) {
        setCandidate(editedData);
        setEditingField(null);
    }
  };

  const handleCancel = () => {
    setEditedData(candidate);
    setEditingField(null);
  };

  const handleFieldChange = (field: string, value: any) => {
    setEditedData(prev => prev ? { ...prev, [field]: value } : null);
  };

  // ✅ UPDATED SAVE FUNCTION WITH ANIMATION & REDIRECT
  const handleSaveAll = async () => {
    if (!editedData) return;
    setSaving(true);
    
    try {
      // 1. Commit final edits to the Global Store
      setCandidate(editedData);

      // 2. Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      setSaving(false);
      setSaveSuccess(true);

      // 3. Redirect after showing success animation
      setTimeout(() => {
        navigate('/gap-analysis'); 
      }, 1500);

    } catch (error) {
      console.error('Save failed:', error);
      setSaving(false);
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (score >= 0.5) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-red-400 bg-red-500/10 border-red-500/20';
  };

  const getConfidenceIcon = (score: number) => {
    if (score >= 0.8) return <CheckCircle size={12} />;
    return <AlertTriangle size={12} />;
  };

  // --- FIELD CARD COMPONENT ---
  const FieldCard = ({ 
    label, field, icon: Icon, value, confidence, multiline = false, editable = true
  }: any) => {
    const isEditing = editingField === field;
    const displayValue = Array.isArray(value) ? value.join(', ') : value;
    const confidenceScore = confidence || 0;

    return (
      <motion.div 
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative border rounded-xl p-5 transition-all duration-200 group ${
            isEditing 
            ? 'bg-[#151515] border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.1)] ring-1 ring-indigo-500/50 z-10' 
            : 'bg-[#111] border-white/10 hover:border-white/20 hover:bg-[#161616]'
        }`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${
                isEditing ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400' : 'bg-white/5 border-white/10 text-slate-400 group-hover:text-indigo-400 group-hover:border-indigo-500/30'
            }`}>
              <Icon size={16} />
            </div>
            <div>
              <h3 className="font-bold text-xs font-['Space_Grotesk'] text-slate-400 uppercase tracking-wider">{label}</h3>
              {!isEditing && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getConfidenceColor(confidenceScore)} flex items-center gap-1`}>
                      {getConfidenceIcon(confidenceScore)}
                      {Math.round(confidenceScore * 100)}%
                    </span>
                  </div>
              )}
            </div>
          </div>
          
          {editable && !isEditing && (
            <button
              onClick={() => handleEdit(field)}
              className="p-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg transition-all"
              title="Edit Field"
            >
              <Edit2 size={14} />
            </button>
          )}
          
          {isEditing && (
            <div className="flex gap-2">
              <button
                onClick={() => handleSave(field)}
                className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded-lg transition-colors"
              >
                <Save size={14} />
              </button>
              <button
                onClick={handleCancel}
                className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          multiline ? (
            <textarea
              value={displayValue}
              onChange={(e) => {
                const val = field === 'skills' ? e.target.value.split(',').map(s => s.trim()) : e.target.value;
                handleFieldChange(field, val);
              }}
              className="w-full bg-[#050505] border border-white/20 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 resize-none font-mono leading-relaxed"
              rows={5}
              autoFocus
            />
          ) : (
            <input
              type="text"
              value={displayValue}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              className="w-full bg-[#050505] border border-white/20 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 font-medium"
              autoFocus
            />
          )
        ) : (
          <div className="text-white text-[15px] font-medium leading-relaxed break-words pl-11 -mt-2">
            {displayValue || <span className="text-slate-600 italic text-sm">Not detected</span>}
          </div>
        )}
      </motion.div>
    );
  };

  const EducationCard = ({ edu, index }: any) => (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-[#111] border border-white/10 rounded-xl p-5 hover:border-indigo-500/30 transition-all group"
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-bold text-base text-white font-['Space_Grotesk']">{edu.degree || "Degree"}</h4>
          <p className="text-sm text-indigo-300 mt-0.5 font-medium">{edu.institution || "Institution"}</p>
        </div>
        {edu.cgpa && (
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 whitespace-nowrap">
            {edu.cgpa} CGPA
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-y-1 gap-x-3 text-xs text-slate-500 mt-2">
        <span className="flex items-center gap-1"><GraduationCap size={12}/> {edu.field || "Major"}</span>
        <span className="text-slate-700">•</span>
        <span>{edu.year || "Year"}</span>
      </div>
    </motion.div>
  );

  const ExperienceCard = ({ exp, index }: any) => (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-[#111] border border-white/10 rounded-xl p-5 hover:border-indigo-500/30 transition-all group"
    >
      <div className="mb-3">
        <div className="flex justify-between items-start">
            <h4 className="font-bold text-base text-white font-['Space_Grotesk']">{exp.role || exp.title || "Role"}</h4>
            <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/5 whitespace-nowrap">{exp.duration || "Duration"}</span>
        </div>
        <p className="text-sm text-indigo-400 font-bold mt-0.5 flex items-center gap-1">
            {exp.company || "Company"} <ExternalLink size={10} className="opacity-50"/>
        </p>
      </div>
      {exp.description && (
        <ul className="space-y-2 mt-3 bg-[#080808] p-3 rounded-lg border border-white/5">
          {Array.isArray(exp.description) ? exp.description.map((desc: string, i: number) => (
            <li key={i} className="text-sm text-slate-300 flex gap-2 items-start leading-relaxed">
              <span className="text-indigo-500 mt-1.5 w-1 h-1 rounded-full bg-indigo-500 shrink-0"></span>
              <span>{desc}</span>
            </li>
          )) : (
            <li className="text-sm text-slate-300">{exp.description}</li>
          )}
        </ul>
      )}
    </motion.div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="flex h-[calc(100vh-6rem)] mt-24 overflow-hidden bg-[#000] relative"
    >
      
      {/* SUCCESS OVERLAY (Added this section) */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-[#111] border border-white/10 rounded-3xl p-8 flex flex-col items-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={40} className="text-emerald-500 animate-bounce" />
              </div>
              <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-white">Saved Successfully!</h2>
              <p className="text-slate-400 mt-2 text-sm">Redirecting to Analysis...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT SIDEBAR - Parsed Data */}
      <div className="w-[500px] xl:w-[550px] bg-[#050505] border-r border-white/10 flex flex-col h-full shrink-0 shadow-2xl relative z-20">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 bg-[#050505]/95 backdrop-blur-md z-10">
          <button
            onClick={() => navigate('/')}
            className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4 text-xs font-bold uppercase tracking-wider"
          >
            <div className="p-1 rounded bg-white/5 group-hover:bg-white/10 transition-colors"><ArrowLeft size={12} /></div> 
            Back to Upload
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold font-['Space_Grotesk'] text-white">Parsed Data</h2>
              <p className="text-xs text-indigo-400 font-medium mt-1 flex items-center gap-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"/> 
                 AI Extraction Complete
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 bg-[#080808]">
          
          {/* Basic Info Group */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1 border-l-2 border-indigo-500 pl-3">Contact Details</h3>
            <div className="space-y-3">
                <FieldCard label="Full Name" field="name" icon={User} value={editedData?.name} confidence={candidate.confidence_scores?.name} />
                <FieldCard label="Email" field="email" icon={Mail} value={editedData?.email} confidence={candidate.confidence_scores?.email} />
                <FieldCard label="Phone" field="phone" icon={Phone} value={editedData?.phone} confidence={candidate.confidence_scores?.phone} />
            </div>
          </div>

          {/* Skills Group */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1 border-l-2 border-purple-500 pl-3">Technical Skills</h3>
            <FieldCard label="Detected Skills" field="skills" icon={Code} value={editedData?.skills} confidence={candidate.confidence_scores?.skills} multiline />
            
            {/* Quick Chips Display */}
            <div className="flex flex-wrap gap-2 pt-1 pl-1">
              {candidate.skills?.slice(0, 20).map((skill: string) => (
                <span key={skill} className="px-3 py-1 bg-[#1A1A1A] border border-white/5 hover:border-white/20 rounded-full text-[11px] font-bold text-slate-300 transition-colors cursor-default">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Education Group */}
          {candidate.education?.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1 border-l-2 border-emerald-500 pl-3">Education</h3>
              {candidate.education.map((edu: any, i: number) => (
                <EducationCard key={i} edu={edu} index={i} />
              ))}
            </div>
          )}

          {/* Experience Group */}
          {candidate.experience?.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1 border-l-2 border-amber-500 pl-3">Experience</h3>
              {candidate.experience.map((exp: any, i: number) => (
                <ExperienceCard key={i} exp={exp} index={i} />
              ))}
            </div>
          )}

          {/* Projects Group */}
          {candidate.projects?.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1 border-l-2 border-cyan-500 pl-3">Projects</h3>
              <div className="grid gap-3">
                {candidate.projects.map((project: any, i: number) => (
                  <div key={i} className="bg-[#111] border border-white/10 hover:border-white/20 rounded-xl p-4 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                        <FolderGit2 size={14} className="text-indigo-400"/>
                        <span className="text-sm font-bold text-white font-mono">Project {i+1}</span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                        {typeof project === 'string' ? project : project.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Floating Save Button Area */}
          <div className="sticky bottom-0 -mx-6 -mb-6 p-6 bg-gradient-to-t from-[#050505] via-[#050505] to-transparent pt-12">
            <button
              onClick={handleSaveAll}
              disabled={saving}
              className={`w-full py-4 font-bold rounded-xl transition-all shadow-xl flex items-center justify-center gap-3 text-sm hover:scale-[1.02] active:scale-[0.98] ${
                  saveSuccess 
                  ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
              }`}
            >
              {saving ? (
                <><Loader2 className="animate-spin" size={18} /> Saving Changes...</>
              ) : saveSuccess ? (
                <><CheckCircle size={18} /> Saved Successfully!</>
              ) : (
                <><Save size={18} /> Confirm & Save Changes</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - PDF Preview */}
      <div className="flex-1 bg-[#020202] relative flex flex-col min-w-0">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
        
        {/* Toolbar */}
        <div className="h-16 border-b border-white/5 flex items-center justify-end px-8 gap-4 bg-[#080808]">
            <span className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">
                <FileText size={12}/> Original Resume Source
            </span>
        </div>

        {/* PDF Container */}
        <div className="flex-1 p-6 lg:p-10 overflow-hidden flex justify-center bg-[#050505]">
            {resumeFile ? (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-[1000px] h-full bg-[#151515] rounded-xl border border-white/10 shadow-2xl overflow-hidden relative ring-1 ring-white/5"
            >
                <iframe 
                    src={resumeFile} 
                    className="w-full h-full object-contain" 
                    title="Resume Preview"
                />
            </motion.div>
            ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-4">
                <div className="p-4 rounded-full bg-white/5">
                    <FileText size={48} className="opacity-20" />
                </div>
                <div className="text-center">
                    <p className="text-sm font-bold text-slate-400">No Preview Available</p>
                    <p className="text-xs text-slate-600 mt-1">Please re-upload your resume to view it here.</p>
                </div>
            </div>
            )}
        </div>
      </div>
    </motion.div>
  );
};

export default ResumeReview;