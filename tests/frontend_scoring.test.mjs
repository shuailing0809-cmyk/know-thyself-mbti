import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const debug = loadFrontendDebugApi();

test("EI treats boredom when alone as evidence for E, not I", () => {
  const result = debug.analyzeAnswer(
    "EI",
    "和好朋友或者家人在一起 会很好，如果一个人会很无聊",
    "main",
    false
  );

  assert.equal(result.naturalLetter, "E");
  assert.equal(result.strategyLetter, "E");
  assert.equal(result.insufficient, false);
  assert.match(result.reason, /不能只抓“一个人”/);
});

test("SN asks a follow-up when the answer only says looking for videos or tutorials", () => {
  const result = debug.analyzeAnswer(
    "SN",
    "先去找相关的视频或者教程",
    "main",
    false
  );
  const followup = debug.selectFollowup("SN", result);

  assert.equal(result.naturalLetter, "?");
  assert.match(followup, /视频或教程|事实、例子和演示|整体原理/);
});

test("SN treats facts, details, examples, and verification as S evidence", () => {
  const result = debug.analyzeAnswer(
    "SN",
    "我一开始会先看真实案例和具体数据，把事实和细节列出来，最好有人演示一下，不然会觉得没底",
    "main",
    false
  );

  assert.equal(result.naturalLetter, "S");
  assert.equal(result.insufficient, false);
  assert.match(result.reason, /事实、细节、例子或演示/);
});

test("SN treats meaning, patterns, and the big picture as N evidence", () => {
  const result = debug.analyzeAnswer(
    "SN",
    "我一开始会先找整体框架和背后的模式，想知道这个东西的意义和可能性；如果只有步骤没有大图景会卡住",
    "main",
    false
  );

  assert.equal(result.naturalLetter, "N");
  assert.equal(result.insufficient, false);
  assert.match(result.reason, /意义、模式、大图景|整体框架/);
});

test("EI follow-up uses energy wording instead of casual battery wording", () => {
  const result = debug.analyzeAnswer("EI", "周末看情况，有时候出去，有时候自己待着", "main", false);
  const followup = debug.selectFollowup("EI", result);

  assert.match(followup, /互动后更有能量|独处后更有能量|更有能量/);
  assert.doesNotMatch(followup, /有电/);
});

test("SN asks a follow-up when the answer only mentions overall logic", () => {
  const result = debug.analyzeAnswer("SN", "需要把整体的逻辑都搞清楚", "main", false);
  const followup = debug.selectFollowup("SN", result);

  assert.equal(result.naturalLetter, "N");
  assert.equal(result.evidence.hasInnerCost, false);
  assert.match(followup, /整体逻辑|只给事实、步骤和例子|稳定偏好/);
});

test("JP treats priority planning with openness as contextual instead of strong P", () => {
  const result = debug.analyzeAnswer("JP", "只做最重要的计划和安排，不重要的就无所谓了", "main", false);
  const followup = debug.selectFollowup("JP", result);
  const model = debug.buildReportModel({
    EI: debug.analyzeAnswer("EI", "第一反应会找朋友聊天，互动后更有能量，一个人久了会无聊", "main", false),
    SN: debug.analyzeAnswer("SN", "一开始会先找整体框架和背后的模式，如果只有步骤没有大图景会卡住", "main", false),
    TF: debug.analyzeAnswer("TF", "第一反应会担心对方不舒服和关系尴尬，最后可能还是委婉答应", "main", false),
    JP: result,
  });
  const jpCard = model.dimensionCards.find((item) => item.dimension === "JP");

  assert.equal(result.evidence.hasJpPriorityPlan, true);
  assert.equal(result.contextDependency, true);
  assert.match(followup, /重要事项必须先计划|保留开放空间/);
  assert.notEqual(jpCard.status, "比较典型稳定");
  assert.equal(jpCard.strength, "计划与弹性并存");
  assert.match(jpCard.summary, /重要事项会计划/);
});

test("mixed or cost-unclear reports are not labeled clear too early", () => {
  const model = debug.buildReportModel({
    EI: debug.analyzeAnswer("EI", "第一反应会找朋友聊天，互动后更有能量，但最后通常会自己待着消化", "main", false),
    SN: debug.analyzeAnswer("SN", "需要把整体的逻辑都搞清楚", "main", false),
    TF: debug.analyzeAnswer("TF", "不太会拒绝，担心影响关系，所以大概率会接受", "main", false),
    JP: debug.analyzeAnswer("JP", "只做最重要的计划和安排，不重要的就无所谓了", "main", false),
  });

  assert.notEqual(model.clarity, "较清晰");
});

test("report includes Best-Fit calibration language", () => {
  const results = {
    EI: debug.analyzeAnswer("EI", "第一反应会找朋友聊聊，互动后更有能量，一个人久了会无聊", "main", false),
    SN: debug.analyzeAnswer("SN", "一开始会先看真实案例和具体数据，把事实和细节列出来，最好有人演示一下", "main", false),
    TF: debug.analyzeAnswer("TF", "第一反应会担心对方不舒服和关系尴尬，最后可能还是委婉答应", "main", false),
    JP: debug.analyzeAnswer("JP", "基本不做计划，喜欢边走边看，变化了顺着调整也可以", "main", false),
  };

  const report = debug.buildReport(results);

  assert.match(report, /Best-Fit 校准/);
  assert.match(report, /系统初判方向/);
  assert.match(report, /自我认知校准/);
});

function loadFrontendDebugApi() {
  const elements = new Map();
  const document = {
    body: {
      appendChild() {},
      removeChild() {},
    },
    createElement() {
      return makeElement();
    },
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, makeElement());
      return elements.get(id);
    },
  };

  const context = vm.createContext({
    console,
    document,
    globalThis: {},
    navigator: {},
    setTimeout,
    window: {
      MBTI_FEEDBACK_API_URL: "",
      location: { protocol: "https:" },
      isSecureContext: true,
    },
  });
  context.globalThis = context;

  const source = readFileSync(new URL("../public/mbti_experience_v2.js", import.meta.url), "utf8");
  vm.runInContext(source, context, { filename: "public/mbti_experience_v2.js" });

  return context.MBTI_V2_DEBUG;
}

function makeElement() {
  return {
    value: "",
    textContent: "",
    innerHTML: "",
    disabled: false,
    hidden: false,
    placeholder: "",
    style: {},
    classList: {
      add() {},
      remove() {},
    },
    addEventListener() {},
    appendChild() {},
    querySelector() {
      return null;
    },
    reset() {},
    focus() {},
    scrollIntoView() {},
    select() {},
    setAttribute() {},
  };
}
