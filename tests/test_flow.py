from __future__ import annotations

import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.agent import MBTIAgent
from app.state import StateStore


class FlowTestCase(unittest.TestCase):
    def make_agent(self) -> MBTIAgent:
        self.tmp = tempfile.TemporaryDirectory()
        db_path = str(Path(self.tmp.name) / "test.sqlite3")
        return MBTIAgent(StateStore(db_path))

    def tearDown(self) -> None:
        tmp = getattr(self, "tmp", None)
        if tmp:
            tmp.cleanup()

    def start(self, agent: MBTIAgent) -> str:
        reply = agent.start_session()
        session_id = reply.session_id
        reply = agent.handle_message(session_id, "开始")
        self.assertIn("周末", reply.message)
        return session_id

    def test_clear_sample_completes_full_report(self) -> None:
        agent = self.make_agent()
        session_id = self.start(agent)

        replies = [
            agent.handle_message(
                session_id,
                "我会约朋友出去聊天，社交后更有能量，基本每次都这样。",
            ),
            agent.handle_message(
                session_id,
                "上次学软件我先找教程视频，照着步骤一步步做。",
            ),
            agent.handle_message(
                session_id,
                "我会直接拒绝并说明原因，这件事不合理，关系归关系。",
            ),
            agent.handle_message(
                session_id,
                "我会提前安排路线，如果临时变化就赶紧重新安排，不然会焦虑。",
            ),
        ]

        final = replies[-1]
        state = agent.store.get_session(session_id)
        self.assertEqual(final.status, "completed")
        self.assertEqual(state.report_layer, "high")
        self.assertIn("ESTJ", final.message)
        self.assertNotIn("confidence", final.message)
        self.assertNotIn("L1", final.message)
        self.assertNotIn("H层", final.message)

    def test_each_dimension_at_most_one_followup(self) -> None:
        agent = self.make_agent()
        session_id = self.start(agent)

        reply = agent.handle_message(session_id, "两种都有，看状态。")
        self.assertIn("精力", reply.message)
        state = agent.store.get_session(session_id)
        self.assertEqual(state.followup_counts["EI"], 1)

        reply = agent.handle_message(session_id, "还是不一定，我不想补充。")
        self.assertIn("陌生的东西", reply.message)
        state = agent.store.get_session(session_id)
        self.assertEqual(state.current_dimension(), "SN")
        self.assertEqual(state.followup_counts["EI"], 1)

    def test_waits_for_user_and_only_asks_one_question(self) -> None:
        agent = self.make_agent()
        reply = agent.start_session()
        self.assertEqual(reply.status, "waiting_confirmation")
        self.assertIn("准备好了", reply.message)
        self.assertNotIn("陌生的东西", reply.message)


if __name__ == "__main__":
    unittest.main()
