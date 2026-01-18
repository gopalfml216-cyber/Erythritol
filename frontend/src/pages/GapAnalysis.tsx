import { useResumeStore } from "../store/resumeStore";
import { analyzeSkillGap } from "../api/skills.api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function GapAnalysis() {
  const parsedResume = useResumeStore((s) => s.parsedResume);
  const navigate = useNavigate();

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Guard: resume must exist
  useEffect(() => {
    if (!parsedResume) navigate("/upload-resume");
  }, [parsedResume]);

  if (!parsedResume) return null;

  // ✅ TEMP: hardcoded role ID (from mock_jobs.json)
  const TARGET_ROLE_ID = "J001";

  const analyze = async () => {
    setLoading(true);
    try {
      const data = await analyzeSkillGap(
        parsedResume.skills,
        TARGET_ROLE_ID
      );
      setResult(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Gap Analysis</h1>

      <h3>Skills from Resume</h3>
      <ul>
        {parsedResume.skills.map((s: string) => (
          <li key={s}>{s}</li>
        ))}
      </ul>

      <button onClick={analyze} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Gap"}
      </button>

      {result && (
        <>
          <h2>Readiness: {result.analysis.readiness_score}%</h2>
          <p>{result.analysis.confidence_level}</p>

          <h3>Missing Skills</h3>
          <ul>
            {result.analysis.missing_skills.map((s: string) => (
              <li key={s}>❌ {s}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}