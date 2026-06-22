from __future__ import annotations

import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any, Dict
from urllib.parse import urlparse

from .agent import MBTIAgent
from .state import DEFAULT_DB_PATH, StateStore


agent = MBTIAgent(StateStore())
STATIC_DIR = Path(__file__).resolve().parent / "static"


class AgentHTTPHandler(BaseHTTPRequestHandler):
    def do_GET(self) -> None:
        path = urlparse(self.path).path
        if path == "/":
            self.write_file(STATIC_DIR / "index.html", "text/html; charset=utf-8")
            return

        if path in {"/static/styles.css", "/static/app.js"}:
            content_type = (
                "text/css; charset=utf-8"
                if path.endswith(".css")
                else "application/javascript; charset=utf-8"
            )
            self.write_file(STATIC_DIR / Path(path).name, content_type)
            return

        if path == "/health":
            self.write_json(200, {"ok": True, "db_path": str(DEFAULT_DB_PATH)})
            return

        match = match_report_path(path)
        if match:
            session_id = match
            try:
                state = agent.store.get_session(session_id)
            except KeyError:
                self.write_json(404, {"detail": "session not found"})
                return
            if state.status != "completed" or not state.report_text:
                self.write_json(409, {"detail": "assessment not completed"})
                return
            self.write_json(200, {"session_id": session_id, "report": state.report_text})
            return

        self.write_json(404, {"detail": "not found"})

    def do_POST(self) -> None:
        path = urlparse(self.path).path
        if path == "/sessions":
            self.write_json(200, agent.start_session().to_dict())
            return

        session_id = match_message_path(path)
        if session_id:
            payload = self.read_json()
            message = str(payload.get("message", ""))
            if not message:
                self.write_json(400, {"detail": "message is required"})
                return
            try:
                self.write_json(200, agent.handle_message(session_id, message).to_dict())
            except KeyError:
                self.write_json(404, {"detail": "session not found"})
            return

        self.write_json(404, {"detail": "not found"})

    def log_message(self, format: str, *args: Any) -> None:
        return

    def read_json(self) -> Dict[str, Any]:
        length = int(self.headers.get("Content-Length", "0"))
        if length <= 0:
            return {}
        raw = self.rfile.read(length).decode("utf-8")
        return json.loads(raw)

    def write_json(self, status: int, payload: Dict[str, Any]) -> None:
        data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def write_file(self, path: Path, content_type: str) -> None:
        if not path.exists():
            self.write_json(404, {"detail": "not found"})
            return
        data = path.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)


def match_message_path(path: str) -> str:
    parts = path.strip("/").split("/")
    if len(parts) == 3 and parts[0] == "sessions" and parts[2] == "messages":
        return parts[1]
    return ""


def match_report_path(path: str) -> str:
    parts = path.strip("/").split("/")
    if len(parts) == 3 and parts[0] == "sessions" and parts[2] == "report":
        return parts[1]
    return ""


def run(host: str = "127.0.0.1", port: int = 8000) -> None:
    server = ThreadingHTTPServer((host, port), AgentHTTPHandler)
    print(f"MBTI Agent HTTP server running at http://{host}:{port}")
    server.serve_forever()


if __name__ == "__main__":
    run()
