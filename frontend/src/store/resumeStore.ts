import { create } from "zustand";

interface ResumeState {
  parsedResume: any | null;
  setParsedResume: (data: any) => void;
  clearResume: () => void;
}

export const useResumeStore = create<ResumeState>((set) => ({
  parsedResume: null,
  setParsedResume: (data) => set({ parsedResume: data }),
  clearResume: () => set({ parsedResume: null }),
}));