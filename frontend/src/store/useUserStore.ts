import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Candidate {
  name: string;
  email: string;
  phone: string;
  skills: string[];
  experience: any[]; 
  education: any[];
  projects: string[];
  confidence_scores: {
    skills: number;
    email: number;
    phone: number;
  };
}

interface UserState {
  // --- Data ---
  candidate: Candidate | null;
  // ✅ NEW: Field to store the file URL
  resumeFile: string | null; 
  
  setCandidate: (candidate: Candidate | null) => void;
  // ✅ NEW: Action to set the file URL
  setResumeFile: (url: string | null) => void;
  clearCandidate: () => void;

  // --- UI State ---
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
  setUploading: (status: boolean) => void;
  setUploadProgress: (progress: number) => void;
  setProgress: (progress: number) => void;
  setError: (error: string | null) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      candidate: null,
      resumeFile: null, // Initial state

      isUploading: false,
      uploadProgress: 0,
      error: null,

      setCandidate: (data) => set({ candidate: data }),
      setResumeFile: (url) => set({ resumeFile: url }),
      clearCandidate: () => set({ candidate: null, resumeFile: null }),

      setUploading: (status) => set({ isUploading: status }),
      setUploadProgress: (progress) => set({ uploadProgress: progress }),
      setProgress: (progress) => set({ uploadProgress: progress }),
      setError: (err) => set({ error: err }),
    }),
    {
      name: 'wevolve-user-storage',
      storage: createJSONStorage(() => localStorage),
      // We only persist candidate data. Blob URLs (resumeFile) don't work after refresh, 
      // so we don't strictly need to persist it, but it doesn't hurt.
      partialize: (state) => ({ candidate: state.candidate }), 
    }
  )
);