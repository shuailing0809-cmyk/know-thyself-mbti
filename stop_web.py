from __future__ import annotations

import os
import signal
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parent
PID_PATH = PROJECT_ROOT / "storage" / "web_server.pid"
URL_PATH = PROJECT_ROOT / "storage" / "web_url.txt"


def main() -> int:
    if not PID_PATH.exists():
        print("没有发现正在运行的测评服务。")
        return 0

    pid_text = PID_PATH.read_text(encoding="utf-8").strip()
    if not pid_text:
        print("没有发现正在运行的测评服务。")
        return 0

    pid = int(pid_text)
    try:
        os.kill(pid, signal.SIGTERM)
    except ProcessLookupError:
        print("测评服务已经关闭。")
    else:
        print("已关闭测评服务。")
    clear_runtime_files()
    return 0


def clear_runtime_files() -> None:
    for path in (PID_PATH, URL_PATH):
        try:
            path.unlink()
        except FileNotFoundError:
            pass


if __name__ == "__main__":
    raise SystemExit(main())
