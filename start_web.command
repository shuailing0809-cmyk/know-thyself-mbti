#!/bin/bash
cd "$(dirname "$0")"
mkdir -p storage
export PYTHONPYCACHEPREFIX="${TMPDIR:-/tmp}/mbti_agent_pycache"
python3 -u start_web.py 2>&1 | tee storage/web_start.log
echo
read -r -p "按回车关闭这个窗口..."
