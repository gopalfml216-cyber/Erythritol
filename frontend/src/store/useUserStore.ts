import { create } from 'zustand';

// --- 1. WE DEFINE THE TYPES RIGHT HERE (No Imports needed!) ---
export interface Experience {
  role: string;
  company: string;
  duration: string;
  description: string[];
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
  score?: string;
}

export interface ParsedResume {
  name: string;
  email: string;
  phone: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  confidenceScore: number;
}

interface UserState {
  candidate: ParsedResume | null;
  isUploading: boolean;
  uploadProgress: number;
  
  setCandidate: (data: ParsedResume | null) => void;
  setUploading: (status: boolean) => void;
  setProgress: (progress: number) => void;
}

// --- 2. THE STORE ---
export const useUserStore = create<UserState>((set) => ({
  candidate: null,
  isUploading: false,
  uploadProgress: 0,

  setCandidate: (data) => set({ candidate: data }),
  setUploading: (status) => set({ isUploading: status }),
  setProgress: (progress) => set({ uploadProgress: progress }),
}));