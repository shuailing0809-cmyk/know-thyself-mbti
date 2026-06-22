from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List

from .schemas import DIMENSION_META, DIMENSION_ORDER, DimensionResult


TYPE_NAMES: Dict[str, str] = {
    "ISTJ": "物流师型",
    "ISFJ": "守卫者型",
    "INFJ": "提倡者型",
    "INTJ": "建筑师型",
    "ISTP": "鉴赏家型",
    "ISFP": "探险家型",
    "INFP": "调停者型",
    "INTP": "思考者型",
    "ESTP": "企业家型",
    "ESFP": "表演者型",
    "ENFP": "竞选者型",
    "ENTP": "辩论者型",
    "ESTJ": "总经理型",
    "ESFJ": "执政官型",
    "ENFJ": "主人公型",
    "ENTJ": "指挥官型",
}


@dataclass
class Report:
    type_code: str
    layer: str
    text: str


def build_report(results: Dict[str, Dict]) -> Report:
    dimensions = [DimensionResult.from_dict(results[key]) for key in DIMENSION_ORDER]
    type_code = "".join(result.direction for result in dimensions)
    layer = decide_layer(dimensions)
    text = render_report(type_code, layer, dimensions)
    return Report(type_code=type_code, layer=layer, text=text)


def decide_layer(results: List[DimensionResult]) -> str:
    strong_count = sum(1 for item in results if item.score <= 3 or item.score >= 8)
    neutral_count = sum(1 for item in results if 4 <= item.score <= 6)
    context_count = sum(1 for item in results if item.context_dependency)
    insufficient_count = sum(
        1
        for item in results
        if item.insufficient or item.evidence_level in ("L1", "L2") or item.confidence <= 0.45
    )
    average_confidence = sum(item.confidence for item in results) / len(results)

    if (
        strong_count >= 3
        and neutral_count <= 1
        and context_count == 0
        and insufficient_count <= 1
        and average_confidence >= 0.65
    ):
        return "high"
    if (
        strong_count <= 1
        or neutral_count >= 3
        or context_count >= 2
        or insufficient_count >= 3
        or average_confidence <= 0.45
    ):
        return "low"
    return "medium"


def render_report(type_code: str, layer: str, results: List[DimensionResult]) -> str:
    if layer == "high":
        return render_high_report(type_code, results)
    if layer == "medium":
        return render_medium_report(type_code, results)
    return render_low_report(type_code, results)


def render_high_report(type_code: str, results: List[DimensionResult]) -> str:
    lines = [
        "你的 MBTI 倾向分析",
        "",
        f"类型结论：倾向于 {type_code}（{TYPE_NAMES.get(type_code, '参考方向')}）",
        "倾向强度：这次回答里的行为依据比较清楚，结果可以作为一个较稳定的参考。",
        "",
        "四维倾向：",
        *dimension_lines(results),
        "",
        "为什么这样判断：",
        *reason_lines(results),
        "",
        "可能的表现：",
        build_dimension_based_profile(results),
        "",
        "沟通与协作建议：",
        build_collaboration_advice(results),
        "",
        "需要留意的边界：",
        "这不是结论，也不是对你的固定标签。它只是基于这次对话里具体行为线索得到的倾向分析。",
        "",
        "如果你愿意，可以回复你觉得准或不准的地方，我可以帮你继续校准。",
    ]
    return "\n".join(lines)


def render_medium_report(type_code: str, results: List[DimensionResult]) -> str:
    flexible = flexible_dimensions(results)
    stable = stable_dimensions(results)
    adjacent = adjacent_types(type_code, results)
    lines = [
        "你的 MBTI 倾向分析",
        "",
        f"类型结论（参考方向）：{type_code}（{TYPE_NAMES.get(type_code, '参考方向')}）",
        "说明：你的结果里有一些倾向比较清楚，也有部分维度会受场景影响，所以更适合作为参考方向。",
        "",
        "四维倾向：",
        *dimension_lines(results),
        "",
        f"相对稳定的部分：{stable or '这次没有特别稳定的维度，需要继续观察。'}",
        f"可能切换的部分：{flexible or '这次没有明显切换维度。'}",
        "",
        f"相邻类型提示：{adjacent or '目前没有特别需要提示的相邻方向。'}",
        "",
        "简要说明：",
        build_conservative_summary(results),
        "",
        "建议把这次结果当作探索入口，而不是固定答案。",
        "",
        "如果你愿意，可以回复你觉得准或不准的地方，我可以帮你继续校准。",
    ]
    return "\n".join(lines)


def render_low_report(type_code: str, results: List[DimensionResult]) -> str:
    unclear = "、".join(
        item.dimension
        for item in results
        if item.context_dependency or item.insufficient or 4 <= item.score <= 6
    )
    adjacent = adjacent_types(type_code, results)
    lines = [
        "当前倾向（参考方向）",
        "",
        f"基于本次对话，目前只能暂时看作接近 {type_code} 方向。",
        "不过你的多个回答仍然比较灵活，或明显依赖具体情境，现在不适合输出完整人格画像。",
        "",
        "四维倾向：",
        *dimension_lines(results),
        "",
        f"不稳定维度：{unclear or '暂无明显不稳定维度，但整体信息仍偏少。'}",
        f"相邻方向：{adjacent or '需要更多具体行为后再判断。'}",
        "",
        "目前阶段，建议把这次测评当作一个思考入口。人会在不同关系、任务和状态下呈现不同面向，这本身并不矛盾。",
        "",
        "如果你愿意，可以回复你觉得准或不准的地方，我可以帮你继续校准。",
    ]
    return "\n".join(lines)


def dimension_lines(results: List[DimensionResult]) -> List[str]:
    lines = []
    for item in results:
        meta = DIMENSION_META[item.dimension]
        label = direction_label(item)
        strength = strength_label(item)
        lines.append(f"- {item.dimension}（{meta['name']}）：{label}，{strength}")
    return lines


def reason_lines(results: List[DimensionResult]) -> List[str]:
    return [f"- {DIMENSION_META[item.dimension]['name']}：{item.user_visible_reason}" for item in results]


def direction_label(item: DimensionResult) -> str:
    meta = DIMENSION_META[item.dimension]
    if item.direction == meta["left"]:
        return f"更接近{meta['left_label']}"
    return f"更接近{meta['right_label']}"


def strength_label(item: DimensionResult) -> str:
    if item.context_dependency:
        return "会受具体情境影响"
    if 4 <= item.score <= 6:
        return "比较灵活"
    if item.score <= 3 or item.score >= 8:
        return "在多数场景下较稳定"
    return "有一定倾向，但保留弹性"


def stable_dimensions(results: List[DimensionResult]) -> str:
    stable = [
        f"{item.dimension}（{DIMENSION_META[item.dimension]['name']}）"
        for item in results
        if (item.score <= 3 or item.score >= 8) and not item.context_dependency
    ]
    return "、".join(stable)


def flexible_dimensions(results: List[DimensionResult]) -> str:
    flexible = [
        f"{item.dimension}（{DIMENSION_META[item.dimension]['name']}）"
        for item in results
        if 4 <= item.score <= 6 or item.context_dependency or item.insufficient
    ]
    return "、".join(flexible)


def adjacent_types(type_code: str, results: List[DimensionResult]) -> str:
    candidates = sorted(
        [
            (abs(item.score - 5.5), index, item)
            for index, item in enumerate(results)
            if 4 <= item.score <= 7 or item.context_dependency
        ],
        key=lambda payload: payload[0],
    )[:2]
    adjacent = []
    for _, index, item in candidates:
        letters = list(type_code)
        meta = DIMENSION_META[item.dimension]
        letters[index] = meta["right"] if letters[index] == meta["left"] else meta["left"]
        adjacent.append("".join(letters))
    return " 或 ".join(dict.fromkeys(adjacent))


def build_dimension_based_profile(results: List[DimensionResult]) -> str:
    parts = []
    for item in results:
        meta = DIMENSION_META[item.dimension]
        parts.append(f"{meta['name']}上，你更常呈现{direction_label(item)}。")
    return "".join(parts)


def build_collaboration_advice(results: List[DimensionResult]) -> str:
    flexible = flexible_dimensions(results)
    if flexible:
        return f"和别人协作时，建议先说明你在 {flexible} 上可能会随场景调整，这能减少对方把你误读成前后不一致。"
    return "和别人协作时，可以把你较稳定的偏好提前说明，让对方知道你通常如何恢复能量、理解信息、做决定和推进事情。"


def build_conservative_summary(results: List[DimensionResult]) -> str:
    return "这份结果主要反映你在本次回答中呈现出的行为线索。清楚的维度可以参考，灵活的维度建议继续观察最近几次真实场景里的反应。"

