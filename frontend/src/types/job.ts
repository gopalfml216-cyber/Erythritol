export interface JobPosting {
  job_id: string;
  title: string;
  company_name: string;
  company_logo?: string; // Added for the icon placeholders in the reference
  location: string;
  salary: string;
  // Expanded types to match the diverse filters in your reference image
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'On-site' | 'Hybrid';
  posted_date: string;
  description: string;
  skills_required: string[];
  // Added for the 'Match %' circle and 'Insights' sections in the reference
  match_score?: number; 
  category?: string;     // e.g., "Engineering", "Design"
  is_hot?: boolean;      // For the green 'Live' or 'Hot' badges
}

export interface JobFilters {
  search: string;
  type: string;
  location: string;
  category: string;      // Added to support the category filters on the left
}