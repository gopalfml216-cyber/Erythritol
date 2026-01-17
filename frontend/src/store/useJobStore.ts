import { create } from 'zustand';
import { JobPosting } from '../types';

interface JobState {
  jobs: JobPosting[];
  savedJobs: string[];
  setJobs: (jobs: JobPosting[]) => void;
  toggleSaveJob: (jobId: string) => void;
}

export const useJobStore = create<JobState>((set) => ({
  jobs: [],
  savedJobs: [],
  setJobs: (jobs) => set({ jobs }),
  toggleSaveJob: (jobId) => 
    set((state) => ({
      savedJobs: state.savedJobs.includes(jobId)
        ? state.savedJobs.filter(id => id !== jobId)
        : [...state.savedJobs, jobId]
    })),
}));