from __future__ import annotations

from typing import Optional

from .data_loader import get_main_question
from .followup import select_followup_question
from .report import build_report
from .schemas import AgentReply, DIMENSION_ORDER, DimensionResult, SessionState
from .scoring import score_answer
from .state import StateStore


WELCOME_MESSAGE = """欢迎来到心灵空间。

我会通过 4 个情境问题帮你更好地了解自己。这不是诊断，只是自我探索，你可以随时退出。

准备好了就开始。"""

EXIT_MESSAGE = "好的，尊重你的选择。以后想继续探索，随时可以回来。"

CONFIRM_WORDS = ["好", "可以", "开始", "准备好了", "来吧", "继续"]
EXIT_WORDS = ["退出", "不想做", "不做了", "算了", "停止", "结束"]


class MBTIAgent:
    def __init__(self, store: Optional[StateStore] = None) -> None:
        self.store = store or StateStore()

    def start_session(self) -> AgentReply:
        state = self.store.create_session()
        self.store.append_message(state.session_id, "assistant", WELCOME_MESSAGE)
        return AgentReply(
            session_id=state.session_id,
            message=WELCOME_MESSAGE,
            status=state.status,
        )

    def handle_message(self, session_id: str, message: str) -> AgentReply:
        state = self.store.get_session(session_id)
        self.store.append_message(session_id, "user", message)

        if is_exit(message):
            state.status = "exited"
            self.store.save_session(state)
            self.store.append_message(session_id, "assistant", EXIT_MESSAGE)
            return AgentReply(session_id, EXIT_MESSAGE, state.status)

        if state.status == "waiting_confirmation":
            reply = self._handle_confirmation(state, message)
        elif state.status == "waiting_answer":
            reply = self._handle_dimension_answer(state, message)
        elif state.status == "waiting_followup":
            reply = self._handle_followup_answer(state, message)
        elif state.status == "completed":
            reply = "这次测评已经完成。你可以重新开始一个新会话，或者告诉我你觉得哪里准、哪里不准。"
        elif state.status == "exited":
            reply = "这次测评已经结束。你可以重新开始一个新会话。"
        else:
            reply = WELCOME_MESSAGE

        self.store.save_session(state)
        self.store.append_message(session_id, "assistant", reply)
        return AgentReply(
            session_id=session_id,
            message=reply,
            status=state.status,
            completed=state.status == "completed",
        )

    def _handle_confirmation(self, state: SessionState, message: str) -> str:
        if not is_confirm(message):
            return "没问题。你准备好后，回复“开始”就行。"
        state.status = "waiting_answer"
        state.current_dimension_index = 0
        return get_main_question(state.current_dimension()).question

    def _handle_dimension_answer(self, state: SessionState, message: str) -> str:
        dimension = state.current_dimension()
        result = score_answer(dimension, message, phase="main")
        if result.needs_followup and state.followup_counts.get(dimension, 0) == 0:
            state.status = "waiting_followup"
            state.pending_answer = message
            state.pending_result = result.to_dict()
            state.followup_counts[dimension] = 1
            return select_followup_question(
                dimension, context_dependency=result.context_dependency
            )
        return self._complete_dimension(state, result)

    def _handle_followup_answer(self, state: SessionState, message: str) -> str:
        dimension = state.current_dimension()
        result = score_answer(
            dimension,
            message,
            phase="followup",
            followup_used=True,
        )
        if state.pending_result:
            result = merge_pending_context(
                DimensionResult.from_dict(state.pending_result), result
            )
        state.pending_answer = None
        state.pending_result = None
        return self._complete_dimension(state, result)

    def _complete_dimension(self, state: SessionState, result: DimensionResult) -> str:
        state.dimension_results[result.dimension] = result.to_dict()
        next_index = state.current_dimension_index + 1
        if next_index < len(DIMENSION_ORDER):
            state.current_dimension_index = next_index
            state.status = "waiting_answer"
            question = get_main_question(state.current_dimension()).question
            return f"了解，我们看下一个情境。\n\n{question}"

        report = build_report(state.dimension_results)
        state.report_text = report.text
        state.report_layer = report.layer
        state.status = "completed"
        return report.text


def merge_pending_context(
    pending: DimensionResult, followup: DimensionResult
) -> DimensionResult:
    followup.context_dependency = (
        followup.context_dependency or pending.context_dependency
    )
    if followup.insufficient and not pending.insufficient:
        followup.user_visible_reason = (
            "你后续补充仍然比较保留，所以我会结合前面的回答，把这一维放在较灵活的位置。"
        )
    return followup


def is_confirm(message: str) -> bool:
    return any(word in message for word in CONFIRM_WORDS)


def is_exit(message: str) -> bool:
    return any(word in message for word in EXIT_WORDS)

