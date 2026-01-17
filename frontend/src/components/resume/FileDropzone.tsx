import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '../../store/useUserStore';

export const FileDropzone = () => {
  // 1. Hook into our Global Store
  const { setUploading, setProgress, setCandidate, isUploading, uploadProgress } = useUserStore();

  // 2. The Logic: What happens when a file is dropped?
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Start the "Fake" Upload Process (Simulating API Latency)
    setUploading(true);
    setProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5; // Random increment for realism
      if (progress > 100) {
        progress = 100;
        clearInterval(interval);
        
        // STOP! Here is where we will eventually call the Python Backend.
        // For now, we simulate a successful parse.
        setUploading(false);
        setCandidate({
          name: "Gopal Agarwal", // Mock Data
          email: "gopal@example.com",
          phone: "+91 98765 43210",
          skills: ["React", "FastAPI", "Tailwind", "Python"],
          experience: [
            { role: "Frontend Developer", company: "Tech Corp", duration: "2024", description: ["Built UI"] }
          ],
          education: [],
          confidenceScore: 92
        });
      }
      setProgress(progress);
    }, 300); // Updates every 300ms

  }, [setUploading, setProgress, setCandidate]);

  // 3. Configure the Dropzone hooks
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] }, // strict accept
    maxFiles: 1,
    multiple: false,
    disabled: isUploading // Prevent dropping while uploading
  });

  // 4. The High-Quality UI
  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        {...getRootProps()}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={!isUploading ? { scale: 1.01, borderColor: '#3b82f6' } : {}}
        className={`
          relative overflow-hidden rounded-2xl border-2 border-dashed p-10 transition-all cursor-pointer
          flex flex-col items-center justify-center min-h-[300px] bg-white
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
          ${isDragReject ? 'border-red-500 bg-red-50' : ''}
        `}
      >
        <input {...getInputProps()} />

        <AnimatePresence mode='wait'>
          {isUploading ? (
            /* STATE A: UPLOADING */
            <motion.div
              key="uploading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col items-center"
            >
              <div className="relative w-20 h-20 mb-6">
                <svg className="animate-spin w-full h-full text-blue-200" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-bold text-blue-600">
                  {uploadProgress}%
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Parsing Resume...</h3>
              <p className="text-gray-500 text-sm mt-1">Extracting skills and experience</p>
            </motion.div>
          ) : (
            /* STATE B: IDLE / DRAG */
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center"
            >
              <div className={`p-5 rounded-full mb-6 ${isDragActive ? 'bg-blue-100' : 'bg-gray-50'}`}>
                {isDragReject ? (
                  <AlertCircle className="w-10 h-10 text-red-500" />
                ) : (
                  <UploadCloud className={`w-10 h-10 ${isDragActive ? 'text-blue-600' : 'text-gray-400'}`} />
                )}
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {isDragActive ? "Drop it like it's hot!" : "Upload your Resume"}
              </h3>
              
              <p className="text-gray-500 max-w-sm mb-6">
                Drag and drop your PDF here, or click to browse. We'll analyze it instantly.
              </p>

              <div className="flex gap-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                <span className="flex items-center"><CheckCircle2 className="w-3 h-3 mr-1" /> PDF Only</span>
                <span className="flex items-center"><CheckCircle2 className="w-3 h-3 mr-1" /> Max 5MB</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};