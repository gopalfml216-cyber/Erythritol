import axios from 'axios';
import type { ParsedResume } from '../types'; 

const API_BASE_URL = 'http://localhost:8000';

export const resumeApi = {
  /**
   * Upload and parse resume PDF
   */
  uploadResume: async (file: File): Promise<ParsedResume> => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/resume/parse`, 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      return response.data;
      
    } catch (error) {
      console.error("🔥 Upload API Error:", error);
      throw error;
    }
  },

  /**
   * Save corrected resume data to backend
   */
  saveResume: async (data: ParsedResume): Promise<{
    success: boolean;
    message: string;
    profile_id: string;
    data: ParsedResume;
  }> => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/resume/save`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log("✅ Save successful:", response.data);
      return response.data;
      
    } catch (error) {
      console.error("🔥 Save API Error:", error);
      throw error;
    }
  },

  /**
   * Get saved resume by profile ID
   */
  getResume: async (profileId: string): Promise<{
    success: boolean;
    profile_id: string;
    data: ParsedResume;
  }> => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/resume/${profileId}`
      );
      
      return response.data;
      
    } catch (error) {
      console.error("🔥 Get Resume API Error:", error);
      throw error;
    }
  },
};