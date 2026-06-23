const DIMENSION_ORDER = ["EI", "SN", "TF", "JP"];

const DIMENSION_META = {
  EI: {
    name: "能量来源",
    left: "E",
    right: "I",
    leftLabel: "靠近互动",
    rightLabel: "回到自己",
    essence: "空下来或需要恢复时，能量更自然地流向人和互动，还是独处和内在空间。",
  },
  SN: {
    name: "信息入口",
    left: "S",
    right: "N",
    leftLabel: "具体步骤",
    rightLabel: "整体框架",
    essence: "面对新信息时，更自然先抓具体事实和步骤，还是先建立结构、逻辑和意义。",
  },
  TF: {
    name: "决策权重",
    left: "T",
    right: "F",
    leftLabel: "原则边界",
    rightLabel: "关系感受",
    essence: "冲突出现时，内心最先被原则、合理性和边界牵动，还是被关系、感受和评价成本牵动。",
  },
  JP: {
    name: "行动节奏",
    left: "J",
    right: "P",
    leftLabel: "收拢确定",
    rightLabel: "开放弹性",
    essence: "面对未定状态时，更自然想先定下来，还是保留空间、边走边看、随情境调整。",
  },
};

const TYPE_NAMES = {
  ISTJ: "检查员型",
  ISFJ: "保护者型",
  INFJ: "顾问型",
  INTJ: "战略家型",
  ISTP: "工匠型",
  ISFP: "冒险者型",
  INFP: "治愈者型",
  INTP: "思考者型",
  ESTP: "促动者型",
  ESFP: "表演者型",
  ENFP: "激励者型",
  ENTP: "辩论者型",
  ESTJ: "执行者型",
  ESFJ: "照顾者型",
  ENFJ: "教师型",
  ENTJ: "指挥官型",
};

const TYPE_SOURCE_PROFILES = {
  ISTJ: {
    name: "检查员型 / 责任者",
    core: "务实、可靠、细致，重视传统、秩序和责任。面对任务时更信任事实、规则和可验证流程，倾向把事情稳稳推进。",
    life: "在工作和生活中通常适合高精确度、有结构的场景，擅长维护系统、执行标准、尊重时间和计划。",
    communication: "表达简洁直接，注重事实和细节，不喜欢无关闲聊，期待目标、边界和预期被说清楚。",
    pressure: "压力下可能更想控制周围，变得僵硬、悲观或对偏离计划高度不安，也可能在沉默和强硬之间摆动。",
    teamwork: "团队中容易让结构和任务压过氛围与新问题；正向状态下能带来秩序、责任感、预算意识和稳定交付。",
  },
  ISFJ: {
    name: "保护者型 / 护卫者",
    core: "温和、可靠、富有同情心，重视稳定、责任和关系安全感。常把照顾他人和把事情做细做好放在很重要的位置。",
    life: "在有序、需要耐心和实际支持的场景中表现稳定，容易成为细致、守纪律、愿意补位的团队成员。",
    communication: "沟通亲切、体贴，善于倾听和提供支持，通常会避免直接冲突，优先维护关系里的舒适度。",
    pressure: "压力下可能自责、退缩或过度照顾他人；长期被占用后也可能突然爆发，把积压很久的委屈一次性倒出。",
    teamwork: "团队中容易被占便宜或不敢设边界；正向状态下能带来可靠支持、流程记忆、细节推进和温暖氛围。",
  },
  INFJ: {
    name: "顾问型 / 提倡者",
    core: "理想主义、洞察力强，关注意义、人类潜力和长期影响。容易先看到事情背后的模式与价值，再思考如何推动改变。",
    life: "适合有深层意义、需要理解人和系统的工作，能在复杂关系中寻找方向，也会在使命感强的事情上投入很深。",
    communication: "善于倾听和提出洞见，表达通常有同理心，也重视话语背后的价值、情绪和长期影响。",
    pressure: "压力下可能变得疏离、自我批评，或以带有正义感但事实处理粗糙的方式爆发；灵感可能转为复杂纠结和受伤感。",
    teamwork: "团队中可能过度停留在理论、人际交换或愿景层面；正向状态下能兼顾洞察、启发、组织推进和关系和气。",
  },
  INTJ: {
    name: "战略家型 / 建筑师",
    core: "理性、独立、战略性强，喜欢分析复杂问题并建立长远结构。通常先搭建全局模型，再筛选路径和资源。",
    life: "在技术、研究、战略规划和系统优化场景中容易发挥优势，重视自主、高效和长期目标。",
    communication: "沟通冷静、精确、偏逻辑，不喜欢无意义闲聊，期待讨论能指向结构、原则和更优方案。",
    pressure: "压力下可能尖锐、傲慢或不耐烦；被细节、人际需求轰炸时，容易更想控制、抽离或不信任他人。",
    teamwork: "团队中可能显得疏离、好争辩或只在智力层面认同协作；正向状态下能提供系统思考、结构化方向和高标准。",
  },
  ISTP: {
    name: "工匠型",
    core: "实用、冷静、擅长解决现实问题，重视工具、效率和现场反馈。通常先观察系统如何运作，再用直接方式处理问题。",
    life: "适合技术、工程、应急、操作性强的场景，喜欢动手实践、测试路径和寻找更短更有效的方法。",
    communication: "表达简洁直接，偏好事实、实用性和解决方案，不太喜欢长篇情绪解释或过多流程会议。",
    pressure: "压力下可能显得冷漠、否认情绪、兴趣下降，或越急越乱；外部刺激过多时更想抽离。",
    teamwork: "团队中可能对例行规章、文书和过多流程感到疲惫；正向状态下行动力强、技术能力好，能快速聚焦问题核心。",
  },
  ISFP: {
    name: "冒险者型 / 探险者",
    core: "温柔、重真实感受和个人价值，珍视自由、美感和自我表达。更倾向在安全空间里按自己的节奏行动。",
    life: "适合创意、设计、艺术、体验性和需要个人表达的场景，喜欢自由、不被过度规定的环境。",
    communication: "沟通温和含蓄，善于倾听，常通过行动、作品或非语言方式表达关心和态度。",
    pressure: "压力下可能沉默、逃避、自责或低落；被否定或过度要求时，容易产生不被尊重和被束缚的感受。",
    teamwork: "团队中可能过度投入到疲惫、忽略截止，或不善表达欣赏；正向状态下能让环境更轻松、更有人味，也愿意为团队协商。",
  },
  INFP: {
    name: "治愈者型 / 理想主义者",
    core: "理想主义、重内在价值和意义感，情绪真实而富有同理心。投入前常会先确认事情是否符合自己的信念。",
    life: "适合创作、心理、社会影响、教育和需要价值感的工作，偏好独立、自由且能表达内在世界的环境。",
    communication: "沟通温柔、有共情力，喜欢深层话题和真实表达，也会在价值被触碰时变得坚定。",
    pressure: "压力下可能逃避、自我怀疑、犹豫或封闭；当团队不接纳其价值观时，容易失去方向感。",
    teamwork: "团队中可能回避冲突直到价值被侵犯才强硬；正向状态下能肯定成员、维护使命感，并在弹性框架内推进目标。",
  },
  INTP: {
    name: "思考者型 / 逻辑学家",
    core: "分析型、思辨、追求逻辑一致性和概念理解。通常先搞清原理和系统，再决定是否行动。",
    life: "适合研究、科学、哲学、系统设计和高智力挑战，偏好灵活、非过度结构化的环境。",
    communication: "沟通安静、思辨，喜欢深入复杂概念；在情感表达和落地细节上可能显得距离感较强。",
    pressure: "压力下可能大量想法激烈涌出但缺乏落地，也可能突然变得强硬、傲慢或不耐烦。",
    teamwork: "团队中可能因需要独处思考而放慢行动，或对执行收尾厌倦；正向状态下能提供深度模型、远见和高质量想法。",
  },
  ESTP: {
    name: "促动者型 / 实干者",
    core: "行动力强、现实感好，喜欢挑战、机会和即时反馈。更倾向边做边判断，在变化中抓住可用路径。",
    life: "适合销售、创业、运动、应急服务和快节奏现场问题，喜欢动手实践和直接看到结果。",
    communication: "沟通直接、开放、带能量，偏好简洁、结果导向和行动中的解决方案。",
    pressure: "压力下可能坐立不安、注意力分散、冲动或反叛；也可能突然沉默并对事实进行负面加工。",
    teamwork: "团队中可能不耐理论框架、容易无聊或冒犯他人；正向状态下务实、精力旺盛，能快速启动并解决现实问题。",
  },
  ESFP: {
    name: "表演者型",
    core: "外向、乐观、重现实体验和人际氛围，容易被鲜活的人和事调动，喜欢分享快乐和当下感受。",
    life: "适合娱乐、活动、服务、人际互动密集的场景，能迅速建立连接并带来活力。",
    communication: "沟通友好、直接、富有感染力，常用幽默、表情和体验分享拉近关系。",
    pressure: "压力下可能回避难题、假装没事，或在散乱与僵硬之间摆动；过度透支后容易悲观和疲惫。",
    teamwork: "团队中可能显得分散、吵闹或难以长期聚焦；正向状态下能提升士气、尊重差异，让团队更有生命力。",
  },
  ENFP: {
    name: "激励者型 / 倡导者",
    core: "充满创意、热情和可能性，重视成长、自我表达、关系连接和内在意义。",
    life: "适合创新、写作、咨询、心理、创业等灵活场景，擅长发掘潜力、激励他人和启动新方向。",
    communication: "沟通热情、有感染力，喜欢讨论想法、灵感和人的可能性，也很在意情感连接。",
    pressure: "压力下可能情绪起伏、自我贬低、身体化不适，或通过启动很多新事来缓解焦虑但难以推进。",
    teamwork: "团队中可能忽略提前规划、爱启动胜过收尾；正向状态下能带来士气、头脑风暴、创造力和团队感。",
  },
  ENTP: {
    name: "辩论者型 / 发明家",
    core: "机智、创造力强，喜欢挑战假设、提出新观点并探索多种解决方案。变化和智力刺激会激活他们。",
    life: "适合战略、创新、发明、法律、学术和创业场景，能快速识别问题并生成选项。",
    communication: "沟通灵活、有挑衅性，喜欢通过讨论和辩论激发想法；有时为了测试观点而显得咄咄逼人。",
    pressure: "压力下可能音量上升、表达散乱重复、控制欲增强，或在极度控制和离谱跳脱之间摇摆。",
    teamwork: "团队中可能为争辩而争辩、推翻旧法、收尾不足；正向状态下能提供高能量、韧性、理论连接和创新突破。",
  },
  ESTJ: {
    name: "执行者型 / 管理者",
    core: "务实、有组织、重效率和结果，倾向通过规则、流程和明确分工推动事情完成。",
    life: "在管理、行政、项目推进和需要组织资源的场景中表现突出，喜欢有序、高效、目标清楚的环境。",
    communication: "沟通直接、简洁、指令清楚，偏好快速对齐目标、责任和完成标准。",
    pressure: "压力下可能固执、控制欲强、难承认失败，甚至在强势爆发和阴郁撤退之间摆动。",
    teamwork: "团队中可能不耐烦、强势或听不进差异；正向状态下能带来结构、进度、截止意识和强执行力。",
  },
  ESFJ: {
    name: "照顾者型 / 执政官",
    core: "友好、关怀、重人际关系和共同规范，喜欢通过具体行动维持秩序、和谐与他人的舒适。",
    life: "适合教育、护理、人力、客户服务等需要高度社交和实际照顾的场景，乐于通过服务他人体现价值。",
    communication: "沟通温暖、关怀、善于倾听，常通过具体语言和行动表达支持，也希望关系有回应。",
    pressure: "压力下可能用照顾或忙碌掩盖问题，对秩序和控制需求上升，并在自责与怪罪他人之间摆动。",
    teamwork: "团队中可能回避冲突、过度照顾或用愧疚感影响他人；正向状态下得体、负责、能肯定贡献并维护合作氛围。",
  },
  ENFJ: {
    name: "教师型 / 主人公",
    core: "有同情心、责任感和领导力，关注他人的成长与福祉，擅长围绕共同目标激励团队。",
    life: "适合教育、咨询、社工、管理等领导和服务性工作，在团体中容易产生感染力并激发潜能。",
    communication: "沟通热情、有同理心，会根据他人需要调整表达，擅长建立连接和动员关系。",
    pressure: "压力下可能过度关注他人而忽略自己，也可能因自我价值感下降而苦涩、拒绝沟通或过度自责。",
    teamwork: "团队中可能压下冲突、记仇或把领导受阻个人化；正向状态下社会敏感、目标清楚，能激励他人并维护和谐。",
  },
  ENTJ: {
    name: "指挥官型",
    core: "果断、战略性强，重视目标、效率和外部影响，倾向用长远规划和决策推动系统前进。",
    life: "适合企业管理、法律、顾问、战略规划和需要领导复杂系统的场景，擅长制定宏观计划并推进实现。",
    communication: "沟通直接、果断、逻辑清晰，偏目标导向，喜欢简洁明了地推动进展。",
    pressure: "压力下可能更强势、傲慢、不耐烦或去个人化，以更大音量和更强控制感维持正确性。",
    teamwork: "团队中可能目标吞噬一切、硬刚分歧或显得缺乏敏感度；正向状态下能提供愿景、结构、战略驱动和强承诺。",
  },
};

const DIMENSION_STRENGTH_GUIDE = {
  E: {
    strong: "多数场景下更容易通过互动获得能量；倾向主动连接，说出来会更清晰，社交与活动往往让状态被激活。",
    medium: "通常偏向互动与外部刺激来激活状态，但疲惫或高压时也需要独处恢复，社交频率会随状态变化。",
    weak: "在互动与独处之间更灵活切换；是否外向更多取决于当天精力、对象与场合。",
  },
  I: {
    strong: "独处与安静环境是主要充电方式；倾向先在心里想清楚再表达，高强度社交后更需要独处恢复。",
    medium: "通常偏向独处恢复与深度沉浸，但在合适的人与情境中也能投入互动，只是需要保留个人空间。",
    weak: "能享受独处也能享受互动；独处不一定是必需，更多是可选恢复方式，倾向会随状态波动。",
  },
  S: {
    strong: "更信任具体事实、细节与可验证信息；做事偏步骤化和落地，倾向用经验、数据、案例建立判断。",
    medium: "通常偏好先搞清楚细节与做法，但也会接受抽象框架，尤其在需要方向感时愿意先看全貌。",
    weak: "在细节落地和整体理解之间更平衡，会根据任务选择先看步骤还是先看框架。",
  },
  N: {
    strong: "更容易先抓趋势、模式与意义；习惯从少量信息推演全局，用框架、类比和联想建立理解。",
    medium: "通常偏向先看整体与方向，但也能回到细节落地，尤其在执行阶段会主动补足步骤与验证。",
    weak: "对框架趋势和细节证据都能兼容；是否走直觉路线取决于主题熟悉度与时间压力。",
  },
  T: {
    strong: "决策更优先逻辑一致、原则、公平与效率；倾向就事论事、明确边界，并用标准和事实裁决冲突。",
    medium: "通常偏向按原则和逻辑做决定，但也会考虑人际影响，表达方式可能更委婉。",
    weak: "在原则与感受之间更会权衡；不同关系与场景下可能切换标准，不能简单概括成理性或感性。",
  },
  F: {
    strong: "决策更优先关系、感受与价值一致；倾向先维护连接与氛围，关注决定对他人的影响和可接受度。",
    medium: "通常偏向顾及他人体验与关系，但在关键问题上也能坚持原则，会在柔和表达与清晰底线之间平衡。",
    weak: "既看重关系也看重原则；是否更顾感受取决于对象与代价，表现更情境化。",
  },
  J: {
    strong: "偏好确定性与结构；喜欢提前规划、列清单、按节点推进，对变化更敏感，倾向尽快收敛选项。",
    medium: "通常喜欢有计划与节奏，但也能容纳一定弹性，遇到变化会调整计划而不是强硬死守。",
    weak: "既能计划也能随时调整；是否走计划路线取决于任务重要性与时间压力，倾向不固定。",
  },
  P: {
    strong: "偏好弹性与开放选项；喜欢边做边调整、临场应变，变化不一定焦虑，反而可能带来灵感与兴致。",
    medium: "通常偏向保持灵活，但必要时也会做基本规划，属于有底线的随性。",
    weak: "在灵活与计划之间切换；既不强烈排斥计划，也不强烈排斥变化，更多是策略选择。",
  },
};

const MBTI_BOUNDARY_PRINCIPLES = [
  "MBTI 描述的是偏好，不是能力、智力、好坏或心理诊断。",
  "每个人都会使用两侧，只是某一侧更自然、更省力，另一侧可能来自训练、责任或情境要求。",
  "这份报告会优先区分自然偏好、外显策略和内在成本，避免只凭表面行为给人定型。",
];

const PREFERENCE_CONTRIBUTIONS = {
  E: "兴趣广度、外部连接和行动推动力",
  I: "专注深度、内在沉淀和独立思考力",
  S: "事实依赖、经验校验和落地细节",
  N: "可能性把握、模式洞察和整体想象",
  T: "逻辑分析、原则判断和客观取舍",
  F: "温暖共情、价值敏感和关系维护",
  J: "组织结构、计划推进和闭环意识",
  P: "适应变化、开放选项和临场弹性",
};

const CHANGE_NEEDS_GUIDE = {
  E: "变化发生时，更需要充分讨论、参与感、持续沟通、表达空间和较快行动节奏。",
  I: "变化发生时，更需要安静反思、书面信息、讨论前的思考时间，以及先消化再行动的空间。",
  S: "变化发生时，更需要真实数据、具体细节、与过去经验的连接、现实的未来描述，以及清楚的角色和责任。",
  N: "变化发生时，更需要整体理由、未来愿景、总计划、方向和选项，以及参与输入的机会。",
  T: "变化发生时，更需要决策背后的逻辑、系统性信息、清晰的目标结构、可靠领导和公平原则。",
  F: "变化发生时，更需要看见这件事对人的影响、人的需要如何被照顾、过程中的参与感、价值说明、支持和认可。",
  J: "变化发生时，更需要清晰简洁的计划、明确结果和目标、阶段时间表、优先级、完成标准，并尽量减少意外。",
  P: "变化发生时，更需要开放式方法、概略行动计划、选择空间、继续收集信息的机会、调整余地，以及对过程的信任。",
};

const COMMUNICATION_GUIDE = {
  S: "沟通时给出事实、成功案例、风险控制和提前梳理过的细节，会更容易让 S 侧接住信息。",
  N: "沟通时先给大图景、机会感、未来收益和有信心的方向感，会更容易让 N 侧进入状态。",
  T: "沟通时讲清逻辑、原则、组织结构、成本与收益，会更容易让 T 侧判断是否合理。",
  F: "沟通时说明谁支持、对人有什么帮助、为什么有价值，并保持友好可接受的表达，会更容易让 F 侧放心。",
};

const CONFLICT_MISREAD_GUIDE = {
  EI: "E 侧可能把 I 侧理解成保留或不参与；I 侧可能把 E 侧理解成侵入或过度推动。真正差异往往是处理节奏不同。",
  SN: "S 侧可能觉得 N 侧不现实；N 侧可能觉得 S 侧打断想法或阻碍进展。真正差异往往是一个先要事实，一个先要模式。",
  TF: "T 侧可能觉得 F 侧不一致或不够逻辑；F 侧可能觉得 T 侧冷淡或不关心。真正差异往往是一个先校验原则，一个先感知影响。",
  JP: "J 侧可能觉得 P 侧不可靠；P 侧可能觉得 J 侧限制太多。真正差异往往是一个先要闭环，一个先要过程中的弹性。",
};

const TYPE_CORE_SUMMARIES = {
  ISTJ: "ISTJ 通常重视可靠、秩序、事实和责任感。面对任务时，他们倾向于先确认规则、资源和可执行步骤，再稳定推进。",
  ISFJ: "ISFJ 通常重视稳定、责任、细节和对人的照顾。他们往往会把实际事务处理好，同时留意关系中的安全感与他人的需要。",
  INFJ: "INFJ 通常重视意义、洞察、长期影响和人的内在状态。他们容易先看到事情背后的模式与价值，再思考如何温和但坚定地推动改变。",
  INTJ: "INTJ 通常重视结构、远景、独立判断和系统优化。他们倾向于先建立全局模型，再用清晰标准筛选路径和资源。",
  ISTP: "ISTP 通常重视现实问题、工具效率和即时判断。他们倾向于观察系统如何运作，再用灵活、低废话的方式解决具体问题。",
  ISFP: "ISFP 通常重视真实感受、个人价值和当下体验。他们不喜欢被过度规定，更倾向于在安全空间里按自己的节奏表达和行动。",
  INFP: "INFP 通常重视内在价值、意义感和情绪真实。他们会先确认一件事是否符合自己的信念，再决定投入多少能量。",
  INTP: "INTP 通常重视逻辑一致性、概念模型和独立思考。他们倾向于先理解原理，再决定是否行动或如何行动。",
  ESTP: "ESTP 通常重视现场信息、机会、行动反馈和现实效果。他们倾向于边做边判断，擅长在变化中快速抓住可用路径。",
  ESFP: "ESFP 通常重视现实体验、人际氛围和即时反馈。他们容易被鲜活的人和事调动，擅长让场面更有生命力。",
  ENFP: "ENFP 通常重视可能性、关系连接和内在热情。他们容易从新想法、新关系和新机会中获得能量，再寻找符合价值感的方向。",
  ENTP: "ENTP 通常重视可能性、辩证思考和灵活探索。他们倾向于不断测试观点、挑战默认假设，并从变化中发现新路径。",
  ESTJ: "ESTJ 通常重视效率、规则、责任和结果落地。他们倾向于快速组织资源、明确分工，并把事情推向可衡量的完成状态。",
  ESFJ: "ESFJ 通常重视关系秩序、实际照顾和共同规范。他们往往会主动维护氛围，也会希望事情对大家都有交代。",
  ENFJ: "ENFJ 通常重视人的成长、共同目标和关系动员。他们倾向于理解他人的状态，并把人组织到一个更有方向感的行动中。",
  ENTJ: "ENTJ 通常重视目标、结构、决策效率和外部影响。他们倾向于快速判断局势，制定方向，并推动系统朝结果前进。",
};

const QUESTIONS = {
  EI:
    "当你连续忙了一段时间，终于有一个完整周末或小长假、没有必须完成的事时，你第一反应更想怎么恢复？\n\n可以说说：你下意识想靠近人还是先回到自己？如果不用顾虑任何人，你更想怎么安排？最后你通常会怎么做？",
  SN:
    "如果要你快速学一个完全陌生的东西，比如一个新软件、一道新菜、一门完全没基础的课，你最开始会怎么建立理解？\n\n可以说说：你的第一反应是先找具体步骤/示例，还是先搞清整体框架/原理？如果别人只给另一种方式，你会不会不舒服？",
  TF:
    "如果有人请你帮一个不太合理、又会占用你时间的忙，你内心第一反应通常是什么？最后你一般会怎么处理？\n\n如果你会拒绝、答应、拖延或找借口，都可以说。关键是：你最先顾虑的是事情是否合理，还是对方感受、关系尴尬或别人评价？",
  JP:
    "假设你要去一个没去过的地方玩两天，或者要推进一件重要但变化很多的事，你面对“还没定下来”的状态时，第一反应是什么？\n\n可以说说：你更想先安排清楚，还是随遇而安、边走边看？如果计划突然变了，你内心是想赶紧重新确定，还是觉得顺着调整也可以？",
};

const BASE_FOLLOWUPS = {
  EI:
    "我想再确认一下更早的反应：当你真的需要恢复时，你第一反应更想找人互动，还是先一个人静下来？如果选择另一边，会不会明显消耗？",
  SN:
    "我想补一下你的信息入口：你最先需要的是具体步骤/示例，还是整体框架/原理？如果别人只给另一种方式，你会觉得卡住、空泛，还是也可以接受？",
  TF:
    "我想确认你当时的内在成本：你这样处理时主要是在避免什么？是避免事情不合理、边界被占用，还是避免对方不舒服、关系尴尬或被评价？",
  JP:
    "我想确认你面对未定状态时的第一反应：没有计划或临时变化时，你更不踏实、想赶紧定下来，还是更轻松，觉得顺着走也可以？",
};

const SPECIAL_FOLLOWUPS = {
  TF_EXCUSE:
    "你提到会找理由或找借口，我想追问一下：找借口主要是在避免什么？是觉得没必要解释太多、保护边界，还是担心对方不舒服、关系尴尬、被评价或伤到对方？",
  JP_REPLAN:
    "你提到会调整或重新安排，我想区分一下：你重新安排是为了尽快恢复确定感，还是只是顺势换个方案、心里并不紧张？",
};

const SIDE_KEYWORDS = {
  EI: {
    left: ["找人", "约", "朋友", "聊天", "分享", "热闹", "聚会", "一起", "有人陪", "见人", "互动", "出去", "社交", "人多"],
    right: ["一个人", "独处", "安静", "自己待", "在家", "不说话", "静静", "恢复", "充电", "消耗", "不想见人", "社交累", "自己消化"],
  },
  SN: {
    left: ["步骤", "说明书", "示例", "例子", "照着", "具体", "细节", "先做", "上手", "操作", "第一步", "实操", "案例"],
    right: ["整体", "框架", "原理", "逻辑", "为什么", "结构", "底层", "模式", "关联", "意义", "概念", "全貌", "体系"],
  },
  TF: {
    left: ["原则", "合理", "不合理", "边界", "事实", "客观", "规则", "公平", "对事不对人", "直接说", "说明原因", "对错", "效率", "逻辑", "该不该"],
    right: ["关系", "感受", "不高兴", "伤害", "尴尬", "评价", "面子", "不好意思", "开不了口", "内疚", "愧疚", "怕伤", "和谐", "委婉", "借口", "找理由", "担心对方"],
  },
  JP: {
    left: ["计划", "安排", "提前", "确定", "定下来", "订好", "清单", "不踏实", "焦虑", "不安", "重新安排", "赶紧定", "掌控", "收拢", "落地", "井然有序", "流程", "秩序", "抓狂", "崩溃", "必须"],
    right: ["随遇而安", "顺其自然", "顺着走", "顺着来", "边走边看", "不做计划", "不会做计划", "不安排", "没有计划", "没计划", "看情况再说", "看情况而定", "等等再说", "到时候再说", "到了再说", "到了地方再说", "到那里再说", "打那里再说", "根据现场", "实际情况", "怎么合适怎么来", "临时", "弹性", "随机", "开放", "自由", "当下决定", "不想定死", "保留选择", "走一步看一步", "无所谓", "都可以"],
  },
};

const STRATEGY_KEYWORDS = {
  EI: SIDE_KEYWORDS.EI,
  SN: SIDE_KEYWORDS.SN,
  TF: {
    left: ["拒绝", "直接拒绝", "说不", "说明原因", "讲清楚", "坚持", "划边界", "不答应"],
    right: ["答应", "妥协", "委婉", "找理由", "找借口", "拖延", "不好意思", "先安抚", "照顾对方"],
  },
  JP: SIDE_KEYWORDS.JP,
};

const REACTION_MARKERS = ["第一反应", "下意识", "一开始", "最先", "本能", "刚开始", "原始反应", "首先", "一瞬间"];
const NATURAL_MARKERS = ["如果不用顾虑", "更想", "自然", "舒服", "省力", "想要", "愿意", "偏向", "喜欢", "倾向"];
const COST_MARKERS = ["累", "消耗", "别扭", "不舒服", "焦虑", "不安", "内疚", "愧疚", "压力", "委屈", "被束缚", "难受", "纠结", "负担", "成本", "压抑"];
const STRATEGY_MARKERS = ["后来", "最后", "实际", "现实", "现在", "学会", "调整", "压住", "克制", "训练", "工作要求", "会逼自己", "表面", "外显", "成熟以后", "最终"];
const AMBIGUOUS_WORDS = ["都有", "都可以", "看情况", "不一定", "说不准", "一半一半", "不好说", "不确定", "看状态"];
const CONTEXT_WORDS = ["看人", "看关系", "看状态", "看内容", "看事情", "看重要", "工作", "生活", "不同场景", "不同情况", "关系近"];
const REFUSAL_WORDS = ["不想说", "不想补充", "不用补充", "已经回答", "不知道", "不记得", "算了", "跳过"];
const ADJUSTMENT_SPLITTERS = ["但是", "但", "不过", "后来", "最后", "实际", "现实", "现在", "然后", "只是", "可我", "但我"];
const EXCUSE_WORDS = ["找借口", "找个借口", "找理由", "编理由", "随便说个理由", "委婉拒绝"];
const FEELING_REASON_WORDS = ["怕对方", "担心对方", "对方不舒服", "对方不高兴", "关系尴尬", "被评价", "伤到", "伤害", "不好意思", "内疚", "愧疚", "面子"];
const BOUNDARY_REASON_WORDS = ["没必要解释", "懒得解释", "省事", "保护边界", "不想被纠缠", "避免麻烦", "事情不合理", "原则"];
const JP_P_NEGATED_PLAN = [/不(?:会|想|爱|喜欢|太|怎么)?(?:做|订|安排|计划)/, /不(?:会|想|爱|喜欢|太|怎么)?规划/, /没有(?:什么)?计划/, /没(?:什么)?计划/, /懒得(?:做)?计划/, /不提前(?:安排|计划|规划)?/];
const JP_UNCERTAIN_WORDS = ["变化", "临时", "没定", "不确定", "突发", "变动", "计划变", "改计划", "没安排", "看情况", "看情况而定", "现场", "实际情况", "等等再说", "怎么合适怎么来"];
const JP_J_COST_WORDS = ["抓狂", "崩溃", "焦虑", "不安", "不踏实", "受不了", "烦躁", "慌", "失控", "必须", "赶紧", "立刻", "马上", "重新安排", "重新计划", "定下来"];
const JP_J_EMOTIONAL_COST_WORDS = ["抓狂", "崩溃", "焦虑", "不安", "不踏实", "没底", "受不了", "烦躁", "慌", "失控", "难受"];
const JP_P_EASE_WORDS = ["无所谓", "都可以", "轻松", "放松", "顺着走", "顺着来", "随遇而安", "顺其自然", "更有意思", "兴奋", "不紧张", "不焦虑", "也可以", "都行", "没关系", "边走边看", "等等再说", "到时候再说", "到了再说", "到了地方再说", "到那里再说", "打那里再说", "现场再看", "根据现场", "实际情况", "看情况而定", "怎么合适怎么来", "合适怎么来"];
const JP_P_CONSTRAINT_WORDS = ["计划太死", "安排太死", "定太死", "被安排", "被束缚", "束缚", "限制", "不自由", "不想定死", "讨厌计划", "讨厌被安排"];
const NEGATION_PREFIXES = ["不", "没", "没有", "无需", "不用", "不需要", "不想", "不愿意", "没必要", "不必", "避免", "不用再"];

const SEMANTIC_SIGNAL_RULES = {
  EI: [
    { side: "left", target: "natural", weight: 3, tag: "social_recharge", negationSensitive: true, patterns: [/(找|约|见|联系|喊|叫|和|跟).{0,8}(朋友|同学|家人|同事|人|大家)/, /(聊天|聚会|吃饭|逛街|旅游|打游戏|出去玩).{0,8}(朋友|同学|家人|一起|人)/, /(说出来|聊完|互动).{0,8}(舒服|开心|有精神|恢复|放松|充电)/, /(朋友|同学|家人|同事|大家).{0,10}(一起|在一起|聊天|互动).{0,10}(好|很好|开心|舒服|放松|有意思|不无聊)/, /(和|跟).{0,6}(朋友|同学|家人|同事).{0,10}(一起|在一起).{0,10}(好|很好|开心|舒服|放松|有意思|不无聊)/] },
    { side: "left", target: "natural", weight: 4, tag: "solitude_cost", patterns: [/(一个人|自己一个人|自己待|独处).{0,10}(无聊|闷|没意思|孤单|孤独|焦虑|难受|受不了)/, /(无聊|闷|没意思|孤单|孤独|焦虑|难受|受不了).{0,10}(一个人|自己一个人|自己待|独处)/] },
    { side: "left", target: "strategy", weight: 2, tag: "social_action", negationSensitive: true, patterns: [/(最后|通常|一般|会).{0,8}(约|找|见|聊|聚|出去)/, /(组织|参加).{0,8}(聚会|活动|饭局|旅游)/] },
    { side: "right", target: "natural", weight: 4, tag: "no_social_need", patterns: [/(不需要|不用|不想|不愿意|没必要|不必).{0,10}(和人|跟人|互动|聊天|社交|见人|别人|有人陪|人陪)/, /(不需要|不想).{0,8}(别人|有人|人).{0,6}(陪|打扰|互动)/] },
    { side: "right", target: "natural", weight: 3, tag: "solitude_recharge", patterns: [/(一个人|自己|独处|安静|静静).{0,10}(恢复|放松|舒服|充电|清净|思考|待着|呆着)/, /不想.{0,6}(见人|说话|社交|被打扰)/, /(社交|见人|聊天).{0,8}(累|消耗|疲惫|透支)/] },
    { side: "right", target: "strategy", weight: 2, tag: "solitude_action", patterns: [/(最后|通常|一般|会).{0,8}(一个人|自己待|在家|休息|睡觉|看视频|听音乐)/] },
  ],
  SN: [
    { side: "left", target: "natural", weight: 3, tag: "step_entry", negationSensitive: true, patterns: [/(先|第一步|一开始|最开始).{0,10}(步骤|示例|例子|说明|操作|模仿|照着|问会的人|看别人|展示|示范|演示)/, /教程.{0,8}(步骤|操作|实操|演示|示范|照着|一步步)/, /(步骤|操作|实操|演示|示范|照着|一步步).{0,8}教程/, /(需要|想要|最好|更想).{0,10}(具体|步骤|例子|示例|案例|演示|展示|示范|人教|别人教|手把手|问别人|问会的人)/, /(只讲|光讲).{0,5}(原理|框架|概念).{0,8}(空|虚|卡|没用|不懂)/] },
    { side: "left", target: "strategy", weight: 2, tag: "step_action", patterns: [/(查|搜|找).{0,8}(教程|步骤|攻略|案例|示例|视频)/, /(照着|跟着|看着).{0,8}(做|操作|学|别人|展示|示范|演示)/, /(问|请教).{0,8}(别人|会的人|懂的人|老师|朋友)/, /(有人|别人).{0,8}(展示|示范|演示|教一下|带着做)/] },
    { side: "right", target: "natural", weight: 3, tag: "framework_entry", patterns: [/(先|第一步|一开始|最开始).{0,10}(整体|框架|原理|逻辑|结构|全貌|底层|为什么|体系)/, /(需要|想要|最好|更想).{0,8}(整体|框架|原理|逻辑|结构|全貌|体系)/, /(没有|缺少).{0,5}(框架|逻辑|结构|全貌|体系).{0,8}(乱|迷失|不舒服|卡|难受)/, /太多.{0,5}(细节|步骤).{0,8}(迷失|乱|烦|抓不到)/] },
    { side: "right", target: "strategy", weight: 2, tag: "framework_action", patterns: [/(搭|建立|理解|搞清).{0,8}(框架|结构|逻辑|原理|体系|全貌)/, /(从|看).{0,8}(整体|结构|底层|原理).{0,8}(入手|开始)/] },
  ],
  TF: [
    { side: "left", target: "natural", weight: 3, tag: "principle_cost", patterns: [/(不合理|没道理|不公平|不合适|越界|边界|原则|该不该|对错|规则|逻辑)/, /(不想|不能).{0,8}(被占用|被占便宜|破坏原则|没边界|违背原则)/] },
    { side: "left", target: "strategy", weight: 3, tag: "boundary_action", patterns: [/(直接|明确|当场).{0,5}(拒绝|说不|不答应)/, /(说明|讲清|解释).{0,8}(原因|理由|边界|不合理)/, /(坚持|保护|划清).{0,8}(原则|边界|底线)/] },
    { side: "right", target: "natural", weight: 4, tag: "relationship_cost", patterns: [/(怕|担心|顾虑).{0,10}(对方|别人|关系|评价|尴尬|不舒服|不高兴|难受|生气|伤心|误会|面子)/, /不想.{0,10}(伤害|伤到|影响关系|让.{0,4}难受|让.{0,4}尴尬|让.{0,4}不舒服)/, /(内疚|愧疚|不好意思|说不出口|开不了口|关系尴尬|避免尴尬)/] },
    { side: "right", target: "strategy", weight: 2, tag: "harmony_action", patterns: [/(勉强|勉为其难|最后|还是).{0,8}(答应|同意|帮|满足)/, /(委婉|找.{0,3}借口|找.{0,3}理由|拖延|先安抚)/] },
    { side: "left", target: "natural", weight: 2, tag: "explanation_cost", patterns: [/(没必要|懒得|不想).{0,8}(解释|说明|纠缠|麻烦)/, /(省事|减少麻烦|保护自己|保护边界)/] },
  ],
  JP: [
    { side: "left", target: "natural", weight: 4, tag: "closure_need", patterns: [/(需要|想|必须|最好|第一反应).{0,10}(计划|安排|定下来|确定|订好|规划|行程|流程|清单)/, /(没有|没|缺少).{0,5}(计划|安排|确定|流程).{0,10}(焦虑|不安|慌|没底|不踏实|抓狂|难受|失控)/, /(变化|临时|突发|改计划|没定).{0,10}(焦虑|抓狂|不安|慌|烦躁|失控|受不了)/] },
    { side: "left", target: "strategy", weight: 2, tag: "reclose_action", patterns: [/(重新|赶紧|立刻|马上).{0,8}(安排|计划|规划|定下来|确定)/, /(调整|改).{0,6}(计划|安排|流程|行程)/] },
    { side: "right", target: "strategy", weight: 3, tag: "easy_adjustment", patterns: [/(变化|临时|突发|改了|变了).{0,12}(调整|改|换).{0,8}(就好|就好了|也可以|无所谓|都行|没关系|不紧张|不焦虑)/, /(赶紧|马上|立刻).{0,4}(调整|改|换).{0,8}(就好|就好了|也可以|无所谓|没关系)/] },
    { side: "right", target: "natural", weight: 4, tag: "open_pace", patterns: [/(不|没|没有|懒得|不太|不怎么).{0,6}(做计划|计划|安排|规划|定行程|订路线)/, /(随遇而安|顺其自然|走一步看一步|边走边看|边做边调|边做边看)/, /(到时候|到了|到了地方|到那里|打那里|现场).{0,8}(再说|再看|再定|再决定|再安排)/, /(无所谓|都可以|都行|没关系|怎么都行|看情况而定|怎么合适怎么来)/] },
    { side: "right", target: "strategy", weight: 3, tag: "adaptive_action", patterns: [/(现场|到时候|到了|到了地方|到那里|打那里).{0,8}(看|定|决定|安排|调整)/, /(顺着|跟着|随着).{0,6}(走|来|调整|变化|感觉)/, /(临时|随机|当下).{0,6}(决定|调整|安排)/] },
    { side: "right", target: "natural", weight: 4, tag: "constraint_cost", patterns: [/(计划|安排|流程|行程).{0,8}(太死|太满|束缚|限制|压抑|不自由|烦)/, /不想.{0,10}(定死|被安排|被限制|被计划|太固定)/, /(被安排|被束缚|没有弹性).{0,8}(难受|不舒服|烦|压抑)/] },
  ],
};

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
const feedbackPanelEl = document.getElementById("feedbackPanel");
const feedbackFormEl = document.getElementById("feedbackForm");
const feedbackAgreeInputEl = document.getElementById("feedbackAgreeInput");
const feedbackDisagreeInputEl = document.getElementById("feedbackDisagreeInput");
const feedbackResultEl = document.getElementById("feedbackResult");
const feedbackSubmitButtonEl = document.getElementById("feedbackSubmitButton");
const feedbackCopyButtonEl = document.getElementById("feedbackCopyButton");

const FEEDBACK_API_URL = window.MBTI_FEEDBACK_API_URL || "https://know-thyself-feedback.YOUR_WORKERS_SUBDOMAIN.workers.dev/api/feedback";
const FEEDBACK_API_PLACEHOLDER = "YOUR_WORKERS_SUBDOMAIN";

let state;
let lastReportText = "";
let lastReportModel = null;
let feedbackFallbackRecord = null;

function reset() {
  state = {
    started: false,
    status: "ready",
    index: 0,
    results: {},
    followups: {},
    pendingResult: null,
    completed: false,
  };
  messagesEl.innerHTML = "";
  reportContentEl.innerHTML = "";
  lastReportText = "";
  lastReportModel = null;
  resetFeedback();
  reportPanelEl.classList.add("is-hidden");
  startAreaEl.classList.remove("is-hidden");
  inputEl.value = "";
  inputEl.disabled = true;
  inputEl.placeholder = "点击“开始测评”后开始回答";
  sendButtonEl.disabled = true;
  appendMessage(
    "agent",
    "欢迎来到心灵空间。\n\n这次测评不会只看你最后做了什么，而会尽量识别：第一反应、自然偏好、内在成本，以及你后来发展出的外显策略。\n\n准备好了就开始。"
  );
}

function start() {
  state.started = true;
  state.status = "waiting_answer";
  startAreaEl.classList.add("is-hidden");
  appendMessage("user", "开始测评");
  appendMessage("agent", QUESTIONS[currentDimension()]);
  inputEl.disabled = false;
  sendButtonEl.disabled = false;
  inputEl.placeholder = "请尽量说第一反应、真实感受和最后做法";
  inputEl.focus();
}

function handleUserMessage(message) {
  const text = message.trim();
  if (!text || state.completed) return;

  appendMessage("user", text);
  inputEl.value = "";
  resizeInput();

  if (isExit(text)) {
    appendMessage("agent", "好的，尊重你的选择。以后想继续探索，随时可以回来。");
    inputEl.disabled = true;
    sendButtonEl.disabled = true;
    return;
  }

  if (state.status === "waiting_answer") {
    handleMainAnswer(text);
    return;
  }

  if (state.status === "waiting_followup") {
    handleFollowupAnswer(text);
  }
}

function handleMainAnswer(text) {
  const dimension = currentDimension();
  const result = analyzeAnswer(dimension, text, "main", false);
  const followup = selectFollowup(dimension, result);

  if (followup && !state.followups[dimension]) {
    state.status = "waiting_followup";
    state.pendingResult = result;
    state.followups[dimension] = 1;
    appendMessage("agent", followup);
    return;
  }

  completeDimension(result);
}

function handleFollowupAnswer(text) {
  const dimension = currentDimension();
  const result = analyzeAnswer(dimension, text, "followup", true);
  const merged = mergeResults(state.pendingResult, result);
  state.pendingResult = null;
  completeDimension(merged);
}

function completeDimension(result) {
  state.results[result.dimension] = result;
  const nextIndex = state.index + 1;
  if (nextIndex < DIMENSION_ORDER.length) {
    state.index = nextIndex;
    state.status = "waiting_answer";
    appendMessage("agent", "了解，我们看下一个情境。\n\n" + QUESTIONS[currentDimension()]);
    return;
  }

  state.completed = true;
  state.status = "completed";
  const reportModel = buildReportModel(state.results);
  const report = buildReport(state.results);
  lastReportModel = reportModel;
  lastReportText = report;
  appendMessage("agent", "测评完成，我把结果整理在下方。");
  renderReport(reportModel);
  resetFeedback();
  reportPanelEl.classList.remove("is-hidden");
  inputEl.disabled = true;
  sendButtonEl.disabled = true;
  inputEl.placeholder = "测评已完成，可以复制下方报告，或重新开始。";
  reportPanelEl.scrollIntoView({ behavior: "smooth", block: "start" });
}

function analyzeAnswer(dimension, answer, phase, followupUsed) {
  const text = normalize(answer);
  const parts = splitByAdjustment(text);
  const initialPart = parts.initial || text;
  const strategyPart = parts.strategy || text;
  const refused = containsAny(text, REFUSAL_WORDS);
  const ambiguous = containsAny(text, AMBIGUOUS_WORDS);
  const contextDependency = containsAny(text, CONTEXT_WORDS);
  const semanticSignals = collectSemanticSignals(dimension, text);
  const semanticEvidence = summarizeSemanticEvidence(dimension, text, semanticSignals);

  const naturalScores = scoreNatural(dimension, text, initialPart);
  const strategyScores = scoreStrategy(dimension, text, strategyPart);
  const firstReactionSide = sideFromScores(naturalScores.initialLeft, naturalScores.initialRight);
  const wholeNaturalSide = sideFromScores(naturalScores.left, naturalScores.right);
  const strategySide = sideFromScores(strategyScores.left, strategyScores.right);
  const semanticNaturalSide = semanticSideFromSignals(semanticSignals, "natural");
  const semanticStrategySide = semanticSideFromSignals(semanticSignals, "strategy");
  const naturalSide = firstReactionSide || semanticNaturalSide || wholeNaturalSide || null;
  const finalStrategySide = strategySide || semanticStrategySide || inferStrategyFromWhole(dimension, text) || naturalSide;

  const evidence = {
    hasFirstReaction: containsAny(text, REACTION_MARKERS) || Boolean(firstReactionSide) || semanticEvidence.hasFirstReaction,
    hasNaturalPreference: containsAny(text, NATURAL_MARKERS) || Boolean(wholeNaturalSide) || semanticEvidence.hasNaturalPreference,
    hasInnerCost: containsAny(text, COST_MARKERS) || hasOppositeCostSignal(dimension, text) || semanticEvidence.hasInnerCost,
    hasStrategy: containsAny(text, STRATEGY_MARKERS) || Boolean(strategySide) || hasExplicitAction(text) || semanticEvidence.hasStrategy,
    hasContext: contextDependency || ambiguous || semanticEvidence.hasContext,
    hasSemanticConflict: semanticEvidence.hasConflict,
    hasExcuse: dimension === "TF" && (containsAny(text, EXCUSE_WORDS) || semanticEvidence.hasExcuse),
    hasReasonForExcuse: dimension === "TF" && (containsAny(text, FEELING_REASON_WORDS) || containsAny(text, BOUNDARY_REASON_WORDS) || semanticEvidence.hasFeelingReason || semanticEvidence.hasBoundaryReason),
    hasReplan: dimension === "JP" && (hasJpReplanAction(text) || semanticEvidence.hasReplan),
    hasJpJCost: dimension === "JP" && (hasJpJCostSignal(text) || semanticEvidence.hasJpJCost),
    hasJpPEase: dimension === "JP" && (hasJpPEaseSignal(text) || semanticEvidence.hasJpPEase),
    hasJpPCost: dimension === "JP" && (hasJpPCostSignal(text) || semanticEvidence.hasJpPCost),
    semanticSignals,
  };

  let resolvedNaturalSide = naturalSide;
  let resolvedStrategySide = finalStrategySide;

  if (dimension === "TF" && evidence.hasExcuse && (containsAny(text, FEELING_REASON_WORDS) || semanticEvidence.hasFeelingReason)) {
    resolvedNaturalSide = "right";
    if (hasTfRefusalAction(text)) {
      resolvedStrategySide = "left";
    }
  }
  if (dimension === "TF" && evidence.hasExcuse && (containsAny(text, BOUNDARY_REASON_WORDS) || semanticEvidence.hasBoundaryReason) && !semanticEvidence.hasFeelingReason && !containsAny(text, FEELING_REASON_WORDS)) {
    resolvedNaturalSide = resolvedNaturalSide || "left";
  }
  if (dimension === "TF" && evidence.hasExcuse && !evidence.hasReasonForExcuse) {
    resolvedNaturalSide = null;
  }
  if (dimension === "JP" && (hasNegatedPlanning(text) || semanticEvidence.hasOpenPace)) {
    resolvedNaturalSide = "right";
    resolvedStrategySide = "right";
  }
  if (dimension === "JP" && evidence.hasJpJCost) {
    resolvedNaturalSide = "left";
    resolvedStrategySide = resolvedStrategySide === "right" ? "left" : (resolvedStrategySide || "left");
  }
  if (dimension === "JP" && (evidence.hasJpPEase || evidence.hasJpPCost) && !evidence.hasJpJCost) {
    resolvedNaturalSide = "right";
    resolvedStrategySide = resolvedStrategySide || "right";
  }

  if (refused) {
    return buildResult({
      dimension,
      naturalSide: null,
      strategySide: null,
      evidence,
      ambiguous,
      contextDependency: contextDependency || ambiguous || evidence.hasContext,
      insufficient: true,
      costLevel: "信息不足",
      confidence: 0.32,
      followupUsed,
      reason: "这次没有继续补充细节，所以我先不把这一维推成明确倾向。",
      rawAnswer: answer,
    });
  }

  const costLevel = detectCostLevel(dimension, text, resolvedNaturalSide);
  const confidence = estimateConfidence(resolvedNaturalSide, resolvedStrategySide, evidence, ambiguous, contextDependency, phase);
  const insufficient = confidence < 0.48 || !resolvedNaturalSide;
  const reason = buildReason(dimension, answer, resolvedNaturalSide, resolvedStrategySide, evidence, costLevel);

  return buildResult({
    dimension,
    naturalSide: resolvedNaturalSide,
    strategySide: resolvedStrategySide,
    evidence,
    ambiguous,
    contextDependency: contextDependency || ambiguous || evidence.hasContext,
    insufficient,
    costLevel,
    confidence,
    followupUsed,
    reason,
    rawAnswer: answer,
  });
}

function scoreNatural(dimension, text, initialPart) {
  const keywords = SIDE_KEYWORDS[dimension];
  const initialSemantic = semanticSideScores(dimension, initialPart, "natural");
  const wholeSemantic = semanticSideScores(dimension, text, "natural");
  const initialLeft = keywordHits(initialPart, keywords.left) + initialSemantic.left;
  const initialRight = keywordHits(initialPart, keywords.right) + initialSemantic.right;
  let left = keywordHits(text, keywords.left) + wholeSemantic.left;
  let right = keywordHits(text, keywords.right) + wholeSemantic.right;

  if (dimension === "JP" && hasNegatedPlanning(text)) {
    right += 3;
    left = Math.max(0, left - 1);
  }
  if (dimension === "JP" && hasJpJCostSignal(text)) {
    left += 4;
    right = Math.max(0, right - 1);
  }
  if (dimension === "JP" && hasJpPEaseSignal(text)) {
    right += 3;
  }
  if (dimension === "JP" && hasJpPCostSignal(text)) {
    right += 4;
    left = Math.max(0, left - 1);
  }
  if (dimension === "TF" && containsAny(text, FEELING_REASON_WORDS)) right += 2;
  if (dimension === "TF" && containsAny(text, BOUNDARY_REASON_WORDS)) left += 1;

  return { left, right, initialLeft, initialRight };
}

function scoreStrategy(dimension, text, strategyPart) {
  const keywords = STRATEGY_KEYWORDS[dimension];
  const semantic = semanticSideScores(dimension, strategyPart || text, "strategy");
  let left = keywordHits(strategyPart, keywords.left) + semantic.left;
  let right = keywordHits(strategyPart, keywords.right) + semantic.right;

  if (dimension === "TF" && containsAny(text, ["拒绝", "不答应", "说不"])) left += 2;
  if (dimension === "TF" && containsAny(text, ["答应", "妥协", "满足"])) right += 1;
  if (dimension === "JP" && hasNegatedPlanning(text)) right += 3;
  if (dimension === "JP" && containsAny(text, ["随遇而安", "顺着走", "边走边看"])) right += 2;
  if (dimension === "JP" && containsAny(text, ["等等再说", "根据现场", "实际情况", "看情况而定", "怎么合适怎么来"])) right += 3;
  if (dimension === "JP" && hasJpJCostSignal(text)) left += 3;
  if (dimension === "JP" && hasJpPEaseSignal(text)) right += 2;
  if (dimension === "JP" && hasJpPCostSignal(text)) right += 3;

  return { left, right };
}

function selectFollowup(dimension, result) {
  if (result.followupUsed) return "";
  const customFollowup = buildCustomFollowup(dimension, result);
  if (customFollowup) return customFollowup;
  if (result.evidence.hasSemanticConflict || !result.evidence.hasFirstReaction || !result.evidence.hasInnerCost || result.insufficient || result.contextDependency) {
    return buildDimensionGapFollowup(dimension, result);
  }
  return "";
}

function buildCustomFollowup(dimension, result) {
  const snippet = compactAnswer(result.rawAnswer || "");
  const signals = result.evidence.semanticSignals || [];

  if (dimension === "TF" && result.evidence.hasExcuse && !result.evidence.hasReasonForExcuse) {
    return `你刚才提到“${snippet}”。我想确认“找借口/找理由”背后的真实原因：你主要是在保护自己的边界、减少解释成本，还是更担心对方不舒服、关系尴尬或被评价？`;
  }

  if (dimension === "TF" && hasTfRefusalAction(result.rawAnswer || "") && signalPresent(signals, ["relationship_cost"])) {
    return `你刚才说会拒绝，同时也提到关系上的顾虑。这里我想分开看：拒绝是你后来学会的边界策略，还是你内心第一反应本来就很容易直接按原则处理？`;
  }

  if (dimension === "JP" && result.evidence.hasReplan && !result.evidence.hasJpJCost && !result.evidence.hasJpPEase) {
    return `你刚才提到“${snippet}”。我想区分一下：你调整安排时，心里是为了尽快恢复确定感、否则会不踏实，还是只是顺势换个方案，其实不太紧张？`;
  }

  if (dimension === "SN" && signalPresent(signals, ["step_action"]) && !signalPresent(signals, ["step_entry", "framework_entry"])) {
    return `你刚才提到“${snippet}”。我想确认这是不是你的信息入口：你需要别人展示/示范，是因为看到具体操作才更容易理解，还是只是卡住之后临时求助，平时第一步仍会先想整体原理？`;
  }

  if (dimension === "EI" && signalPresent(signals, ["solitude_action", "social_action"]) && !result.evidence.hasInnerCost) {
    return `你刚才提到“${snippet}”。我想确认这背后的能量方向：这样做之后你是更恢复、更像充电，还是只是当时这样安排，换成另一边也差不多？`;
  }

  return "";
}

function buildDimensionGapFollowup(dimension, result) {
  const snippet = compactAnswer(result.rawAnswer || "");

  if (dimension === "EI") {
    if (!result.evidence.hasFirstReaction) {
      return `你刚才说“${snippet}”。如果只看真正需要恢复的第一反应，你更想先找人说说、被互动激活，还是先一个人安静下来？`;
    }
    return `你刚才说“${snippet}”。我想补的是能量感：这个选择会让你更有电，还是只是可接受？如果换成另一边，会明显消耗吗？`;
  }

  if (dimension === "SN") {
    if (!result.evidence.hasFirstReaction) {
      return `你刚才说“${snippet}”。如果回到最开始那一步，你是先需要具体示例、步骤和演示，还是先需要整体框架、原理和逻辑？`;
    }
    return `你刚才说“${snippet}”。如果别人只给你另一种方式，比如只给步骤不给框架，或只讲原理不给示例，你会卡住吗？卡在哪一边？`;
  }

  if (dimension === "TF") {
    if (!result.evidence.hasInnerCost) {
      return `你刚才说“${snippet}”。我想确认你最在意的成本：是事情不合理、边界被占用，还是对方感受、关系尴尬或别人评价？`;
    }
    return `你刚才说“${snippet}”。如果第一反应和最后做法不一样，哪个更接近你的本能反应，哪个更像后来学会的处理方式？`;
  }

  if (dimension === "JP") {
    if (!result.evidence.hasInnerCost) {
      return `你刚才说“${snippet}”。面对没定下来的状态，你内心是更放松、可以边走边看，还是会不踏实、想尽快把事情收拢确定？`;
    }
    return `你刚才说“${snippet}”。如果计划变化了，你调整时更像恢复掌控感，还是像顺势应变？这两种感受差别会很明显吗？`;
  }

  return BASE_FOLLOWUPS[dimension];
}

function mergeResults(pending, followup) {
  if (!pending) return followup;
  const followupClarifiesMechanism =
    followup.evidence.hasInnerCost ||
    followup.evidence.hasReasonForExcuse ||
    followup.evidence.hasJpJCost ||
    followup.evidence.hasJpPEase ||
    followup.evidence.hasJpPCost;
  const naturalSide = followup.naturalSide || pending.naturalSide;
  const strategySide = followupClarifiesMechanism
    ? (followup.strategySide || pending.strategySide || naturalSide)
    : (pending.strategySide || followup.strategySide || naturalSide);
  const evidence = {
    hasFirstReaction: pending.evidence.hasFirstReaction || followup.evidence.hasFirstReaction,
    hasNaturalPreference: pending.evidence.hasNaturalPreference || followup.evidence.hasNaturalPreference,
    hasInnerCost: pending.evidence.hasInnerCost || followup.evidence.hasInnerCost,
    hasStrategy: pending.evidence.hasStrategy || followup.evidence.hasStrategy,
    hasContext: pending.evidence.hasContext || followup.evidence.hasContext,
    hasSemanticConflict: pending.evidence.hasSemanticConflict || followup.evidence.hasSemanticConflict,
    hasExcuse: pending.evidence.hasExcuse || followup.evidence.hasExcuse,
    hasReasonForExcuse: pending.evidence.hasReasonForExcuse || followup.evidence.hasReasonForExcuse,
    hasReplan: pending.evidence.hasReplan || followup.evidence.hasReplan,
    hasJpJCost: pending.evidence.hasJpJCost || followup.evidence.hasJpJCost,
    hasJpPEase: pending.evidence.hasJpPEase || followup.evidence.hasJpPEase,
    hasJpPCost: pending.evidence.hasJpPCost || followup.evidence.hasJpPCost,
    semanticSignals: (pending.evidence.semanticSignals || []).concat(followup.evidence.semanticSignals || []),
  };

  const contextDependency = pending.contextDependency || followup.contextDependency || evidence.hasContext;
  const ambiguous = pending.ambiguous || followup.ambiguous;
  const costLevel = strongerCost(pending.costLevel, followup.costLevel);
  const confidence = Math.min(
    0.86,
    Math.max(pending.confidence, followup.confidence) + (evidence.hasInnerCost ? 0.08 : 0) + (evidence.hasFirstReaction ? 0.04 : 0) - (evidence.hasSemanticConflict ? 0.05 : 0)
  );

  return buildResult({
    dimension: pending.dimension,
    naturalSide,
    strategySide,
    evidence,
    ambiguous,
    contextDependency,
    insufficient: !naturalSide || confidence < 0.48,
    costLevel,
    confidence,
    followupUsed: true,
    reason: buildReason(pending.dimension, `${pending.rawAnswer} ${followup.rawAnswer}`, naturalSide, strategySide, evidence, costLevel),
    rawAnswer: `${pending.rawAnswer}\n${followup.rawAnswer}`,
  });
}

function buildResult(payload) {
  const meta = DIMENSION_META[payload.dimension];
  const naturalLetter = payload.naturalSide === "left" ? meta.left : payload.naturalSide === "right" ? meta.right : "?";
  const strategyLetter = payload.strategySide === "left" ? meta.left : payload.strategySide === "right" ? meta.right : "?";
  const naturalScore = sideToScore(payload.naturalSide, payload.confidence);
  const strategyScore = sideToScore(payload.strategySide, payload.confidence);
  const alignment = !payload.naturalSide || !payload.strategySide ? "不清晰" : payload.naturalSide === payload.strategySide ? "一致" : "分离";

  return {
    ...payload,
    naturalLetter,
    strategyLetter,
    naturalScore,
    strategyScore,
    alignment,
  };
}

function buildReason(dimension, answer, naturalSide, strategySide, evidence, costLevel) {
  const meta = DIMENSION_META[dimension];
  const naturalText = sideLabel(dimension, naturalSide);
  const strategyText = sideLabel(dimension, strategySide);
  const snippet = compactAnswer(answer);

  if (!naturalSide) {
    return `你提到“${snippet}”，但还不足以判断更早的第一反应，所以这一维会保守处理。`;
  }

  if (dimension === "TF" && evidence.hasExcuse && naturalSide === "right" && strategySide === "left") {
    return `你提到“${snippet}”。外显动作更像是在拒绝或守住边界，但找理由的原因指向关系、尴尬或评价成本，所以自然偏好和外显策略需要分开看。`;
  }

  if (dimension === "TF" && evidence.hasExcuse && naturalSide === "right") {
    return `你提到“${snippet}”。找理由或借口本身不等于 F，但如果背后是在担心对方感受、关系尴尬或评价，它说明决策里存在明显的关系成本。`;
  }

  if (dimension === "JP" && naturalSide === "right" && hasNegatedPlanning(answer)) {
    return `你提到“${snippet}”。不做计划、不安排、随遇而安更接近保留弹性的一侧，也就是 P，而不是 J。`;
  }

  if (dimension === "JP" && naturalSide === "left" && hasJpJCostSignal(answer)) {
    return `你提到“${snippet}”。这里的关键不是“发生了变化”，而是你表达了${jpJCostReasonText(answer)}，因此更接近收拢确定（J）。`;
  }

  if (dimension === "JP" && naturalSide === "right" && hasJpPEaseSignal(answer)) {
    return `你提到“${snippet}”。变化或未定状态本身没有带来明显不安，反而可以顺着调整，这更接近开放弹性（P）。`;
  }

  if (dimension === "JP" && naturalSide === "right" && hasJpPCostSignal(answer)) {
    return `你提到“${snippet}”。过度计划或被安排带来束缚感，这说明收拢确定本身有成本，因此更接近开放弹性（P）。`;
  }

  if (dimension === "EI" && naturalSide === "left" && signalPresent(evidence.semanticSignals || [], ["solitude_cost"])) {
    return `你提到“${snippet}”。这里不能只抓“一个人”，因为你同时表达了独处会无聊或没意思；这更像恢复时能量会被互动激活，因此更接近靠近互动（E）。`;
  }

  if (naturalSide && strategySide && naturalSide !== strategySide) {
    return `你提到“${snippet}”。这里更像是自然偏好接近${naturalText}，但外显策略可能呈现${strategyText}，两者需要分开看。`;
  }

  if (costLevel === "高") {
    return `你提到“${snippet}”。这一维的关键不只是行为，而是选择另一边时会有明显内在成本，因此更接近${naturalText}。`;
  }

  return `你提到“${snippet}”，更接近${meta.name}里的${naturalText}。`;
}

function jpJCostReasonText(answer) {
  const text = normalize(answer);
  if (containsAny(text, ["焦虑", "不安", "不踏实", "没底", "慌"])) {
    return "未定状态会带来不安或不踏实";
  }
  if (containsAny(text, ["抓狂", "崩溃", "受不了", "失控", "烦躁"])) {
    return "变化或未定状态会带来明显失控感";
  }
  if (/(必须|需要|想要|想|要|得|最好|第一反应).{0,10}(重新)?(安排好|计划好|定下来|确定|收拢|规划好|排好)/.test(text)) {
    return "更需要尽快恢复确定感或安排感";
  }
  return "更想把未定状态尽快收拢";
}

function buildReportModel(resultsMap) {
  const results = DIMENSION_ORDER.map((key) => resultsMap[key]);
  const naturalType = results.map((item) => item.naturalLetter === "?" ? fallbackLetter(item) : item.naturalLetter).join("");
  const strategyType = results.map((item) => item.strategyLetter === "?" ? fallbackLetter(item) : item.strategyLetter).join("");
  const clarity = decideClarity(results);
  const separated = results.filter((item) => item.alignment === "分离");
  const unclear = results.filter((item) => item.insufficient || item.naturalLetter === "?");
  const typical = results.filter(isTypicalDimension);
  const variable = results.filter((item) => !isTypicalDimension(item));
  const profile = TYPE_SOURCE_PROFILES[naturalType];
  const typeName = TYPE_NAMES[naturalType] || "参考方向";
  const profileName = profile?.name || typeName;
  const strategyNote = strategyType !== naturalType
    ? `外显策略更接近 ${strategyType}，别人看到的你可能不完全等同于自然偏好。`
    : "外显策略和自然偏好整体比较一致。";

  return {
    naturalType,
    strategyType,
    clarity,
    typeName,
    profileName,
    strategyNote,
    profile: {
      core: profile?.core || TYPE_CORE_SUMMARIES[naturalType] || "这个类型方向需要结合四维证据继续观察。",
      life: profile?.life || "工作和生活表现需要结合四维证据继续观察。",
      communication: profile?.communication || "沟通风格需要结合具体维度继续观察。",
      pressure: profile?.pressure || stressDescription(naturalType.split("")),
      teamwork: profile?.teamwork || "团队合作方式需要结合具体情境继续观察。",
    },
    typical,
    variable,
    separated,
    unclear,
    strengthRows: results.map(strengthAxisData),
    dimensionCards: results.map(dimensionCardData),
    contributionLines: preferenceContributionLines(naturalType),
    communicationLines: compactCommunicationAndChangeLines(results),
    evidenceLines: reasonLines(results),
    riskLines: compactRiskLines(results),
    boundaryLines: MBTI_BOUNDARY_PRINCIPLES,
    suggestionLines: [
      "重点看第一反应和后来调整后的做法是否一致，这个分离点通常比四个字母更有解释力。",
      "不要努力变成另一种类型，而是看见自己天然省力的地方、容易过度使用的地方，以及不同情境中该如何说明自己的需要。",
    ],
  };
}

function buildReport(resultsMap) {
  const model = buildReportModel(resultsMap);
  return [
    "自然偏好分析报告",
    "",
    "结果概览：",
    `- 自然偏好参考方向：${model.naturalType}（${model.typeName}）`,
    `- 外显策略参考方向：${model.strategyType}${model.strategyType !== model.naturalType ? "（与你的自然偏好可能不完全一致）" : ""}`,
    `- 结果清晰度：${model.clarity}`,
    "",
    "对应型号完整描述：",
    `- 核心特质：${model.profile.core}`,
    `- 工作和生活：${model.profile.life}`,
    `- 沟通风格：${model.profile.communication}`,
    `- 压力下的应对：${model.profile.pressure}`,
    `- 团队协作：${model.profile.teamwork}`,
    "",
    "维度速览：",
    ...model.dimensionCards.map((item) => `- ${item.dimension}（${item.name}）：${item.natural}；${item.status}。${item.summary}`),
    "",
    "比较典型的维度：",
    ...(model.typical.length ? model.typical.map((item) => `- ${item.dimension}（${DIMENSION_META[item.dimension].name}）`) : ["- 暂无特别典型的维度。"]),
    "",
    "需要结合情境看的维度：",
    ...(model.variable.length ? model.variable.map((item) => `- ${item.dimension}（${DIMENSION_META[item.dimension].name}）：${dimensionVariationReason(item)}`) : ["- 暂无明显需要情境化解释的维度。"]),
    "",
    "沟通与变化建议：",
    ...model.communicationLines,
    "",
    "判断依据：",
    ...model.evidenceLines,
    "",
    "偏好与策略的关系：",
    model.separated.length ? model.separated.map(separationLine).join("\n") : "这次回答里，自然偏好和外显策略没有出现特别明显的分离。",
    "",
    "报告边界和容易误判的地方：",
    ...model.boundaryLines.map((item) => `- ${item}`),
    ...model.riskLines,
    "",
    model.unclear.length
      ? `需要继续观察的维度：${model.unclear.map((item) => `${item.dimension}（${DIMENSION_META[item.dimension].name}）`).join("、")}。这些维度目前不适合下定论。`
      : "目前没有明显信息不足的维度，但仍建议把结果当作探索入口，而不是固定标签。",
    "",
    "建议：",
    ...model.suggestionLines.map((item) => `- ${item}`),
  ].join("\n");
}

function renderReport(model) {
  const stableTags = model.typical.length
    ? model.typical.map((item) => `${item.dimension} ${safeSideLabel(item.dimension, item.naturalSide)}`)
    : ["暂无特别稳定维度"];
  const variableTags = model.variable.length
    ? model.variable.map((item) => `${item.dimension} ${dimensionStatusLabel(item)}`)
    : ["暂无明显情境化维度"];

  reportContentEl.innerHTML = `
    <div class="report-summary-grid">
      <div class="summary-card">
        <span>自然偏好</span>
        <strong>${escapeHtml(model.naturalType)}（${escapeHtml(model.typeName)}）</strong>
      </div>
      <div class="summary-card">
        <span>外显策略</span>
        <strong>${escapeHtml(model.strategyType)}</strong>
      </div>
      <div class="summary-card">
        <span>清晰度</span>
        <strong>${escapeHtml(model.clarity)}</strong>
      </div>
    </div>

    <section class="report-block">
      <span class="report-kicker">对应型号完整描述</span>
      <h3>${escapeHtml(model.naturalType)}（${escapeHtml(model.profileName)}）</h3>
      <p><strong>核心：</strong>${escapeHtml(model.profile.core)}</p>
      <p><strong>工作和生活：</strong>${escapeHtml(model.profile.life)}</p>
      <p><strong>沟通：</strong>${escapeHtml(model.profile.communication)}</p>
      <p><strong>压力下的应对：</strong>${escapeHtml(model.profile.pressure)}</p>
      <p><strong>团队协作：</strong>${escapeHtml(model.profile.teamwork)}</p>
      <p><strong>本次提醒：</strong>${escapeHtml(model.strategyNote)}</p>
    </section>

    <section class="report-block">
      <span class="report-kicker">强弱图</span>
      <h3>四个维度偏向一眼看懂</h3>
      <div class="strength-chart">
        ${model.strengthRows.map(strengthAxisHtml).join("")}
      </div>
      <div class="axis-legend">
        <span class="legend-item"><span class="legend-swatch"></span>自然偏好位置</span>
        <span class="legend-item"><span class="legend-line"></span>外显策略位置</span>
        <span>越靠近两端，倾向越明显；越靠近中间，越容易随情境变化。</span>
      </div>
    </section>

    <section class="report-block">
      <span class="report-kicker">四维速览</span>
      <h3>哪些典型，哪些需要看情境</h3>
      <div class="tag-row">${tagListHtml(stableTags, "")}</div>
      <div class="tag-row">${tagListHtml(variableTags, "is-variable")}</div>
      <div class="dimension-grid">
        ${model.dimensionCards.map(dimensionCardHtml).join("")}
      </div>
    </section>

    <section class="report-block">
      <span class="report-kicker">自然贡献</span>
      <h3>这个偏好组合容易带来的优势</h3>
      ${listHtml(model.contributionLines)}
    </section>

    <details class="report-details">
      <summary>展开查看判断依据</summary>
      <div class="report-details-body">${listHtml(model.evidenceLines)}</div>
    </details>

    <details class="report-details">
      <summary>展开查看沟通与变化建议</summary>
      <div class="report-details-body">${listHtml(model.communicationLines)}</div>
    </details>

    <details class="report-details">
      <summary>展开查看边界说明和容易误判的地方</summary>
      <div class="report-details-body">
        ${listHtml(model.boundaryLines.concat(model.riskLines))}
      </div>
    </details>

    <section class="report-block">
      <span class="report-kicker">下一步</span>
      <h3>怎么使用这份结果</h3>
      ${listHtml(model.suggestionLines)}
    </section>
  `;
}

function dimensionCardHtml(item) {
  return `
    <article class="dimension-card">
      <h4>${escapeHtml(item.dimension)}（${escapeHtml(item.name)}）</h4>
      <div class="tag-row">
        <span class="tag">${escapeHtml(item.natural)}</span>
        <span class="tag ${item.status.includes("分离") || item.status.includes("情境") ? "is-variable" : ""}">${escapeHtml(item.status)}</span>
      </div>
      <p><strong>外显策略：</strong>${escapeHtml(item.strategy)}</p>
      <p><strong>强弱：</strong>${escapeHtml(item.strength)}；内在成本 ${escapeHtml(item.cost)}</p>
      <p>${escapeHtml(item.summary)}</p>
    </article>
  `;
}

function strengthAxisData(item) {
  const meta = DIMENSION_META[item.dimension];
  const naturalScore = item.naturalLetter === "?" ? 5 : item.naturalScore;
  const strategyScore = item.strategyLetter === "?" ? naturalScore : item.strategyScore;
  const bandWidth = item.insufficient ? 14 : item.alignment === "分离" || item.contextDependency ? 18 : 16;
  const naturalPercent = scoreToPercent(naturalScore);
  const strategyPercent = scoreToPercent(strategyScore);
  const bandLeft = Math.max(0, Math.min(100 - bandWidth, naturalPercent - bandWidth / 2));

  return {
    dimension: item.dimension,
    name: meta.name,
    left: meta.left,
    right: meta.right,
    naturalScore,
    strategyScore,
    bandLeft: `${bandLeft.toFixed(1)}%`,
    bandWidth: `${bandWidth}%`,
    strategyLeft: `${strategyPercent.toFixed(1)}%`,
    status: dimensionStatusLabel(item),
    className: item.insufficient || item.naturalLetter === "?" ? "is-unclear" : item.alignment === "分离" || item.contextDependency ? "is-variable" : "",
  };
}

function strengthAxisHtml(row) {
  return `
    <div class="axis-row ${escapeHtml(row.className)}">
      <div class="axis-title">
        <strong>${escapeHtml(row.dimension)}</strong>
        <span>${escapeHtml(row.name)}</span>
      </div>
      <div class="axis-wrap">
        <div class="axis-labels">
          <span>${escapeHtml(row.left)}</span>
          <span>${escapeHtml(row.right)}</span>
        </div>
        <div class="axis-track">
          <span class="axis-band" style="--band-left:${escapeHtml(row.bandLeft)}; --band-width:${escapeHtml(row.bandWidth)}"></span>
          <span class="axis-strategy" style="--strategy-left:${escapeHtml(row.strategyLeft)}"></span>
        </div>
      </div>
      <div>
        <div class="axis-score">${escapeHtml(String(row.naturalScore))}/10</div>
        <div class="axis-note">${escapeHtml(row.status)}</div>
      </div>
    </div>
  `;
}

function scoreToPercent(score) {
  const normalized = Math.max(1, Math.min(10, Number(score) || 5));
  return ((normalized - 1) / 9) * 100;
}

function listHtml(lines) {
  return `<ul class="report-list">${lines.map((line) => `<li>${escapeHtml(stripBullet(line))}</li>`).join("")}</ul>`;
}

function tagListHtml(tags, className) {
  return tags.map((tag) => `<span class="tag ${className}">${escapeHtml(tag)}</span>`).join("");
}

function stripBullet(line) {
  return String(line || "").replace(/^-\s*/, "");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function dimensionCardData(item) {
  const meta = DIMENSION_META[item.dimension];
  return {
    dimension: item.dimension,
    name: meta.name,
    natural: safeSideLabel(item.dimension, item.naturalSide),
    strategy: safeSideLabel(item.dimension, item.strategySide),
    strength: dimensionStrength(item),
    cost: item.costLevel,
    status: dimensionStatusLabel(item),
    summary: compactDimensionSummary(item),
  };
}

function dimensionStatusLabel(item) {
  if (item.insufficient || item.naturalLetter === "?") return "需要继续观察";
  if (item.alignment === "分离") return "自然偏好与外显策略分离";
  if (item.contextDependency || item.ambiguous || item.evidence?.hasSemanticConflict) return "容易随情境变化";
  if (isTypicalDimension(item)) return "比较典型稳定";
  return "有倾向但不宜说满";
}

function compactDimensionSummary(item) {
  if (item.insufficient || item.naturalLetter === "?") {
    return "证据还不够支撑明确判断。";
  }
  if (item.alignment === "分离") {
    return `内在更接近${safeSideLabel(item.dimension, item.naturalSide)}，但行为上可能呈现${safeSideLabel(item.dimension, item.strategySide)}。`;
  }
  if (item.contextDependency) {
    return "不同关系、任务或状态下可能切换，需要结合场景理解。";
  }
  return trimChinesePeriod(dimensionStrengthDescription(item));
}

function compactCommunicationAndChangeLines(results) {
  return results.map((item) => {
    if (!item.naturalLetter || item.naturalLetter === "?") {
      return `- ${item.dimension}：这一维暂不清晰，先继续观察。`;
    }
    const communication = COMMUNICATION_GUIDE[item.naturalLetter];
    const change = CHANGE_NEEDS_GUIDE[item.naturalLetter];
    const source = communication || change || "这一维需要结合具体场景沟通。";
    const suffix = isTypicalDimension(item) ? "建议相对稳定。" : "但要为情境变化留弹性。";
    return `- ${item.dimension}（${item.naturalLetter}）：${shortenText(source, 54)} ${suffix}`;
  });
}

function compactRiskLines(results) {
  const lines = [];
  if (results.some((item) => item.dimension === "TF")) {
    lines.push("- TF：拒绝不等于 T，找借口也不等于 F，关键要看背后的关系成本或边界成本。");
  }
  if (results.some((item) => item.dimension === "JP")) {
    lines.push("- JP：随遇而安、不做计划、不安排通常更接近 P；快速重排则要看是在恢复掌控还是顺势调整。");
  }
  lines.push("- EI：能社交不等于 E，关键是互动后更充电还是更消耗。");
  lines.push("- SN：能理解抽象不等于 N，关键是第一理解入口更需要步骤还是框架。");
  return lines;
}

function dimensionLines(results) {
  return results.map((item) => {
    const meta = DIMENSION_META[item.dimension];
    return `- ${item.dimension}（${meta.name}）：自然偏好 ${safeSideLabel(item.dimension, item.naturalSide)}；外显策略 ${safeSideLabel(item.dimension, item.strategySide)}；强弱 ${dimensionStrength(item)}：${trimChinesePeriod(dimensionStrengthDescription(item))}；内在成本 ${item.costLevel}；${alignmentLabel(item)}`;
  });
}

function preferenceContributionLines(typeCode) {
  if (!typeCode || typeCode.includes("?")) {
    return ["- 当前类型方向仍不够稳定，暂不展开偏好组合贡献。"];
  }
  return typeCode.split("").map((letter) => `- ${letter}：${PREFERENCE_CONTRIBUTIONS[letter] || "这一偏好需要结合具体场景理解"}。`);
}

function communicationAndChangeLines(results) {
  const lines = [];
  for (const item of results) {
    if (!item.naturalLetter || item.naturalLetter === "?") {
      lines.push(`- ${item.dimension}（${DIMENSION_META[item.dimension].name}）：这一维目前不够清晰，建议先继续观察，不急着套用固定沟通建议。`);
      continue;
    }
    const communication = COMMUNICATION_GUIDE[item.naturalLetter];
    const change = CHANGE_NEEDS_GUIDE[item.naturalLetter];
    const variableNote = isTypicalDimension(item)
      ? "这一建议相对稳定。"
      : "但这一维可能受情境或外显策略影响，实际表现需要留出弹性。";
    if (communication && change) {
      lines.push(`- ${item.dimension}（${item.naturalLetter}）：${communication} ${change} ${variableNote}`);
    } else if (change) {
      lines.push(`- ${item.dimension}（${item.naturalLetter}）：${change} ${variableNote}`);
    }
  }
  return lines;
}

function renderTypeProfile(typeCode, strategyType, results) {
  const typeName = TYPE_NAMES[typeCode] || "参考方向";
  const profile = TYPE_SOURCE_PROFILES[typeCode];
  const summary = profile?.core || TYPE_CORE_SUMMARIES[typeCode] || "这个类型方向需要结合四维证据继续观察。";
  const typical = results.filter(isTypicalDimension);
  const variable = results.filter((item) => !isTypicalDimension(item));
  const strategyNote = strategyType !== typeCode
    ? `需要注意的是，你的外显策略更接近 ${strategyType}，所以别人看到的你，可能不完全等同于你的自然偏好。`
    : "这次回答里，外显策略和自然偏好整体比较一致。";

  if (profile) {
    return [
      `${typeCode}（${profile.name || typeName}）`,
      "",
      `核心特质：${summary}`,
      "",
      `工作和生活表现：${profile.life}`,
      "",
      `沟通风格：${profile.communication}`,
      "",
      `压力下的反应：${profile.pressure}`,
      "",
      `团队合作提醒：${profile.teamwork}`,
      "",
      `本次结果提醒：${strategyNote} ${typical.length ? `比较稳定的部分是 ${typical.map((item) => item.dimension).join("、")}。` : "本次没有特别稳定的维度。"} ${variable.length ? `更需要结合情境看的部分是 ${variable.map((item) => item.dimension).join("、")}。` : "本次没有明显需要情境化解释的维度。"}`,
      "",
      "阅读方式：上面是该型号的完整参考画像；下面的维度拆解会说明你哪些部分比较典型，哪些部分可能受情境、成长训练或外显策略影响。",
    ].join("\n");
  }

  const letters = typeCode.split("");
  return [
    `${typeCode}（${typeName}）`,
    "",
    `核心特质：${summary}`,
    "",
    `工作和生活表现：在日常生活里，${typeCode} 往往会呈现出${energyDescription(letters[0])}、${informationDescription(letters[1])}、${decisionDescription(letters[2])}、${paceDescription(letters[3])}的组合。比较典型时，他们会按照自己自然的节奏处理信息和关系；不典型时，则可能因为责任、关系、工作要求或成长训练，表现出另一侧策略。`,
    "",
    `沟通风格：${communicationDescription(letters)} 如果对方只看你的外显行为，可能会忽略你真实的内在成本，因此这份报告会单独标出“自然偏好”和“外显策略”。`,
    "",
    `压力下的反应：${stressDescription(letters)} 当不典型维度被持续拉扯时，你可能会表现得和自然偏好不一致，比如表面能处理，内在却更累、更纠结或更需要恢复。`,
    "",
    `本次结果提醒：${strategyNote} ${typical.length ? `比较稳定的部分是 ${typical.map((item) => item.dimension).join("、")}。` : "本次没有特别稳定的维度。"} ${variable.length ? `更需要结合情境看的部分是 ${variable.map((item) => item.dimension).join("、")}。` : "本次没有明显需要情境化解释的维度。"}`,
    "",
    "边界说明：这里的型号不是固定标签，而是基于本轮回答推导出的参考画像。真正重要的是哪些维度稳定、哪些维度会随情境变化。",
  ].join("\n");
}

function energyDescription(letter) {
  return letter === "E" ? "更容易从外部互动中被激活" : "更需要通过独处或内在整理恢复能量";
}

function informationDescription(letter) {
  return letter === "S" ? "更依赖具体事实、步骤和可迁移经验建立理解" : "更依赖整体框架、底层逻辑和关联模式建立理解";
}

function decisionDescription(letter) {
  return letter === "T" ? "更先看原则、边界和事情是否合理" : "更先感受到关系、感受和他人反应带来的成本";
}

function paceDescription(letter) {
  return letter === "J" ? "更偏向收拢、确定和提前安排" : "更偏向开放、弹性和根据现场调整";
}

function communicationDescription(letters) {
  const [, info, decision, pace] = letters;
  const parts = [];
  parts.push(info === "S" ? "你可能更喜欢对方讲清楚具体步骤、例子和落地方式" : "你可能更喜欢对方先讲清楚背景、框架和底层逻辑");
  parts.push(decision === "T" ? "讨论冲突时，你会更在意边界、规则和合理性" : "讨论冲突时，你会更在意表达方式、关系氛围和对方感受");
  parts.push(pace === "J" ? "推进事情时，清楚的安排会让你更安心" : "推进事情时，保留调整空间会让你更舒服");
  return parts.join("；") + "。";
}

function stressDescription(letters) {
  const [energy, info, decision, pace] = letters;
  const parts = [];
  parts.push(energy === "E" ? "长期缺少互动和反馈时，容易失去活力" : "长期被迫高强度社交时，容易消耗过度");
  parts.push(info === "S" ? "信息太抽象、缺少示例时，可能会觉得无从下手" : "信息太碎、缺少结构时，可能会觉得迷失");
  parts.push(decision === "T" ? "边界反复被模糊时，容易不耐烦" : "关系压力太强时，容易委屈自己或事后反复消耗");
  parts.push(pace === "J" ? "计划频繁被打断时，容易焦虑或抓狂" : "被过度安排、没有弹性时，容易觉得受束缚");
  return parts.join("；") + "。";
}

function typicalDimensionLines(results) {
  const typical = results.filter(isTypicalDimension);
  if (!typical.length) {
    return ["- 暂无特别典型的维度。当前更适合从情境变化和偏好策略关系来理解。"];
  }
  return typical.map((item) => {
    const meta = DIMENSION_META[item.dimension];
    return `- ${item.dimension}（${meta.name}）：自然偏好与外显策略基本一致，${safeSideLabel(item.dimension, item.naturalSide)}较稳定。`;
  });
}

function variableDimensionLines(results) {
  const variable = results.filter((item) => !isTypicalDimension(item));
  if (!variable.length) {
    return ["- 暂无明显不典型维度。四个维度在本次回答中都比较一致。"];
  }
  return variable.map((item) => {
    const meta = DIMENSION_META[item.dimension];
    return `- ${item.dimension}（${meta.name}）：${dimensionVariationReason(item)}`;
  });
}

function isTypicalDimension(item) {
  return (
    item.alignment === "一致" &&
    !item.contextDependency &&
    !item.ambiguous &&
    !item.evidence?.hasSemanticConflict &&
    !item.insufficient &&
    item.confidence >= 0.58
  );
}

function dimensionStrength(item) {
  if (item.insufficient || item.naturalLetter === "?") return "信息不足";
  if (item.confidence >= 0.72 && item.alignment === "一致") return "较强且稳定";
  if (item.confidence >= 0.58 && item.alignment === "一致") return "中等偏强";
  if (item.alignment === "分离") return "自然偏好与外显策略分离";
  if (item.contextDependency || item.ambiguous || item.evidence?.hasSemanticConflict) return "受情境影响";
  return "轻中度倾向";
}

function dimensionStrengthDescription(item) {
  if (item.insufficient || item.naturalLetter === "?") {
    return "这一维目前缺少足够的第一反应或内在成本证据，所以只作为观察入口。";
  }

  const guide = DIMENSION_STRENGTH_GUIDE[item.naturalLetter];
  if (!guide) {
    return "这一维需要结合更多具体情境继续观察。";
  }

  if (item.alignment === "分离") {
    return `${trimChinesePeriod(guide.medium)}；但你的自然偏好和外显策略不完全一致，说明这一维容易被责任、关系或训练拉到另一侧。`;
  }
  if (item.contextDependency || item.ambiguous || item.evidence?.hasSemanticConflict) {
    return `${trimChinesePeriod(guide.weak)}；本次回答里有情境依赖，所以不适合说成固定表现。`;
  }
  if (item.confidence >= 0.72) {
    return guide.strong;
  }
  if (item.confidence >= 0.58) {
    return guide.medium;
  }
  return guide.weak;
}

function trimChinesePeriod(text) {
  return String(text || "").replace(/[。.!！]+$/, "");
}

function shortenText(text, maxLength) {
  const cleaned = normalize(String(text || ""));
  if (cleaned.length <= maxLength) return cleaned;
  return trimChinesePeriod(cleaned.slice(0, Math.max(0, maxLength - 1))) + "…";
}

function dimensionVariationReason(item) {
  if (item.insufficient || item.naturalLetter === "?") {
    return "第一反应或内在成本还不够清楚，暂时不适合定型。";
  }
  if (item.contextDependency || item.ambiguous || item.evidence?.hasSemanticConflict) {
    return `会受具体关系、任务或场景影响，行为可能在${safeSideLabel(item.dimension, item.naturalSide)}和另一侧之间切换。`;
  }
  if (item.alignment === "分离") {
    return `自然偏好更接近${safeSideLabel(item.dimension, item.naturalSide)}，但外显策略更接近${safeSideLabel(item.dimension, item.strategySide)}，不同场景下容易表现出另一面。`;
  }
  if (item.costLevel === "未明确") {
    return "方向有一定线索，但内在成本还不够明确，稳定性需要继续观察。";
  }
  return "本次有一定倾向，但还需要更多具体情境来确认是否稳定。";
}

function reasonLines(results) {
  return results.map((item) => `- ${item.dimension}：${item.reason}`);
}

function riskLines(results) {
  const lines = [];
  const tf = results.find((item) => item.dimension === "TF");
  const jp = results.find((item) => item.dimension === "JP");

  if (tf) {
    lines.push("- TF：不能只看最后是否拒绝。直接拒绝可能是后天边界能力，找借口也要看是在保护边界，还是在承担关系/评价成本。");
  }
  if (jp) {
    lines.push("- JP：不能只看有没有重新安排。随遇而安、不做计划、不安排通常更接近 P；快速重排可能是 J 的恢复掌控，也可能只是 P 的顺势调整。");
  }
  lines.push("- EI：能社交不等于 E，关键是社交之后更充电还是更消耗。");
  lines.push("- SN：能理解抽象不等于 N，关键是第一理解入口更需要具体步骤还是整体框架。");
  lines.push(`- 偏好误读：${CONFLICT_MISREAD_GUIDE.EI}`);
  lines.push(`- 偏好误读：${CONFLICT_MISREAD_GUIDE.SN}`);
  lines.push(`- 偏好误读：${CONFLICT_MISREAD_GUIDE.TF}`);
  lines.push(`- 偏好误读：${CONFLICT_MISREAD_GUIDE.JP}`);
  return lines;
}

function separationLine(item) {
  return `- ${item.dimension}（${DIMENSION_META[item.dimension].name}）：自然偏好更接近${safeSideLabel(item.dimension, item.naturalSide)}，但外显策略更接近${safeSideLabel(item.dimension, item.strategySide)}。这可能来自成长训练、职业要求、关系场景或自我调节。`;
}

function decideClarity(results) {
  const average = results.reduce((sum, item) => sum + item.confidence, 0) / results.length;
  const unclearCount = results.filter((item) => item.insufficient || item.naturalLetter === "?").length;
  const contextCount = results.filter((item) => item.contextDependency || item.ambiguous || item.evidence?.hasSemanticConflict).length;
  if (average >= 0.7 && unclearCount === 0 && contextCount === 0) return "较清晰";
  if (average >= 0.5 && unclearCount <= 2 && contextCount <= 2) return "中等，需要结合具体场景理解";
  return "偏探索，暂不适合下定论";
}

function estimateConfidence(naturalSide, strategySide, evidence, ambiguous, contextDependency, phase) {
  let score = naturalSide ? 0.46 : 0.32;
  if (evidence.hasFirstReaction) score += 0.12;
  if (evidence.hasInnerCost) score += 0.13;
  if (evidence.hasStrategy) score += 0.08;
  if (phase === "followup") score += 0.06;
  if (ambiguous) score -= 0.08;
  if (contextDependency) score -= 0.06;
  if (evidence.hasSemanticConflict) score -= 0.1;
  if (naturalSide && strategySide && naturalSide !== strategySide) score += 0.03;
  return Math.max(0.28, Math.min(0.86, score));
}

function detectCostLevel(dimension, text, naturalSide) {
  if (!containsAny(text, COST_MARKERS) && !hasOppositeCostSignal(dimension, text)) return "未明确";
  const strongWords = ["很", "特别", "非常", "受不了", "压抑", "委屈", "焦虑", "内疚", "愧疚", "不安", "消耗", "抓狂", "崩溃", "失控", "束缚"];
  if (containsAny(text, strongWords)) return "高";
  return naturalSide ? "中" : "未明确";
}

function hasOppositeCostSignal(dimension, text) {
  if (dimension === "EI") return containsAny(text, ["社交累", "见人累", "一个人会闷", "独处焦虑"]);
  if (dimension === "SN") return containsAny(text, ["没有框架会乱", "只给步骤会不舒服", "只讲原理太空", "没步骤会卡"]);
  if (dimension === "TF") return containsAny(text, FEELING_REASON_WORDS.concat(["边界被占", "被占便宜", "不公平"])) || signalPresent(collectSemanticSignals(dimension, text), ["relationship_cost", "principle_cost", "explanation_cost"]);
  if (dimension === "JP") return containsAny(text, ["没计划不安", "不确定焦虑", "计划太死", "被安排很束缚"]) || hasJpJCostSignal(text) || hasJpPEaseSignal(text) || hasJpPCostSignal(text) || signalPresent(collectSemanticSignals(dimension, text), ["closure_need", "open_pace", "constraint_cost"]);
  return false;
}

function inferStrategyFromWhole(dimension, text) {
  if (dimension === "TF") {
    if (containsAny(text, ["拒绝", "不答应", "说不"])) return "left";
    if (containsAny(text, ["答应", "满足", "妥协"])) return "right";
  }
  if (dimension === "JP" && hasNegatedPlanning(text)) return "right";
  if (dimension === "JP" && hasJpJCostSignal(text)) return "left";
  if (dimension === "JP" && (hasJpPEaseSignal(text) || hasJpPCostSignal(text))) return "right";
  return null;
}

function collectSemanticSignals(dimension, text) {
  const rules = SEMANTIC_SIGNAL_RULES[dimension] || [];
  return rules.flatMap((rule) => {
    const matched = rule.patterns
      .flatMap((pattern) => patternMatchDetails(text, pattern))
      .filter((match) => !rule.negationSensitive || !isNegatedNear(text, match.index));
    if (!matched.length) return [];
    return [{
      side: rule.side,
      target: rule.target,
      weight: rule.weight,
      tag: rule.tag,
      matchedCount: matched.length,
    }];
  });
}

function summarizeSemanticEvidence(dimension, text, signals) {
  const naturalScores = scoreSignals(signals, "natural");
  const strategyScores = scoreSignals(signals, "strategy");
  const hasLeftNatural = naturalScores.left > 0;
  const hasRightNatural = naturalScores.right > 0;
  const hasConflict = hasLeftNatural && hasRightNatural && Math.abs(naturalScores.left - naturalScores.right) <= 3;

  return {
    hasFirstReaction: containsAny(text, REACTION_MARKERS) || signalPresent(signals, ["social_recharge", "solitude_cost", "no_social_need", "solitude_recharge", "step_entry", "framework_entry", "principle_cost", "relationship_cost", "closure_need", "open_pace"]),
    hasNaturalPreference: naturalScores.left > 0 || naturalScores.right > 0,
    hasInnerCost: signalPresent(signals, ["solitude_cost", "no_social_need", "solitude_recharge", "framework_entry", "step_entry", "principle_cost", "relationship_cost", "closure_need", "constraint_cost"]),
    hasStrategy: strategyScores.left > 0 || strategyScores.right > 0,
    hasContext: containsAny(text, CONTEXT_WORDS) || containsAny(text, AMBIGUOUS_WORDS),
    hasConflict,
    hasExcuse: dimension === "TF" && (containsAny(text, EXCUSE_WORDS) || signalPresent(signals, ["harmony_action"])),
    hasFeelingReason: dimension === "TF" && signalPresent(signals, ["relationship_cost"]),
    hasBoundaryReason: dimension === "TF" && signalPresent(signals, ["principle_cost", "explanation_cost"]),
    hasReplan: dimension === "JP" && signalPresent(signals, ["reclose_action"]),
    hasOpenPace: dimension === "JP" && signalPresent(signals, ["open_pace", "adaptive_action"]),
    hasJpJCost: dimension === "JP" && signalPresent(signals, ["closure_need"]),
    hasJpPEase: dimension === "JP" && signalPresent(signals, ["open_pace", "adaptive_action", "easy_adjustment"]),
    hasJpPCost: dimension === "JP" && signalPresent(signals, ["constraint_cost"]),
  };
}

function semanticSideScores(dimension, text, target) {
  return scoreSignals(collectSemanticSignals(dimension, text), target);
}

function semanticSideFromSignals(signals, target) {
  const scores = scoreSignals(signals, target);
  if (Math.abs(scores.left - scores.right) < 2) return null;
  return sideFromScores(scores.left, scores.right);
}

function scoreSignals(signals, target) {
  return signals.reduce((scores, signal) => {
    if (!signalTargets(signal.target, target)) return scores;
    scores[signal.side] += signal.weight * Math.max(1, signal.matchedCount || 1);
    return scores;
  }, { left: 0, right: 0 });
}

function signalTargets(signalTarget, target) {
  return signalTarget === target || signalTarget === "both" || (Array.isArray(signalTarget) && signalTarget.includes(target));
}

function signalPresent(signals, tags) {
  return signals.some((signal) => tags.includes(signal.tag));
}

function patternMatchDetails(text, pattern) {
  if (typeof pattern === "string") {
    const index = text.indexOf(pattern);
    return index === -1 ? [] : [{ text: pattern, index }];
  }
  const flags = pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`;
  const regex = new RegExp(pattern.source, flags);
  const matches = [];
  let match;
  while ((match = regex.exec(text))) {
    matches.push({ text: match[0], index: match.index });
    if (!match[0]) regex.lastIndex += 1;
  }
  return matches;
}

function patternMatches(text, pattern) {
  return patternMatchDetails(text, pattern).length > 0;
}

function sideToScore(side, confidence) {
  if (!side) return 5;
  if (side === "left") return confidence >= 0.7 ? 2 : confidence >= 0.55 ? 3 : 4;
  return confidence >= 0.7 ? 9 : confidence >= 0.55 ? 8 : 7;
}

function sideFromScores(left, right) {
  if (left > right) return "left";
  if (right > left) return "right";
  return null;
}

function safeSideLabel(dimension, side) {
  return side ? sideLabel(dimension, side) : "暂不清晰";
}

function sideLabel(dimension, side) {
  const meta = DIMENSION_META[dimension];
  if (side === "left") return `${meta.leftLabel}（${meta.left}）`;
  if (side === "right") return `${meta.rightLabel}（${meta.right}）`;
  return "暂不清晰";
}

function alignmentLabel(item) {
  if (item.alignment === "分离") return "自然偏好和外显策略有分离";
  if (item.alignment === "一致") return "自然偏好和外显策略基本一致";
  return "信息仍不足";
}

function fallbackLetter(item) {
  const meta = DIMENSION_META[item.dimension];
  if (item.strategyLetter !== "?") return item.strategyLetter;
  return item.naturalScore <= 5 ? meta.left : meta.right;
}

function strongerCost(a, b) {
  const order = { "信息不足": 0, "未明确": 1, "中": 2, "高": 3 };
  return (order[b] || 0) > (order[a] || 0) ? b : a;
}

function splitByAdjustment(text) {
  const indexes = ADJUSTMENT_SPLITTERS.map((word) => text.indexOf(word)).filter((index) => index > 0);
  if (!indexes.length) return { initial: text, strategy: "" };
  const index = Math.min(...indexes);
  return { initial: text.slice(0, index), strategy: text.slice(index) };
}

function keywordHits(text, keywords) {
  return keywords.reduce((count, keyword) => count + keywordHitCount(text, keyword), 0);
}

function keywordHitCount(text, keyword) {
  if (!keyword) return 0;
  let count = 0;
  let start = 0;
  while (start < text.length) {
    const index = text.indexOf(keyword, start);
    if (index === -1) break;
    if (isBuiltInNegatedKeyword(keyword) || !isNegatedNear(text, index)) {
      count += 1;
    }
    start = index + keyword.length;
  }
  return count;
}

function isBuiltInNegatedKeyword(keyword) {
  return /^(不|没|无|没有|无需|不用)/.test(keyword);
}

function isNegatedNear(text, index) {
  const before = text.slice(Math.max(0, index - 6), index);
  return NEGATION_PREFIXES.some((word) => before.endsWith(word) || new RegExp(`${escapeRegExp(word)}.{0,2}$`).test(before));
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function containsAny(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword));
}

function hasNegatedPlanning(text) {
  return JP_P_NEGATED_PLAN.some((pattern) => {
    pattern.lastIndex = 0;
    return pattern.test(text);
  }) || /不.{0,6}(做计划|计划|安排|规划|定行程|订路线)/.test(text) || /(到时候|到了|到了地方|到那里|打那里|现场).{0,8}(再说|再看|再定|再决定|再安排)/.test(text) || containsAny(text, ["随遇而安", "边走边看", "走一步看一步", "不想定死", "到时候再说", "到了再说", "到了地方再说", "到那里再说", "打那里再说"]);
}

function hasJpJCostSignal(text) {
  const hasUncertainTrigger = containsAny(text, JP_UNCERTAIN_WORDS) || containsAny(text, ["计划", "安排", "流程", "行程", "路线", "确定"]);
  const hasEmotionalCost = containsAny(text, JP_J_EMOTIONAL_COST_WORDS) || /(焦虑|不安|慌|没底|不踏实|抓狂|难受|失控|烦躁)/.test(text);
  const hasExplicitClosureNeed =
    /(必须|需要|想要|想|要|得|最好|第一反应).{0,10}(重新)?(安排好|计划好|定下来|确定|收拢|规划好|排好)/.test(text) ||
    /(没有|没|不).{0,5}(计划|安排|确定|流程|行程).{0,10}(不行|受不了|不舒服|难受|焦虑|不安|不踏实|没底)/.test(text);
  return hasUncertainTrigger && (hasEmotionalCost || hasExplicitClosureNeed);
}

function hasJpPEaseSignal(text) {
  const hasUncertainTrigger = containsAny(text, JP_UNCERTAIN_WORDS) || hasNegatedPlanning(text);
  return hasUncertainTrigger && (containsAny(text, JP_P_EASE_WORDS) || /(轻松|放松|无所谓|都可以|都行|没关系|不紧张|不焦虑)/.test(text) || /(变化|临时|突发|改了|变了).{0,12}(调整|改|换).{0,8}(就好|就好了|也可以|无所谓|都行|没关系)/.test(text));
}

function hasJpPCostSignal(text) {
  return containsAny(text, JP_P_CONSTRAINT_WORDS) || /(计划|安排|流程|行程).{0,8}(太死|太满|束缚|限制|压抑|不自由|烦)/.test(text) || /不想.{0,10}(定死|被安排|被限制|被计划|太固定)/.test(text);
}

function hasJpReplanAction(text) {
  return containsAny(text, ["重新安排", "调整计划", "改计划", "重新计划", "调整安排", "调整行程"]) ||
    /(变化|临时|突发|改了|变了).{0,12}(调整|改|换|重新)/.test(text) ||
    /(赶紧|马上|立刻).{0,4}(调整|改|换|安排|计划|确定)/.test(text);
}

function hasTfRefusalAction(text) {
  return /(拒绝|不答应|说不|不帮|不做|推掉|婉拒)/.test(text);
}

function hasExplicitAction(text) {
  return containsAny(text, ["会", "通常", "一般", "最后", "实际", "拒绝", "答应", "安排", "调整", "开始", "先"]);
}

function isExit(text) {
  return ["退出", "不想做", "不做了", "算了", "停止", "结束"].some((word) => text.includes(word));
}

function normalize(text) {
  return text.replace(/\s+/g, " ").trim();
}

function compactAnswer(answer) {
  const cleaned = normalize(answer);
  return cleaned.length <= 44 ? cleaned : cleaned.slice(0, 42) + "...";
}

function currentDimension() {
  return DIMENSION_ORDER[state.index];
}

function appendMessage(role, content) {
  const wrapper = document.createElement("div");
  wrapper.className = `message ${role === "user" ? "user" : "agent"}`;
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = content;
  wrapper.appendChild(bubble);
  messagesEl.appendChild(wrapper);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function resizeInput() {
  inputEl.style.height = "auto";
  inputEl.style.height = `${Math.min(inputEl.scrollHeight, 190)}px`;
}

async function copyReport() {
  const text = lastReportText.trim();
  if (!text) return;
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
  } else {
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
  copyReportButtonEl.textContent = "已复制";
  setTimeout(() => (copyReportButtonEl.textContent = "复制报告"), 1400);
}

function resetFeedback() {
  if (!feedbackFormEl || !feedbackResultEl) return;
  feedbackFormEl.reset();
  feedbackAgreeInputEl.value = "";
  feedbackDisagreeInputEl.value = "";
  setFeedbackResult("", "");
  feedbackFallbackRecord = null;
  if (feedbackCopyButtonEl) feedbackCopyButtonEl.hidden = true;
  if (feedbackSubmitButtonEl) feedbackSubmitButtonEl.disabled = false;
}

async function handleFeedbackSubmit(event) {
  event.preventDefault();
  const payload = collectFeedbackPayload();
  const evaluation = evaluateFeedback(payload);

  setFeedbackResult(evaluation.valid ? "is-valid" : "is-invalid", evaluation.message);
  if (feedbackCopyButtonEl) feedbackCopyButtonEl.hidden = true;

  if (!evaluation.valid) return;

  const record = {
    createdAt: new Date().toISOString(),
    clientId: getClientId(),
    rating: payload.rating,
    agreeText: payload.agreeText,
    disagreeText: payload.disagreeText,
    evaluation,
    naturalType: lastReportModel?.naturalType || "",
    strategyType: lastReportModel?.strategyType || "",
    clarity: lastReportModel?.clarity || "",
    reportSummary: summarizeReportForFeedback(lastReportModel),
  };

  saveFeedbackRecord(record);
  feedbackSubmitButtonEl.disabled = true;
  setFeedbackResult("is-syncing", "正在同步反馈...");

  const syncResult = await submitFeedbackRecord(record);
  if (syncResult.ok) {
    setFeedbackResult("is-valid", feedbackSyncedMessage(payload.rating, evaluation.usefulness));
    return;
  }

  feedbackFallbackRecord = record;
  setFeedbackResult("is-invalid", feedbackSyncFailedMessage(syncResult.reason));
  if (feedbackCopyButtonEl) feedbackCopyButtonEl.hidden = false;
  feedbackSubmitButtonEl.disabled = false;
}

function collectFeedbackPayload() {
  const checked = feedbackFormEl.querySelector('input[name="feedbackRating"]:checked');
  return {
    rating: checked ? Number(checked.value) : null,
    agreeText: feedbackAgreeInputEl.value.trim(),
    disagreeText: feedbackDisagreeInputEl.value.trim(),
  };
}

function evaluateFeedback(payload) {
  if (!payload || !payload.rating) {
    return {
      valid: false,
      score: 0,
      usefulness: "missing_rating",
      message: "请先选择 1-5 分评分，再提交反馈。",
    };
  }

  const agreeText = normalize(payload.agreeText || "");
  const disagreeText = normalize(payload.disagreeText || "");
  const combinedText = normalize(`${agreeText} ${disagreeText}`);

  const vagueOnly = ["准", "很准", "不准", "错了", "挺好", "还行", "一般", "没问题", "可以", "不好", "暂无"].includes(combinedText);
  const hasDimension = /EI|SN|TF|JP|E|I|S|N|T|F|J|P|维度|类型|型号|题|问题|报告|结果/.test(combinedText);
  const hasEvidence = containsAny(combinedText, ["因为", "例如", "比如", "我其实", "真实", "第一反应", "内在", "成本", "情境", "场景", "关系", "行为", "追问", "理由", "借口"]);
  const hasAction = containsAny(combinedText, ["建议", "应该", "希望", "可以", "需要", "改成", "增加", "减少", "区分", "优化", "太长", "太短", "不清楚"]);
  const hasJudgement = containsAny(combinedText, ["准确", "准", "不准", "错", "对", "偏差", "符合", "不符合", "一致", "不一致"]);
  const hasAgreeDetail = agreeText.length >= 12 && !["准", "很准", "一致", "暂无"].includes(agreeText);
  const hasDisagreeDetail = disagreeText.length >= 12 && !["没有", "暂无", "无", "没有不准确"].includes(disagreeText);
  const score = [hasDimension, hasEvidence, hasAction, hasJudgement, hasAgreeDetail, hasDisagreeDetail, combinedText.length >= 45].filter(Boolean).length;
  const usefulness = classifyFeedbackUsefulness({
    score,
    textLength: combinedText.length,
    vagueOnly,
    hasDimension,
    hasEvidence,
    hasAction,
    hasJudgement,
    hasAgreeDetail,
    hasDisagreeDetail,
  });

  return {
    valid: true,
    score,
    usefulness,
    message: feedbackAcceptedMessage(payload.rating, usefulness),
  };
}

function classifyFeedbackUsefulness(signals) {
  if (signals.score >= 4 || (signals.hasDimension && (signals.hasEvidence || signals.hasAction))) {
    return "high";
  }
  if (signals.score >= 2 || signals.hasJudgement || signals.hasAgreeDetail || signals.hasDisagreeDetail) {
    return "medium";
  }
  return "low";
}

function feedbackAcceptedMessage(rating, usefulness) {
  if (usefulness === "high") {
    return `已收到：${rating} 分反馈，内容比较具体，会作为后续迭代的重要参考。`;
  }
  if (usefulness === "medium") {
    return `已收到：${rating} 分反馈，会作为后续观察和趋势判断的参考。`;
  }
  return `已收到：${rating} 分反馈，会先作为满意度记录保存。`;
}

function feedbackSyncedMessage(rating, usefulness) {
  if (usefulness === "high") {
    return `已收到并同步保存：${rating} 分反馈，内容比较具体，会作为后续迭代的重要参考。`;
  }
  if (usefulness === "medium") {
    return `已收到并同步保存：${rating} 分反馈，会作为后续观察和趋势判断的参考。`;
  }
  return `已收到并同步保存：${rating} 分反馈，会先作为满意度记录保存。`;
}

function feedbackSyncFailedMessage(reason) {
  if (reason === "not_configured") {
    return "反馈服务器还没有配置好，已先保存在本机。你也可以复制反馈内容发给我们。";
  }
  return "暂未同步到服务器，已保存在本机。你也可以复制反馈内容发给我们。";
}

function setFeedbackResult(className, message) {
  if (!feedbackResultEl) return;
  feedbackResultEl.textContent = message;
  feedbackResultEl.classList.remove("is-valid", "is-invalid", "is-syncing");
  if (className) feedbackResultEl.classList.add(className);
}

function saveFeedbackRecord(record) {
  try {
    const key = "mbti_agent_feedback_records";
    const existing = JSON.parse(window.localStorage.getItem(key) || "[]");
    existing.push(record);
    window.localStorage.setItem(key, JSON.stringify(existing.slice(-100)));
  } catch (error) {
    // Feedback validation still works even if the browser does not allow local persistence.
  }
}

function summarizeReportForFeedback(model) {
  if (!model) return {};
  return {
    naturalType: model.naturalType,
    strategyType: model.strategyType,
    clarity: model.clarity,
    dimensions: (model.dimensionCards || []).map((item) => ({
      dimension: item.dimension,
      natural: item.natural,
      strategy: item.strategy,
      status: item.status,
      strength: item.strength,
      cost: item.cost,
    })),
  };
}

function getClientId() {
  const key = "mbti_agent_client_id";
  try {
    let value = window.localStorage.getItem(key);
    if (!value) {
      value = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
      window.localStorage.setItem(key, value);
    }
    return value;
  } catch (error) {
    return `anonymous-${Date.now().toString(36)}`;
  }
}

function getFeedbackApiUrl() {
  const url = String(FEEDBACK_API_URL || "").trim();
  if (!url || url.includes(FEEDBACK_API_PLACEHOLDER)) return "";
  return url;
}

async function submitFeedbackRecord(record) {
  if (!["http:", "https:"].includes(window.location.protocol)) {
    return { ok: false, reason: "unsupported_protocol" };
  }
  if (!window.fetch) {
    return { ok: false, reason: "fetch_unavailable" };
  }

  const apiUrl = getFeedbackApiUrl();
  if (!apiUrl) {
    return { ok: false, reason: "not_configured" };
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
      keepalive: true,
    });
    if (!response.ok) {
      return { ok: false, reason: `http_${response.status}` };
    }
    return { ok: true };
  } catch (error) {
    return { ok: false, reason: "network_error" };
  }
}

function copyFeedbackFallback() {
  if (!feedbackFallbackRecord) return;
  const text = JSON.stringify(feedbackFallbackRecord, null, 2);
  copyText(text);
  if (!feedbackCopyButtonEl) return;
  feedbackCopyButtonEl.textContent = "已复制";
  setTimeout(() => (feedbackCopyButtonEl.textContent = "复制反馈内容"), 1400);
}

function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).catch(() => copyTextWithTextarea(text));
    return;
  }
  copyTextWithTextarea(text);
}

function copyTextWithTextarea(text) {
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

startButtonEl.addEventListener("click", start);
restartButtonEl.addEventListener("click", reset);
copyReportButtonEl.addEventListener("click", copyReport);
feedbackFormEl.addEventListener("submit", handleFeedbackSubmit);
if (feedbackCopyButtonEl) feedbackCopyButtonEl.addEventListener("click", copyFeedbackFallback);
inputEl.addEventListener("input", resizeInput);
inputEl.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    formEl.requestSubmit();
  }
});
formEl.addEventListener("submit", (event) => {
  event.preventDefault();
  handleUserMessage(inputEl.value);
});

globalThis.MBTI_V2_DEBUG = {
  analyzeAnswer,
  selectFollowup,
  mergeResults,
  buildReport,
  buildReportModel,
  collectSemanticSignals,
};

reset();
