from __future__ import annotations

import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.agent import MBTIAgent
from app.state import StateStore


class EdgeCaseTestCase(unittest.TestCase):
    def make_agent(self) -> MBTIAgent:
        self.tmp = tempfile.TemporaryDirectory()
        db_path = str(Path(self.tmp.name) / "test.sqlite3")
        return MBTIAgent(StateStore(db_path))

    def tearDown(self) -> None:
        tmp = getattr(self, "tmp", None)
        if tmp:
            tmp.cleanup()

    def run_answers(self, answers):
        agent = self.make_agent()
        reply = agent.start_session()
        session_id = reply.session_id
        agent.handle_message(session_id, "开始")
        last = None
        for answer in answers:
            last = agent.handle_message(session_id, answer)
        return agent, session_id, last

    def test_gray_sample_outputs_conservative_report(self) -> None:
        answers = [
            "两种都有，看状态。",
            "长期看也差不多一半一半。",
            "看内容，不一定。",
            "不同内容不同方法，很难固定一种。",
            "我会直接拒绝并说明原因，事情不合理就不做。",
            "我大致有方向就行，临时变化顺着走。",
        ]
        agent, session_id, final = self.run_answers(answers)
        state = agent.store.get_session(session_id)
        self.assertEqual(final.status, "completed")
        self.assertIn(state.report_layer, {"medium", "low"})
        self.assertNotIn("你就是", final.message)

    def test_all_uncertain_outputs_minimal_report(self) -> None:
        answers = [
            "不确定，看情况。",
            "不想补充。",
            "都有，不一定。",
            "不想补充。",
            "看人吧，不好说。",
            "不想补充。",
            "看事情重要程度。",
            "不想补充。",
        ]
        agent, session_id, final = self.run_answers(answers)
        state = agent.store.get_session(session_id)
        self.assertEqual(state.report_layer, "low")
        self.assertIn("当前倾向", final.message)
        self.assertIn("不适合输出完整人格画像", final.message)


if __name__ == "__main__":
    unittest.main()

