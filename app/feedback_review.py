from __future__ import annotations

import argparse
import json
import sqlite3
from dataclasses import dataclass
from datetime import date, datetime, time, timezone
from pathlib import Path
from typing import Iterable, Optional
from zoneinfo import ZoneInfo

from .state import DEFAULT_DB_PATH


REVIEW_TZ = ZoneInfo("Asia/Shanghai")
DIMENSION_WORDS = ("EI", "SN", "TF", "JP", "E", "I", "S", "N", "T", "F", "J", "P")
SPECIFIC_WORDS = (
    "因为",
    "比如",
    "例如",
    "我觉得",
    "我认为",
    "更倾向",
    "不准确",
    "不符合",
    "符合",
    "准",
    "不准",
    "维度",
    "判断",
)
HARMFUL_WORDS = (
    "傻逼",
    "垃圾人",
    "去死",
    "自杀",
    "歧视",
    "种族",
    "性别歧视",
    "纳粹",
)


@dataclass
class FeedbackItem:
    id: int
    rating: Optional[int]
    usefulness: str
    natural_type: str
    strategy_type: str
    clarity: str
    created_at: str
    payload: dict
    review_bucket: str
    review_reason: str


def shanghai_day_bounds(target_day: date) -> tuple[str, str]:
    start_local = datetime.combine(target_day, time.min, tzinfo=REVIEW_TZ)
    end_local = datetime.combine(target_day, time.max, tzinfo=REVIEW_TZ)
    start_utc = start_local.astimezone(timezone.utc).replace(tzinfo=None)
    end_utc = end_local.astimezone(timezone.utc).replace(tzinfo=None)
    return (
        start_utc.isoformat(timespec="seconds") + "Z",
        end_utc.isoformat(timespec="seconds") + "Z",
    )


def load_feedback_for_day(db_path: Path, target_day: date) -> list[FeedbackItem]:
    start_utc, end_utc = shanghai_day_bounds(target_day)
    with sqlite3.connect(str(db_path)) as conn:
        rows = conn.execute(
            """
            SELECT id, rating, usefulness, natural_type, strategy_type, clarity, payload_json, created_at
            FROM feedback_records
            WHERE created_at >= ? AND created_at <= ?
            ORDER BY id ASC
            """,
            (start_utc, end_utc),
        ).fetchall()

    items: list[FeedbackItem] = []
    for row in rows:
        payload = safe_json_loads(row[6])
        bucket, reason = classify_feedback(payload)
        items.append(
            FeedbackItem(
                id=row[0],
                rating=row[1],
                usefulness=str(row[2] or ""),
                natural_type=str(row[3] or ""),
                strategy_type=str(row[4] or ""),
                clarity=str(row[5] or ""),
                payload=payload,
                created_at=str(row[7] or ""),
                review_bucket=bucket,
                review_reason=reason,
            )
        )
    return items


def classify_feedback(payload: dict) -> tuple[str, str]:
    rating = payload.get("rating")
    agree_text = str(payload.get("agreeText") or "").strip()
    disagree_text = str(payload.get("disagreeText") or "").strip()
    combined = f"{agree_text} {disagree_text}"
    evaluation = payload.get("evaluation") if isinstance(payload.get("evaluation"), dict) else {}

    if contains_any(combined, HARMFUL_WORDS):
        return "隔离", "包含攻击性、有害或不适合进入样本库的表达"

    if evaluation.get("valid") is False:
        return "弱反馈", "系统初筛认为具体性不足"

    if not agree_text and not disagree_text:
        return "弱反馈", "只有评分，没有说明"

    has_dimension = contains_any(combined.upper(), DIMENSION_WORDS)
    has_specific_reason = contains_any(combined, SPECIFIC_WORDS) or len(combined) >= 40
    is_low_rating = isinstance(rating, int) and rating <= 3

    if has_dimension and has_specific_reason:
        return "待复核", "包含具体维度和可讨论理由"

    if is_low_rating and has_specific_reason:
        return "待复核", "低评分且说明较具体"

    return "只统计", "有一定参考，但暂不直接进入规则复核"


def render_digest(items: Iterable[FeedbackItem], target_day: date) -> str:
    item_list = list(items)
    counts = {
        "待复核": sum(1 for item in item_list if item.review_bucket == "待复核"),
        "只统计": sum(1 for item in item_list if item.review_bucket == "只统计"),
        "弱反馈": sum(1 for item in item_list if item.review_bucket == "弱反馈"),
        "隔离": sum(1 for item in item_list if item.review_bucket == "隔离"),
    }
    lines = [
        f"# MBTI 测评反馈复核日报：{target_day.isoformat()}",
        "",
        "## 复核原则",
        "",
        "- 用户反馈不会自动修改测评规则。",
        "- 只有“待复核”反馈会进入你和 Codex 的人工确认环节。",
        "- 被采纳的反馈必须能转成可回放样本，并通过回归测试。",
        "",
        "## 今日概览",
        "",
        f"- 总反馈数：{len(item_list)}",
        f"- 待复核：{counts['待复核']}",
        f"- 只统计：{counts['只统计']}",
        f"- 弱反馈：{counts['弱反馈']}",
        f"- 隔离：{counts['隔离']}",
        "",
        "## 待复核反馈",
        "",
    ]

    review_items = [item for item in item_list if item.review_bucket == "待复核"]
    if not review_items:
        lines.append("今日没有需要人工复核的具体反馈。")
    else:
        for item in review_items:
            lines.extend(render_item(item))

    non_review_items = [item for item in item_list if item.review_bucket != "待复核"]
    if non_review_items:
        lines.extend(["", "## 仅统计 / 弱反馈 / 隔离", ""])
        for item in non_review_items:
            lines.extend(render_item(item, compact=True))

    return "\n".join(lines).rstrip() + "\n"


def render_item(item: FeedbackItem, compact: bool = False) -> list[str]:
    agree = str(item.payload.get("agreeText") or "").strip() or "未填写"
    disagree = str(item.payload.get("disagreeText") or "").strip() or "未填写"
    lines = [
        f"### 反馈 #{item.id}",
        "",
        f"- 分类：{item.review_bucket}",
        f"- 分类原因：{item.review_reason}",
        f"- 评分：{item.rating or '未记录'}",
        f"- 自然偏好 / 外显策略：{item.natural_type or '未知'} / {item.strategy_type or '未知'}",
        f"- 清晰度：{item.clarity or '未知'}",
        f"- 提交时间：{item.created_at}",
    ]
    if not compact:
        lines.extend(
            [
                f"- 认为一致：{agree}",
                f"- 认为不准确：{disagree}",
                "- 复核结论：待你和 Codex 确认",
            ]
        )
    return lines + [""]


def safe_json_loads(raw: str) -> dict:
    try:
        value = json.loads(raw)
    except json.JSONDecodeError:
        return {}
    return value if isinstance(value, dict) else {}


def contains_any(text: str, words: Iterable[str]) -> bool:
    return any(word and word in text for word in words)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate a daily MBTI feedback review digest.")
    parser.add_argument("--date", help="Feedback date in Asia/Shanghai, YYYY-MM-DD.")
    parser.add_argument("--db", default=str(DEFAULT_DB_PATH), help="SQLite database path.")
    parser.add_argument("--output", help="Markdown output path. If omitted, prints to stdout.")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    target_day = date.fromisoformat(args.date) if args.date else datetime.now(REVIEW_TZ).date()
    items = load_feedback_for_day(Path(args.db), target_day)
    digest = render_digest(items, target_day)
    if args.output:
        output_path = Path(args.output)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(digest, encoding="utf-8")
    else:
        print(digest)


if __name__ == "__main__":
    main()
