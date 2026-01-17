import pytest

from app.services.gap_service import (
    analyze_skill_gap,
    generate_learning_roadmap
)

# -----------------------------
# Tests for analyze_skill_gap
# -----------------------------

def test_all_skills_matched():
    current = ["Python", "React", "FastAPI"]
    target = ["Python", "React", "FastAPI"]

    result = analyze_skill_gap(current, target)

    assert result["skill_gap_percentage"] == 0.0
    assert result["readiness_score"] == 100.0
    assert result["missing_skills"] == []
    assert result["confidence_level"] == "High - Ready to apply"


def test_partial_skill_gap():
    current = ["Python", "React"]
    target = ["Python", "React", "Docker", "AWS"]

    result = analyze_skill_gap(current, target)

    assert set(result["matching_skills"]) == {"Python", "React"}
    assert set(result["missing_skills"]) == {"Docker", "AWS"}
    assert result["skill_gap_percentage"] == 50.0
    assert result["readiness_score"] == 50.0
    assert result["confidence_level"] == "Low - Significant gaps"


def test_no_current_skills():
    current = []
    target = ["Python", "Docker"]

    result = analyze_skill_gap(current, target)

    assert result["matching_skills"] == []
    assert set(result["missing_skills"]) == {"Python", "Docker"}
    assert result["readiness_score"] == 0.0
    assert result["confidence_level"] == "Very Low - Major upskilling needed"


def test_empty_target_skills():
    current = ["Python"]
    target = []

    result = analyze_skill_gap(current, target)

    assert result["skill_gap_percentage"] == 0
    assert result["readiness_score"] == 100
    assert result["missing_skills"] == []


def test_case_insensitivity():
    current = ["python", "react"]
    target = ["Python", "React", "Docker"]

    result = analyze_skill_gap(current, target)

    assert set(result["matching_skills"]) == {"Python", "React"}
    assert result["missing_skills"] == ["Docker"]


# -----------------------------
# Tests for generate_learning_roadmap
# -----------------------------

def test_generate_basic_roadmap():
    missing = ["Docker", "AWS"]
    current = ["Python"]

    roadmap = generate_learning_roadmap(missing, current)

    assert len(roadmap) >= 1
    assert roadmap[0]["phase"] == 1
    assert "skills_to_learn" in roadmap[0]
    assert isinstance(roadmap[0]["skills_to_learn"], list)


def test_prerequisite_handling():
    """
    Kubernetes requires Docker.
    Kubernetes should not appear in the first phase
    if Docker is not in current_skills.
    """
    missing = ["Docker", "Kubernetes"]
    current = ["Python"]

    roadmap = generate_learning_roadmap(missing, current)

    phase_1_skills = roadmap[0]["skills_to_learn"]

    assert "Docker" in phase_1_skills
    assert "Kubernetes" not in phase_1_skills


def test_max_three_skills_per_phase():
    missing = ["Docker", "AWS", "Redis", "MongoDB"]
    current = []

    roadmap = generate_learning_roadmap(missing, current)

    for phase in roadmap:
        assert len(phase["skills_to_learn"]) <= 3


def test_roadmap_has_reasoning_and_resources():
    missing = ["Docker"]
    current = []

    roadmap = generate_learning_roadmap(missing, current)

    phase = roadmap[0]

    assert "reasoning" in phase
    assert "resources" in phase
    assert isinstance(phase["resources"], list)
