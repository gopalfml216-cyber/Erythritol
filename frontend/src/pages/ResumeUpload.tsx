import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileDropzone } from '../components/resume/FileDropzone';
import { 
  CheckCircle2, AlertTriangle, Layout, ArrowRight, ChevronRight
} from 'lucide-react';

const ResumeUploadPage = () => {
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => setFilePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    // Applied 'font-['Plus_Jakarta_Sans']' for the UI base
    // Added 'bg-grid-pattern' for technical texture
    <div className="min-h-screen bg-[#050505] pt-28 font-['Plus_Jakarta_Sans'] text-white relative overflow-hidden selection:bg-indigo-500/30">
      
      {/* Engineering Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.4] -z-10" />
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-[#050505] to-transparent z-0 pointer-events-none" />

      <AnimatePresence mode="wait">
        {!filePreview ? (
          <motion.div 
            key="u" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="min-h-[calc(100vh-7rem)] flex items-center justify-center p-6 lg:p-12 relative z-10"
          >
            <div className="grid grid-cols-12 gap-16 max-w-[1600px] w-full items-center">
              
              {/* LEFT COLUMN */}
              <div className="col-span-12 lg:col-span-6 space-y-10">
                <div className="space-y-8">
                  <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-white/5 border border-white/10 text-indigo-300 rounded-full text-[11px] font-bold uppercase tracking-widest font-['Space_Grotesk']">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"/>
                    System Core v4.0
                  </div>
                  
                  {/* Distinctive Typography: Space Grotesk */}
                  <h1 className="text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9] text-white font-['Space_Grotesk']">
                    Is your resume <br/> 
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient">
                      engineered
                    </span> to win?
                  </h1>
                  
                  <p className="max-w-xl text-slate-400 text-lg leading-relaxed font-medium">
                    Stop guessing. Our parser runs 16 heuristic checks to benchmark your profile against the top 1% of candidates.
                  </p>
                </div>

                {/* Upload Box: Sharper, Darker, More Technical */}
                <div className="relative group max-w-lg">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl opacity-20 group-hover:opacity-40 transition duration-500 blur-sm"></div>
                  <div className="relative bg-[#0A0A0A] p-1 rounded-3xl border border-white/10 shadow-2xl">
                    <div className="bg-[#0A0A0A] rounded-[1.3rem] overflow-hidden">
                       <FileDropzone onFileSelect={handleFileSelect} />
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: HIGH FIDELITY DASHBOARD */}
              <div className="col-span-12 lg:col-span-6 relative hidden lg:block">
                <motion.div 
                  initial={{ x: 50, opacity: 0 }} 
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-1 shadow-2xl relative"
                >
                  {/* Inner Border Wrapper for that "Device" look */}
                  <div className="bg-[#0e0e0e] rounded-[1.4rem] border border-white/5 p-8 relative overflow-hidden h-[600px] flex flex-col">
                    
                    {/* Header */}
                    <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-6">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center border border-indigo-500/20">
                             <Layout size={20} className="text-indigo-400" />
                          </div>
                          <div>
                             <h3 className="font-['Space_Grotesk'] font-bold text-lg leading-none">Analysis_V2</h3>
                             <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-bold">Live Stream</p>
                          </div>
                       </div>
                       <div className="flex gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-500/50" />
                          <span className="w-2 h-2 rounded-full bg-yellow-500/50" />
                          <span className="w-2 h-2 rounded-full bg-green-500/50" />
                       </div>
                    </div>

                    <div className="grid grid-cols-12 gap-8 h-full">
                      {/* Left Sidebar */}
                      <div className="col-span-4 space-y-6 border-r border-white/5 pr-6">
                         <div className="text-center mb-8">
                            <div className="inline-block relative">
                               <svg className="w-32 h-32 transform -rotate-90">
                                  <circle cx="64" cy="64" r="56" stroke="#1F2937" strokeWidth="6" fill="transparent" />
                                  <circle cx="64" cy="64" r="56" stroke="#6366f1" strokeWidth="6" fill="transparent" strokeDasharray="351" strokeDashoffset="35" strokeLinecap="round" />
                               </svg>
                               <div className="absolute inset-0 flex flex-col items-center justify-center">
                                  <span className="text-4xl font-bold font-['Space_Grotesk']">92</span>
                                  <span className="text-xs text-slate-500 uppercase font-bold">Score</span>
                               </div>
                            </div>
                         </div>
                         
                         <div className="space-y-1">
                            {['Structure', 'Impact', 'Brevity', 'Keywords'].map((item, i) => (
                               <div key={item} className={`flex justify-between items-center p-3 rounded-lg ${i === 0 ? 'bg-white/5 border border-white/5' : 'opacity-40'}`}>
                                  <span className="text-xs font-bold">{item}</span>
                                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${i===0 ? 'bg-indigo-500 text-white' : 'bg-white/10'}`}>
                                     {i === 0 ? 'A+' : 'B'}
                                  </span>
                               </div>
                            ))}
                         </div>
                      </div>

                      {/* Main Feed */}
                      <div className="col-span-8 space-y-6">
                         <div className="bg-[#151515] p-6 rounded-2xl border border-white/5 relative group">
                            <div className="absolute top-0 right-0 p-4 opacity-50">
                               <ArrowRight size={16} className="text-slate-600 -rotate-45" />
                            </div>
                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Parsing Engine</h4>
                            
                            {/* Technical Progress Bar */}
                            <div className="mb-6">
                               <div className="flex justify-between text-[10px] font-bold mb-2">
                                  <span className="text-indigo-400">ATS COMPATIBILITY</span>
                                  <span>98.4%</span>
                               </div>
                               <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                  <div className="h-full w-[98%] bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                               </div>
                            </div>

                            <div className="space-y-3">
                               <div className="flex gap-3 items-start">
                                  <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                                  <div>
                                     <p className="text-sm font-medium text-slate-200">Contact info successfully mapped.</p>
                                     <p className="text-[10px] text-slate-500 mt-0.5">0.02s latency</p>
                                  </div>
                               </div>
                               <div className="flex gap-3 items-start">
                                  <AlertTriangle size={16} className="text-amber-500 mt-0.5 shrink-0" />
                                  <div>
                                     <p className="text-sm font-medium text-slate-200">Quantifiable metrics missing.</p>
                                     <p className="text-[10px] text-slate-500 mt-0.5">Section: Experience</p>
                                  </div>
                               </div>
                            </div>
                         </div>

                         {/* Code Snippet Aesthetic */}
                         <div className="bg-black/40 p-4 rounded-xl border border-white/5 font-mono text-[10px] text-slate-400 leading-relaxed">
                            <p><span className="text-purple-400">const</span> <span className="text-blue-400">candidate</span> = <span className="text-emerald-400">await</span> parse(resume);</p>
                            <p className="mt-1">Analyzing skills vector... <span className="text-emerald-500">Done</span></p>
                         </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* --- Map Career Link (Opens in New Tab) --- */}
                <Link to="/gap-analysis" target="_blank" rel="noopener noreferrer">
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute -bottom-10 left-10 right-10 bg-indigo-600 p-6 rounded-[2rem] shadow-2xl flex items-center justify-between cursor-pointer hover:bg-indigo-500 transition-colors group"
                  >
                    <div>
                      <h4 className="font-bold text-sm font-['Space_Grotesk']">Map Your Career.</h4>
                      <p className="text-indigo-200 text-[10px] font-bold">Instant personalized roadmap.</p>
                    </div>
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:translate-x-1 transition-transform">
                      <ChevronRight size={20} />
                    </div>
                  </motion.div>
                </Link>
              </div>

            </div>
          </motion.div>
        ) : (
          /* --- REPORT VIEW: TECHNICAL --- */
          <motion.div 
            key="r" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="flex h-[calc(100vh-7rem)] overflow-hidden"
          >
             <div className="w-[420px] bg-[#0A0A0A] border-r border-white/10 flex flex-col h-full z-10 p-8">
                <div className="mb-8">
                   <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-4 font-['Space_Grotesk']">Analysis Report</h3>
                   <div className="flex items-baseline gap-2">
                      <span className="text-7xl font-bold font-['Space_Grotesk'] text-indigo-400">92</span>
                      <span className="text-xl text-slate-600 font-medium">/100</span>
                   </div>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                   {['Content', 'Formatting', 'ATS Keywords', 'Impact'].map((cat, i) => (
                      <div key={cat} className="group p-4 bg-[#111] hover:bg-[#161616] rounded-xl border border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer">
                         <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-bold text-slate-300">{cat}</span>
                            <span className={`text-xs font-bold ${i===0 ? 'text-indigo-400' : 'text-slate-500'}`}>{i===0 ? '98%' : '84%'}</span>
                         </div>
                         <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${i===0 ? 'bg-indigo-500 w-[98%]' : 'bg-slate-600 w-[84%]'}`} />
                         </div>
                      </div>
                   ))}
                </div>

                <button 
                  onClick={() => setFilePreview(null)}
                  className="mt-6 w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                >
                   <ArrowRight size={18} className="rotate-180" /> Upload New File
                </button>
             </div>
             
             <div className="flex-1 bg-[#050505] p-12 flex justify-center items-center relative">
               <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
               <iframe src={filePreview} className="w-full max-w-[900px] h-full bg-white rounded-lg shadow-2xl border-none relative z-10" title="Resume Preview"/>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResumeUploadPage;