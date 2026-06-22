from __future__ import annotations

import csv
from functools import lru_cache
from pathlib import Path
from typing import Dict, List

from .schemas import Question


DATA_DIR = Path(__file__).resolve().parent / "data"


def normalize_text(text: str) -> str:
    """Repair known export encoding glitches without changing question intent."""
    replacements = {
        "什��": "什么",
        "不高心": "不高兴",
        "让对方高兴": "让对方不高兴",
        "地方��时间": "地方、时间",
        "订好的地方��时间": "订好的地方、时间",
        "免责���明": "免责声明",
    }
    for source, target in replacements.items():
        text = text.replace(source, target)
    return text


@lru_cache(maxsize=1)
def load_questions() -> List[Question]:
    path = DATA_DIR / "questions.csv"
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        rows = []
        for row in csv.DictReader(handle):
            rows.append(
                Question(
                    id=row["id"],
                    dimension=row["dimension"],
                    question_type=row["question_type"],
                    question=normalize_text(row["question"]),
                    scoring_hint=normalize_text(row.get("scoring_hint", "")),
                    follow_up_condition=normalize_text(
                        row.get("follow_up_condition", "")
                    ),
                    notes=normalize_text(row.get("notes", "")),
                )
            )
    return rows


@lru_cache(maxsize=1)
def question_map() -> Dict[str, Dict[str, List[Question]]]:
    mapping: Dict[str, Dict[str, List[Question]]] = {}
    for question in load_questions():
        mapping.setdefault(question.dimension, {}).setdefault(
            question.question_type, []
        ).append(question)
    return mapping


def get_main_question(dimension: str) -> Question:
    return question_map()[dimension]["main"][0]


def get_followup_question(dimension: str, reason: str = "") -> Question:
    candidates = question_map()[dimension].get("followup", [])
    if reason:
        for question in candidates:
            haystack = question.follow_up_condition + question.notes + question.scoring_hint
            if reason in haystack:
                return question
    return candidates[0]

