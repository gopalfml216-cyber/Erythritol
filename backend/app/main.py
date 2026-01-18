from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
import uuid
from pathlib import Path
from app.services.parser_service import ResumeParser
from app.services.matching_service import rank_jobs, get_matching_insights
from app.services.gap_service import analyze_skill_gap, generate_learning_roadmap

app = FastAPI(title="Wevolve API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize parser
parser_service = ResumeParser()

# Create uploads directory
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Load mock data helpers
def load_mock_resume():
    file_path = Path(__file__).parent / "data" / "mock_resume.json"
    try:
        with open(file_path) as f:
            return json.load(f)
    except FileNotFoundError:
        return {
            "name": "Sample User",
            "email": "user@example.com",
            "phone": "+91-0000000000",
            "skills": [],
            "education": [],
            "experience": [],
            "projects": [],
            "confidence_scores": {}
        }

def load_mock_jobs():
    file_path = Path(__file__).parent / "data" / "mock_jobs.json"
    try:
        with open(file_path) as f:
            return json.load(f)
    except FileNotFoundError:
        return []

# Store mock jobs in memory (load once)
MOCK_JOBS = load_mock_jobs()

@app.get("/")
def root():
    return {
        "message": "Wevolve API is running",
        "version": "1.0.0",
        "endpoints": {
            "docs": "/docs",
            "health": "/health",
            "resume_parse": "POST /api/resume/parse",
            "resume_save": "POST /api/resume/save",
            "resume_get": "GET /api/resume/{profile_id}",
            "jobs_search": "GET /api/jobs/search",
            "job_match_details": "GET /api/jobs/{job_id}/match",
            "skills_analyze": "POST /api/skills/analyze",
            "skills_available": "GET /api/skills/available"
        }
    }

@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "wevolve-api",
        "version": "1.0.0",
        "jobs_loaded": len(MOCK_JOBS),
        "upload_dir": str(UPLOAD_DIR.absolute()),
        "uploads_count": len(list(UPLOAD_DIR.glob("*.pdf")))
    }

@app.post("/api/resume/parse")
async def parse_resume(file: UploadFile = File(...)):
    """
    Parse uploaded PDF/DOCX resume
    
    Features:
    - Real parsing for: name, email, phone, skills, education, experience, projects
    - File storage with unique ID
    - Confidence scores for all fields
    
    Returns:
    - ParsedResume with confidence scores
    - file_id for reference
    - original_filename
    """
    # Validate file type
    if not (file.filename.endswith('.pdf') or file.filename.endswith('.docx')):
        raise HTTPException(
            status_code=400, 
            detail="Only PDF and DOCX files are supported"
        )
    
    content = await file.read()
    
    # Validate file size (5MB limit)
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File too large (max 5MB)")
    
    try:
        # Generate unique file ID
        file_id = str(uuid.uuid4())
        
        # Save file to disk
        file_extension = ".pdf" if file.filename.endswith('.pdf') else ".docx"
        file_path = UPLOAD_DIR / f"{file_id}{file_extension}"
        with open(file_path, "wb") as f:
            f.write(content)
        
        # ✅ CRITICAL FIX: Pass filename to parser
        parsed_data = parser_service.parse(content, file.filename)
        
        # Result with file metadata
        result = {
            "file_id": file_id,
            "original_filename": file.filename,
            "name": parsed_data.get("name", ""),
            "email": parsed_data.get("email", ""),
            "phone": parsed_data.get("phone", ""),
            "skills": parsed_data.get("skills", []),
            "education": parsed_data.get("education", []),
            "experience": parsed_data.get("experience", []),
            "projects": parsed_data.get("projects", []),
            "confidence_scores": parsed_data.get("confidence_scores", {
                "name": 0.0,
                "email": 0.0,
                "phone": 0.0,
                "skills": 0.0,
                "education": 0.0,
                "experience": 0.0
            })
        }
        
        print(f"✅ Parsed resume: {result['name']} | {len(result['skills'])} skills | {len(result['education'])} education")
        print(f"   File saved: {file_id}{file_extension}")
        print(f"   Confidence avg: {sum(result['confidence_scores'].values())/6:.2f}")
        
        return result
        
    except Exception as e:
        print(f"❌ Parse error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to parse resume: {str(e)}")

@app.post("/api/resume/save")
async def save_corrected_resume(data: dict):
    """
    Save user-corrected resume data
    
    This endpoint receives the parsed data after user corrections
    and stores it for future use (job matching, profile creation, etc.)
    
    Request body:
    {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+91-9876543210",
        "skills": ["Python", "React", "Docker"],
        "education": [...],
        "experience": [...],
        "projects": [...],
        "file_id": "uuid-from-parse" (optional)
    }
    
    Returns:
    {
        "success": true,
        "message": "Resume saved successfully",
        "profile_id": "PROF_JOHNDOE",
        "data": {...}
    }
    """
    try:
        # Validate required fields
        required_fields = ["name", "email", "skills"]
        missing_fields = [field for field in required_fields if field not in data]
        
        if missing_fields:
            raise HTTPException(
                status_code=400, 
                detail=f"Missing required fields: {', '.join(missing_fields)}"
            )
        
        # Validate email format
        email = data.get("email", "")
        if not "@" in email or not "." in email:
            raise HTTPException(status_code=400, detail="Invalid email format")
        
        # Validate skills is array
        if not isinstance(data.get("skills", []), list):
            raise HTTPException(status_code=400, detail="Skills must be an array")
        
        # Generate profile ID from email
        profile_id = f"PROF_{email.split('@')[0].upper().replace('.', '_')}"
        
        # Save to JSON file for demo
        profiles_dir = Path("saved_profiles")
        profiles_dir.mkdir(exist_ok=True)
        
        profile_file = profiles_dir / f"{profile_id}.json"
        with open(profile_file, "w") as f:
            json.dump(data, f, indent=2)
        
        print(f"✅ Saved corrected resume for: {data['name']}")
        print(f"   Email: {email}")
        print(f"   Skills: {len(data.get('skills', []))}")
        print(f"   Profile ID: {profile_id}")
        print(f"   Saved to: {profile_file}")
        
        return {
            "success": True,
            "message": "Resume saved successfully",
            "profile_id": profile_id,
            "data": data
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Save error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to save resume: {str(e)}"
        )

@app.get("/api/resume/{profile_id}")
def get_saved_resume(profile_id: str):
    """
    Retrieve a saved resume by profile ID
    
    Path params:
    - profile_id: Profile ID (e.g., "PROF_JOHNDOE")
    
    Returns saved resume data or 404 if not found
    """
    try:
        profiles_dir = Path("saved_profiles")
        profile_file = profiles_dir / f"{profile_id}.json"
        
        if not profile_file.exists():
            raise HTTPException(
                status_code=404, 
                detail=f"Profile {profile_id} not found"
            )
        
        with open(profile_file, "r") as f:
            data = json.load(f)
        
        print(f"✅ Retrieved profile: {profile_id}")
        
        return {
            "success": True,
            "profile_id": profile_id,
            "data": data
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Retrieve error: {e}")
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to retrieve profile: {str(e)}"
        )

@app.get("/api/jobs/search")
def search_jobs(
    skills: str = "",
    experience: int = 0,
    location: str = None,
    min_salary: int = None,
    max_salary: int = None
):
    """
    Search and rank jobs based on candidate profile
    
    Query params:
    - skills: Comma-separated list (e.g., "Python,React,Docker")
    - experience: Years of experience (default: 0)
    - location: Preferred location (optional, filters for exact match or Remote)
    - min_salary: Minimum salary in INR (optional)
    - max_salary: Maximum salary in INR (optional)
    
    Returns:
    - List of jobs ranked by match_score (highest first)
    - Each job includes match_score field (0-100)
    """
    try:
        # Parse candidate skills
        candidate_skills = [s.strip() for s in skills.split(",")] if skills else []
        
        # Use copy to avoid modifying original MOCK_JOBS
        jobs_copy = [job.copy() for job in MOCK_JOBS]
        
        # Rank jobs with matching algorithm
        ranked_jobs = rank_jobs(
            candidate_skills=candidate_skills,
            jobs=jobs_copy,
            experience_years=experience,
            location_preference=location,
            min_salary=min_salary,
            max_salary=max_salary
        )
        
        print(f"✅ Ranked {len(ranked_jobs)} jobs for {len(candidate_skills)} skills")
        if ranked_jobs:
            print(f"   Top 3 scores: {[j.get('match_score', 0) for j in ranked_jobs[:3]]}")
        
        return ranked_jobs
        
    except Exception as e:
        print(f"❌ Job search error: {e}")
        raise HTTPException(status_code=500, detail=f"Job search failed: {str(e)}")

@app.get("/api/jobs/{job_id}/match")
def get_job_match_details(job_id: str, skills: str = ""):
    """
    Get detailed match insights for a specific job
    
    Path params:
    - job_id: Job ID (e.g., "J001")
    
    Query params:
    - skills: Comma-separated candidate skills
    
    Returns:
    - Job details
    - Matching skills (green - candidate has these)
    - Missing skills (red - candidate needs these)
    - Additional skills (blue - candidate has, but job doesn't require)
    - Match percentage
    """
    try:
        candidate_skills = [s.strip() for s in skills.split(",")] if skills else []
        
        # Find the job
        job = next((j for j in MOCK_JOBS if j["job_id"] == job_id), None)
        if not job:
            raise HTTPException(status_code=404, detail=f"Job {job_id} not found")
        
        # Get detailed insights
        insights = get_matching_insights(candidate_skills, job)
        
        print(f"✅ Match details for {job_id}: {insights['match_percentage']}% match")
        
        return {
            "job": job,
            "insights": insights
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Match details error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get match details: {str(e)}")

@app.post("/api/skills/analyze")
def analyze_gap_endpoint(data: dict):
    """
    Analyze skill gaps and generate learning roadmap
    
    Request body:
    {
        "current_skills": ["Python", "React", "FastAPI"],
        "target_skills": ["Python", "React", "FastAPI", "Docker", "AWS", "Kubernetes"]
    }
    
    Returns:
    {
        "analysis": {
            "matching_skills": ["Python", "React", "FastAPI"],
            "missing_skills": ["Docker", "AWS", "Kubernetes"],
            "skill_gap_percentage": 50.0,
            "readiness_score": 50.0,
            "estimated_learning_time_months": 10,
            "confidence_level": "Medium - Close to ready"
        },
        "learning_roadmap": [
            {
                "phase": 1,
                "duration_months": 2,
                "focus": "Foundation & Quick Wins",
                "skills_to_learn": ["Docker"],
                "priority": "High",
                "reasoning": "These skills have no prerequisites...",
                "resources": [...]
            },
            ...
        ]
    }
    """
    try:
        current_skills = data.get("current_skills", [])
        target_skills = data.get("target_skills", [])
        
        # Validation
        if not target_skills:
            raise HTTPException(
                status_code=400, 
                detail="target_skills is required and cannot be empty"
            )
        
        if not isinstance(current_skills, list) or not isinstance(target_skills, list):
            raise HTTPException(
                status_code=400,
                detail="current_skills and target_skills must be arrays"
            )
        
        # Analyze gap using the smart gap service
        analysis = analyze_skill_gap(current_skills, target_skills)
        
        # Generate phased learning roadmap
        roadmap = generate_learning_roadmap(
            analysis["missing_skills"],
            current_skills
        )
        
        print(f"✅ Gap analysis complete:")
        print(f"   Missing: {len(analysis['missing_skills'])} skills")
        print(f"   Readiness: {analysis['readiness_score']}%")
        print(f"   Roadmap: {len(roadmap)} phases")
        
        return {
            "analysis": analysis,
            "learning_roadmap": roadmap
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Gap analysis error: {e}")
        raise HTTPException(
            status_code=500, 
            detail=f"Gap analysis failed: {str(e)}"
        )

@app.get("/api/skills/available")
def get_available_skills():
    """
    Get list of all skills across all jobs (for autocomplete/suggestions)
    
    Returns all unique skills from job listings
    """
    all_skills = set()
    for job in MOCK_JOBS:
        all_skills.update(job.get("required_skills", []))
    
    return {
        "skills": sorted(list(all_skills)),
        "count": len(all_skills)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)