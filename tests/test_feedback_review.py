from __future__ import annotations

import json
import sqlite3
import sys
import tempfile
import unittest
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.feedback_review import classify_feedback, load_feedback_for_day, render_digest
from app.state import StateStore


class FeedbackReviewTestCase(unittest.TestCase):
    def setUp(self) -> None:
        self.tmp = tempfile.TemporaryDirectory()
        self.db_path = Path(self.tmp.name) / "test.sqlite3"
        StateStore(str(self.db_path))

    def tearDown(self) -> None:
        self.tmp.cleanup()

    def insert_feedback(self, payload: dict, created_at: str = "2026-06-22T05:00:00Z") -> None:
        evaluation = payload.get("evaluation") if isinstance(payload.get("evaluation"), dict) else {}
        with sqlite3.connect(str(self.db_path)) as conn:
            conn.execute(
                """
                INSERT INTO feedback_records(
                    client_id, rating, usefulness, natural_type, strategy_type, clarity, payload_json, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    payload.get("clientId", "test-client"),
                    payload.get("rating"),
                    evaluation.get("usefulness", ""),
                    payload.get("naturalType", ""),
                    payload.get("strategyType", ""),
                    payload.get("clarity", ""),
                    json.dumps(payload, ensure_ascii=False),
                    created_at,
                ),
            )

    def test_specific_dimension_feedback_needs_review(self) -> None:
        payload = {
            "rating": 3,
            "agreeText": "TF 的判断基本符合。",
            "disagreeText": "SN 我更倾向于 S，因为只给抽象框架会困难，我需要具体步骤和例子。",
        }
        bucket, reason = classify_feedback(payload)
        self.assertEqual(bucket, "待复核")
        self.assertIn("具体维度", reason)

    def test_rating_only_is_weak_feedback(self) -> None:
        bucket, reason = classify_feedback({"rating": 5})
        self.assertEqual(bucket, "弱反馈")
        self.assertIn("只有评分", reason)

    def test_harmful_feedback_is_quarantined(self) -> None:
        bucket, _ = classify_feedback({"rating": 1, "disagreeText": "垃圾人，去死"})
        self.assertEqual(bucket, "隔离")

    def test_daily_digest_groups_review_items(self) -> None:
        self.insert_feedback(
            {
                "rating": 3,
                "agreeText": "P 判断符合。",
                "disagreeText": "EI 不应该强判 E，因为这个人外显不主动，应该标为情境化。",
                "naturalType": "ENFP",
                "strategyType": "ESTP",
                "clarity": "较清晰",
            }
        )
        items = load_feedback_for_day(self.db_path, date(2026, 6, 22))
        digest = render_digest(items, date(2026, 6, 22))
        self.assertIn("待复核：1", digest)
        self.assertIn("EI 不应该强判 E", digest)


if __name__ == "__main__":
    unittest.main()
