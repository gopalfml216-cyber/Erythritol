import { create } from 'zustand';

// --- TYPES (Must Match Backend Exactly!) ---

export interface Education {
  degree: string;
  field: string;          // ✅ Added (backend has this)
  institution: string;
  year?: string;          // ✅ Made optional (backend has Optional)
  cgpa?: number;          // ✅ Renamed from "score", changed to number
}

export interface Experience {
  title: string;          // ✅ Renamed from "role" to match backend
  company: string;
  duration: string;
  description: string[];
}

export interface ParsedResume {
  name: string;
  email: string;
  phone: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  projects: string[];     // ✅ Added (backend sends this)
  confidence_scores: {    // ✅ Renamed from "confidenceScore" to match backend
    [key: string]: number;
  };
}

// --- STORE STATE ---

interface UserState {
  // Data
  candidate: ParsedResume | null;
  profile: ParsedResume | null;     // ✅ Added as alias (some components might use this)
  
  // Upload state
  isUploading: boolean;
  uploadProgress: number;
  
  // Actions
  setCandidate: (data: ParsedResume | null) => void;
  setProfile: (data: ParsedResume | null) => void;  // ✅ Alias for setCandidate
  setUploading: (status: boolean) => void;
  setProgress: (progress: number) => void;
  clearProfile: () => void;
}

// --- THE STORE ---

export const useUserStore = create<UserState>((set) => ({
  // Initial state
  candidate: null,
  profile: null,
  isUploading: false,
  uploadProgress: 0,
  
  // Actions
  setCandidate: (data) => set({ candidate: data, profile: data }),
  setProfile: (data) => set({ candidate: data, profile: data }),
  setUploading: (status) => set({ isUploading: status }),
  setProgress: (progress) => set({ uploadProgress: progress }),
  clearProfile: () => set({ candidate: null, profile: null, uploadProgress: 0 }),
}));