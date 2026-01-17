import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/useUserStore'; // Check this path!
import { resumeApi } from '../../api/resumeApi';         // Check this path!

export const FileDropzone = () => {
  // 1. Hooks
  const { 
    setUploading, 
    setCandidate, 
    uploadProgress, 
    setProgress,
    isUploading 
  } = useUserStore();
  
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // 2. The REAL Logic
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB. Please upload a smaller file.');
      setTimeout(() => setError(null), 4000);
      return;
    }

    // Reset states
    setError(null);
    setUploading(true);
    setProgress(10);

    // FIX 1: Use 'any' to stop the NodeJS error
    let progressTimer: any = null;
    let currentFakeProgress = 10;

    try {
      console.log("📤 Sending file to Backend...");
      
      // FIX 2: Simple math instead of functional update
      progressTimer = setInterval(() => {
        currentFakeProgress += 10;
        if (currentFakeProgress > 90) currentFakeProgress = 90;
        setProgress(currentFakeProgress); 
      }, 500);

      // --- REAL BACKEND CALL ---
      const data = await resumeApi.uploadResume(file);
      
      // Validate response
      if (!data || !data.name) {
        throw new Error("Invalid response from backend");
      }

      // Cleanup timer
      if (progressTimer) clearInterval(progressTimer);
      
      // Final progress
      setProgress(100);
      console.log("✅ Backend Responded:", data);

      // Save to store
      setCandidate(data);
      
      // Short delay → show 100% → redirect
      setTimeout(() => {
        setUploading(false);
        navigate('/gap-analysis'); // Redirect to your new Skills Page!
      }, 600);

    } catch (err: any) {
      // Cleanup timer on error
      if (progressTimer) clearInterval(progressTimer);
      
      console.error("❌ Upload Failed:", err);

      let errorMsg = "Failed to parse resume. Please try again.";
      if (err.response?.data?.detail) {
        errorMsg = err.response.data.detail;
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      setError(errorMsg);
      setUploading(false);
      setProgress(0);
    }
  }, [setUploading, setProgress, setCandidate, navigate]);

  // 3. Dropzone Config
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    multiple: false,
    disabled: isUploading
  });

  // 4. UI
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Error Banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
          >
            <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">Upload Failed</p>
              <p className="text-xs text-red-600 mt-1">{error}</p>
            </div>
            <button 
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FIX 3: Changed outer tag from motion.div to regular div to fix onDrag conflict */}
      <div
        {...getRootProps()}
        className={`
          relative overflow-hidden rounded-2xl border-2 border-dashed p-10 transition-all cursor-pointer
          flex flex-col items-center justify-center min-h-[300px] bg-white
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
          ${isDragReject ? 'border-red-500 bg-red-50' : ''}
          ${isUploading ? 'pointer-events-none opacity-75' : ''}
          hover:border-blue-400 hover:scale-[1.01] duration-200
        `}
      >
        <input {...getInputProps()} />

        <AnimatePresence mode='wait'>
          {isUploading ? (
            /* UPLOADING STATE */
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
              <h3 className="text-lg font-semibold text-gray-800">Analyzing Resume...</h3>
              <p className="text-gray-500 text-sm mt-1">Extracting skills and experience</p>
              
              <div className="w-full max-w-xs mt-4 bg-gray-200 rounded-full h-2">
                <motion.div
                  className="h-full bg-blue-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          ) : (
            /* IDLE STATE */
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
                {isDragReject 
                  ? "Only PDF files are accepted" 
                  : "Drag and drop your PDF here, or click to browse. We'll analyze it instantly."
                }
              </p>

              <div className="flex gap-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                <span className="flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> PDF Only
                </span>
                <span className="flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> Max 5MB
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};