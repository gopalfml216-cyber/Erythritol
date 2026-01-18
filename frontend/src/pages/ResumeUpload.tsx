import  { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import { FileDropzone } from '../components/resume/FileDropzone';
import { Loader2, Zap } from 'lucide-react';

// ✅ IMPORT YOUR IMAGE
import dashboardPreview from '../assets/WhatsApp Image 2026-01-18 at 1.36.22 AM.jpeg';

const ResumeUpload = () => {
  const navigate = useNavigate();
  
  // ✅ Get setCandidate AND setResumeFile (if added to store)
  // If setResumeFile is missing in your store, this line might error. 
  // If so, remove `setResumeFile` and use the fallback line inside handleFileSelect.
  const { setCandidate, setResumeFile } = useUserStore(); 
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    setError(null);

    // 1. Create a local preview URL for the Review Page
    const objectUrl = URL.createObjectURL(file);
    
    // ✅ SAVE FILE TO STORE (Try both methods to be safe)
    if (setResumeFile) {
        setResumeFile(objectUrl);
    } else {
        // Fallback if you haven't updated the store interface yet
        // @ts-ignore
        useUserStore.setState({ resumeFile: objectUrl });
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const url = 'http://127.0.0.1:8000/api/resume/parse';
      console.log(`Attempting fetch to ${url}`);

      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      setCandidate({
        name: data.name || "Candidate",
        email: data.email || "No Email",
        phone: data.phone || "No Phone",
        skills: data.skills || [],
        experience: data.experience || [],
        education: data.education || [],
        projects: data.projects || [],
        confidence_scores: data.confidence_scores || { skills: 0.9, email: 1, phone: 1 }
      });

      navigate('/resume-review');
      
    } catch (err: any) {
      console.error(err);
      let errorMessage = "Connection Failed.";
      if (err.message.includes("404")) errorMessage = "404 Error: Backend route not found.";
      else if (err.message === "Failed to fetch") errorMessage = "Backend not running on port 8000.";
      else errorMessage = err.message || "Unknown Error";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dots-dark pt-28 font-['Plus_Jakarta_Sans'] text-white relative overflow-hidden">
      {/* Top Gradient Fade */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-[#050505] to-transparent z-0 pointer-events-none" />

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505]/95 backdrop-blur-md"
          >
            <Loader2 className="w-16 h-16 text-indigo-500 animate-spin mb-4" />
            <h2 className="text-2xl font-bold font-['Space_Grotesk']">Analyzing Resume...</h2>
          </motion.div>
        ) : (
          <motion.div 
            key="upload" 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
            className="min-h-[calc(100vh-7rem)] flex items-center justify-center p-6 lg:p-12 relative z-10"
          >
            <div className="grid grid-cols-12 gap-12 lg:gap-16 max-w-[1600px] w-full items-center">
              
              {/* LEFT COLUMN: Upload Section */}
              <div className="col-span-12 lg:col-span-5 space-y-10">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-full text-[10px] font-bold uppercase tracking-widest">
                     <Zap size={12} className="fill-current" /> AI Powered V4.0
                  </div>
                  <h1 className="text-6xl lg:text-7xl font-bold tracking-tight text-white font-['Space_Grotesk'] leading-[1.1]">
                    Resume <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Intelligence</span>
                  </h1>
                  <p className="text-slate-400 text-lg leading-relaxed">
                    Don't let an ATS reject your hard work. Get a detailed breakdown of your parsing score, keyword gaps, and competitive benchmarks instantly.
                  </p>
                </div>

                <div className="relative bg-[#0A0A0A] p-1.5 rounded-3xl border border-white/10 shadow-2xl transition-transform hover:scale-[1.01] duration-500">
                    <div className="bg-[#0A0A0A] rounded-[1.3rem] overflow-hidden">
                       <FileDropzone onFileSelect={handleFileSelect} />
                    </div>
                </div>
                
                {error && (
                   <div className="p-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl font-mono text-xs flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      {error}
                   </div>
                )}
              </div>
              
              {/* RIGHT COLUMN: Enhanced Image Display */}
              <div className="col-span-12 lg:col-span-7 hidden lg:flex items-center justify-center relative">
                 
                 {/* 1. Background Glow Blob to make it pop */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />

                 {/* 2. Floating Card Container */}
                 <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative z-10 w-full"
                 >
                     {/* Glass Frame */}
                     <div className="relative p-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-2xl">
                         
                         {/* The Image Itself - Adjusted for maximum visibility */}
                         <div className="relative rounded-xl overflow-hidden shadow-lg border border-white/5 bg-[#0e0e0e]">
                            <img 
                                src={dashboardPreview}
                                alt="Dashboard Analysis Preview"
                                className="w-full h-auto object-cover opacity-95 hover:opacity-100 transition-opacity duration-500"
                            />
                            {/* Shine overlay */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
                         </div>

                         {/* Decorative Element: Floating Badge */}
                         <div className="absolute -bottom-5 -right-5 bg-[#111] border border-white/10 p-4 rounded-xl shadow-xl flex items-center gap-4 animate-bounce-slow z-20">
                             <div className="relative">
                                <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                                <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75" />
                             </div>
                             <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</p>
                                <p className="text-xs font-bold text-white">System Online</p>
                             </div>
                         </div>
                     </div>
                 </motion.div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResumeUpload;