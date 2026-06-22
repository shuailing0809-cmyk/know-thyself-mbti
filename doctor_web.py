from __future__ import annotations

import errno
import socket
import sys
import traceback
from datetime import datetime
from pathlib import Path
from typing import List


PROJECT_ROOT = Path(__file__).resolve().parent
LOG_PATH = PROJECT_ROOT / "storage" / "web_diagnose.log"
HOST = "127.0.0.1"
PORTS = range(8000, 8011)


def main() -> int:
    LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
    lines: List[str] = []

    add(lines, "MBTI 网页体验诊断")
    add(lines, f"时间：{datetime.now().isoformat(timespec='seconds')}")
    add(lines, f"项目目录：{PROJECT_ROOT}")
    add(lines, f"Python：{sys.executable}")
    add(lines, f"Python 版本：{sys.version.split()[0]}")
    add(lines, "")

    check_file(lines, PROJECT_ROOT / "app" / "http_server.py")
    check_file(lines, PROJECT_ROOT / "app" / "static" / "index.html")
    check_file(lines, PROJECT_ROOT / "app" / "static" / "app.js")
    check_file(lines, PROJECT_ROOT / "app" / "static" / "styles.css")
    add(lines, "")

    try:
        from app.http_server import AgentHTTPHandler  # noqa: F401
        from app.state import StateStore

        store = StateStore()
        add(lines, "服务加载：通过")
        add(lines, f"数据记录：通过，位置 {store.db_path}")
    except Exception:
        add(lines, "服务加载：失败")
        add(lines, traceback.format_exc())
        write_and_print(lines)
        return 1

    add(lines, "")
    add(lines, "端口检查：")
    available = []
    for port in PORTS:
        status = check_port(port)
        add(lines, f"- {HOST}:{port} {status}")
        if status == "可启动":
            available.append(port)

    add(lines, "")
    if available:
        add(lines, f"结论：可以启动，建议使用端口 {available[0]}。")
    else:
        add(lines, "结论：8000-8010 都不可启动，请关闭占用端口的程序或检查系统权限。")

    write_and_print(lines)
    return 0 if available else 1


def check_file(lines: List[str], path: Path) -> None:
    status = "存在" if path.exists() else "缺失"
    add(lines, f"文件检查：{path.name} {status}")


def check_port(port: int) -> str:
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    try:
        sock.bind((HOST, port))
        return "可启动"
    except OSError as error:
        if error.errno == errno.EADDRINUSE:
            return "已被占用"
        if error.errno in {errno.EACCES, errno.EPERM}:
            return "被系统权限阻止"
        return f"异常：{error}"
    finally:
        sock.close()


def add(lines: List[str], text: str) -> None:
    lines.append(text)


def write_and_print(lines: List[str]) -> None:
    text = "\n".join(lines)
    LOG_PATH.write_text(text + "\n", encoding="utf-8")
    print(text)
    print("")
    print(f"诊断日志：{LOG_PATH}")


if __name__ == "__main__":
    sys.exit(main())
