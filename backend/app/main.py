from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import json
from pathlib import Path

app = FastAPI(title="Wevolve API", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load mock data
mock_resume_path = Path(__file__).parent / "data" / "mock_resume.json"
mock_jobs_path = Path(__file__).parent / "data" / "mock_jobs.json"

try:
    with open(mock_resume_path) as f:
        MOCK_RESUME = json.load(f)
except FileNotFoundError:
    MOCK_RESUME = {
        "name": "Sample User",
        "email": "user@example.com",
        "phone": "+91-9876543210",
        "skills": ["Python", "React"],
        "education": [],
        "experience": [],
        "projects": [],
        "confidence_scores": {}
    }

try:
    with open(mock_jobs_path) as f:
        MOCK_JOBS = json.load(f)
except FileNotFoundError:
    MOCK_JOBS = []

@app.get("/")
def root():
    return {
        "message": "Wevolve API is running",
        "version": "1.0.0",
        "endpoints": {
            "docs": "/docs",
            "health": "/health",
            "resume_parse": "/api/resume/parse",
            "jobs": "/api/jobs/search",
            "skills_analyze": "/api/skills/analyze"
        }
    }

@app.get("/health")
def health():
    return {"status": "ok", "service": "wevolve-api"}

@app.post("/api/resume/parse")
async def parse_resume(file: UploadFile = File(...)):
    """Parse resume from PDF - currently returns mock data"""
    # TODO: Add real PDF parsing logic
    return MOCK_RESUME

@app.get("/api/jobs/search")
def search_jobs(skills: str = ""):
    """Search jobs - currently returns mock data"""
    # TODO: Add filtering logic
    return MOCK_JOBS

@app.post("/api/skills/analyze")
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
                "reasoning": f"{skill} is essential for the target role"
            }
            for i, skill in enumerate(missing[:5])
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)