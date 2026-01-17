
export interface Education {
  degree: string;
  field: string;
  institution: string;
  year?: string;
  cgpa?: number;
}

export interface Experience {
  title: string;
  company: string;
  duration: string;
  description: string[];
}


export interface ParsedResume {
  name: string;
  email: string;
  phone: string;
  skills: string[];
  education: Education[];
  experience: Experience[];
  projects: string[]; // <--- MATCHES PYTHON List[str]
  confidence_scores: Record<string, number>;
}


export interface JobPosting {
  job_id: string;
  title: string;
  company: string;
  location: string;
  salary_range: number[]; 
  required_skills: string[];
  experience_required: string;
  job_type: string;
  posted_date: string;
  description: string;
  match_score?: number;
}