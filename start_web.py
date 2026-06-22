from __future__ import annotations

import errno
import os
import sys
import threading
import traceback
import webbrowser
from datetime import datetime
from http.server import ThreadingHTTPServer
from pathlib import Path
from typing import Optional


PROJECT_ROOT = Path(__file__).resolve().parent
LOG_PATH = PROJECT_ROOT / "storage" / "web_start.log"
PID_PATH = PROJECT_ROOT / "storage" / "web_server.pid"
URL_PATH = PROJECT_ROOT / "storage" / "web_url.txt"
HOST = "127.0.0.1"
PORTS = range(8000, 8011)


def main() -> int:
    LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
    write_log("starting")
    PID_PATH.write_text(str(os.getpid()), encoding="utf-8")

    try:
        from app.http_server import AgentHTTPHandler
    except Exception:
        message = "测评服务加载失败，请把 storage/web_start.log 发给我。"
        print(message)
        write_log("import failed")
        write_log(traceback.format_exc())
        return 1

    server: Optional[ThreadingHTTPServer] = None
    last_error: Optional[OSError] = None

    for port in PORTS:
        try:
            server = ThreadingHTTPServer((HOST, port), AgentHTTPHandler)
            write_log(f"bound {HOST}:{port}")
            break
        except OSError as error:
            last_error = error
            write_log(f"bind failed {HOST}:{port}: {error!r}")
            if error.errno not in {errno.EADDRINUSE, errno.EACCES, errno.EPERM}:
                raise

    if server is None:
        print("没有成功启动测评页面。")
        if last_error and last_error.errno == errno.EADDRINUSE:
            print("8000-8010 这些端口都被占用了，请先关闭其他正在运行的本地服务。")
        elif last_error and last_error.errno in {errno.EACCES, errno.EPERM}:
            print("系统拒绝启动本地页面，请在普通终端里运行，或检查安全软件限制。")
        else:
            print("请把 storage/web_start.log 发给我。")
        print(f"日志位置：{LOG_PATH}")
        return 1

    url = f"http://{HOST}:{server.server_port}/"
    URL_PATH.write_text(url, encoding="utf-8")
    print("MBTI 对话式测评已启动。")
    print(f"请打开这个地址：{url}")
    print("测试期间请不要关闭这个终端窗口。")
    print("结束测试时，按 Control + C 关闭。")
    print(f"启动日志：{LOG_PATH}")
    write_log(f"serving {url}")

    threading.Timer(0.8, webbrowser.open, args=(url,)).start()

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n已关闭测评页面。")
        write_log("stopped by user")
    except Exception:
        write_log("server crashed")
        write_log(traceback.format_exc())
        raise
    finally:
        server.server_close()
        clear_runtime_files()
    return 0


def write_log(message: str) -> None:
    timestamp = datetime.now().isoformat(timespec="seconds")
    with LOG_PATH.open("a", encoding="utf-8") as file:
        file.write(f"[{timestamp}] {message}\n")


def clear_runtime_files() -> None:
    for path in (PID_PATH, URL_PATH):
        try:
            path.unlink()
        except FileNotFoundError:
            pass


if __name__ == "__main__":
    sys.exit(main())
