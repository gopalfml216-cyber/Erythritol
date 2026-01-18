from pydantic import BaseModel
from typing import List, Dict, Optional

class Education(BaseModel):
    degree: str
    field: str
    institution: str
    year: Optional[str] = None
    cgpa: Optional[float] = None

class Experience(BaseModel):
    title: str
    company: str
    duration: str
    description: List[str] = []

class ParsedResume(BaseModel):
    name: str
    email: str
    phone: str
    skills: List[str]
    education: List[Education]
    experience: List[Experience]
    projects: List[str] = []
    confidence_scores: Dict[str, float]

class JobPosting(BaseModel):
    job_id: str
    title: str
    company: str
    location: str
    salary_range: List[int]
    required_skills: List[str]
    experience_required: str
    job_type: str
    posted_date: str
    description: str
    match_score: Optional[float] = None

class SkillGapAnalysis(BaseModel):
    matching_skills: List[str]
    missing_skills: List[str]
    skill_gap_percentage: float
    readiness_score: float
    estimated_learning_time_months: int

class LearningPhase(BaseModel):
    phase: int
    duration_months: int
    focus: str
    skills_to_learn: List[str]
    priority: str
    reasoning: str

class GapAnalysisResponse(BaseModel):
    analysis: SkillGapAnalysis
    learning_roadmap: List[LearningPhase]
