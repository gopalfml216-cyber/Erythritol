from typing import List, Dict
import json
from pathlib import Path

def load_skills_taxonomy():
    """Load skill categories for weighted matching"""
    taxonomy_path = Path(__file__).parent.parent / "data" / "skills_taxonomy.json"
    try:
        with open(taxonomy_path) as f:
            return json.load(f)
    except FileNotFoundError:
        # Fallback taxonomy
        return {
            "core_technical": ["Python", "FastAPI", "React", "TypeScript", "PostgreSQL", "MongoDB"],
            "infrastructure": ["Docker", "Kubernetes", "AWS", "Linux"],
            "tools": ["Git", "Redis"],
            "foundational": ["HTML/CSS", "JavaScript", "REST APIs"]
        }

def categorize_skills(skills: List[str], taxonomy: Dict) -> Dict[str, List[str]]:
    """Categorize skills into tiers"""
    categorized = {
        "core": [],
        "infrastructure": [],
        "tools": [],
        "foundational": []
    }
    
    for skill in skills:
        if skill in taxonomy.get("core_technical", []):
            categorized["core"].append(skill)
        elif skill in taxonomy.get("infrastructure", []):
            categorized["infrastructure"].append(skill)
        elif skill in taxonomy.get("tools", []):
            categorized["tools"].append(skill)
        else:
            categorized["foundational"].append(skill)
    
    return categorized

def calculate_match_score(
    candidate_skills: List[str], 
    job_skills: List[str],
    experience_years: int = 0
) -> float:
    """
    Calculate match score with weighted algorithm
    
    Formula:
    - Skill match: 60% (exact matches)
    - Skill depth: 20% (having more relevant skills)
    - Critical skills: 15% (first 3 job requirements)
    - Experience bonus: 5%
    """
    if not job_skills:
        return 0.0
    
    candidate_set = set(s.lower() for s in candidate_skills)
    job_set = set(s.lower() for s in job_skills)
    
    # 1. Exact skill matches (60%)
    matching_skills = candidate_set & job_set
    skill_match_score = (len(matching_skills) / len(job_set)) * 60
    
    # 2. Skill depth bonus (20%) - reward having more skills
    # Cap at 10 skills to avoid over-rewarding
    skill_depth = min(len(candidate_skills), 10) / 10 * 20
    
    # 3. Critical skills bonus (15%) - first 3 job requirements are most important
    critical_job_skills = set(s.lower() for s in job_skills[:3])
    critical_matches = candidate_set & critical_job_skills
    critical_bonus = (len(critical_matches) / len(critical_job_skills)) * 15 if critical_job_skills else 0
    
    # 4. Experience bonus (5%)
    # 0 years = 0%, 1 year = 2.5%, 2+ years = 5%
    experience_bonus = min(experience_years * 2.5, 5)
    
    total_score = skill_match_score + skill_depth + critical_bonus + experience_bonus
    
    return round(min(total_score, 100), 1)  # Cap at 100

def rank_jobs(
    candidate_skills: List[str], 
    jobs: List[Dict],
    experience_years: int = 0,
    location_preference: str = None,
    min_salary: int = None,
    max_salary: int = None
) -> List[Dict]:
    """
    Rank jobs by match score and apply filters
    """
    # Calculate match scores
    for job in jobs:
        job['match_score'] = calculate_match_score(
            candidate_skills,
            job.get('required_skills', []),
            experience_years
        )
    
    # Apply filters
    filtered_jobs = jobs
    
    if location_preference:
        filtered_jobs = [j for j in filtered_jobs 
                        if j.get('location', '').lower() == location_preference.lower() 
                        or j.get('job_type') == 'Remote']
    
    if min_salary is not None:
        filtered_jobs = [j for j in filtered_jobs 
                        if j.get('salary_range', [0, 0])[1] >= min_salary]
    
    if max_salary is not None:
        filtered_jobs = [j for j in filtered_jobs 
                        if j.get('salary_range', [0, 0])[0] <= max_salary]
    
    # Sort by match score (descending)
    ranked_jobs = sorted(filtered_jobs, key=lambda x: x.get('match_score', 0), reverse=True)
    
    return ranked_jobs

def get_matching_insights(candidate_skills: List[str], job: Dict) -> Dict:
    """
    Get detailed insights about why a job matches
    """
    job_skills = set(s.lower() for s in job.get('required_skills', []))
    candidate_set = set(s.lower() for s in candidate_skills)
    
    matching = list(job_skills & candidate_set)
    missing = list(job_skills - candidate_set)
    extra = list(candidate_set - job_skills)
    
    return {
        "matching_skills": [s for s in job.get('required_skills', []) if s.lower() in matching],
        "missing_skills": [s for s in job.get('required_skills', []) if s.lower() in missing],
        "additional_skills": [s for s in candidate_skills if s.lower() in extra][:5],  # Top 5
        "match_percentage": round(len(matching) / len(job_skills) * 100, 1) if job_skills else 0
    }