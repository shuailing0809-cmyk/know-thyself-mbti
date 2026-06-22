from __future__ import annotations

from .agent import MBTIAgent
from .state import StateStore


def main() -> None:
    agent = MBTIAgent(StateStore())
    reply = agent.start_session()
    print(reply.message)
    session_id = reply.session_id
    while True:
        try:
            user_input = input("\n你：").strip()
        except (EOFError, KeyboardInterrupt):
            print("\n已结束。")
            break
        if not user_input:
            continue
        reply = agent.handle_message(session_id, user_input)
        print(f"\nAgent：{reply.message}")
        if reply.status in {"completed", "exited"}:
            break


if __name__ == "__main__":
    main()

