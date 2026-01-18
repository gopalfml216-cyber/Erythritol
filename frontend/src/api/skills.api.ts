import axios from "axios";

const API = import.meta.env.VITE_API_URL;

// ✅ Backend-aligned version
export const analyzeSkillGap = async (
  currentSkills: string[],
  targetRoleId: string
) => {
  const res = await axios.post(`${API}/api/skills/analyze`, {
    current_skills: currentSkills,
    target_role_id: targetRoleId, // 🔥 MATCHES BACKEND
  });

  return res.data;
};