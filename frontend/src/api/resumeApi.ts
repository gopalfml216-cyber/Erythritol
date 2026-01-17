import axios from 'axios';
import type { ParsedResume } from '../types'; // Adjust path if needed

// 1. Define the Backend URL explicitly
// We force it to port 8000 to avoid any "localhost" confusion
const API_BASE_URL = 'http://localhost:8000';

export const resumeApi = {
  uploadResume: async (file: File): Promise<ParsedResume> => {
    
    // 2. Prepare the Form Data (Required for file uploads)
    const formData = new FormData();
    formData.append('file', file);

    try {
      // 3. The Critical Call
      // We manually construct the full URL to ensure NO mistakes.
      // It matches your Backend: /api/v1/resume/parse
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/resume/parse`, 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data', // 🚨 Crucial for files
          },
        }
      );
      
      return response.data;
      
    } catch (error) {
      console.error("🔥 API Error:", error);
      throw error;
    }
  },
};