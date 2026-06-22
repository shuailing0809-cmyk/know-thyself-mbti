from __future__ import annotations

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.report import build_report
from app.schemas import DimensionResult


def result(
    dimension: str,
    score: int,
    direction: str,
    confidence: float,
    evidence: str = "L3",
    context: bool = False,
    insufficient: bool = False,
) -> dict:
    return DimensionResult(
        dimension=dimension,
        score=score,
        direction=direction,
        evidence_level=evidence,
        confidence=confidence,
        needs_followup=False,
        followup_used=False,
        context_dependency=context,
        insufficient=insufficient,
        user_visible_reason="这里有具体行为依据。",
    ).to_dict()


class ReportTestCase(unittest.TestCase):
    def test_high_report(self) -> None:
        report = build_report(
            {
                "EI": result("EI", 2, "E", 0.78, "L4"),
                "SN": result("SN", 3, "S", 0.7, "L3"),
                "TF": result("TF", 2, "T", 0.78, "L4"),
                "JP": result("JP", 2, "J", 0.78, "L4"),
            }
        )
        self.assertEqual(report.layer, "high")
        self.assertIn("ESTJ", report.text)
        self.assertIn("沟通与协作建议", report.text)

    def test_medium_report(self) -> None:
        report = build_report(
            {
                "EI": result("EI", 2, "E", 0.78, "L4"),
                "SN": result("SN", 5, "S", 0.42, "L2", context=True),
                "TF": result("TF", 3, "T", 0.7, "L3"),
                "JP": result("JP", 8, "P", 0.7, "L3"),
            }
        )
        self.assertEqual(report.layer, "medium")
        self.assertIn("参考方向", report.text)
        self.assertNotIn("压力状态", report.text)

    def test_low_report(self) -> None:
        report = build_report(
            {
                "EI": result("EI", 5, "E", 0.35, "L1", True, True),
                "SN": result("SN", 5, "S", 0.35, "L1", True, True),
                "TF": result("TF", 5, "T", 0.35, "L1", False, True),
                "JP": result("JP", 5, "J", 0.35, "L1", False, True),
            }
        )
        self.assertEqual(report.layer, "low")
        self.assertIn("不适合输出完整人格画像", report.text)
        self.assertNotIn("沟通与协作建议", report.text)


if __name__ == "__main__":
    unittest.main()

