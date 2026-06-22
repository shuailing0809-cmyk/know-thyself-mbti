from __future__ import annotations

from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from .agent import MBTIAgent
from .state import DEFAULT_DB_PATH, StateStore


class MessageIn(BaseModel):
    message: str


class FeedbackIn(BaseModel):
    clientId: Optional[str] = ""
    rating: Optional[int] = None
    agreeText: Optional[str] = ""
    disagreeText: Optional[str] = ""
    evaluation: dict = Field(default_factory=dict)
    naturalType: Optional[str] = ""
    strategyType: Optional[str] = ""
    clarity: Optional[str] = ""
    reportSummary: dict = Field(default_factory=dict)
    createdAt: Optional[str] = ""


class EventIn(BaseModel):
    clientId: Optional[str] = ""
    eventName: str = "unknown"
    payload: dict = Field(default_factory=dict)
    createdAt: Optional[str] = ""


class SessionOut(BaseModel):
    session_id: str
    message: str
    status: str
    completed: bool = False


app = FastAPI(title="MBTI Conversational Assessment Agent")
store = StateStore()
agent = MBTIAgent(store)
PUBLIC_DIR = Path(__file__).resolve().parents[1] / "public"


@app.get("/")
def index() -> FileResponse:
    return FileResponse(PUBLIC_DIR / "index.html")


@app.get("/health")
def health() -> dict:
    return {"ok": True, "db_path": str(DEFAULT_DB_PATH)}


@app.post("/sessions", response_model=SessionOut)
def create_session() -> dict:
    return agent.start_session().to_dict()


@app.post("/sessions/{session_id}/messages", response_model=SessionOut)
def send_message(session_id: str, payload: MessageIn) -> dict:
    try:
        return agent.handle_message(session_id, payload.message).to_dict()
    except KeyError:
        raise HTTPException(status_code=404, detail="session not found")


@app.get("/sessions/{session_id}/report")
def get_report(session_id: str) -> dict:
    try:
        state = agent.store.get_session(session_id)
    except KeyError:
        raise HTTPException(status_code=404, detail="session not found")
    if state.status != "completed" or not state.report_text:
        raise HTTPException(status_code=409, detail="assessment not completed")
    return {"session_id": session_id, "report": state.report_text}


@app.post("/api/feedback")
def save_feedback(payload: FeedbackIn) -> dict:
    data = payload.model_dump()
    if not data.get("rating"):
        raise HTTPException(status_code=400, detail="rating is required")
    store.save_feedback(data)
    return {"ok": True}


@app.post("/api/events")
def save_event(payload: EventIn) -> dict:
    store.save_event(payload.model_dump())
    return {"ok": True}


if PUBLIC_DIR.exists():
    app.mount("/", StaticFiles(directory=PUBLIC_DIR, html=True), name="public")
