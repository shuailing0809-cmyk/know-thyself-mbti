from __future__ import annotations

from .data_loader import get_followup_question


FOLLOWUP_REASON_HINTS = {
    "EI": {
        "context": "看状态",
        "default": "",
    },
    "SN": {
        "context": "看内容",
        "default": "",
    },
    "TF": {
        "context": "看人",
        "default": "",
    },
    "JP": {
        "context": "看事情重要程度",
        "default": "",
    },
}


def select_followup_question(dimension: str, context_dependency: bool) -> str:
    reason = ""
    if context_dependency:
        reason = FOLLOWUP_REASON_HINTS.get(dimension, {}).get("context", "")
    question = get_followup_question(dimension, reason=reason)
    return question.question

