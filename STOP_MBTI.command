#!/bin/bash
cd "$(dirname "$0")" || exit 1
export PYTHONPYCACHEPREFIX="${TMPDIR:-/tmp}/mbti_agent_pycache"
python3 stop_web.py
echo
read -r -p "Press Enter to close this window..."
