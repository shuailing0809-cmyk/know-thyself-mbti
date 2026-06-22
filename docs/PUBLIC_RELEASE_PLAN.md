# Know-Thyself Journey MBTI 测评发布计划

## 一、发布目标

把当前 MBTI 对话式测评 Agent 发布为一个免费 H5 测评产品，并通过个人微信公众号提供入口。

第一版采用：

公众号菜单 / 文章 / 自动回复 → H5 测评网页 → 用户完成对话测评 → 查看报告 → 提交反馈

暂不强行做公众号聊天框内完整测评，避免个人公众号接口权限、回复时限和体验限制带来的风险。

## 二、当前推荐架构

```text
微信公众号
  └─ 自定义菜单：开始测评
      └─ HTTPS H5 页面
          ├─ 前端对话测评
          ├─ 本地生成报告
          └─ /api/feedback 提交反馈

FastAPI 服务
  ├─ 托管 public/ 静态页面
  ├─ 接收反馈数据
  └─ SQLite 持久化存储
```

## 三、已经完成的发布准备

- `public/index.html`：正式 H5 测评页。
- `public/mbti_experience_v2.js`：当前测评判读与报告逻辑。
- `public/privacy.html`：隐私说明。
- `public/terms.html`：使用说明。
- `app/main.py`：托管页面并接收反馈。
- `app/state.py`：新增反馈记录和事件记录表。
- `Dockerfile`：容器化部署入口。
- `render.yaml`：可选的 Render 部署配置。

## 四、上线前需要确认的资源

### 1. 域名

建议准备一个简短域名，例如：

```text
knowthyselfjourney.com
mbti.你的域名.com
```

如果暂时没有域名，可以先使用云平台提供的 HTTPS 临时域名做内测，再绑定正式域名。

### 2. 服务器 / 托管平台

推荐优先级：

1. 有持久化磁盘的云服务器或应用托管平台。
2. Render / Railway / Fly.io 等支持 Docker 的应用平台。
3. 纯静态托管平台只适合展示页面，不适合收集反馈数据。

如果选择国内服务器和国内域名，可能需要备案。为了快速内测，可先使用海外或香港节点。

### 3. 公众号后台

已确认个人公众号支持自定义菜单。

后续需要你本人在后台完成：

- 登录公众号后台。
- 添加菜单：`开始测评`。
- 菜单类型选择：跳转网页。
- 填入我部署完成后提供的 HTTPS 链接。
- 点击保存并发布。

## 五、部署步骤

### 本地验证

```bash
cd /Users/shuailing/Documents/Playground/mbti_agent
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000
```

打开：

```text
http://127.0.0.1:8000
```

反馈数据默认写入：

```text
storage/mbti_agent.sqlite3
```

查看反馈：

```bash
sqlite3 storage/mbti_agent.sqlite3 \
  'select id, rating, usefulness, natural_type, strategy_type, clarity, created_at from feedback_records order by id desc;'
```

### 线上部署

使用 Docker：

```bash
cd /Users/shuailing/Documents/Playground/mbti_agent
docker build -t know-thyself-mbti .
docker run -p 8000:8000 -v "$PWD/storage:/app/storage" know-thyself-mbti
```

上线平台需要配置：

```text
启动命令：uvicorn app.main:app --host 0.0.0.0 --port $PORT
持久化目录：/app/storage
健康检查：/health
```

## 六、公众号菜单配置

建议第一版菜单：

```text
开始测评
```

菜单动作：

```text
跳转网页
```

网页地址：

```text
https://你的正式域名/
```

如果公众号后台要求填写备用说明，可用：

```text
通过 4 个情境问题，探索你的自然偏好、外显策略和内在成本。
```

## 七、上线前测试清单

- 微信内置浏览器可以打开页面。
- 点击“开始测评”后，每次只出现一个问题。
- 用户按 Enter 可以发送，Shift + Enter 可以换行。
- 四题完成后可以看到报告。
- 报告可以复制。
- 反馈评分可以提交。
- 数据库能看到反馈记录。
- 隐私说明和使用说明可以打开。
- 公众号菜单跳转正常。

## 八、后续迭代

第一版上线后，重点收集：

- 评分低于 3 分的反馈。
- 用户认为“不准确”的维度。
- TF、JP、SN、EI 的误判样本。
- 用户觉得追问自然或不自然的地方。

这些反馈会进入回归样本库，防止同类问题重复出现。
