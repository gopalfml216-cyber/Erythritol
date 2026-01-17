import axios from 'axios';
import { ENDPOINTS } from '../config/apiConfig';
import type { JobPosting } from '../types';

export const jobApi = {
  /**
   * Fetch all jobs (or search)
   */
  searchJobs: async (query: string = ""): Promise<JobPosting[]> => {
    // If your backend isn't ready for search yet, this returns all mock jobs
    const response = await axios.get<JobPosting[]>(ENDPOINTS.JOBS.SEARCH, {
      params: { q: query }
    });
    return response.data;
  },

  /**
   * Get jobs that match the user's uploaded resume (Smart Match)
   */
  getMatchedJobs: async (resumeText: string): Promise<JobPosting[]> => {
    const response = await axios.post<JobPosting[]>(ENDPOINTS.JOBS.MATCH, {
      resume_text: resumeText
    });
    return response.data;
  }
};