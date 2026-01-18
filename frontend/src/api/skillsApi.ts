import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

/* ======================================================
   TYPES (MATCH BACKEND RESPONSE)
====================================================== */

export interface SkillGapAnalysis {
  matching_skills: string[];
  missing_skills: string[];
  skill_gap_percentage: number;
  readiness_score: number;
  estimated_learning_time_months: number;
  confidence_level: string;
}

export interface LearningResource {
  name: string;   // backend sends "name", not "title"
  type: string;
  url: string;
}

export interface LearningPhase {
  phase: number;
  duration_months: number;
  focus: string;
  skills_to_learn: string[];
  priority: string;
  reasoning: string;
  resources?: LearningResource[];
}

export interface SkillGapResponse {
  analysis: SkillGapAnalysis;
  learning_roadmap: LearningPhase[];
}

/* ======================================================
   API
====================================================== */

export const skillGapApi = {
  analyzeSkillGap: async (
    currentSkills: string[],
    targetSkills: string[]
  ): Promise<SkillGapResponse> => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/skills/analyze`,
        {
          current_skills: currentSkills,
          target_skills: targetSkills,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;

    } catch (error: any) {
      console.error('❌ Skill Gap API Error:', error);
      throw new Error(
        error.response?.data?.detail || 'Failed to analyze skill gap'
      );
    }
  },
};