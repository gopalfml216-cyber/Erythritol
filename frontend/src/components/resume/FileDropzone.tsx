import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Zap, AlertCircle, Cloud } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '../../store/useUserStore';
import { resumeApi } from '../../api/resumeApi';

// Define the Props to accept the preview callback
interface FileDropzoneProps {
  onFileSelect?: (file: File) => void;
}

export const FileDropzone = ({ onFileSelect }: FileDropzoneProps) => {
  const { setUploading, setCandidate, uploadProgress, setProgress, isUploading } = useUserStore();
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Trigger the preview on the main page immediately
    if (onFileSelect) {
      onFileSelect(file);
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB. Please upload a smaller file.');
      setTimeout(() => setError(null), 4000);
      return;
    }

    setError(null);
    setUploading(true);
    setProgress(10);

    let progressTimer: any = null;
    let currentFakeProgress = 10;

    try {
      progressTimer = setInterval(() => {
        currentFakeProgress += 10;
        if (currentFakeProgress > 90) currentFakeProgress = 90;
        setProgress(currentFakeProgress); 
      }, 500);

      const data = await resumeApi.uploadResume(file);
      
      if (!data || !data.name) throw new Error("Invalid response from backend");

      if (progressTimer) clearInterval(progressTimer);
      setProgress(100);

      // Store the parsed data in Zustand
      setCandidate(data);
      
      setTimeout(() => {
        setUploading(false);
        // We stay on the same page now to show the Side-by-Side preview
      }, 800);

    } catch (err: any) {
      if (progressTimer) clearInterval(progressTimer);
      setError(err.response?.data?.detail || err.message || "Upload Failed");
      setUploading(false);
      setProgress(0);
    }
  }, [setUploading, setProgress, setCandidate, onFileSelect]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    multiple: false,
    disabled: isUploading
  });

  return (
    <div className="w-full">
      {/* Error Banner - Compact for Bento Grid */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 p-3 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3"
          >
            <AlertCircle size={16} className="text-red-500" />
            <p className="text-[10px] text-red-600 font-bold uppercase tracking-tight">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        {...getRootProps()}
        className={`
          relative overflow-hidden rounded-[2.5rem] border-2 border-dashed transition-all duration-500 cursor-pointer
          flex flex-col items-center justify-center min-h-[300px]
          ${isDragActive ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-200 bg-white'}
          ${isUploading ? 'pointer-events-none' : 'hover:border-indigo-400'}
        `}
      >
        <input {...getInputProps()} />

        <AnimatePresence mode='wait'>
          {isUploading ? (
            /* CIRCULAR PROGRESS STATE */
            <motion.div
              key="uploading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center"
            >
              <div className="relative w-20 h-20 mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-indigo-50" />
                  <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="4" fill="transparent" 
                    strokeDasharray={226.2} strokeDashoffset={226.2 - (226.2 * uploadProgress) / 100}
                    className="text-indigo-600 transition-all duration-500" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-black text-sm text-slate-800">
                  {uploadProgress}%
                </div>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Neural Parsing...</p>
            </motion.div>
          ) : (
            /* IDLE STATE */
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center text-center px-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center mb-6 shadow-lg shadow-slate-200">
                <Cloud size={28} fill="currentColor" />
              </div>
              
              <h3 className="text-xl font-black text-slate-800 mb-2 tracking-tight">
                {isDragActive ? "Drop File" : "Upload Resume"}
              </h3>
              
              <p className="text-slate-400 font-medium text-xs max-w-[200px] mb-6 leading-relaxed">
                Drag and drop your PDF here to build your profile instantly.
              </p>

              <div className="flex gap-4 text-[9px] font-black text-indigo-600 uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><Zap size={12} fill="currentColor" /> AI Powered</span>
                <span className="text-slate-300">|</span>
                <span>Secure</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};