# MBTI 对话式测评 Agent

本项目是 MBTI 对话式测评 Agent：基于资料包规则实现对话流程、四维判断、必要追问、SQLite 会话记录、分层报告、网页体验页、命令行入口和 HTTP API。

当前状态：
- 本地网页体验页已可用于产品试测。
- 已准备公众号 H5 发布包，适合后续配置到公众号自定义菜单。
- 暂不直接操作公众号后台真实联调，公众号控制权仍由账号管理员保留。

## 安装依赖

建议在项目目录内创建虚拟环境：

```bash
cd /Users/shuailing/Documents/Playground/mbti_agent
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

核心 CLI 和测试使用标准库即可运行；HTTP API 需要安装 `requirements.txt` 中的依赖。

## 启动本地服务

无额外依赖的标准库 HTTP 服务：

```bash
cd /Users/shuailing/Documents/Playground/mbti_agent
python3 -m app.http_server
```

浏览器体验页：

```text
http://127.0.0.1:8000
```

安装依赖后，也可以使用 FastAPI 服务：

```bash
cd /Users/shuailing/Documents/Playground/mbti_agent
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

FastAPI 服务会同时提供：
- `/`：正式用户体验页
- `/api/feedback`：结果反馈收集接口
- `/health`：健康检查

健康检查：

```bash
curl http://127.0.0.1:8000/health
```

## 命令行测试

```bash
cd /Users/shuailing/Documents/Playground/mbti_agent
python3 -m app.cli
```

CLI 会先显示欢迎语，用户回复“开始”后进入四个情境问题。每次只问一个问题，必要时最多追问一次。

## HTTP API 测试

创建会话：

```bash
curl -X POST http://127.0.0.1:8000/sessions
```

发送用户消息：

```bash
curl -X POST http://127.0.0.1:8000/sessions/<session_id>/messages \
  -H 'Content-Type: application/json' \
  -d '{"message":"开始"}'
```

获取报告：

```bash
curl http://127.0.0.1:8000/sessions/<session_id>/report
```

如果测评未完成，报告接口会返回 `409`。

## 运行测试

```bash
cd /Users/shuailing/Documents/Playground
python3 -m unittest discover -s mbti_agent/tests
```

当前测试覆盖：

- 清晰型样本
- 灰区样本
- “都有 / 看情况 / 不一定”样本
- 用户拒绝补充样本
- 应输出完整报告的样本
- 应输出保守报告的样本
- 应输出极简报告的样本
- 每个维度最多追问一次
- 未确认开始前不提前出题

## SQLite 记录

默认数据库路径：

```text
/Users/shuailing/Documents/Playground/mbti_agent/storage/mbti_agent.sqlite3
```

可以通过环境变量覆盖：

```bash
export MBTI_AGENT_DB=/tmp/mbti_agent.sqlite3
```

查看会话：

```bash
sqlite3 /Users/shuailing/Documents/Playground/mbti_agent/storage/mbti_agent.sqlite3 'select session_id, state_json, updated_at from sessions;'
```

实际字段为：

```sql
select session_id, state_json, created_at, updated_at from sessions;
select session_id, role, content, created_at from messages order by id;
select rating, usefulness, natural_type, strategy_type, clarity, created_at from feedback_records order by id desc;
```

## 公众号发布准备

已生成发布目录：

```text
/Users/shuailing/Documents/Playground/mbti_agent/public
```

其中：
- `index.html` 是最终用户打开的测评页面。
- `mbti_experience_v2.js` 是当前测评逻辑与交互脚本。
- `privacy.html` 是隐私说明。
- `terms.html` 是使用说明。

部署说明见：

```text
/Users/shuailing/Documents/Playground/mbti_agent/docs/PUBLIC_RELEASE_PLAN.md
/Users/shuailing/Documents/Playground/mbti_agent/docs/WECHAT_MENU_SETUP.md
/Users/shuailing/Documents/Playground/mbti_agent/docs/AUTHORIZATION_AND_ACCESS.md
/Users/shuailing/Documents/Playground/mbti_agent/docs/FEEDBACK_REVIEW_POLICY.md
```

## 当前边界

- 不直接接管微信公众号后台。
- 当前只准备 H5 页面、自定义菜单配置方案和反馈接口。
- 不补写 `MBTI_KNOWLEDGE.md`。
- 不把开放式测评改成选择题。
- 用户可见报告不暴露内部证据层级、内部报告层级和置信度字段。
- 低清晰度样本只输出极简参考方向，不硬凑完整人格画像。
