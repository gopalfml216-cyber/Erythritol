import pytest

from app.services.matching_service import (
    calculate_match_score,
    rank_jobs,
    get_matching_insights,
    categorize_skills,
    load_skills_taxonomy
)

# -----------------------------
# calculate_match_score tests
# -----------------------------

def test_perfect_skill_match():
    candidate = ["Python", "React", "Docker"]
    job = ["Python", "React", "Docker"]

    score = calculate_match_score(candidate, job, experience_years=2)

    assert score == 100.0


def test_partial_skill_match():
    candidate = ["Python"]
    job = ["Python", "React", "Docker"]

    score = calculate_match_score(candidate, job, experience_years=0)

    assert score > 0
    assert score < 100


def test_no_matching_skills():
    candidate = ["Go", "Rust"]
    job = ["Python", "React"]

    score = calculate_match_score(candidate, job)

    assert score < 25  # only depth bonus may apply


def test_experience_bonus_applied():
    candidate = ["Python"]
    job = ["Python"]

    score_no_exp = calculate_match_score(candidate, job, experience_years=0)
    score_with_exp = calculate_match_score(candidate, job, experience_years=2)

    assert score_with_exp > score_no_exp


def test_score_never_exceeds_100():
    candidate = ["Python", "React", "Docker", "AWS", "Kubernetes", "Linux"]
    job = ["Python", "React"]

    score = calculate_match_score(candidate, job, experience_years=10)

    assert score <= 100


# -----------------------------
# rank_jobs tests
# -----------------------------

def test_rank_jobs_orders_by_match_score():
    jobs = [
        {"job_id": "J1", "required_skills": ["Python"]},
        {"job_id": "J2", "required_skills": ["Python", "React"]},
    ]

    ranked = rank_jobs(["Python", "React"], jobs)

    assert ranked[0]["job_id"] == "J2"
    assert ranked[0]["match_score"] >= ranked[1]["match_score"]


def test_rank_jobs_location_filter():
    jobs = [
        {"job_id": "J1", "required_skills": ["Python"], "location": "Bangalore"},
        {"job_id": "J2", "required_skills": ["Python"], "job_type": "Remote"},
    ]

    ranked = rank_jobs(["Python"], jobs, location_preference="Bangalore")

    assert len(ranked) == 2  # Bangalore + Remote allowed


def test_rank_jobs_salary_filter():
    jobs = [
        {"job_id": "J1", "required_skills": ["Python"], "salary_range": [5, 10]},
        {"job_id": "J2", "required_skills": ["Python"], "salary_range": [15, 20]},
    ]

    ranked = rank_jobs(["Python"], jobs, min_salary=12)

    assert len(ranked) == 1
    assert ranked[0]["job_id"] == "J2"


# -----------------------------
# get_matching_insights tests
# -----------------------------

def test_matching_insights_structure():
    job = {
        "required_skills": ["Python", "React", "Docker"]
    }
    candidate = ["Python", "Docker", "AWS"]

    insights = get_matching_insights(candidate, job)

    assert "matching_skills" in insights
    assert "missing_skills" in insights
    assert "additional_skills" in insights
    assert "match_percentage" in insights


def test_matching_insights_values():
    job = {
        "required_skills": ["Python", "React"]
    }
    candidate = ["Python", "Docker"]

    insights = get_matching_insights(candidate, job)

    assert insights["matching_skills"] == ["Python"]
    assert insights["missing_skills"] == ["React"]
    assert "Docker" in insights["additional_skills"]
    assert insights["match_percentage"] == 50.0


# -----------------------------
# taxonomy & categorization tests
# -----------------------------

def test_load_skills_taxonomy_fallback():
    taxonomy = load_skills_taxonomy()

    assert isinstance(taxonomy, dict)
    assert "core_technical" in taxonomy


def test_categorize_skills():
    taxonomy = load_skills_taxonomy()
    skills = ["Python", "Docker", "Git", "SomeRandomSkill"]

    categorized = categorize_skills(skills, taxonomy)

    assert "Python" in categorized["core"]
    assert "Docker" in categorized["infrastructure"]
    assert "Git" in categorized["tools"]
    assert "SomeRandomSkill" in categorized["foundational"]
