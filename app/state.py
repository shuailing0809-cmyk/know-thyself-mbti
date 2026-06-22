from __future__ import annotations

import json
import os
import sqlite3
import uuid
from datetime import datetime
from pathlib import Path
from typing import Optional

from .schemas import SessionState


PROJECT_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DB_PATH = PROJECT_ROOT / "storage" / "mbti_agent.sqlite3"


class StateStore:
    def __init__(self, db_path: Optional[str] = None) -> None:
        env_path = os.getenv("MBTI_AGENT_DB")
        self.db_path = Path(db_path or env_path or DEFAULT_DB_PATH)
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self._init_db()

    def _connect(self) -> sqlite3.Connection:
        return sqlite3.connect(str(self.db_path))

    def _init_db(self) -> None:
        with self._connect() as conn:
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS sessions (
                    session_id TEXT PRIMARY KEY,
                    state_json TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                )
                """
            )
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS messages (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    session_id TEXT NOT NULL,
                    role TEXT NOT NULL,
                    content TEXT NOT NULL,
                    created_at TEXT NOT NULL
                )
                """
            )
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS feedback_records (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    client_id TEXT,
                    rating INTEGER,
                    usefulness TEXT,
                    natural_type TEXT,
                    strategy_type TEXT,
                    clarity TEXT,
                    payload_json TEXT NOT NULL,
                    created_at TEXT NOT NULL
                )
                """
            )
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS assessment_events (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    client_id TEXT,
                    event_name TEXT NOT NULL,
                    payload_json TEXT NOT NULL,
                    created_at TEXT NOT NULL
                )
                """
            )

    def create_session(self) -> SessionState:
        now = utc_now()
        state = SessionState(session_id=str(uuid.uuid4()))
        with self._connect() as conn:
            conn.execute(
                "INSERT INTO sessions(session_id, state_json, created_at, updated_at) VALUES (?, ?, ?, ?)",
                (state.session_id, json.dumps(state.to_dict(), ensure_ascii=False), now, now),
            )
        return state

    def get_session(self, session_id: str) -> SessionState:
        with self._connect() as conn:
            row = conn.execute(
                "SELECT state_json FROM sessions WHERE session_id = ?", (session_id,)
            ).fetchone()
        if not row:
            raise KeyError(f"session not found: {session_id}")
        return SessionState.from_dict(json.loads(row[0]))

    def save_session(self, state: SessionState) -> None:
        now = utc_now()
        with self._connect() as conn:
            conn.execute(
                "UPDATE sessions SET state_json = ?, updated_at = ? WHERE session_id = ?",
                (json.dumps(state.to_dict(), ensure_ascii=False), now, state.session_id),
            )

    def append_message(self, session_id: str, role: str, content: str) -> None:
        with self._connect() as conn:
            conn.execute(
                "INSERT INTO messages(session_id, role, content, created_at) VALUES (?, ?, ?, ?)",
                (session_id, role, content, utc_now()),
            )

    def save_feedback(self, payload: dict) -> None:
        evaluation = payload.get("evaluation") if isinstance(payload.get("evaluation"), dict) else {}
        with self._connect() as conn:
            conn.execute(
                """
                INSERT INTO feedback_records(
                    client_id, rating, usefulness, natural_type, strategy_type, clarity, payload_json, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    str(payload.get("clientId") or ""),
                    payload.get("rating"),
                    str(evaluation.get("usefulness") or ""),
                    str(payload.get("naturalType") or ""),
                    str(payload.get("strategyType") or ""),
                    str(payload.get("clarity") or ""),
                    json.dumps(payload, ensure_ascii=False),
                    utc_now(),
                ),
            )

    def save_event(self, payload: dict) -> None:
        with self._connect() as conn:
            conn.execute(
                """
                INSERT INTO assessment_events(client_id, event_name, payload_json, created_at)
                VALUES (?, ?, ?, ?)
                """,
                (
                    str(payload.get("clientId") or ""),
                    str(payload.get("eventName") or "unknown"),
                    json.dumps(payload, ensure_ascii=False),
                    utc_now(),
                ),
            )


def utc_now() -> str:
    return datetime.utcnow().isoformat(timespec="seconds") + "Z"
