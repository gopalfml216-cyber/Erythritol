from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import json
from pathlib import Path

app = FastAPI(title="Wevolve API", version="1.0.0")

# --- 1. SECURITY (CORS) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows localhost:5173, 5174, etc.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 2. LOAD MOCK DATA ---
mock_resume_path = Path(__file__).parent / "data" / "mock_resume.json"
mock_jobs_path = Path(__file__).parent / "data" / "mock_jobs.json"

# Default fallback data (prevents crashes if files are missing)
DEFAULT_RESUME = {
    "name": "Sample User",
    "email": "user@example.com",
    "phone": "+91-9876543210",
    "skills": ["Python", "React", "FastAPI"],
    "education": [{"degree": "B.Tech", "institution": "IIT", "year": "2024"}],
    "experience": [{"title": "Intern", "company": "TechCorp", "duration": "6 months"}],
    "confidence_scores": {"overall": 0.9}
}

DEFAULT_JOBS = [
    {
        "job_id": "1",
        "title": "Frontend Developer",
        "company": "TechFlow",
        "location": "Remote",
        "salary_range": [120000, 150000],
        "required_skills": ["React", "TypeScript"],
        "match_score": 0.95
    }
]

try:
    with open(mock_resume_path) as f:
        MOCK_RESUME = json.load(f)
except (FileNotFoundError, json.JSONDecodeError):
    MOCK_RESUME = DEFAULT_RESUME

try:
    with open(mock_jobs_path) as f:
        MOCK_JOBS = json.load(f)
except (FileNotFoundError, json.JSONDecodeError):
    MOCK_JOBS = DEFAULT_JOBS


# --- 3. API ENDPOINTS (Fixed with /v1) ---

@app.get("/")
def root():
    return {"status": "active", "message": "Wevolve API is running"}

@app.get("/health")
def health():
    return {"status": "ok"}

# 🚨 FIX: Added /v1 here
@app.post("/api/v1/resume/parse")
async def parse_resume(file: UploadFile = File(...)):
    """Parse resume from PDF"""
    return MOCK_RESUME

# 🚨 FIX: Added /v1 here
@app.get("/api/v1/jobs/search")
def search_jobs(skills: str = ""):
    """Search jobs"""
    return MOCK_JOBS

# 🚨 FIX: Added /v1 here
@app.post("/api/v1/skills/analyze")
def analyze_gap(data: dict):
    """Analyze skill gaps"""
    current_skills = set(data.get("current_skills", []))
    target_skills = set(data.get("target_skills", []))
    
    matching = list(current_skills & target_skills)
    missing = list(target_skills - current_skills)
    
    gap_percentage = (len(missing) / len(target_skills) * 100) if target_skills else 0
    readiness = 100 - gap_percentage
    
    return {
        "analysis": {
            "matching_skills": matching,
            "missing_skills": missing,
            "skill_gap_percentage": round(gap_percentage, 1),
            "readiness_score": round(readiness, 1),
            "estimated_learning_time_months": len(missing) * 2
        },
        "learning_roadmap": [
            {
                "phase": i + 1,
                "duration_months": 2,
                "focus": f"Learn {skill}",
                "skills_to_learn": [skill],
                "priority": "High" if i < 2 else "Medium",
                "reasoning": f"{skill} is essential"
            }
            for i, skill in enumerate(missing[:5])
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)