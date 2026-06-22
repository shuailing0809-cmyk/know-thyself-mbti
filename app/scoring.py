from __future__ import annotations

import re
from typing import Dict, Iterable, List, Tuple

from .schemas import DIMENSION_META, DimensionResult


LEFT_KEYWORDS: Dict[str, List[str]] = {
    "EI": ["找人", "约", "朋友", "热闹", "聚会", "聊天", "出去", "大家", "社交", "一起", "有人", "更有能量", "不闷"],
    "SN": ["教程", "步骤", "说明书", "照着", "视频", "怎么做", "细节", "按顺序", "第一步", "具体"],
    "TF": ["原则", "不合理", "客观", "对事不对人", "事实", "应该", "正当", "直接拒绝", "说明原因", "边界"],
    "JP": ["计划", "安排", "提前", "订好", "不安心", "焦虑", "重新安排", "赶紧", "清单", "确定"],
}

RIGHT_KEYWORDS: Dict[str, List[str]] = {
    "EI": ["一个人", "独处", "安静", "在家", "看书", "静静", "累", "恢复", "充电", "消耗", "不想见人"],
    "SN": ["原理", "整体", "框架", "底层逻辑", "为什么", "结构", "关联", "模式", "先了解", "逻辑"],
    "TF": ["关系", "感受", "不好意思", "开不了口", "担心", "怕伤", "难受", "委婉", "对方不高兴", "尴尬"],
    "JP": ["无所谓", "边走边看", "弹性", "临时", "不急", "顺着走", "随机", "开放", "变化", "自由"],
}

AMBIGUOUS_WORDS = ["都有", "都可以", "看情况", "不一定", "说不准", "一半一半", "不好说", "不确定", "看状态"]
CONTEXT_WORDS = ["看人", "看关系", "看状态", "看内容", "看事情", "看重要", "工作", "生活", "不同场景", "不同情况"]
REFUSAL_WORDS = ["不想说", "不想补充", "不用补充", "已经回答", "不知道", "不记得", "算了", "跳过"]
L4_WORDS = ["总是", "每次", "必须", "受不了", "一定", "完全", "几乎", "长期", "大多数", "基本每次", "从来"]
L3_WORDS = ["上次", "最近", "比如", "具体", "先", "然后", "后来", "通常会", "我会", "一般会", "实际"]
L2_WORDS = ["喜欢", "倾向", "一般", "比较", "想", "觉得", "可能", "偏"]
L1_WORDS = ["外向", "内向", "理性", "感性", "随性", "自律", "拖延", "我是"]

ENERGY_WORDS = ["能量", "精力", "放松", "更有劲", "更有能量", "累", "恢复", "充电", "消耗", "舒服"]
CHANGE_WORDS = ["变化", "临时", "调整", "改", "重新安排", "顺着走", "计划赶不上"]
WEIGHT_WORDS = ["纠结", "担心", "原则", "关系", "不合理", "对方", "拒绝", "理由", "开不了口"]
FIRST_STEP_WORDS = ["先", "第一步", "开始", "上来", "教程", "步骤", "原理", "框架"]


def score_answer(
    dimension: str,
    answer: str,
    phase: str = "main",
    followup_used: bool = False,
) -> DimensionResult:
    text = answer.strip()
    left_hits = keyword_hits(text, LEFT_KEYWORDS[dimension])
    right_hits = keyword_hits(text, RIGHT_KEYWORDS[dimension])
    ambiguous = contains_any(text, AMBIGUOUS_WORDS)
    context_dependency = contains_any(text, CONTEXT_WORDS)
    refused = contains_any(text, REFUSAL_WORDS)
    evidence = detect_evidence_level(text, left_hits + right_hits)
    needs_followup = False
    insufficient = False

    if refused:
        score = 5
        confidence = 0.35
        insufficient = True
        reason = "你这次没有继续补充细节，所以我会先把这一维保持在比较保守的位置。"
        return build_result(
            dimension,
            score,
            evidence,
            confidence,
            False,
            followup_used,
            context_dependency,
            insufficient,
            reason,
            ["refusal"],
        )

    dominant_side, dominance = decide_side(left_hits, right_hits)
    if phase == "main":
        needs_followup = should_followup(
            dimension, text, evidence, ambiguous, context_dependency, dominance
        )

    if ambiguous and dominance <= 1:
        score = 5
        confidence = 0.35 if evidence in ("L1", "L2") else 0.45
        insufficient = evidence in ("L1", "L2")
    elif dominant_side == "left":
        score, confidence = score_for_side("left", evidence, context_dependency)
    elif dominant_side == "right":
        score, confidence = score_for_side("right", evidence, context_dependency)
    else:
        score = 5
        confidence = 0.35
        insufficient = True

    if phase == "followup" and evidence in ("L1", "L2") and dominance <= 1:
        score = 5
        confidence = 0.35
        insufficient = True
        needs_followup = False

    reason = build_user_reason(dimension, score, text, ambiguous, context_dependency)
    notes = [
        "ambiguous" if ambiguous else "",
        "context_dependency" if context_dependency else "",
        f"left_hits={left_hits}",
        f"right_hits={right_hits}",
    ]
    return build_result(
        dimension,
        score,
        evidence,
        confidence,
        needs_followup,
        followup_used,
        context_dependency,
        insufficient,
        reason,
        [note for note in notes if note],
    )


def keyword_hits(text: str, keywords: Iterable[str]) -> int:
    return sum(1 for keyword in keywords if keyword and keyword in text)


def contains_any(text: str, keywords: Iterable[str]) -> bool:
    return any(keyword in text for keyword in keywords)


def detect_evidence_level(text: str, directional_hits: int) -> str:
    if directional_hits == 0 and not contains_any(text, L1_WORDS + L2_WORDS):
        return "L1"
    if contains_any(text, L4_WORDS) and directional_hits > 0:
        return "L4"
    if contains_any(text, L3_WORDS) and directional_hits > 0:
        return "L3"
    if contains_any(text, L2_WORDS) or directional_hits > 0:
        return "L2"
    return "L1"


def decide_side(left_hits: int, right_hits: int) -> Tuple[str, int]:
    if left_hits > right_hits:
        return "left", left_hits - right_hits
    if right_hits > left_hits:
        return "right", right_hits - left_hits
    return "neutral", 0


def should_followup(
    dimension: str,
    text: str,
    evidence: str,
    ambiguous: bool,
    context_dependency: bool,
    dominance: int,
) -> bool:
    if ambiguous or context_dependency:
        return True
    if dominance == 0:
        return True
    if dimension == "EI" and not contains_any(text, ENERGY_WORDS):
        return True
    if dimension == "SN" and not contains_any(text, FIRST_STEP_WORDS):
        return True
    if dimension == "TF" and "纠结" in text and not contains_any(text, WEIGHT_WORDS):
        return True
    if dimension == "JP" and not contains_any(text, CHANGE_WORDS):
        return True
    if evidence == "L1":
        return True
    return False


def score_for_side(side: str, evidence: str, context_dependency: bool) -> Tuple[int, float]:
    if context_dependency:
        return (4, 0.48) if side == "left" else (7, 0.48)
    if evidence == "L4":
        return (2, 0.78) if side == "left" else (9, 0.78)
    if evidence == "L3":
        return (3, 0.62) if side == "left" else (8, 0.62)
    if evidence == "L2":
        return (4, 0.45) if side == "left" else (7, 0.45)
    return (5, 0.35)


def build_result(
    dimension: str,
    score: int,
    evidence: str,
    confidence: float,
    needs_followup: bool,
    followup_used: bool,
    context_dependency: bool,
    insufficient: bool,
    reason: str,
    notes: List[str],
) -> DimensionResult:
    meta = DIMENSION_META[dimension]
    direction = meta["left"] if score <= 5 else meta["right"]
    return DimensionResult(
        dimension=dimension,
        score=score,
        direction=direction,
        evidence_level=evidence,
        confidence=confidence,
        needs_followup=needs_followup,
        followup_used=followup_used,
        context_dependency=context_dependency,
        insufficient=insufficient,
        user_visible_reason=reason,
        internal_notes=notes,
    )


def build_user_reason(
    dimension: str,
    score: int,
    answer: str,
    ambiguous: bool,
    context_dependency: bool,
) -> str:
    meta = DIMENSION_META[dimension]
    direction_label = meta["left_label"] if score <= 5 else meta["right_label"]
    if ambiguous:
        return f"你的回答里同时出现了两边的可能，我会先把 {meta['name']} 看作比较灵活。"
    if context_dependency:
        return f"你的回答明显受具体情境影响，所以 {meta['name']} 会保守看待，避免直接推成强倾向。"
    snippet = compact_answer(answer)
    return f"你提到“{snippet}”，这更接近{direction_label}这一侧。"


def compact_answer(answer: str) -> str:
    cleaned = re.sub(r"\s+", " ", answer.strip())
    if len(cleaned) <= 34:
        return cleaned
    return cleaned[:32] + "..."
