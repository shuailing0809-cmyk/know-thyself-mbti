const messagesEl = document.getElementById("messages");
const formEl = document.getElementById("chatForm");
const inputEl = document.getElementById("messageInput");
const sendButtonEl = document.getElementById("sendButton");
const startButtonEl = document.getElementById("startButton");
const startAreaEl = document.getElementById("startArea");
const restartButtonEl = document.getElementById("restartButton");
const reportPanelEl = document.getElementById("reportPanel");
const reportContentEl = document.getElementById("reportContent");
const copyReportButtonEl = document.getElementById("copyReportButton");

let activeId = "";
let started = false;
let completed = false;
let busy = false;

async function prepareAssessment() {
  setBusy(true);
  started = false;
  completed = false;
  activeId = "";
  messagesEl.innerHTML = "";
  clearReport();
  startAreaEl.classList.remove("is-hidden");
  inputEl.value = "";
  inputEl.disabled = true;
  inputEl.placeholder = "点击“开始测评”后开始回答";

  try {
    const reply = await postJson("/sessions", {});
    activeId = reply.session_id;
    appendMessage("agent", reply.message);
  } catch (error) {
    appendMessage("agent", "测评暂时没有准备好，请稍后刷新页面再试。", true);
    startButtonEl.disabled = true;
  } finally {
    setBusy(false);
  }
}

async function startAssessment() {
  if (!activeId || busy || started) {
    return;
  }

  started = true;
  startAreaEl.classList.add("is-hidden");
  const sent = await sendMessage("开始", {
    displayText: "开始测评",
    keepInputDisabled: true,
  });
  if (!sent) {
    started = false;
    startAreaEl.classList.remove("is-hidden");
    inputEl.disabled = true;
    inputEl.placeholder = "点击“开始测评”后开始回答";
    setBusy(false);
    return;
  }
  if (!completed) {
    inputEl.disabled = false;
    inputEl.placeholder = "请结合真实经历回答，可以直接说“看情况”或举一个例子";
    inputEl.focus();
  }
}

async function sendMessage(message, options = {}) {
  const text = message.trim();
  if (!text || !activeId || busy || completed) {
    return false;
  }

  appendMessage("user", options.displayText || text);
  inputEl.value = "";
  resizeInput();
  setBusy(true);

  if (options.keepInputDisabled) {
    inputEl.disabled = true;
  }

  try {
    const reply = await postJson(`/sessions/${activeId}/messages`, {
      message: text,
    });

    completed = Boolean(reply.completed);
    if (completed) {
      appendMessage("agent", "测评完成，我把结果整理在下方。");
      renderReport(reply.message);
      inputEl.disabled = true;
      inputEl.placeholder = "测评已完成，可以复制下方报告，或重新开始。";
      reportPanelEl.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      appendMessage("agent", reply.message);
      if (started) {
        inputEl.disabled = false;
        inputEl.focus();
      }
    }
    return true;
  } catch (error) {
    appendMessage("agent", "刚才这条消息没有发送成功，请稍后再试。", true);
    if (started && !completed) {
      inputEl.disabled = false;
      inputEl.focus();
    }
    return false;
  } finally {
    setBusy(false);
  }
}

async function postJson(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

function appendMessage(role, content, isError = false) {
  const wrapper = document.createElement("div");
  wrapper.className = `message ${role === "user" ? "user" : "agent"}`;

  const bubble = document.createElement("div");
  bubble.className = `bubble ${isError ? "error" : ""}`;
  bubble.textContent = content;

  wrapper.appendChild(bubble);
  messagesEl.appendChild(wrapper);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function renderReport(text) {
  reportContentEl.textContent = text;
  reportPanelEl.classList.remove("is-hidden");
}

function clearReport() {
  reportContentEl.textContent = "";
  reportPanelEl.classList.add("is-hidden");
}

function setBusy(isBusy) {
  busy = isBusy;
  sendButtonEl.disabled = isBusy || completed || !started;
  startButtonEl.disabled = isBusy || started || !activeId;
  restartButtonEl.disabled = isBusy;
}

function resizeInput() {
  inputEl.style.height = "auto";
  inputEl.style.height = `${Math.min(inputEl.scrollHeight, 190)}px`;
}

formEl.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessage(inputEl.value);
});

inputEl.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    formEl.requestSubmit();
  }
});

inputEl.addEventListener("input", resizeInput);

startButtonEl.addEventListener("click", startAssessment);

restartButtonEl.addEventListener("click", prepareAssessment);

copyReportButtonEl.addEventListener("click", async () => {
  const text = reportContentEl.textContent.trim();
  if (!text) {
    return;
  }

  await copyText(text);
  copyReportButtonEl.textContent = "已复制";
  setTimeout(() => {
    copyReportButtonEl.textContent = "复制报告";
  }, 1400);
});

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const helper = document.createElement("textarea");
  helper.value = text;
  helper.setAttribute("readonly", "");
  helper.style.position = "fixed";
  helper.style.opacity = "0";
  document.body.appendChild(helper);
  helper.select();
  document.execCommand("copy");
  document.body.removeChild(helper);
}

prepareAssessment();
