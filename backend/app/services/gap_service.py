from typing import List, Dict
import json
from pathlib import Path

def load_skill_metadata():
    """Load skill learning time estimates and dependencies"""
    # This would ideally come from skills_taxonomy.json
    return {
        "Python": {"learning_months": 3, "difficulty": "medium", "prerequisites": []},
        "FastAPI": {"learning_months": 2, "difficulty": "easy", "prerequisites": ["Python"]},
        "React": {"learning_months": 3, "difficulty": "medium", "prerequisites": ["JavaScript"]},
        "TypeScript": {"learning_months": 2, "difficulty": "medium", "prerequisites": ["JavaScript"]},
        "Docker": {"learning_months": 2, "difficulty": "medium", "prerequisites": ["Linux"]},
        "Kubernetes": {"learning_months": 4, "difficulty": "hard", "prerequisites": ["Docker"]},
        "PostgreSQL": {"learning_months": 2, "difficulty": "medium", "prerequisites": []},
        "MongoDB": {"learning_months": 2, "difficulty": "easy", "prerequisites": []},
        "AWS": {"learning_months": 4, "difficulty": "hard", "prerequisites": ["Linux"]},
        "Redis": {"learning_months": 1, "difficulty": "easy", "prerequisites": []},
        "GraphQL": {"learning_months": 2, "difficulty": "medium", "prerequisites": ["REST APIs"]},
        "JavaScript": {"learning_months": 3, "difficulty": "medium", "prerequisites": []},
        "Linux": {"learning_months": 2, "difficulty": "medium", "prerequisites": []},
    }

def analyze_skill_gap(current_skills: List[str], target_skills: List[str]) -> Dict:
    """
    Analyze gap between current and target skills
    """
    current_set = set(s.lower() for s in current_skills)
    target_set = set(s.lower() for s in target_skills)
    
    matching = list(target_set & current_set)
    missing = list(target_set - current_set)
    
    gap_percentage = (len(missing) / len(target_set) * 100) if target_set else 0
    readiness_score = 100 - gap_percentage
    
    # Estimate learning time based on skill metadata
    skill_metadata = load_skill_metadata()
    total_learning_months = sum(
        skill_metadata.get(skill, {}).get("learning_months", 2) 
        for skill in missing
    )
    
    return {
        "matching_skills": [s for s in target_skills if s.lower() in matching],
        "missing_skills": [s for s in target_skills if s.lower() in missing],
        "skill_gap_percentage": round(gap_percentage, 1),
        "readiness_score": round(readiness_score, 1),
        "estimated_learning_time_months": total_learning_months,
        "confidence_level": _calculate_confidence(readiness_score)
    }

def _calculate_confidence(readiness: float) -> str:
    """Classify readiness into confidence levels"""
    if readiness >= 80:
        return "High - Ready to apply"
    elif readiness >= 60:
        return "Medium - Close to ready"
    elif readiness >= 40:
        return "Low - Significant gaps"
    else:
        return "Very Low - Major upskilling needed"

def generate_learning_roadmap(
    missing_skills: List[str],
    current_skills: List[str]
) -> List[Dict]:
    """
    Generate a phased learning roadmap with smart ordering
    """
    skill_metadata = load_skill_metadata()
    current_set = set(s.lower() for s in current_skills)
    
    # Categorize missing skills by difficulty and prerequisites
    ready_to_learn = []
    requires_prereq = []
    
    for skill in missing_skills:
        metadata = skill_metadata.get(skill, {})
        prerequisites = metadata.get("prerequisites", [])
        
        # Check if all prerequisites are met
        prereq_met = all(p.lower() in current_set for p in prerequisites)
        
        if prereq_met:
            ready_to_learn.append({
                "skill": skill,
                "difficulty": metadata.get("difficulty", "medium"),
                "months": metadata.get("learning_months", 2),
                "prerequisites": prerequisites
            })
        else:
            requires_prereq.append({
                "skill": skill,
                "difficulty": metadata.get("difficulty", "medium"),
                "months": metadata.get("learning_months", 2),
                "prerequisites": prerequisites
            })
    
    # Sort by difficulty (easy first) and learning time
    difficulty_order = {"easy": 1, "medium": 2, "hard": 3}
    ready_to_learn.sort(key=lambda x: (difficulty_order.get(x["difficulty"], 2), x["months"]))
    
    # Build phased roadmap
    roadmap = []
    phase = 1
    cumulative_months = 0
    
    # Phase 1: Skills ready to learn immediately (prioritize easy ones)
    if ready_to_learn:
        phase_skills = ready_to_learn[:3]  # Max 3 skills per phase
        phase_duration = max(s["months"] for s in phase_skills)
        cumulative_months += phase_duration
        
        roadmap.append({
            "phase": phase,
            "duration_months": phase_duration,
            "focus": "Foundation & Quick Wins",
            "skills_to_learn": [s["skill"] for s in phase_skills],
            "priority": "High",
            "reasoning": "These skills have no prerequisites and will give you immediate progress. Start with these to build momentum.",
            "resources": _get_learning_resources([s["skill"] for s in phase_skills])
        })
        phase += 1
    
    # Phase 2: Remaining ready skills
    if len(ready_to_learn) > 3:
        phase_skills = ready_to_learn[3:6]
        phase_duration = max(s["months"] for s in phase_skills)
        cumulative_months += phase_duration
        
        roadmap.append({
            "phase": phase,
            "duration_months": phase_duration,
            "focus": "Core Technical Skills",
            "skills_to_learn": [s["skill"] for s in phase_skills],
            "priority": "High",
            "reasoning": "Essential skills for the target role. Build on Phase 1 knowledge.",
            "resources": _get_learning_resources([s["skill"] for s in phase_skills])
        })
        phase += 1
    
    # Phase 3: Skills requiring prerequisites
    if requires_prereq:
        phase_skills = requires_prereq[:3]
        phase_duration = max(s["months"] for s in phase_skills)
        cumulative_months += phase_duration
        
        prereq_list = ", ".join(set(
            p for s in phase_skills for p in s["prerequisites"]
        ))
        
        roadmap.append({
            "phase": phase,
            "duration_months": phase_duration,
            "focus": "Advanced Specialization",
            "skills_to_learn": [s["skill"] for s in phase_skills],
            "priority": "Medium",
            "reasoning": f"These require prerequisites ({prereq_list}). Tackle after completing earlier phases.",
            "resources": _get_learning_resources([s["skill"] for s in phase_skills])
        })
    
    return roadmap

def _get_learning_resources(skills: List[str]) -> List[Dict]:
    """Recommend learning resources for skills"""
    resource_map = {
        "Python": [
            {"name": "freeCodeCamp Python Course", "type": "video", "url": "https://www.youtube.com/freecodecamp"},
            {"name": "Automate the Boring Stuff", "type": "book", "url": "https://automatetheboringstuff.com/"}
        ],
        "React": [
            {"name": "React Official Docs", "type": "docs", "url": "https://react.dev"},
            {"name": "freeCodeCamp React Course", "type": "video", "url": "https://www.youtube.com/freecodecamp"}
        ],
        "Docker": [
            {"name": "Docker Getting Started", "type": "docs", "url": "https://docs.docker.com/get-started/"},
            {"name": "Docker Mastery Course", "type": "course", "url": "https://www.udemy.com/"}
        ],
        # Add more as needed
    }
    
    resources = []
    for skill in skills[:2]:  # Top 2 skills only
        if skill in resource_map:
            resources.extend(resource_map[skill][:1])  # One resource per skill
    
    return resources