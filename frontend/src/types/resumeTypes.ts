// frontend/src/types/resumeTypes.ts

// --- RESUME DEFINITIONS ---
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

// --- JOB DEFINITIONS ---
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  skills: string[];
  posted: string;
  matchScore?: number;
}