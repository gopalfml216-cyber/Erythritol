// frontend/src/types/index.ts

export interface ConfidenceScores {
  name?: number;
  email?: number;
  phone?: number;
  skills?: number;
  education?: number;
  experience?: number;

  // allows backend to add more confidence fields safely
  [key: string]: number | undefined;
}

export interface Education {
  degree: string;
  field: string;
  institution: string;
  year: string;
  cgpa?: number;
}

export interface Experience {
  title: string;
  company: string;
  duration: string;
  description: string[];
}

/**
 * Single source of truth for resume data
 * Matches backend + frontend editing + parsing reality
 */
export interface ParsedResume {
  name?: string;
  email?: string;
  phone?: string;
  skills?: string[];
  education?: Education[];
  experience?: Experience[];
  projects?: string[];
  confidence_scores?: ConfidenceScores;
}
export interface JobPosting {
  id: string;
  title: string;
  company: string;
  location?: string;
  experienceLevel?: string;
  skills?: string[];
  salary?: string;
  description?: string;
  applyUrl?: string;
}
