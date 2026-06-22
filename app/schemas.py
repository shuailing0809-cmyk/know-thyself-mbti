from __future__ import annotations

from dataclasses import asdict, dataclass, field
from typing import Any, Dict, List, Optional


DIMENSION_ORDER = ["EI", "SN", "TF", "JP"]

DIMENSION_META: Dict[str, Dict[str, str]] = {
    "EI": {
        "name": "能量来源",
        "left": "E",
        "right": "I",
        "left_label": "外部互动",
        "right_label": "独处恢复",
    },
    "SN": {
        "name": "信息偏好",
        "left": "S",
        "right": "N",
        "left_label": "具体步骤",
        "right_label": "整体框架",
    },
    "TF": {
        "name": "决策权重",
        "left": "T",
        "right": "F",
        "left_label": "原则逻辑",
        "right_label": "关系感受",
    },
    "JP": {
        "name": "行动组织",
        "left": "J",
        "right": "P",
        "left_label": "先定计划",
        "right_label": "保留弹性",
    },
}


@dataclass
class Question:
    id: str
    dimension: str
    question_type: str
    question: str
    scoring_hint: str = ""
    follow_up_condition: str = ""
    notes: str = ""


@dataclass
class DimensionResult:
    dimension: str
    score: int
    direction: str
    evidence_level: str
    confidence: float
    needs_followup: bool
    followup_used: bool
    context_dependency: bool
    insufficient: bool
    user_visible_reason: str
    internal_notes: List[str] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, payload: Dict[str, Any]) -> "DimensionResult":
        return cls(**payload)


@dataclass
class SessionState:
    session_id: str
    status: str = "waiting_confirmation"
    current_dimension_index: int = 0
    dimension_results: Dict[str, Dict[str, Any]] = field(default_factory=dict)
    followup_counts: Dict[str, int] = field(default_factory=dict)
    pending_answer: Optional[str] = None
    pending_result: Optional[Dict[str, Any]] = None
    report_text: Optional[str] = None
    report_layer: Optional[str] = None

    def current_dimension(self) -> str:
        return DIMENSION_ORDER[self.current_dimension_index]

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, payload: Dict[str, Any]) -> "SessionState":
        return cls(**payload)


@dataclass
class AgentReply:
    session_id: str
    message: str
    status: str
    completed: bool = False

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

