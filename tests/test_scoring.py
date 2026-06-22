from __future__ import annotations

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.scoring import score_answer


class ScoringTestCase(unittest.TestCase):
    def test_both_and_uncertain_stays_conservative(self) -> None:
        result = score_answer("EI", "两边都有，看情况，不一定。")
        self.assertTrue(result.needs_followup)
        self.assertEqual(result.score, 5)
        self.assertLessEqual(result.confidence, 0.45)

    def test_specific_behavior_gets_clearer_score(self) -> None:
        result = score_answer("SN", "上次学软件我先找教程，按步骤一步步做。")
        self.assertFalse(result.needs_followup)
        self.assertEqual(result.direction, "S")
        self.assertLessEqual(result.score, 4)

    def test_context_dependency_caps_strength(self) -> None:
        result = score_answer("TF", "看关系，亲近的人我担心对方不高兴，不熟的人就看原则。")
        self.assertTrue(result.context_dependency)
        self.assertTrue(result.needs_followup)
        self.assertIn(result.score, [5, 7])
        self.assertLessEqual(result.confidence, 0.48)

    def test_refusal_after_followup_is_middle(self) -> None:
        result = score_answer("JP", "不想补充，跳过。", phase="followup", followup_used=True)
        self.assertFalse(result.needs_followup)
        self.assertEqual(result.score, 5)
        self.assertTrue(result.insufficient)


if __name__ == "__main__":
    unittest.main()

