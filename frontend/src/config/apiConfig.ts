// frontend/src/config/apiConfig.ts

// 1. Point to your Python Backend
export const API_BASE_URL = "http://localhost:8000";

// 2. Define your API Routes
export const ENDPOINTS = {
  RESUME: {
    UPLOAD: `${API_BASE_URL}/api/v1/resume/parse`,
  },
  JOBS: {
    SEARCH: `${API_BASE_URL}/api/v1/jobs/search`, // We will build this next
    MATCH: `${API_BASE_URL}/api/v1/jobs/match`,
  }
};